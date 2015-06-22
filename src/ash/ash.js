
/*

   _       _
  /_\  ___| |__
 //_\\/ __| '_ \
/  _  \__ \ | | |
\_/ \_/___/_| |_|

              __  __
    ___ ___  / _|/ _| ___  ___
   / __/ _ \| |_| |_ / _ \/ _ \
  | (_| (_) |  _|  _|  __/  __/
 (_)___\___/|_| |_|  \___|\___|


Copyright (c) 2015 Bruce Davidson &lt;darkoverlordofdata@gmail.com&gt;

Author: Richard Lord
Copyright (c) Richard Lord 2011-2012
http://www.richardlord.net


Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

(function() {
  'use strict';
  var ComponentInstanceProvider, ComponentMatchingFamily, ComponentPool, ComponentSingletonProvider, ComponentTypeProvider, Dictionary, DynamicComponentProvider, DynamicSystemProvider, Engine, EngineState, EngineStateMachine, Entity, EntityList, EntityState, EntityStateMachine, Family, FrameTickProvider, Helper, ListIteratingSystem, ListenerNode, ListenerNodePool, Node, NodeList, NodePool, PhaserEngine, PhaserEntity, PhaserPlugin, Signal0, Signal1, Signal2, Signal3, SignalBase, StateComponentMapping, StateSystemMapping, System, SystemInstanceProvider, SystemList, SystemSingletonProvider, ash,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  ash = {
    signals: {},
    core: {},
    ext: {},
    fsm: {},
    tick: {},
    tools: {}
  };

  Dictionary = (function() {
    function Dictionary() {}

    return Dictionary;

  })();


  /*
   * A node in the list of listeners in a signal.
   */

  ash.signals.ListenerNode = ListenerNode = (function() {
    function ListenerNode() {}

    ListenerNode.prototype.previous = null;

    ListenerNode.prototype.next = null;

    ListenerNode.prototype.listener = null;

    ListenerNode.prototype.once = false;

    return ListenerNode;

  })();


  /*
   * This internal class maintains a pool of deleted listener nodes for reuse by framework. This reduces
   * the overhead from object creation and garbage collection.
   */

  ash.signals.ListenerNodePool = ListenerNodePool = (function() {
    function ListenerNodePool() {}

    ListenerNodePool.prototype.tail = null;

    ListenerNodePool.prototype.cacheTail = null;

    ListenerNodePool.prototype.get = function() {
      var node;
      if (this.tail !== null) {
        node = this.tail;
        this.tail = this.tail.previous;
        node.previous = null;
        return node;
      } else {
        return new ListenerNode();
      }
    };

    ListenerNodePool.prototype.dispose = function(node) {
      node.listener = null;
      node.once = false;
      node.next = null;
      node.previous = this.tail;
      this.tail = node;
    };

    ListenerNodePool.prototype.cache = function(node) {
      node.listener = null;
      node.previous = this.cacheTail;
      this.cacheTail = node;
    };

    ListenerNodePool.prototype.releaseCache = function() {
      var node;
      while (this.cacheTail !== null) {
        node = this.cacheTail;
        this.cacheTail = node.previous;
        node.next = null;
        node.previous = this.tail;
        this.tail = node;
      }
    };

    return ListenerNodePool;

  })();

  ash.signals.SignalBase = SignalBase = (function() {
    SignalBase.prototype.head = null;

    SignalBase.prototype.tail = null;

    SignalBase.prototype.numListeners = 0;

    SignalBase.prototype.keys = null;

    SignalBase.prototype.nodes = null;

    SignalBase.prototype.listenerNodePool = null;

    SignalBase.prototype.toAddHead = null;

    SignalBase.prototype.toAddTail = null;

    SignalBase.prototype.dispatching = false;

    function SignalBase() {
      this.nodes = [];
      this.keys = [];
      this.listenerNodePool = new ListenerNodePool();
      this.numListeners = 0;
    }

    SignalBase.prototype.startDispatch = function() {
      this.dispatching = true;
    };

    SignalBase.prototype.endDispatch = function() {
      this.dispatching = false;
      if (this.toAddHead) {
        if (!this.head) {
          this.head = this.toAddHead;
          this.tail = this.toAddTail;
        } else {
          this.tail.next = this.toAddHead;
          this.toAddHead.previous = this.tail;
          this.tail = this.toAddTail;
        }
        this.toAddHead = null;
        this.toAddTail = null;
      }
      this.listenerNodePool.releaseCache();
    };

    SignalBase.prototype.getNode = function(listener) {
      var node;
      node = this.head;
      while (node !== null) {
        if (node.listener === listener) {
          break;
        }
        node = node.next;
      }
      if (node === null) {
        node = this.toAddHead;
        while (node !== null) {
          if (node.listener === listener) {
            break;
          }
          node = node.next;
        }
      }
      return node;
    };

    SignalBase.prototype.add = function(listener) {
      var node;
      if (this.keys.indexOf(listener) !== -1) {
        return;
      }
      node = this.listenerNodePool.get();
      node.listener = listener;
      this.nodes.push(node);
      this.keys.push(listener);
      this.addNode(node);
    };

    SignalBase.prototype.addOnce = function(listener) {
      var node;
      if (this.keys.indexOf(listener) !== -1) {
        return;
      }
      node = this.listenerNodePool.get();
      node.listener = listener;
      node.once = true;
      this.nodes.push(node);
      this.keys.push(listener);
      this.addNode(node);
    };

    SignalBase.prototype.addNode = function(node) {
      if (this.dispatching) {
        if (this.toAddHead === null) {
          this.toAddHead = this.toAddTail = node;
        } else {
          this.toAddTail.next = node;
          node.previous = this.toAddTail;
          this.toAddTail = node;
        }
      } else {
        if (this.head === null) {
          this.head = this.tail = node;
        } else {
          this.tail.next = node;
          node.previous = this.tail;
          this.tail = node;
        }
      }
      this.numListeners++;
    };

    SignalBase.prototype.remove = function(listener) {
      var index, node;
      index = this.keys.indexOf(listener);
      node = this.nodes[index];
      if (node) {
        if (this.head === node) {
          this.head = this.head.next;
        }
        if (this.tail === node) {
          this.tail = this.tail.previous;
        }
        if (this.toAddHead === node) {
          this.toAddHead = this.toAddHead.next;
        }
        if (this.toAddTail === node) {
          this.toAddTail = this.toAddTail.previous;
        }
        if (node.previous) {
          node.previous.next = node.next;
        }
        if (node.next) {
          node.next.previous = node.previous;
        }
        this.nodes.splice(index, 1);
        this.keys.splice(index, 1);
        if (this.dispatching) {
          this.listenerNodePool.cache(node);
        } else {
          this.listenerNodePool.dispose(node);
        }
        this.numListeners--;
      }
    };

    SignalBase.prototype.removeAll = function() {
      var node;
      while (this.head) {
        node = this.head;
        this.head = this.head.next;
        this.nodes.splice(index, 1);
        this.listenerNodePool.dispose(node);
      }
      this.nodes = [];
      this.keys = [];
      this.tail = null;
      this.toAddHead = null;
      this.toAddTail = null;
      this.numListeners = 0;
    };

    return SignalBase;

  })();

  ash.signals.Signal0 = Signal0 = (function(_super) {
    __extends(Signal0, _super);

    function Signal0() {
      return Signal0.__super__.constructor.apply(this, arguments);
    }

    Signal0.prototype.dispatch = function() {
      var node;
      this.startDispatch();
      node = this.head;
      while (node !== null) {
        node.listener();
        if (node.once) {
          this.remove(node.listener);
        }
        node = node.next;
      }
      return this.endDispatch();
    };

    return Signal0;

  })(SignalBase);

  ash.signals.Signal1 = Signal1 = (function(_super) {
    __extends(Signal1, _super);

    function Signal1() {
      return Signal1.__super__.constructor.apply(this, arguments);
    }

    Signal1.prototype.dispatch = function($1) {
      var node;
      this.startDispatch();
      node = this.head;
      while (node !== null) {
        node.listener($1);
        if (node.once) {
          this.remove(node.listener);
        }
        node = node.next;
      }
      return this.endDispatch();
    };

    return Signal1;

  })(SignalBase);

  ash.signals.Signal2 = Signal2 = (function(_super) {
    __extends(Signal2, _super);

    function Signal2() {
      return Signal2.__super__.constructor.apply(this, arguments);
    }

    Signal2.prototype.dispatch = function($1, $2) {
      var node;
      this.startDispatch();
      node = this.head;
      while (node) {
        node.listener($1, $2);
        if (node.once) {
          this.remove(node.listener);
        }
        node = node.next;
      }
      return this.endDispatch();
    };

    return Signal2;

  })(SignalBase);

  ash.signals.Signal3 = Signal3 = (function(_super) {
    __extends(Signal3, _super);

    function Signal3() {
      return Signal3.__super__.constructor.apply(this, arguments);
    }

    Signal3.prototype.dispatch = function($1, $2, $3) {
      var node;
      this.startDispatch();
      node = this.head;
      while (node !== null) {
        node.listener($1, $2, $3);
        if (node.once) {
          this.remove(node.listener);
        }
        node = node.next;
      }
      return this.endDispatch();
    };

    return Signal3;

  })(SignalBase);


  /*
   * An entity is composed from components. As such, it is essentially a collection object for components.
   * Sometimes, the entities in a game will mirror the actual characters and objects in the game, but this
   * is not necessary.
   *
   * <p>Components are simple value objects that contain data relevant to the entity. Entities
   * with similar functionality will have instances of the same components. So we might have
   * a position component</p>
   *
   * <p><code>class PositionComponent
   * {
   *   public var x:Float;
   *   public var y:Float;
   * }</code></p>
   *
   * <p>All entities that have a position in the game world, will have an instance of the
   * position component. Systems operate on entities based on the components they have.</p>
   */

  ash.core.Entity = Entity = (function() {
    var nameCount;

    nameCount = 0;


    /*
     * Optional, give the entity a name. This can help with debugging and with serialising the entity.
     */

    Entity.prototype._name = '';


    /*
     * This signal is dispatched when a component is added to the entity.
     */

    Entity.prototype.componentAdded = null;


    /*
     * This signal is dispatched when a component is removed from the entity.
     */

    Entity.prototype.componentRemoved = null;


    /*
     * Dispatched when the name of the entity changes. Used internally by the engine to track entities based on their names.
     */

    Entity.prototype.nameChanged = null;

    Entity.prototype.previous = null;

    Entity.prototype.next = null;

    Entity.prototype.components = null;

    function Entity(name) {
      if (name == null) {
        name = '';
      }
      Object.defineProperties(this, {

        /*
         * All entities have a name. If no name is set, a default name is used. Names are used to
         * fetch specific entities from the engine, and can also help to identify an entity when debugging.
         */
        name: {
          get: function() {
            return this._name;
          },
          set: function(value) {
            var previous;
            if (this._name !== value) {
              previous = this._name;
              this._name = value;
              return this.nameChanged.dispatch(this, previous);
            }
          }
        }
      });
      this.componentAdded = new Signal2();
      this.componentRemoved = new Signal2();
      this.nameChanged = new Signal2();
      this.components = new Dictionary();
      if (name !== '') {
        this._name = name;
      } else {
        this._name = "_entity" + (++nameCount);
      }
    }


    /*
     * Add a component to the entity.
     *
     * @param component The component object to add.
     * @param componentClass The class of the component. This is only necessary if the component
     * extends another component class and you want the framework to treat the component as of
     * the base class type. If not set, the class type is determined directly from the component.
     *
     * @return A reference to the entity. This enables the chaining of calls to add, to make
     * creating and configuring entities cleaner. e.g.
     *
     * <code>var entity:Entity = new Entity()
     *     .add(new Position(100, 200)
     *     .add(new Display(new PlayerClip());</code>
     */

    Entity.prototype.add = function(component, componentClass) {
      if (componentClass == null) {
        componentClass = component.constructor;
      }
      if (componentClass.name in this.components) {
        this.remove(componentClass);
      }
      this.components[componentClass.name] = component;
      this.componentAdded.dispatch(this, componentClass);
      return this;
    };


    /*
     * Remove a component from the entity.
     *
     * @param componentClass The class of the component to be removed.
     * @return the component, or null if the component doesn't exist in the entity
     */

    Entity.prototype.remove = function(componentClass) {
      var component, name;
      name = componentClass.name != null ? componentClass.name : componentClass;
      component = this.components[name];
      if (component) {
        delete this.components[name];
        this.componentRemoved.dispatch(this, name);
        return component;
      }
      return null;
    };


    /*
     * Get a component from the entity.
     *
     * @param componentClass The class of the component requested.
     * @return The component, or null if none was found.
     */

    Entity.prototype.get = function(componentClass) {
      return this.components[componentClass.name];
    };


    /*
     * Get all components from the entity.
     *
     * @return An array containing all the components that are on the entity.
     */

    Entity.prototype.getAll = function() {
      var component, componentArray, _i, _len, _ref;
      componentArray = [];
      _ref = this.components;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        component = _ref[_i];
        componentArray.push(component);
      }
      return componentArray;
    };


    /*
     * Does the entity have a component of a particular type.
     *
     * @param componentClass The class of the component sought.
     * @return true if the entity has a component of the type, false if not.
     */

    Entity.prototype.has = function(componentClass) {
      return componentClass.name in this.components;
    };

    return Entity;

  })();


  /*
   * An internal class for a linked list of entities. Used inside the framework for
   * managing the entities.
   */

  ash.core.EntityList = EntityList = (function() {
    function EntityList() {}

    EntityList.prototype.head = null;

    EntityList.prototype.tail = null;

    EntityList.prototype.add = function(entity) {
      if (!this.head) {
        this.head = this.tail = entity;
        entity.next = entity.previous = null;
      } else {
        this.tail.next = entity;
        entity.previous = this.tail;
        entity.next = null;
        this.tail = entity;
      }
    };

    EntityList.prototype.remove = function(entity) {
      if (this.head === entity) {
        this.head = this.head.next;
      }
      if (this.tail === entity) {
        this.tail = this.tail.previous;
      }
      if (entity.previous) {
        entity.previous.next = entity.next;
      }
      if (entity.next) {
        entity.next.previous = entity.previous;
      }
    };

    EntityList.prototype.removeAll = function() {
      var entity;
      while (this.head) {
        entity = this.head;
        this.head = this.head.next;
        entity.previous = null;
        entity.next = null;
      }
      this.tail = null;
    };

    return EntityList;

  })();

  ash.core.Node = Node = (function() {
    function Node() {}

    Node.prototype.entity = null;

    Node.prototype.previous = null;

    Node.prototype.next = null;

    return Node;

  })();


  /*
   * A collection of nodes.
   *
   * <p>Systems within the engine access the components of entities via NodeLists. A NodeList contains
   * a node for each Entity in the engine that has all the components required by the node. To iterate
   * over a NodeList, start from the head and step to the next on each loop, until the returned value
   * is null. Or just use for in syntax.</p>
   *
   * <p>for (node in nodeList)
   * {
   *   // do stuff
   * }</p>
   *
   * <p>It is safe to remove items from a nodelist during the loop. When a Node is removed form the
   * NodeList it's previous and next properties still point to the nodes that were before and after
   * it in the NodeList just before it was removed.</p>
   */

  ash.core.NodeList = NodeList = (function() {

    /*
     * The first item in the node list, or null if the list contains no nodes.
     */
    NodeList.prototype.head = null;


    /*
     * The last item in the node list, or null if the list contains no nodes.
     */

    NodeList.prototype.tail = null;


    /*
     * A signal that is dispatched whenever a node is added to the node list.
     *
     * <p>The signal will pass a single parameter to the listeners - the node that was added.</p>
     */

    NodeList.prototype.nodeAdded = null;


    /*
     * A signal that is dispatched whenever a node is removed from the node list.
     *
     * <p>The signal will pass a single parameter to the listeners - the node that was removed.</p>
     */

    NodeList.prototype.nodeRemoved = null;

    function NodeList() {
      this.nodeAdded = new Signal1();
      this.nodeRemoved = new Signal1();
    }

    NodeList.prototype.add = function(node) {
      if (!this.head) {
        this.head = this.tail = node;
        node.next = node.previous = null;
      } else {
        this.tail.next = node;
        node.previous = this.tail;
        node.next = null;
        this.tail = node;
      }
      this.nodeAdded.dispatch(node);
    };

    NodeList.prototype.remove = function(node) {
      if (this.head === node) {
        this.head = this.head.next;
      }
      if (this.tail === node) {
        this.tail = this.tail.previous;
      }
      if (node.previous) {
        node.previous.next = node.next;
      }
      if (node.next) {
        node.next.previous = node.previous;
      }
      this.nodeRemoved.dispatch(node);
    };

    NodeList.prototype.removeAll = function() {
      var node;
      while (this.head) {
        node = this.head;
        this.head = this.head.next;
        node.previous = null;
        node.next = null;
        this.nodeRemoved.dispatch(node);
      }
      this.tail = null;
    };


    /*
     * true if the list is empty, false otherwise.
     */

    Object.defineProperties(NodeList.prototype, {
      empty: {
        get: function() {
          return this.head === null;
        }
      }
    });


    /*
     * Swaps the positions of two nodes in the list. Useful when sorting a list.
     */

    NodeList.prototype.swap = function(node1, node2) {
      var temp;
      if (node1.previous === node2) {
        node1.previous = node2.previous;
        node2.previous = node1;
        node2.next = node1.next;
        node1.next = node2;
      } else if (node2.previous === node1) {
        node2.previous = node1.previous;
        node1.previous = node2;
        node1.next = node2.next;
        node2.next = node1;
      } else {
        temp = node1.previous;
        node1.previous = node2.previous;
        node2.previous = temp;
        temp = node1.next;
        node1.next = node2.next;
        node2.next = temp;
      }
      if (this.head === node1) {
        this.head = node2;
      } else if (this.head === node2) {
        this.head = node1;
      }
      if (this.tail === node1) {
        this.tail = node2;
      } else if (this.tail === node2) {
        this.tail = node1;
      }
      if (node1.previous !== null) {
        node1.previous.next = node1;
      }
      if (node2.previous !== null) {
        node2.previous.next = node2;
      }
      if (node1.next !== null) {
        node1.next.previous = node1;
      }
      if (node2.next !== null) {
        node2.next.previous = node2;
      }
    };


    /*
     * Performs an insertion sort on the node list. In general, insertion sort is very efficient with short lists
     * and with lists that are mostly sorted, but is inefficient with large lists that are randomly ordered.
     *
     * <p>The sort function takes two nodes and returns an Int.</p>
     *
     * <p><code>function sortFunction( node1 : MockNode, node2 : MockNode ) : Int</code></p>
     *
     * <p>If the returned number is less than zero, the first node should be before the second. If it is greater
     * than zero the second node should be before the first. If it is zero the order of the nodes doesn't matter
     * and the original order will be retained.</p>
     *
     * <p>This insertion sort implementation runs in place so no objects are created during the sort.</p>
     */

    NodeList.prototype.insertionSort = function(sortFunction) {
      var node, other, remains;
      if (this.head === this.tail) {
        return;
      }
      remains = this.head.next;
      node = remains;
      while (node !== null) {
        remains = node.next;
        other = node.previous;
        while (other !== null) {
          if (sortFunction(node, other) >= 0) {
            if (node !== other.next) {
              if (this.tail === node) {
                this.tail = node.previous;
              }
              node.previous.next = node.next;
              if (node.next !== null) {
                node.next.previous = node.previous;
              }
              node.next = other.next;
              node.previous = other;
              node.next.previous = node;
              other.next = node;
            }
            break;
          }
          other = other.previous;
        }
        if (other === null) {
          if (this.tail === node) {
            this.tail = node.previous;
          }
          node.previous.next = node.next;
          if (node.next !== null) {
            node.next.previous = node.previous;
          }
          node.next = this.head;
          this.head.previous = node;
          node.previous = null;
          this.head = node;
        }
        node = remains;
      }
    };


    /*
     * Performs a merge sort on the node list. In general, merge sort is more efficient than insertion sort
     * with long lists that are very unsorted.
     *
     * <p>The sort function takes two nodes and returns an Int.</p>
     *
     * <p><code>function sortFunction( node1 : MockNode, node2 : MockNode ) : Int</code></p>
     *
     * <p>If the returned number is less than zero, the first node should be before the second. If it is greater
     * than zero the second node should be before the first. If it is zero the order of the nodes doesn't matter.</p>
     *
     * <p>This merge sort implementation creates and uses a single Vector during the sort operation.</p>
     */

    NodeList.prototype.mergeSort = function(sortFunction) {
      var end, lists, next, start;
      if (this.head === this.tail) {
        return;
      }
      lists = [];
      start = this.head;
      while (start !== null) {
        end = start;
        while (end.next !== null && sortFunction(end, end.next) <= 0) {
          end = end.next;
        }
        next = end.next;
        start.previous = end.next = null;
        lists.push(start);
        start = next;
      }
      while (lists.length > 1) {
        lists.push(this.merge(lists.shift(), lists.shift(), sortFunction));
      }
      this.tail = this.head = lists[0];
      while (this.tail.next !== null) {
        this.tail = this.tail.next;
      }
    };

    NodeList.prototype.merge = function(head1, head2, sortFunction) {
      var head, node;
      if (sortFunction(head1, head2) <= 0) {
        head = node = head1;
        head1 = head1.next;
      } else {
        head = node = head2;
        head2 = head2.next;
      }
      while (head1 !== null && head2 !== null) {
        if (sortFunction(head1, head2) <= 0) {
          node.next = head1;
          head1.previous = node;
          node = head1;
          head1 = head1.next;
        } else {
          node.next = head2;
          head2.previous = node;
          node = head2;
          head2 = head2.next;
        }
      }
      if (head1 !== null) {
        node.next = head1;
        head1.previous = node;
      } else {
        node.next = head2;
        head2.previous = node;
      }
      return head;
    };

    return NodeList;

  })();


  /*
   * This internal class maintains a pool of deleted nodes for reuse by the framework. This reduces the overhead
   * from object creation and garbage collection.
   *
   * Because nodes may be deleted from a NodeList while in use, by deleting Nodes from a NodeList
   * while iterating through the NodeList, the pool also maintains a cache of nodes that are added to the pool
   * but should not be reused yet. They are then released into the pool by calling the releaseCache method.
   */

  ash.core.NodePool = NodePool = (function() {
    NodePool.prototype.tail = null;

    NodePool.prototype.nodeClass = null;

    NodePool.prototype.cacheTail = null;

    NodePool.prototype.components = null;


    /*
     * Creates a pool for the given node class.
     */

    function NodePool(nodeClass, components) {
      this.nodeClass = nodeClass;
      this.components = components;
    }


    /*
     * Fetches a node from the pool.
     */

    NodePool.prototype.get = function() {
      var node;
      if (this.tail) {
        node = this.tail;
        this.tail = this.tail.previous;
        node.previous = null;
        return node;
      } else {
        return new this.nodeClass();
      }
    };


    /*
     * Adds a node to the pool.
     */

    NodePool.prototype.dispose = function(node) {
      var componentName;
      for (componentName in this.components) {
        node[componentName] = null;
      }
      node.entity = null;
      node.next = null;
      node.previous = this.tail;
      this.tail = node;
    };


    /*
     * Adds a node to the cache
     */

    NodePool.prototype.cache = function(node) {
      node.previous = this.cacheTail;
      this.cacheTail = node;
    };


    /*
     * Releases all nodes from the cache into the pool
     */

    NodePool.prototype.releaseCache = function() {
      var node;
      while (this.cacheTail) {
        node = this.cacheTail;
        this.cacheTail = node.previous;
        this.dispose(node);
      }
    };

    return NodePool;

  })();


  /*
   * The base class for a system.
   *
   * <p>A system is part of the core functionality of the game. After a system is added to the engine, its
   * update method will be called on every frame of the engine. When the system is removed from the engine,
   * the update method is no longer called.</p>
   *
   * <p>The aggregate of all systems in the engine is the functionality of the game, with the update
   * methods of those systems collectively constituting the engine update loop. Systems generally operate on
   * node lists - collections of nodes. Each node contains the components from an entity in the engine
   * that match the node.</p>
   */

  ash.core.System = System = (function() {
    function System() {
      this.update = __bind(this.update, this);
    }


    /*
      * Used internally to manage the list of systems within the engine. The previous system in the list.
     */

    System.prototype.previous = null;


    /*
     * Used internally to manage the list of systems within the engine. The next system in the list.
     */

    System.prototype.next = null;


    /*
     * Used internally to hold the priority of this system within the system list. This is
     * used to order the systems so they are updated in the correct order.
     */

    System.prototype.priority = 0;


    /*
     * Called just after the system is added to the engine, before any calls to the update method.
     * Override this method to add your own functionality.
     *
     * @param engine The engine the system was added to.
     */

    System.prototype.addToEngine = function(engine) {};


    /*
     * Called just after the system is removed from the engine, after all calls to the update method.
     * Override this method to add your own functionality.
     *
     * @param engine The engine the system was removed from.
     */

    System.prototype.removeFromEngine = function(engine) {};


    /*
     * After the system is added to the engine, this method is called every frame until the system
     * is removed from the engine. Override this method to add your own functionality.
     *
     * <p>If you need to perform an action outside of the update loop (e.g. you need to change the
     * systems in the engine and you don't want to do it while they're updating) add a listener to
     * the engine's updateComplete signal to be notified when the update loop completes.</p>
     *
     * @param time The duration, in seconds, of the frame.
     */

    System.prototype.update = function(time) {};

    return System;

  })();


  /*
   * Used internally, this is an ordered list of Systems for use by the engine update loop.
   */

  ash.core.SystemList = SystemList = (function() {
    function SystemList() {}

    SystemList.prototype.head = null;

    SystemList.prototype.tail = null;

    SystemList.prototype.add = function(system) {
      var node;
      if (!this.head) {
        this.head = this.tail = system;
        system.next = system.previous = null;
      } else {
        node = this.tail;
        while (node) {
          if (node.priority <= system.priority) {
            break;
          }
          node = node.previous;
        }
        if (node === this.tail) {
          this.tail.next = system;
          system.previous = this.tail;
          system.next = null;
          this.tail = system;
        } else if (!node) {
          system.next = this.head;
          system.previous = null;
          this.head.previous = system;
          this.head = system;
        } else {
          system.next = node.next;
          system.previous = node;
          node.next.previous = system;
          node.next = system;
        }
      }
    };

    SystemList.prototype.remove = function(system) {
      if (this.head === system) {
        this.head = this.head.next;
      }
      if (this.tail === system) {
        this.tail = this.tail.previous;
      }
      if (system.previous) {
        system.previous.next = system.next;
      }
      if (system.next) {
        system.next.previous = system.previous;
      }
    };

    SystemList.prototype.removeAll = function() {
      var system;
      while (this.head) {
        system = this.head;
        this.head = this.head.next;
        system.previous = null;
        system.next = null;
      }
      this.tail = null;
    };

    SystemList.prototype.get = function(type) {
      var system;
      system = this.head;
      while (system) {
        if (system.constructor === type) {
          return system;
        }
        system = system.next;
      }
      return null;
    };

    return SystemList;

  })();


  /*
   * The interface for classes that are used to manage NodeLists (set as the familyClass property
   * in the Engine object). Most developers don't need to use this since the default implementation
   * is used by default and suits most needs.
   */

  ash.core.Family = Family = (function() {
    Family.prototype.nodes = null;


    /*
     * Returns the NodeList managed by this class. This should be a reference that remains valid always
     * since it is retained and reused by Systems that use the list. i.e. never recreate the list,
     * always modify it in place.
     */

    function Family() {
      Object.defineProperties(this, {
        nodeList: {
          get: function() {
            return this.nodes;
          }
        }
      });
    }


    /*
     * An entity has been added to the engine. It may already have components so test the entity
     * for inclusion in this family's NodeList.
     */

    Family.prototype.newEntity = function(entity) {
      throw new Error('Method must be overriden');
    };


    /*
     * An entity has been removed from the engine. If it's in this family's NodeList it should be removed.
     */

    Family.prototype.removeEntity = function(entity) {
      throw new Error('Method must be overriden');
    };


    /*
     * A component has been added to an entity. Test whether the entity's inclusion in this family's
     * NodeList should be modified.
     */

    Family.prototype.componentAddedToEntity = function(entity, componentClass) {
      throw new Error('Method must be overriden');
    };


    /*
     * A component has been removed from an entity. Test whether the entity's inclusion in this family's
     * NodeList should be modified.
     */

    Family.prototype.componentRemovedFromEntity = function(entity, componentClass) {
      throw new Error('Method must be overriden');
    };


    /*
     * The family is about to be discarded. Clean up all properties as necessary. Usually, you will
     * want to empty the NodeList at this time.
     */

    Family.prototype.cleanUp = function() {
      throw new Error('Method must be overriden');
    };

    return Family;

  })();


  /*
   * The default class for managing a NodeList. This class creates the NodeList and adds and removes
   * nodes to/from the list as the entities and the components in the engine change.
   *
   * It uses the basic entity matching pattern of an entity system - entities are added to the list if
   * they contain components matching all the public properties of the node class.
   */

  ash.core.ComponentMatchingFamily = ComponentMatchingFamily = (function() {
    ComponentMatchingFamily.prototype.nodes = null;

    ComponentMatchingFamily.prototype.entities = null;

    ComponentMatchingFamily.prototype.nodeClass = null;

    ComponentMatchingFamily.prototype.components = null;

    ComponentMatchingFamily.prototype.nodePool = null;

    ComponentMatchingFamily.prototype.engine = null;


    /*
     * The constructor. Creates a ComponentMatchingFamily to provide a NodeList for the
     * given node class.
     *
     * @param nodeClass The type of node to create and manage a NodeList for.
     * @param engine The engine that this family is managing teh NodeList for.
     */

    function ComponentMatchingFamily(nodeClass, engine) {
      this.nodeClass = nodeClass;
      this.engine = engine;
      this.releaseNodePoolCache = __bind(this.releaseNodePoolCache, this);
      this.init();
    }


    /*
     * Initialises the class. Creates the nodelist and other tools. Analyses the node to determine
     * what component types the node requires.
     */

    ComponentMatchingFamily.prototype.init = function() {
      var name, type, _ref;
      this.nodes = new NodeList();
      this.entities = new Dictionary();
      this.components = new Dictionary();
      this.nodePool = new NodePool(this.nodeClass, this.nodeClass.components);
      _ref = this.nodeClass.components;
      for (name in _ref) {
        type = _ref[name];
        this.components[type.name] = type;
      }
    };


    /*
     * The nodelist managed by this family. This is a reference that remains valid always
     * since it is retained and reused by Systems that use the list. i.e. we never recreate the list,
     * we always modify it in place.
     */

    Object.defineProperties(ComponentMatchingFamily.prototype, {
      nodeList: {
        get: function() {
          return this.nodes;
        }
      }
    });


    /*
     * Called by the engine when an entity has been added to it. We check if the entity should be in
     * this family's NodeList and add it if appropriate.
     */

    ComponentMatchingFamily.prototype.newEntity = function(entity) {
      this.addIfMatch(entity);
    };


    /*
     * Called by the engine when a component has been added to an entity. We check if the entity is not in
     * this family's NodeList and should be, and add it if appropriate.
     */

    ComponentMatchingFamily.prototype.componentAddedToEntity = function(entity, componentClass) {
      this.addIfMatch(entity);
    };


    /*
     * Called by the engine when a component has been removed from an entity. We check if the removed component
     * is required by this family's NodeList and if so, we check if the entity is in this this NodeList and
     * remove it if so.
     */

    ComponentMatchingFamily.prototype.componentRemovedFromEntity = function(entity, componentClass) {
      var name;
      name = componentClass.name != null ? componentClass.name : componentClass;
      if (name in this.components) {
        this.removeIfMatch(entity);
      }
    };


    /*
     * Called by the engine when an entity has been rmoved from it. We check if the entity is in
     * this family's NodeList and remove it if so.
     */

    ComponentMatchingFamily.prototype.removeEntity = function(entity) {
      this.removeIfMatch(entity);
    };


    /*
     * If the entity is not in this family's NodeList, tests the components of the entity to see
     * if it should be in this NodeList and adds it if so.
     */

    ComponentMatchingFamily.prototype.addIfMatch = function(entity) {
      var componentClass, name, node, _ref, _ref1;
      if (this.entities[entity.name] == null) {
        _ref = this.nodeClass.components;
        for (name in _ref) {
          componentClass = _ref[name];
          if (!entity.has(componentClass)) {
            return;
          }
        }
        node = this.nodePool.get();
        node.entity = entity;
        _ref1 = this.nodeClass.components;
        for (name in _ref1) {
          componentClass = _ref1[name];
          node[name] = entity.get(componentClass);
        }
        this.entities[entity.name] = node;
        this.nodes.add(node);
      }
    };


    /*
     * Removes the entity if it is in this family's NodeList.
     */

    ComponentMatchingFamily.prototype.removeIfMatch = function(entity) {
      var node;
      if (entity.name in this.entities) {
        node = this.entities[entity.name];
        delete this.entities[entity.name];
        this.nodes.remove(node);
        if (this.engine.updating) {
          this.nodePool.cache(node);
          this.engine.updateComplete.add(this.releaseNodePoolCache);
        } else {
          this.nodePool.dispose(node);
        }
      }
    };


    /*
     * Releases the nodes that were added to the node pool during this engine update, so they can
     * be reused.
     */

    ComponentMatchingFamily.prototype.releaseNodePoolCache = function() {
      this.engine.updateComplete.remove(this.releaseNodePoolCache);
      this.nodePool.releaseCache();
    };


    /*
     * Removes all nodes from the NodeList.
     */

    ComponentMatchingFamily.prototype.cleanUp = function() {
      var node;
      node = this.nodes.head;
      while (node) {
        this.entities.remove(node.entity);
        node = node.next;
      }
      this.nodes.removeAll();
    };

    return ComponentMatchingFamily;

  })();


  /*
   * The Engine class is the central point for creating and managing your game state. Add
   * entities and systems to the engine, and fetch families of nodes from the engine.
   */

  ash.core.Engine = Engine = (function() {
    Engine.prototype.entityNames = null;

    Engine.prototype.entityList = null;

    Engine.prototype.systemList = null;

    Engine.prototype.families = null;


    /*
     * Indicates if the engine is currently in its update loop.
     */

    Engine.prototype.updating = false;


    /*
     * Dispatched when the update loop ends. If you want to add and remove systems from the
     * engine it is usually best not to do so during the update loop. To avoid this you can
     * listen for this signal and make the change when the signal is dispatched.
     */

    Engine.prototype.updateComplete = null;


    /*
     * The class used to manage node lists. In most cases the default class is sufficient
     * but it is exposed here so advanced developers can choose to create and use a
     * different implementation.
     *
     * The class must implement the IFamily interface.
     */

    Engine.prototype.familyClass = ComponentMatchingFamily;

    function Engine() {
      this.update = __bind(this.update, this);
      this.componentRemoved = __bind(this.componentRemoved, this);
      this.componentAdded = __bind(this.componentAdded, this);
      this.entityNameChanged = __bind(this.entityNameChanged, this);
      this.entityList = new EntityList();
      this.entityNames = new Dictionary();
      this.systemList = new SystemList();
      this.families = new Dictionary();
      this.updateComplete = new Signal0();
    }

    Object.defineProperties(Engine.prototype, {

      /*
       * Returns a vector containing all the entities in the engine.
       */
      entities: {
        get: function() {
          var entities, entity;
          entities = [];
          entity = this.entityList.head;
          while (entity) {
            this.entities.push(entity);
            entity = entity.next;
          }
          return entities;
        }
      },

      /*
       * Returns a vector containing all the systems in the engine.
       */
      systems: {
        get: function() {
          var system, systems;
          systems = [];
          system = this.systemList.head;
          while (system) {
            systems.push(system);
            system = system.next;
          }
          return systems;
        }
      }
    });


    /*
     * Add an entity to the engine.
     *
     * @param entity The entity to add.
     */

    Engine.prototype.addEntity = function(entity) {
      var each, family, _ref;
      if (this.entityNames[entity.name]) {
        throw "The entity name " + entity.name + " is already in use by another entity.";
      }
      this.entityList.add(entity);
      this.entityNames[entity.name] = entity;
      entity.componentAdded.add(this.componentAdded);
      entity.componentRemoved.add(this.componentRemoved);
      entity.nameChanged.add(this.entityNameChanged);
      _ref = this.families;
      for (each in _ref) {
        family = _ref[each];
        family.newEntity(entity);
      }
    };


    /*
     * Remove an entity from the engine.
     *
     * @param entity The entity to remove.
     */

    Engine.prototype.removeEntity = function(entity) {
      var each, family, _ref;
      entity.componentAdded.remove(this.componentAdded);
      entity.componentRemoved.remove(this.componentRemoved);
      entity.nameChanged.remove(this.entityNameChanged);
      _ref = this.families;
      for (each in _ref) {
        family = _ref[each];
        family.removeEntity(entity);
      }
      delete this.entityNames[entity.name];
      this.entityList.remove(entity);
    };

    Engine.prototype.entityNameChanged = function(entity, oldName) {
      if (this.entityNames[oldName] === entity) {
        delete this.entityNames[oldName];
        this.entityNames[entity.name] = entity;
      }
    };


    /*
     * Get an entity based n its name.
     *
     * @param name The name of the entity
     * @return The entity, or null if no entity with that name exists on the engine
     */

    Engine.prototype.getEntityByName = function(name) {
      return this.entityNames[name];
    };


    /*
     * Remove all entities from the engine.
     */

    Engine.prototype.removeAllEntities = function() {
      while (this.entityList.head !== null) {
        this.removeEntity(this.entityList.head);
      }
    };


    /*
     @private
     */

    Engine.prototype.componentAdded = function(entity, componentClass) {
      var each, family, _ref;
      _ref = this.families;
      for (each in _ref) {
        family = _ref[each];
        family.componentAddedToEntity(entity, componentClass);
      }
    };


    /*
     @private
     */

    Engine.prototype.componentRemoved = function(entity, componentClass) {
      var each, family, _ref;
      _ref = this.families;
      for (each in _ref) {
        family = _ref[each];
        family.componentRemovedFromEntity(entity, componentClass);
      }
    };


    /*
     * Get a collection of nodes from the engine, based on the type of the node required.
     *
     * <p>The engine will create the appropriate NodeList if it doesn't already exist and
     * will keep its contents up to date as entities are added to and removed from the
     * engine.</p>
     *
     * <p>If a NodeList is no longer required, release it with the releaseNodeList method.</p>
     *
     * @param nodeClass The type of node required.
     * @return A linked list of all nodes of this type from all entities in the engine.
     */

    Engine.prototype.getNodeList = function(nodeClass) {
      var entity, family;
      if (nodeClass.name in this.families) {
        return this.families[nodeClass.name].nodeList;
      }
      family = new this.familyClass(nodeClass, this);
      this.families[nodeClass.name] = family;
      entity = this.entityList.head;
      while (entity) {
        family.newEntity(entity);
        entity = entity.next;
      }
      return family.nodeList;
    };


    /*
     * If a NodeList is no longer required, this method will stop the engine updating
     * the list and will release all references to the list within the framework
     * classes, enabling it to be garbage collected.
     *
     * <p>It is not essential to release a list, but releasing it will free
     * up memory and processor resources.</p>
     *
     * @param nodeClass The type of the node class if the list to be released.
     */

    Engine.prototype.releaseNodeList = function(nodeClass) {
      if (nodeClass.name in this.families) {
        this.families[nodeClass.name].cleanUp();
        delete this.families[nodeClass.name];
      }
    };


    /*
     * Add a system to the engine, and set its priority for the order in which the
     * systems are updated by the engine update loop.
     *
     * <p>The priority dictates the order in which the systems are updated by the engine update
     * loop. Lower numbers for priority are updated first. i.e. a priority of 1 is
     * updated before a priority of 2.</p>
     *
     * @param system The system to add to the engine.
     * @param priority The priority for updating the systems during the engine loop. A
     * lower number means the system is updated sooner.
     */

    Engine.prototype.addSystem = function(system, priority) {
      system.priority = priority;
      system.addToEngine(this);
      this.systemList.add(system);
    };


    /*
     * Get the system instance of a particular type from within the engine.
     *
     * @param type The type of system
     * @return The instance of the system type that is in the engine, or
     * null if no systems of this type are in the engine.
     */

    Engine.prototype.getSystem = function(type) {
      return systemList.get(type);
    };


    /*
     * Remove a system from the engine.
     *
     * @param system The system to remove from the engine.
     */

    Engine.prototype.removeSystem = function(system) {
      this.systemList.remove(system);
      system.removeFromEngine(this);
    };


    /*
     * Remove all systems from the engine.
     */

    Engine.prototype.removeAllSystems = function() {
      while (this.systemList.head !== null) {
        this.removeSystem(this.systemList.head);
      }
    };


    /*
     * Update the engine. This causes the engine update loop to run, calling update on all the
     * systems in the engine.
     *
     * <p>The package ash.tick contains classes that can be used to provide
     * a steady or variable tick that calls this update method.</p>
     *
     * @time The duration, in seconds, of this update step.
     */

    Engine.prototype.update = function(time) {
      var system;
      this.updating = true;
      system = this.systemList.head;
      while (system) {
        system.update(time);
        system = system.next;
      }
      this.updating = false;
      this.updateComplete.dispatch();
    };

    return Engine;

  })();


  /*
   * The Engine class is the central point for creating and managing your game state. Add
   * entities and systems to the engine, and fetch families of nodes from the engine.
   *
   * This version is implemented as a Phaser Plugin. It uses the Phaser postRender cycle
   * to provide tick for the ash engine update.
   *
   * Use this version if the phaser update cycle clashes with Ash updates
   */

  if (typeof Phaser !== "undefined" && Phaser !== null) {
    ash.ext.PhaserEngine = PhaserEngine = (function(_super) {
      __extends(PhaserEngine, _super);

      PhaserEngine.prototype.entityNames = null;

      PhaserEngine.prototype.entityList = null;

      PhaserEngine.prototype.systemList = null;

      PhaserEngine.prototype.families = null;

      PhaserEngine.prototype.nodes = null;

      PhaserEngine.prototype.components = null;


      /*
       * Phaser.Plugin members
       */

      PhaserEngine.prototype.game = null;

      PhaserEngine.prototype.parent = null;

      PhaserEngine.prototype.active = true;

      PhaserEngine.prototype.visible = true;

      PhaserEngine.prototype.hasPostRender = true;


      /*
       * Indicates if the engine is currently in its update loop.
       */

      PhaserEngine.prototype.updating = false;


      /*
       * Dispatched when the update loop ends. If you want to add and remove systems from the
       * engine it is usually best not to do so during the update loop. To avoid this you can
       * listen for this signal and make the change when the signal is dispatched.
       */

      PhaserEngine.prototype.updateComplete = null;


      /*
       * The class used to manage node lists. In most cases the default class is sufficient
       * but it is exposed here so advanced developers can choose to create and use a
       * different implementation.
       *
       * The class must implement the IFamily interface.
       */

      PhaserEngine.prototype.familyClass = ComponentMatchingFamily;


      /*
       * @param game      the current phaser game context
       * @param parent    the current phaser state context
       */

      function PhaserEngine(game, parent) {
        this.postRender = __bind(this.postRender, this);
        this.removeAllSystems = __bind(this.removeAllSystems, this);
        this.removeSystem = __bind(this.removeSystem, this);
        this.getSystem = __bind(this.getSystem, this);
        this.addSystem = __bind(this.addSystem, this);
        this.releaseNodeList = __bind(this.releaseNodeList, this);
        this.getNodeList = __bind(this.getNodeList, this);
        this.componentRemoved = __bind(this.componentRemoved, this);
        this.componentAdded = __bind(this.componentAdded, this);
        this.removeAllEntities = __bind(this.removeAllEntities, this);
        this.getEntityByName = __bind(this.getEntityByName, this);
        this.entityNameChanged = __bind(this.entityNameChanged, this);
        this.removeEntity = __bind(this.removeEntity, this);
        this.addEntity = __bind(this.addEntity, this);
        this.init = __bind(this.init, this);
        PhaserEngine.__super__.constructor.call(this, game, parent);
        this.nodes = {};
        this.components = {};
        this.entityList = new EntityList();
        this.entityNames = new Dictionary();
        this.systemList = new SystemList();
        this.families = new Dictionary();
        this.updateComplete = new Signal0();
      }

      PhaserEngine.prototype.addNode = function(name, def) {
        var property, type, _ref;
        if (def.components == null) {
          def.components = {};
          _ref = def.prototype;
          for (property in _ref) {
            if (!__hasProp.call(_ref, property)) continue;
            type = _ref[property];
            def.components[property] = type;
            def.prototype[property] = null;
          }
          def.prototype.entity = null;
          def.prototype.previous = null;
          def.prototype.next = null;
        }
        return this.nodes[name] = def;
      };

      PhaserEngine.prototype.init = function(nodes, components) {

        /*
         * register components
         */
        var klass, name, property, type, _ref, _results;
        if (components != null) {
          for (name in components) {
            klass = components[name];
            this.components[name] = klass;
          }
        }

        /*
         * register nodes
         */
        if (nodes != null) {
          _results = [];
          for (name in nodes) {
            klass = nodes[name];

            /*
             * convert template to an actual node class
             */
            if (klass.components == null) {
              klass.components = {};
              _ref = klass.prototype;
              for (property in _ref) {
                if (!__hasProp.call(_ref, property)) continue;
                type = _ref[property];
                klass.components[property] = type;
                klass.prototype[property] = null;
              }
              klass.prototype.entity = null;
              klass.prototype.previous = null;
              klass.prototype.next = null;
            }
            if (components != null) {
              _results.push(this.nodes[name] = klass);
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        }
      };

      Object.defineProperties(PhaserEngine.prototype, {

        /*
         * Returns a vector containing all the entities in the engine.
         */
        entities: {
          get: function() {
            var entities, entity;
            entities = [];
            entity = this.entityList.head;
            while (entity) {
              this.entities.push(entity);
              entity = entity.next;
            }
            return entities;
          }
        },

        /*
         * Returns a vector containing all the systems in the engine.
         */
        systems: {
          get: function() {
            var system, systems;
            systems = [];
            system = this.systemList.head;
            while (system) {
              systems.push(system);
              system = system.next;
            }
            return systems;
          }
        }
      });


      /*
       * Add an entity to the engine.
       *
       * @param entity The entity to add.
       */

      PhaserEngine.prototype.addEntity = function(entity) {
        var each, family, _ref;
        if (this.entityNames[entity.name]) {
          throw "The entity name " + entity.name + " is already in use by another entity.";
        }
        this.entityList.add(entity);
        this.entityNames[entity.name] = entity;
        entity.componentAdded.add(this.componentAdded);
        entity.componentRemoved.add(this.componentRemoved);
        entity.nameChanged.add(this.entityNameChanged);
        _ref = this.families;
        for (each in _ref) {
          family = _ref[each];
          family.newEntity(entity);
        }
      };


      /*
       * Remove an entity from the engine.
       *
       * @param entity The entity to remove.
       */

      PhaserEngine.prototype.removeEntity = function(entity) {
        var each, family, _ref;
        entity.componentAdded.remove(this.componentAdded);
        entity.componentRemoved.remove(this.componentRemoved);
        entity.nameChanged.remove(this.entityNameChanged);
        _ref = this.families;
        for (each in _ref) {
          family = _ref[each];
          family.removeEntity(entity);
        }
        delete this.entityNames[entity.name];
        this.entityList.remove(entity);
      };

      PhaserEngine.prototype.entityNameChanged = function(entity, oldName) {
        if (this.entityNames[oldName] === entity) {
          delete this.entityNames[oldName];
          this.entityNames[entity.name] = entity;
        }
      };


      /*
       * Get an entity based n its name.
       *
       * @param name The name of the entity
       * @return The entity, or null if no entity with that name exists on the engine
       */

      PhaserEngine.prototype.getEntityByName = function(name) {
        return this.entityNames[name];
      };


      /*
       * Remove all entities from the engine.
       */

      PhaserEngine.prototype.removeAllEntities = function() {
        while (this.entityList.head !== null) {
          this.removeEntity(this.entityList.head);
        }
      };


      /*
       @private
       */

      PhaserEngine.prototype.componentAdded = function(entity, componentClass) {
        var each, family, _ref;
        _ref = this.families;
        for (each in _ref) {
          family = _ref[each];
          family.componentAddedToEntity(entity, componentClass);
        }
      };


      /*
       @private
       */

      PhaserEngine.prototype.componentRemoved = function(entity, componentClass) {
        var each, family, _ref;
        _ref = this.families;
        for (each in _ref) {
          family = _ref[each];
          family.componentRemovedFromEntity(entity, componentClass);
        }
      };


      /*
       * Get a collection of nodes from the engine, based on the type of the node required.
       *
       * <p>The engine will create the appropriate NodeList if it doesn't already exist and
       * will keep its contents up to date as entities are added to and removed from the
       * engine.</p>
       *
       * <p>If a NodeList is no longer required, release it with the releaseNodeList method.</p>
       *
       * @param nodeClass The type of node required.
       * @return A linked list of all nodes of this type from all entities in the engine.
       */

      PhaserEngine.prototype.getNodeList = function(nodeClass) {
        var entity, family;
        if (nodeClass.name in this.families) {
          return this.families[nodeClass.name].nodeList;
        }
        family = new this.familyClass(nodeClass, this);
        this.families[nodeClass.name] = family;
        entity = this.entityList.head;
        while (entity) {
          family.newEntity(entity);
          entity = entity.next;
        }
        return family.nodeList;
      };


      /*
       * If a NodeList is no longer required, this method will stop the engine updating
       * the list and will release all references to the list within the framework
       * classes, enabling it to be garbage collected.
       *
       * <p>It is not essential to release a list, but releasing it will free
       * up memory and processor resources.</p>
       *
       * @param nodeClass The type of the node class if the list to be released.
       */

      PhaserEngine.prototype.releaseNodeList = function(nodeClass) {
        if (nodeClass.name in this.families) {
          this.families[nodeClass.name].cleanUp();
          delete this.families[nodeClass.name];
        }
      };


      /*
       * Add a system to the engine, and set its priority for the order in which the
       * systems are updated by the engine update loop.
       *
       * <p>The priority dictates the order in which the systems are updated by the engine update
       * loop. Lower numbers for priority are updated first. i.e. a priority of 1 is
       * updated before a priority of 2.</p>
       *
       * @param system The system to add to the engine.
       * @param priority The priority for updating the systems during the engine loop. A
       * lower number means the system is updated sooner.
       */

      PhaserEngine.prototype.addSystem = function(system, priority) {
        system.priority = priority;
        system.addToEngine(this);
        this.systemList.add(system);
      };


      /*
       * Get the system instance of a particular type from within the engine.
       *
       * @param type The type of system
       * @return The instance of the system type that is in the engine, or
       * null if no systems of this type are in the engine.
       */

      PhaserEngine.prototype.getSystem = function(type) {
        return systemList.get(type);
      };


      /*
       * Remove a system from the engine.
       *
       * @param system The system to remove from the engine.
       */

      PhaserEngine.prototype.removeSystem = function(system) {
        this.systemList.remove(system);
        system.removeFromEngine(this);
      };


      /*
       * Remove all systems from the engine.
       */

      PhaserEngine.prototype.removeAllSystems = function() {
        while (this.systemList.head !== null) {
          this.removeSystem(this.systemList.head);
        }
      };


      /*
       * postRender
       *
       * Phaser.Plugin interface
       *
       * Update the engine. This causes the engine update loop to run, calling update on all the
       * systems in the engine.
       *
       * <p>The package ash.tick contains classes that can be used to provide
       * a steady or variable tick that calls this update method.</p>
       *
       * @time The duration, in seconds, of this update step.
       */

      PhaserEngine.prototype.postRender = function() {
        var system, time;
        time = this.game.time.elapsed * 0.001;
        this.updating = true;
        system = this.systemList.head;
        while (system) {
          system.update(time);
          system = system.next;
        }
        this.updating = false;
        this.updateComplete.dispatch();
      };

      return PhaserEngine;

    })(Phaser.Plugin);
  }


  /*
    After reading http://www.paolodistefano.com/2015/01/18/ecs2/,
    I tried making entity inherit from Sprite. Turns out this can't work.
    Sprite already has a component collection named components.
  
    While we could re-implement ash so that there are no named collisions when merging into
    Sprite, the whole super object approach is a bad idea, and why we are using ecs in the
    first place ;)
  
    Sprite should be a component of an entity, just like everything else
   */


  /*
   * An entity is composed from components. As such, it is essentially a collection object for components.
   * Sometimes, the entities in a game will mirror the actual characters and objects in the game, but this
   * is not necessary.
   *
   * <p>Components are simple value objects that contain data relevant to the entity. Entities
   * with similar functionality will have instances of the same components. So we might have
   * a position component</p>
   *
   * <p><code>class PositionComponent
   * {
   *   public var x:Float;
   *   public var y:Float;
   * }</code></p>
   *
   * <p>All entities that have a position in the game world, will have an instance of the
   * position component. Systems operate on entities based on the components they have.</p>
   */

  if (typeof Phaser !== "undefined" && Phaser !== null) {
    ash.ext.PhaserEntity = PhaserEntity = (function(_super) {
      var nameCount;

      __extends(PhaserEntity, _super);

      nameCount = 0;


      /*
       * Optional, give the entity a name. This can help with debugging and with serialising the entity.
       */

      PhaserEntity.prototype._name = '';


      /*
       * This signal is dispatched when a component is added to the entity.
       */

      PhaserEntity.prototype.componentAdded = null;


      /*
       * This signal is dispatched when a component is removed from the entity.
       */

      PhaserEntity.prototype.componentRemoved = null;


      /*
       * Dispatched when the name of the entity changes. Used internally by the engine to track entities based on their names.
       */

      PhaserEntity.prototype.nameChanged = null;

      PhaserEntity.prototype.previous = null;

      PhaserEntity.prototype.next = null;

      PhaserEntity.prototype.components = null;

      function PhaserEntity(game, key, name) {
        if (name == null) {
          name = '';
        }
        PhaserEntity.__super__.constructor.call(this, game, 0, 0, key);
        Object.defineProperties(this, {

          /*
           * All entities have a name. If no name is set, a default name is used. Names are used to
           * fetch specific entities from the engine, and can also help to identify an entity when debugging.
           */
          name: {
            get: function() {
              return this._name;
            },
            set: function(value) {
              var previous;
              if (this._name !== value) {
                previous = this._name;
                this._name = value;
                return this.nameChanged.dispatch(this, previous);
              }
            }
          }
        });
        this.componentAdded = new Signal2();
        this.componentRemoved = new Signal2();
        this.nameChanged = new Signal2();
        this.components = new Dictionary();
        if (name !== '') {
          this._name = name;
        } else {
          this._name = "_entity" + (++nameCount);
        }
      }


      /*
       * Add a component to the entity.
       *
       * @param component The component object to add.
       * @param componentClass The class of the component. This is only necessary if the component
       * extends another component class and you want the framework to treat the component as of
       * the base class type. If not set, the class type is determined directly from the component.
       *
       * @return A reference to the entity. This enables the chaining of calls to add, to make
       * creating and configuring entities cleaner. e.g.
       *
       * <code>var entity:Entity = new Entity()
       *     .add(new Position(100, 200)
       *     .add(new Display(new PlayerClip());</code>
       */

      PhaserEntity.prototype.add = function(component, componentClass) {
        if (componentClass == null) {
          componentClass = component.constructor;
        }
        if (componentClass.name in this.components) {
          this.remove(componentClass);
        }
        this.components[componentClass.name] = component;
        this.componentAdded.dispatch(this, componentClass);
        return this;
      };


      /*
       * Remove a component from the entity.
       *
       * @param componentClass The class of the component to be removed.
       * @return the component, or null if the component doesn't exist in the entity
       */

      PhaserEntity.prototype.remove = function(componentClass) {
        var component, name;
        name = componentClass.name != null ? componentClass.name : componentClass;
        component = this.components[name];
        if (component) {
          delete this.components[name];
          this.componentRemoved.dispatch(this, name);
          return component;
        }
        return null;
      };


      /*
       * Get a component from the entity.
       *
       * @param componentClass The class of the component requested.
       * @return The component, or null if none was found.
       */

      PhaserEntity.prototype.get = function(componentClass) {
        return this.components[componentClass.name];
      };


      /*
       * Get all components from the entity.
       *
       * @return An array containing all the components that are on the entity.
       */

      PhaserEntity.prototype.getAll = function() {
        var component, componentArray, _i, _len, _ref;
        componentArray = [];
        _ref = this.components;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          component = _ref[_i];
          componentArray.push(component);
        }
        return componentArray;
      };


      /*
       * Does the entity have a component of a particular type.
       *
       * @param componentClass The class of the component sought.
       * @return true if the entity has a component of the type, false if not.
       */

      PhaserEntity.prototype.has = function(componentClass) {
        return componentClass.name in this.components;
      };

      return PhaserEntity;

    })(Phaser.Sprite);
  }


  /*
   * The Engine class is the central point for creating and managing your game state. Add
   * entities and systems to the engine, and fetch families of nodes from the engine.
   *
   * This version is implemented as a Phaser Plugin. It uses the Phaser update cycle
   * to provide tick for the ash engine update.
   *
   * Use this version if Phaser drives the updates
   */

  if (typeof Phaser !== "undefined" && Phaser !== null) {
    ash.ext.PhaserPlugin = PhaserPlugin = (function(_super) {
      __extends(PhaserPlugin, _super);

      PhaserPlugin.prototype.entityNames = null;

      PhaserPlugin.prototype.entityList = null;

      PhaserPlugin.prototype.systemList = null;

      PhaserPlugin.prototype.families = null;

      PhaserPlugin.prototype.nodes = null;

      PhaserPlugin.prototype.components = null;


      /*
       * Phaser.Plugin members
       */

      PhaserPlugin.prototype.game = null;

      PhaserPlugin.prototype.parent = null;

      PhaserPlugin.prototype.active = true;

      PhaserPlugin.prototype.visible = true;

      PhaserPlugin.prototype.hasPostRender = true;


      /*
       * Indicates if the engine is currently in its update loop.
       */

      PhaserPlugin.prototype.updating = false;


      /*
       * Dispatched when the update loop ends. If you want to add and remove systems from the
       * engine it is usually best not to do so during the update loop. To avoid this you can
       * listen for this signal and make the change when the signal is dispatched.
       */

      PhaserPlugin.prototype.updateComplete = null;


      /*
       * The class used to manage node lists. In most cases the default class is sufficient
       * but it is exposed here so advanced developers can choose to create and use a
       * different implementation.
       *
       * The class must implement the IFamily interface.
       */

      PhaserPlugin.prototype.familyClass = ComponentMatchingFamily;


      /*
       * @param game      the current phaser game context
       * @param parent    the current phaser state context
       */

      function PhaserPlugin(game, parent) {
        this.update = __bind(this.update, this);
        this.removeAllSystems = __bind(this.removeAllSystems, this);
        this.removeSystem = __bind(this.removeSystem, this);
        this.getSystem = __bind(this.getSystem, this);
        this.addSystem = __bind(this.addSystem, this);
        this.releaseNodeList = __bind(this.releaseNodeList, this);
        this.getNodeList = __bind(this.getNodeList, this);
        this.componentRemoved = __bind(this.componentRemoved, this);
        this.componentAdded = __bind(this.componentAdded, this);
        this.removeAllEntities = __bind(this.removeAllEntities, this);
        this.getEntityByName = __bind(this.getEntityByName, this);
        this.entityNameChanged = __bind(this.entityNameChanged, this);
        this.removeEntity = __bind(this.removeEntity, this);
        this.addEntity = __bind(this.addEntity, this);
        this.init = __bind(this.init, this);
        PhaserPlugin.__super__.constructor.call(this, game, parent);
        this.nodes = {};
        this.components = {};
        this.entityList = new EntityList();
        this.entityNames = new Dictionary();
        this.systemList = new SystemList();
        this.families = new Dictionary();
        this.updateComplete = new Signal0();
      }

      PhaserPlugin.prototype.addNode = function(name, def) {
        var property, type, _ref;
        if (def.components == null) {
          def.components = {};
          _ref = def.prototype;
          for (property in _ref) {
            if (!__hasProp.call(_ref, property)) continue;
            type = _ref[property];
            def.components[property] = type;
            def.prototype[property] = null;
          }
          def.prototype.entity = null;
          def.prototype.previous = null;
          def.prototype.next = null;
        }
        return this.nodes[name] = def;
      };

      PhaserPlugin.prototype.init = function(nodes, components) {

        /*
         * register components
         */
        var klass, name, property, type, _ref, _results;
        if (components != null) {
          for (name in components) {
            klass = components[name];
            this.components[name] = klass;
          }
        }

        /*
         * register nodes
         */
        if (nodes != null) {
          _results = [];
          for (name in nodes) {
            klass = nodes[name];

            /*
             * convert template to an actual node class
             */
            if (klass.components == null) {
              klass.components = {};
              _ref = klass.prototype;
              for (property in _ref) {
                if (!__hasProp.call(_ref, property)) continue;
                type = _ref[property];
                klass.components[property] = type;
                klass.prototype[property] = null;
              }
              klass.prototype.entity = null;
              klass.prototype.previous = null;
              klass.prototype.next = null;
            }
            if (components != null) {
              _results.push(this.nodes[name] = klass);
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        }
      };

      Object.defineProperties(PhaserPlugin.prototype, {

        /*
         * Returns a vector containing all the entities in the engine.
         */
        entities: {
          get: function() {
            var entities, entity;
            entities = [];
            entity = this.entityList.head;
            while (entity) {
              this.entities.push(entity);
              entity = entity.next;
            }
            return entities;
          }
        },

        /*
         * Returns a vector containing all the systems in the engine.
         */
        systems: {
          get: function() {
            var system, systems;
            systems = [];
            system = this.systemList.head;
            while (system) {
              systems.push(system);
              system = system.next;
            }
            return systems;
          }
        }
      });


      /*
       * Add an entity to the engine.
       *
       * @param entity The entity to add.
       */

      PhaserPlugin.prototype.addEntity = function(entity) {
        var each, family, _ref;
        if (this.entityNames[entity.name]) {
          throw "The entity name " + entity.name + " is already in use by another entity.";
        }
        this.entityList.add(entity);
        this.entityNames[entity.name] = entity;
        entity.componentAdded.add(this.componentAdded);
        entity.componentRemoved.add(this.componentRemoved);
        entity.nameChanged.add(this.entityNameChanged);
        _ref = this.families;
        for (each in _ref) {
          family = _ref[each];
          family.newEntity(entity);
        }
      };


      /*
       * Remove an entity from the engine.
       *
       * @param entity The entity to remove.
       */

      PhaserPlugin.prototype.removeEntity = function(entity) {
        var each, family, _ref;
        entity.componentAdded.remove(this.componentAdded);
        entity.componentRemoved.remove(this.componentRemoved);
        entity.nameChanged.remove(this.entityNameChanged);
        _ref = this.families;
        for (each in _ref) {
          family = _ref[each];
          family.removeEntity(entity);
        }
        delete this.entityNames[entity.name];
        this.entityList.remove(entity);
      };

      PhaserPlugin.prototype.entityNameChanged = function(entity, oldName) {
        if (this.entityNames[oldName] === entity) {
          delete this.entityNames[oldName];
          this.entityNames[entity.name] = entity;
        }
      };


      /*
       * Get an entity based n its name.
       *
       * @param name The name of the entity
       * @return The entity, or null if no entity with that name exists on the engine
       */

      PhaserPlugin.prototype.getEntityByName = function(name) {
        return this.entityNames[name];
      };


      /*
       * Remove all entities from the engine.
       */

      PhaserPlugin.prototype.removeAllEntities = function() {
        while (this.entityList.head !== null) {
          this.removeEntity(this.entityList.head);
        }
      };


      /*
       @private
       */

      PhaserPlugin.prototype.componentAdded = function(entity, componentClass) {
        var each, family, _ref;
        _ref = this.families;
        for (each in _ref) {
          family = _ref[each];
          family.componentAddedToEntity(entity, componentClass);
        }
      };


      /*
       @private
       */

      PhaserPlugin.prototype.componentRemoved = function(entity, componentClass) {
        var each, family, _ref;
        _ref = this.families;
        for (each in _ref) {
          family = _ref[each];
          family.componentRemovedFromEntity(entity, componentClass);
        }
      };


      /*
       * Get a collection of nodes from the engine, based on the type of the node required.
       *
       * <p>The engine will create the appropriate NodeList if it doesn't already exist and
       * will keep its contents up to date as entities are added to and removed from the
       * engine.</p>
       *
       * <p>If a NodeList is no longer required, release it with the releaseNodeList method.</p>
       *
       * @param nodeClass The type of node required.
       * @return A linked list of all nodes of this type from all entities in the engine.
       */

      PhaserPlugin.prototype.getNodeList = function(nodeClass) {
        var entity, family;
        if (nodeClass.name in this.families) {
          return this.families[nodeClass.name].nodeList;
        }
        family = new this.familyClass(nodeClass, this);
        this.families[nodeClass.name] = family;
        entity = this.entityList.head;
        while (entity) {
          family.newEntity(entity);
          entity = entity.next;
        }
        return family.nodeList;
      };


      /*
       * If a NodeList is no longer required, this method will stop the engine updating
       * the list and will release all references to the list within the framework
       * classes, enabling it to be garbage collected.
       *
       * <p>It is not essential to release a list, but releasing it will free
       * up memory and processor resources.</p>
       *
       * @param nodeClass The type of the node class if the list to be released.
       */

      PhaserPlugin.prototype.releaseNodeList = function(nodeClass) {
        if (nodeClass.name in this.families) {
          this.families[nodeClass.name].cleanUp();
          delete this.families[nodeClass.name];
        }
      };


      /*
       * Add a system to the engine, and set its priority for the order in which the
       * systems are updated by the engine update loop.
       *
       * <p>The priority dictates the order in which the systems are updated by the engine update
       * loop. Lower numbers for priority are updated first. i.e. a priority of 1 is
       * updated before a priority of 2.</p>
       *
       * @param system The system to add to the engine.
       * @param priority The priority for updating the systems during the engine loop. A
       * lower number means the system is updated sooner.
       */

      PhaserPlugin.prototype.addSystem = function(system, priority) {
        system.priority = priority;
        system.addToEngine(this);
        this.systemList.add(system);
      };


      /*
       * Get the system instance of a particular type from within the engine.
       *
       * @param type The type of system
       * @return The instance of the system type that is in the engine, or
       * null if no systems of this type are in the engine.
       */

      PhaserPlugin.prototype.getSystem = function(type) {
        return systemList.get(type);
      };


      /*
       * Remove a system from the engine.
       *
       * @param system The system to remove from the engine.
       */

      PhaserPlugin.prototype.removeSystem = function(system) {
        this.systemList.remove(system);
        system.removeFromEngine(this);
      };


      /*
       * Remove all systems from the engine.
       */

      PhaserPlugin.prototype.removeAllSystems = function() {
        while (this.systemList.head !== null) {
          this.removeSystem(this.systemList.head);
        }
      };


      /*
       * update
       *
       * Phaser.Plugin interface
       *
       * Update the engine. This causes the engine update loop to run, calling update on all the
       * systems in the engine.
       *
       * <p>The package ash.tick contains classes that can be used to provide
       * a steady or variable tick that calls this update method.</p>
       *
       * @time The duration, in seconds, of this update step.
       */

      PhaserPlugin.prototype.update = function() {
        var system, time;
        time = this.game.time.elapsed * 0.001;
        this.updating = true;
        system = this.systemList.head;
        while (system) {
          system.update(time);
          system = system.next;
        }
        this.updating = false;
        this.updateComplete.dispatch();
      };

      return PhaserPlugin;

    })(Phaser.Plugin);
  }


  /*
   * A Helper for Components & Nodes
   *
   * Creates a common registry object
   * Fix-up up Node templates
   */

  ash.ext.Helper = Helper = (function() {
    Helper.prototype.components = null;

    Helper.prototype.nodes = null;

    function Helper(components, nodes) {
      var klass, name, property, type, _ref;
      this.components = {};
      this.nodes = {};

      /*
       * register components
       */
      if (components != null) {
        for (name in components) {
          klass = components[name];
          this.components[name] = klass;
        }
      }

      /*
       * register nodes
       */
      if (nodes != null) {
        for (name in nodes) {
          klass = nodes[name];

          /*
           * convert template to an actual node class
           */
          if (klass.components == null) {
            klass.components = {};
            _ref = klass.prototype;
            for (property in _ref) {
              if (!__hasProp.call(_ref, property)) continue;
              type = _ref[property];
              klass.components[property] = type;
              klass.prototype[property] = null;
            }
            klass.prototype.entity = null;
            klass.prototype.previous = null;
            klass.prototype.next = null;
          }
          if (components != null) {
            this.nodes[name] = klass;
          }
        }
      }
    }

    return Helper;

  })();


  /*
   * This component provider always returns the same instance of the component. The instance
   * is passed to the provider at initialisation.
   */

  ash.fsm.ComponentInstanceProvider = ComponentInstanceProvider = (function() {
    ComponentInstanceProvider.prototype.instance = null;


    /*
     * Constructor
     *
     * @param instance The instance to return whenever a component is requested.
     */

    function ComponentInstanceProvider(instance) {
      this.instance = instance;
    }


    /*
     * Used to request a component from this provider
     *
     * @return The instance
     */

    ComponentInstanceProvider.prototype.getComponent = function() {
      return this.instance;
    };


    /*
     * Used to compare this provider with others. Any provider that returns the same component
     * instance will be regarded as equivalent.
     *
     * @return The instance
     */

    Object.defineProperties(ComponentInstanceProvider.prototype, {
      identifier: {
        get: function() {
          return this.instance;
        }
      }
    });

    return ComponentInstanceProvider;

  })();

  ash.fsm.ComponentSingletonProvider = ComponentSingletonProvider = (function() {
    ComponentSingletonProvider.prototype.componentType = null;

    ComponentSingletonProvider.prototype.instance = null;


    /*
     * Constructor
     *
     * @param type The type of the single instance
     */

    function ComponentSingletonProvider(type) {
      this.componentType = type;

      /*
       * Used to request a component from this provider
       *
       * @return The instance
       */
    }

    ComponentSingletonProvider.prototype.getComponent = function() {
      if (this.instance == null) {
        this.instance = new this.componentType();
      }
      return this.instance;
    };


    /*
     * Used to compare this provider with others. Any provider that returns the same component
     * instance will be regarded as equivalent.
     *
     * @return The instance
     */

    Object.defineProperties(ComponentSingletonProvider.prototype, {
      identifier: {
        get: function() {
          return this.getComponent();
        }
      }
    });

    return ComponentSingletonProvider;

  })();

  ash.fsm.ComponentTypeProvider = ComponentTypeProvider = (function() {
    ComponentTypeProvider.prototype.componentType = null;


    /*
     * Constructor
     *
     * @param type The type of the single instance
     */

    function ComponentTypeProvider(type) {
      this.componentType = type;
    }


    /*
     * Used to request a component from this provider
     *
     * @return The instance
     */

    ComponentTypeProvider.prototype.getComponent = function() {
      return new this.componentType();
    };


    /*
     * Used to compare this provider with others. Any provider that returns the same component
     * instance will be regarded as equivalent.
     *
     * @return The instance
     */

    Object.defineProperties(ComponentTypeProvider.prototype, {
      identifier: {
        get: function() {
          return this.componentType;
        }
      }
    });

    return ComponentTypeProvider;

  })();

  ash.fsm.DynamicComponentProvider = DynamicComponentProvider = (function() {
    DynamicComponentProvider.prototype._closure = null;


    /*
     * Constructor
     *
     * @param closure The function that will return the component instance when called.
     */

    function DynamicComponentProvider(closure) {
      this._closure = closure;

      /*
       * Used to request a component from this provider
       *
       * @return The instance
       */
    }

    DynamicComponentProvider.prototype.getComponent = function() {
      return this._closure;
    };


    /*
     * Used to compare this provider with others. Any provider that returns the same component
     * instance will be regarded as equivalent.
     *
     * @return The instance
     */

    Object.defineProperties(DynamicComponentProvider.prototype, {
      identifier: {
        get: function() {
          return this._closure;
        }
      }
    });

    return DynamicComponentProvider;

  })();


  /*
   * This System provider returns results of a method call. The method
   * is passed to the provider at initialisation.
   */

  ash.fsm.DynamicSystemProvider = DynamicSystemProvider = (function() {
    DynamicSystemProvider.prototype.method = function() {};

    DynamicSystemProvider.prototype.systemPriority = 0;


    /*
     * Constructor
     *
     * @param method The method that returns the System instance;
     */

    function DynamicSystemProvider(method) {
      this.method = method;
    }


    /*
     * Used to compare this provider with others. Any provider that returns the same component
     * instance will be regarded as equivalent.
     *
     * @return The method used to call the System instances
     */

    DynamicSystemProvider.prototype.getSystem = function() {
      return this.method();
    };

    Object.defineProperties(DynamicSystemProvider.prototype, {

      /*
       * The priority at which the System should be added to the Engine
       */
      identifier: {
        get: function() {
          return this.method;
        }
      },

      /*
       * The priority at which the System should be added to the Engine
       */
      priority: {
        get: function() {
          return this.systemPriority;
        },
        set: function(value) {
          return this.systemPriority = value;
        }
      }
    });

    return DynamicSystemProvider;

  })();


  /*
   * Represents a state for a SystemStateMachine. The state contains any number of SystemProviders which
   * are used to add Systems to the Engine when this state is entered.
   */

  ash.fsm.EngineState = EngineState = (function() {
    EngineState.prototype.providers = null;

    function EngineState() {
      this.providers = [];
    }


    /*
     * Creates a mapping for the System type to a specific System instance. A
     * SystemInstanceProvider is used for the mapping.
     *
     * @param system The System instance to use for the mapping
     * @return This StateSystemMapping, so more modifications can be applied
     */

    EngineState.prototype.addInstance = function(system) {
      return this.addProvider(new SystemInstanceProvider(system));
    };


    /*
     * Creates a mapping for the System type to a single instance of the provided type.
     * The instance is not created until it is first requested. The type should be the same
     * as or extend the type for this mapping. A SystemSingletonProvider is used for
     * the mapping.
     *
     * @param type The type of the single instance to be created. If omitted, the type of the
     * mapping is used.
     * @return This StateSystemMapping, so more modifications can be applied
     */

    EngineState.prototype.addSingleton = function(type) {
      return this.addProvider(new SystemSingletonProvider(type));
    };


    /*
     * Creates a mapping for the System type to a method call.
     * The method should return a System instance. A DynamicSystemProvider is used for
     * the mapping.
     *
     * @param method The method to provide the System instance.
     * @return This StateSystemMapping, so more modifications can be applied.
     */

    EngineState.prototype.addMethod = function(method) {
      return this.addProvider(new DynamicSystemProvider(method));
    };


    /*
     * Adds any SystemProvider.
     *
     * @param provider The component provider to use.
     * @return This StateSystemMapping, so more modifications can be applied.
     */

    EngineState.prototype.addProvider = function(provider) {
      var mapping;
      mapping = new StateSystemMapping(this, provider);
      this.providers.push(provider);
      return mapping;
    };

    return EngineState;

  })();


  /*
   * Used by the EntityState class to create the mappings of components to providers via a fluent interface.
   */

  ash.fsm.StateComponentMapping = StateComponentMapping = (function() {
    StateComponentMapping.prototype.componentType = null;

    StateComponentMapping.prototype.creatingState = null;

    StateComponentMapping.prototype.provider = null;


    /*
     * Used internally, the constructor creates a component mapping. The constructor
     * creates a ComponentTypeProvider as the default mapping, which will be replaced
     * by more specific mappings if other methods are called.
     *
     * @param creatingState The EntityState that the mapping will belong to
     * @param type The component type for the mapping
     */

    function StateComponentMapping(creatingState, type) {
      this.creatingState = creatingState;
      this.componentType = type;
      this.withType(type);
    }


    /*
     * Creates a mapping for the component type to a specific component instance. A
     * ComponentInstanceProvider is used for the mapping.
     *
     * @param component The component instance to use for the mapping
     * @return This ComponentMapping, so more modifications can be applied
     */

    StateComponentMapping.prototype.withInstance = function(component) {
      this.setProvider(new ComponentInstanceProvider(component));
      return this;
    };


    /*
     * Creates a mapping for the component type to new instances of the provided type.
     * The type should be the same as or extend the type for this mapping. A ComponentTypeProvider
     * is used for the mapping.
     *
     * @param type The type of components to be created by this mapping
     * @return This ComponentMapping, so more modifications can be applied
     */

    StateComponentMapping.prototype.withType = function(type) {
      this.setProvider(new ComponentTypeProvider(type));
      return this;
    };


    /*
     * Creates a mapping for the component type to a single instance of the provided type.
     * The instance is not created until it is first requested. The type should be the same
     * as or extend the type for this mapping. A ComponentSingletonProvider is used for
     * the mapping.
     *
     * @param The type of the single instance to be created. If omitted, the type of the
     * mapping is used.
     * @return This ComponentMapping, so more modifications can be applied
     */

    StateComponentMapping.prototype.withSingleton = function(type) {
      if (type == null) {
        type = this.componentType;
      }
      this.setProvider(new ComponentSingletonProvider(type));
      return this;
    };


    /*
     * Creates a mapping for the component type to a method call. A
     * DynamicComponentProvider is used for the mapping.
     *
     * @param method The method to return the component instance
     * @return This ComponentMapping, so more modifications can be applied
     */

    StateComponentMapping.prototype.withMethod = function(method) {
      this.setProvider(new DynamicComponentProvider(method));
      return this;
    };


    /*
     * Creates a mapping for the component type to any ComponentProvider.
     *
     * @param provider The component provider to use.
     * @return This ComponentMapping, so more modifications can be applied.
     */

    StateComponentMapping.prototype.withProvider = function(provider) {
      this.setProvider(provider);
      return this;
    };


    /*
     * Maps through to the add method of the EntityState that this mapping belongs to
     * so that a fluent interface can be used when configuring entity states.
     *
     * @param type The type of component to add a mapping to the state for
     * @return The new ComponentMapping for that type
     */

    StateComponentMapping.prototype.add = function(type) {
      return this.creatingState.add(type);
    };

    StateComponentMapping.prototype.setProvider = function(provider) {
      this.provider = provider;
      return this.creatingState.providers[this.componentType] = provider;
    };

    return StateComponentMapping;

  })();


  /*
   * This is a state machine for the Engine. The state machine manages a set of states,
   * each of which has a set of System providers. When the state machine changes the state, it removes
   * Systems associated with the previous state and adds Systems associated with the new state.
   */

  ash.fsm.EngineStateMachine = EngineStateMachine = (function() {
    EngineStateMachine.prototype.engine = null;

    EngineStateMachine.prototype.states = null;

    EngineStateMachine.prototype.currentState = null;


    /*
     * Constructor. Creates an SystemStateMachine.
     */

    function EngineStateMachine(engine) {
      this.engine = engine;
      this.states = new Dictionary();
    }


    /*
     * Add a state to this state machine.
     *
     * @param name The name of this state - used to identify it later in the changeState method call.
     * @param state The state.
     * @return This state machine, so methods can be chained.
     */

    EngineStateMachine.prototype.addState = function(name, state) {
      this.states[name] = state;
      return this;
    };


    /*
     * Create a new state in this state machine.
     *
     * @param name The name of the new state - used to identify it later in the changeState method call.
     * @return The new EntityState object that is the state. This will need to be configured with
     * the appropriate component providers.
     */

    EngineStateMachine.prototype.createState = function(name) {
      var state;
      state = new EngineState();
      this.states[name] = state;
      return this;
    };


    /*
     * Change to a new state. The Systems from the old state will be removed and the Systems
     * for the new state will be added.
     *
     * @param name The name of the state to change to.
     */

    EngineStateMachine.prototype.changeState = function(name) {
      var each, id, newState, other, provider, toAdd, _ref, _ref1;
      newState = this.states[name];
      if (newState == null) {
        throw new Error("Engine state " + name + " doesn't exist");
      }
      if (newState === this.currentState) {
        newState = null;
        return;
      }
      toAdd = new Dictionary();
      _ref = newState.providers;
      for (each in _ref) {
        provider = _ref[each];
        id = provider.identifier;
        toAdd[id] = provider;
      }
      if (currentState) {
        _ref1 = this.currentState.providers;
        for (each in _ref1) {
          provider = _ref1[each];
          id = provider.identifier;
          other = toAdd[id];
          if (other) {
            delete toAdd[id];
          } else {
            this.engine.removeSystem(provider.getSystem());
          }
        }
      }
      for (each in toAdd) {
        provider = toAdd[each];
        this.engine.addSystem(provider.getSystem(), provider.priority);
      }
      return this.currentState = newState;
    };

    return EngineStateMachine;

  })();


  /*
   * Represents a state for an EntityStateMachine. The state contains any number of ComponentProviders which
   * are used to add components to the entity when this state is entered.
   */

  ash.fsm.EntityState = EntityState = (function() {
    EntityState.prototype.providers = null;

    function EntityState() {
      this.providers = new Dictionary();
    }


    /*
     * Add a new ComponentMapping to this state. The mapping is a utility class that is used to
     * map a component type to the provider that provides the component.
     *
     * @param type The type of component to be mapped
     * @return The component mapping to use when setting the provider for the component
     */

    EntityState.prototype.add = function(type) {
      return new StateComponentMapping(this, type.name);
    };


    /*
     * Get the ComponentProvider for a particular component type.
     *
     * @param type The type of component to get the provider for
     * @return The ComponentProvider
     */

    EntityState.prototype.get = function(type) {
      return this.providers[type];
    };


    /*
     * To determine whether this state has a provider for a specific component type.
     *
     * @param type The type of component to look for a provider for
     * @return true if there is a provider for the given type, false otherwise
     */

    EntityState.prototype.has = function(type) {
      return this.providers[type] !== null;
    };

    return EntityState;

  })();


  /*
   * This is a state machine for an entity. The state machine manages a set of states,
   * each of which has a set of component providers. When the state machine changes the state, it removes
   * components associated with the previous state and adds components associated with the new state.
   */

  ash.fsm.EntityStateMachine = EntityStateMachine = (function() {
    EntityStateMachine.prototype.states = null;


    /*
    	 * The current state of the state machine.
     */

    EntityStateMachine.prototype.currentState = null;


    /*
     * The entity whose state machine this is
     */

    EntityStateMachine.prototype.entity = null;


    /*
     * Constructor. Creates an EntityStateMachine.
     */

    function EntityStateMachine(entity) {
      this.entity = entity;
      this.states = new Dictionary();
    }


    /*
    		 * Add a state to this state machine.
    		 *
    		 * @param name The name of this state - used to identify it later in the changeState method call.
    		 * @param state The state.
    		 * @return This state machine, so methods can be chained.
     */

    EntityStateMachine.prototype.addState = function(name, state) {
      this.states[name] = state;
      return this;
    };


    /*
     * Create a new state in this state machine.
     *
     * @param name The name of the new state - used to identify it later in the changeState method call.
     * @return The new EntityState object that is the state. This will need to be configured with
     * the appropriate component providers.
     */

    EntityStateMachine.prototype.createState = function(name) {
      var state;
      state = new EntityState();
      this.states[name] = state;
      return state;
    };


    /*
     * Change to a new state. The components from the old state will be removed and the components
     * for the new state will be added.
     *
     * @param name The name of the state to change to.
     */

    EntityStateMachine.prototype.changeState = function(name) {
      var newState, other, toAdd, type;
      newState = this.states[name];
      if (!newState) {
        throw new Error("Entity state " + name + " doesn't exist");
      }
      if (newState === this.currentState) {
        newState = null;
        return;
      }
      if (this.currentState) {
        toAdd = new Dictionary();
        for (type in newState.providers) {
          toAdd[type] = newState.providers[type];
        }
        for (type in this.currentState.providers) {
          other = toAdd[type];
          if (other && other.identifier === this.currentState.providers[type].identifier) {
            delete toAdd[type];
          } else {
            this.entity.remove(type);
          }
        }
      } else {
        toAdd = newState.providers;
      }
      for (type in toAdd) {
        this.entity.add(toAdd[type].getComponent());
      }
      return this.currentState = newState;
    };

    return EntityStateMachine;

  })();


  /*
   * Used by the SystemState class to create the mappings of Systems to providers via a fluent interface.
   */

  ash.fsm.StateSystemMapping = StateSystemMapping = (function() {
    StateSystemMapping.prototype.creatingState = null;

    StateSystemMapping.prototype.provider = null;


    /*
     * Used internally, the constructor creates a component mapping. The constructor
     * creates a SystemSingletonProvider as the default mapping, which will be replaced
     * by more specific mappings if other methods are called.
     *
     * @param creatingState The SystemState that the mapping will belong to
     * @param type The System type for the mapping
     */

    function StateSystemMapping(creatingState, provider) {
      this.creatingState = creatingState;
      this.provider = provider;
    }


    /*
     * Applies the priority to the provider that the System will be.
     *
     * @param priority The component provider to use.
     * @return This StateSystemMapping, so more modifications can be applied.
     */

    StateSystemMapping.prototype.withPriority = function(priority) {
      this.provider.priority = priority;
      return this;
    };


    /*
     * Creates a mapping for the System type to a specific System instance. A
     * SystemInstanceProvider is used for the mapping.
     *
     * @param system The System instance to use for the mapping
     * @return This StateSystemMapping, so more modifications can be applied
     */

    StateSystemMapping.prototype.addInstance = function(system) {
      return creatingState.addInstance(system);
    };


    /*
     * Creates a mapping for the System type to a single instance of the provided type.
     * The instance is not created until it is first requested. The type should be the same
     * as or extend the type for this mapping. A SystemSingletonProvider is used for
     * the mapping.
     *
     * @param type The type of the single instance to be created. If omitted, the type of the
     * mapping is used.
     * @return This StateSystemMapping, so more modifications can be applied
     */

    StateSystemMapping.prototype.addSingleton = function(type) {
      return creatingState.addSingleton(type);
    };


    /*
     * Creates a mapping for the System type to a method call.
     * The method should return a System instance. A DynamicSystemProvider is used for
     * the mapping.
     *
     * @param method The method to provide the System instance.
     * @return This StateSystemMapping, so more modifications can be applied.
     */

    StateSystemMapping.prototype.addMethod = function(method) {
      return creatingState.addMethod(method);
    };


    /*
     * Maps through to the addProvider method of the SystemState that this mapping belongs to
     * so that a fluent interface can be used when configuring entity states.
     *
     * @param provider The component provider to use.
     * @return This StateSystemMapping, so more modifications can be applied.
     */

    StateSystemMapping.prototype.addProvider = function(provider) {
      return creatingState.addProvider(provider);
    };


    /*
     */

    return StateSystemMapping;

  })();


  /*
   * This System provider always returns the same instance of the component. The system
   * is passed to the provider at initialisation.
   */

  ash.fsm.SystemInstanceProvider = SystemInstanceProvider = (function() {
    SystemInstanceProvider.prototype.instance = null;

    SystemInstanceProvider.prototype.systemPriority = 0;


    /*
     * Constructor
     *
     * @param instance The instance to return whenever a System is requested.
     */

    function SystemInstanceProvider(instance) {
      this.instance = instance;
    }


    /*
     * Used to request a component from this provider
     *
     * @return The instance of the System
     */

    SystemInstanceProvider.prototype.getSystem = function() {
      return this.instance;
    };

    Object.defineProperties(SystemInstanceProvider.prototype, {

      /*
       * Used to compare this provider with others. Any provider that returns the same component
       * instance will be regarded as equivalent.
       *
       * @return The instance
       */
      identifier: {
        get: function() {
          return this.instance;
        }
      },

      /*
       * The priority at which the System should be added to the Engine
       */
      priority: {
        get: function() {
          return this.systemPriority;
        },
        set: function(value) {
          return this.systemPriority = value;
        }
      }
    });

    return SystemInstanceProvider;

  })();


  /*
   * This System provider always returns the same instance of the System. The instance
   * is created when first required and is of the type passed in to the constructor.
   */

  ash.fsm.SystemSingletonProvider = SystemSingletonProvider = (function() {
    SystemSingletonProvider.prototype.componentType = null;

    SystemSingletonProvider.prototype.instance = null;

    SystemSingletonProvider.prototype.systemPriority = 0;


    /*
     * Constructor
     *
     * @param type The type of the single System instance
     */

    function SystemSingletonProvider(type) {
      this.componentType = type;
    }


    /*
     * Used to request a System from this provider
     *
     * @return The single instance
     */

    SystemSingletonProvider.prototype.getSystem = function() {
      if (!this.instance) {
        this.instance = new this.componentType();
      }
      return this.instance;
    };

    Object.defineProperties(SystemSingletonProvider.prototype, {

      /*
      		 * Used to compare this provider with others. Any provider that returns the same single
      		 * instance will be regarded as equivalent.
      		 *
      		 * @return The single instance
       */
      identifier: {
        get: function() {
          return this.getSystem();
        }
      },

      /*
       * The priority at which the System should be added to the Engine
       */
      priority: {
        get: function() {
          return this.systemPriority;
        },
        set: function(value) {
          return this.systemPriority = value;
        }
      }
    });

    return SystemSingletonProvider;

  })();


  /*
   * Uses the enter frame event to provide a frame tick where the frame duration is the time since the previous frame.
   * There is a maximum frame time parameter in the constructor that can be used to limit
   * the longest period a frame can be.
   */

  ash.tick.FrameTickProvider = FrameTickProvider = (function(_super) {
    __extends(FrameTickProvider, _super);

    FrameTickProvider.prototype.displayObject = null;

    FrameTickProvider.prototype.previousTime = 0;

    FrameTickProvider.prototype.maximumFrameTime = 0;

    FrameTickProvider.prototype.isPlaying = false;

    FrameTickProvider.prototype.request = null;


    /*
     * Applies a time adjustement factor to the tick, so you can slow down or speed up the entire engine.
     * The update tick time is multiplied by this value, so a value of 1 will run the engine at the normal rate.
     */

    FrameTickProvider.prototype.timeAdjustment = 1;

    function FrameTickProvider(displayObject, maximumFrameTime) {
      this.displayObject = displayObject;
      this.maximumFrameTime = maximumFrameTime;
      this.dispatchTick = __bind(this.dispatchTick, this);
      FrameTickProvider.__super__.constructor.apply(this, arguments);
    }

    Object.defineProperties(FrameTickProvider.prototype, {
      playing: {
        get: function() {
          return this.isPlaying;
        }
      }
    });

    FrameTickProvider.prototype.start = function() {
      this.request = requestAnimationFrame(this.dispatchTick);
      this.isPlaying = true;
    };

    FrameTickProvider.prototype.stop = function() {
      cancelRequestAnimationFrame(this.request);
      this.isPlaying = false;
    };

    FrameTickProvider.prototype.dispatchTick = function(timestamp) {
      var frameTime, temp;
      if (timestamp == null) {
        timestamp = Date.now();
      }
      if (this.displayObject) {
        this.displayObject.begin();
      }
      temp = this.previousTime || timestamp;
      this.previousTime = timestamp;
      frameTime = (timestamp - temp) * 0.001;
      this.dispatch(frameTime);
      requestAnimationFrame(this.dispatchTick);
      if (this.displayObject) {
        this.displayObject.end();
      }
    };

    return FrameTickProvider;

  })(Signal1);


  /*
   * An object pool for re-using components. This is not integrated in to Ash but is used dierectly by
   * the developer. It expects components to not require any parameters in their constructor.
   *
   * <p>Fetch an object from the pool with</p>
   *
   * <p>ComponentPool.get( ComponentClass );</p>
   *
   * <p>If the pool contains an object of the required type, it will be returned. If it does not, a new object
   * will be created and returned.</p>
   *
   * <p>The object returned may have properties set on it from the time it was previously used, so all properties
   * should be reset in the object once it is received.</p>
   *
   * <p>Add an object to the pool with</p>
   *
   * <p>ComponentPool.dispose( component );</p>
   *
   * <p>You will usually want to do this when removing a component from an entity. The remove method on the entity
   * returns the component that was removed, so this can be done in one line of code like this</p>
   *
   * <p>ComponentPool.dispose( entity.remove( component ) );</p>
   */

  ash.tools.ComponentPool = ComponentPool = (function() {
    var getPool, pools;

    function ComponentPool() {}

    pools = new Dictionary();

    getPool = function(componentClass) {
      var _ref;
      if ((_ref = componentClass.name, __indexOf.call(pools, _ref) >= 0)) {
        return pools[componentClass.name];
      } else {
        return pools[componentClass.name] = [];
      }
    };


    /*
     * Get an object from the pool.
     *
     * @param componentClass The type of component wanted.
     * @return The component.
     */

    ComponentPool.get = function(componentClass) {
      var pool;
      pool = getPool(componentClass);
      if (pool.length > 0) {
        return pool.pop();
      } else {
        return new componentClass();
      }
    };


    /*
     * Return an object to the pool for reuse.
     *
     * @param component The component to return to the pool.
     */

    ComponentPool.dispose = function(component) {
      var pool, type;
      if (component) {
        type = component.constructor;
        pool = getPool(type);
        pool.push(component);
      }
    };


    /*
     * Dispose of all pooled resources, freeing them for garbage collection.
     */

    ComponentPool.empty = function() {
      return pools = new Dictionary();
    };

    return ComponentPool;

  })();


  /*
   * A useful class for systems which simply iterate over a set of nodes, performing the same action on each node. This
   * class removes the need for a lot of boilerplate code in such systems. Extend this class and pass the node type and
   * a node update method into the constructor. The node update method will be called once per node on the update cycle
   * with the node instance and the frame time as parameters. e.g.
   *
   * <code>package;
   * class MySystem extends ListIteratingSystem<MyNode>
   * {
   *     public function new()
   *     {
   *         super(MyNode, updateNode);
   *     }
   *
   *     private function updateNode(node:MyNode, time:Float):Void
   *     {
   *         // process the node here
   *     }
   * }
   * </code>
   */

  ash.tools.ListIteratingSystem = ListIteratingSystem = (function(_super) {
    __extends(ListIteratingSystem, _super);

    ListIteratingSystem.prototype.nodeList = null;

    ListIteratingSystem.prototype.nodeClass = null;

    ListIteratingSystem.prototype.nodeUpdateFunction = null;

    ListIteratingSystem.prototype.nodeAddedFunction = null;

    ListIteratingSystem.prototype.nodeRemovedFunction = null;

    function ListIteratingSystem(nodeClass, nodeUpdateFunction, nodeAddedFunction, nodeRemovedFunction) {
      if (nodeAddedFunction == null) {
        nodeAddedFunction = null;
      }
      if (nodeRemovedFunction == null) {
        nodeRemovedFunction = null;
      }
      this.nodeClass = nodeClass;
      this.nodeUpdateFunction = nodeUpdateFunction;
      this.nodeAddedFunction = nodeAddedFunction;
      this.nodeRemovedFunction = nodeRemovedFunction;
    }

    ListIteratingSystem.prototype.addToEngine = function(engine) {
      var node;
      this.nodeList = engine.getNodeList(this.nodeClass);
      if (this.nodeAddedFunction !== null) {
        node = this.nodeList.head;
        while (node) {
          this.nodeAddedFunction(node);
          node = node.next;
        }
        this.nodeList.nodeAdded.add(this.nodeAddedFunction);
      }
      if (this.nodeRemovedFunction !== null) {
        this.nodeList.nodeRemoved.add(this.nodeRemovedFunction);
      }
    };

    ListIteratingSystem.prototype.removeFromEngine = function(engine) {
      if (this.nodeAddedFunction !== null) {
        this.nodeList.nodeAdded.remove(this.nodeAddedFunction);
      }
      if (this.nodeRemovedFunction !== null) {
        this.nodeList.nodeRemoved.remove(this.nodeRemovedFunction);
      }
      this.nodeList = null;
    };

    ListIteratingSystem.prototype.update = function(time) {
      var node;
      node = this.nodeList.head;
      while (node) {
        this.nodeUpdateFunction(node, time);
        node = node.next;
      }
    };

    return ListIteratingSystem;

  })(System);

  if (typeof module !== "undefined" && module !== null) {
    module.exports = ash;
  } else {
    window.ash = ash;
  }

}).call(this);

//# sourceMappingURL=ash.js.map
