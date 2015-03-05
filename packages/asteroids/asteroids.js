!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.asteroids=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var Dictionary, NodeList, NodePool, ash,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

ash = require('../../../lib');

NodeList = ash.core.NodeList;

NodePool = ash.core.NodePool;

Dictionary = (function() {
  function Dictionary() {}

  return Dictionary;

})();


/*
 * The default class for managing a NodeList. This class creates the NodeList and adds and removes
 * nodes to/from the list as the entities and the components in the engine change.
 *
 * It uses the basic entity matching pattern of an entity system - entities are added to the list if
 * they contain components matching all the public properties of the node class.
 */

ash.core.ComponentMatchingFamily = (function() {
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

//# sourceMappingURL=component_matching_family.js.map

},{"../../../lib":34}],2:[function(require,module,exports){
'use strict';
var ComponentMatchingFamily, Dictionary, EntityList, Signal0, SystemList, ash,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

ash = require('../../../lib');

ComponentMatchingFamily = ash.core.ComponentMatchingFamily;

EntityList = ash.core.EntityList;

Signal0 = ash.signals.Signal0;

SystemList = ash.core.SystemList;

Dictionary = (function() {
  function Dictionary() {}

  return Dictionary;

})();


/*
 * The Engine class is the central point for creating and managing your game state. Add
 * entities and systems to the engine, and fetch families of nodes from the engine.
 */

ash.core.Engine = (function() {
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

//# sourceMappingURL=engine.js.map

},{"../../../lib":34}],3:[function(require,module,exports){
'use strict';
var Dictionary, Signal2, ash;

ash = require('../../../lib');

Signal2 = ash.signals.Signal2;

Dictionary = (function() {
  function Dictionary() {}

  return Dictionary;

})();


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

ash.core.Entity = (function() {
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

//# sourceMappingURL=entity.js.map

},{"../../../lib":34}],4:[function(require,module,exports){
'use strict';
var ash;

ash = require('../../../lib');


/*
 * An internal class for a linked list of entities. Used inside the framework for
 * managing the entities.
 */

ash.core.EntityList = (function() {
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

//# sourceMappingURL=entity_list.js.map

},{"../../../lib":34}],5:[function(require,module,exports){
'use strict';
var ash;

ash = require('../../../lib');


/*
 * The interface for classes that are used to manage NodeLists (set as the familyClass property
 * in the Engine object). Most developers don't need to use this since the default implementation
 * is used by default and suits most needs.
 */

ash.core.Family = (function() {
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

//# sourceMappingURL=family.js.map

},{"../../../lib":34}],6:[function(require,module,exports){
'use strict';
var ash;

ash = require('../../../lib');

ash.core.Node = (function() {
  function Node() {}

  Node.prototype.entity = null;

  Node.prototype.previous = null;

  Node.prototype.next = null;

  return Node;

})();

//# sourceMappingURL=node.js.map

},{"../../../lib":34}],7:[function(require,module,exports){
'use strict';
var Signal1, ash;

ash = require('../../../lib');

Signal1 = ash.signals.Signal1;


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

ash.core.NodeList = (function() {

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

//# sourceMappingURL=node_list.js.map

},{"../../../lib":34}],8:[function(require,module,exports){
'use strict';
var ash;

ash = require('../../../lib');


/*
 * This internal class maintains a pool of deleted nodes for reuse by the framework. This reduces the overhead
 * from object creation and garbage collection.
 *
 * Because nodes may be deleted from a NodeList while in use, by deleting Nodes from a NodeList
 * while iterating through the NodeList, the pool also maintains a cache of nodes that are added to the pool
 * but should not be reused yet. They are then released into the pool by calling the releaseCache method.
 */

ash.core.NodePool = (function() {
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

//# sourceMappingURL=node_pool.js.map

},{"../../../lib":34}],9:[function(require,module,exports){
'use strict';
var ash,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

ash = require('../../../lib');


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

ash.core.System = (function() {
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

//# sourceMappingURL=system.js.map

},{"../../../lib":34}],10:[function(require,module,exports){
'use strict';
var ash;

ash = require('../../../lib');


/*
 * Used internally, this is an ordered list of Systems for use by the engine update loop.
 */

ash.core.SystemList = (function() {
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

//# sourceMappingURL=system_list.js.map

},{"../../../lib":34}],11:[function(require,module,exports){
'use strict';
var ash;

ash = require('../../../lib');


/*
 * This component provider always returns the same instance of the component. The instance
 * is passed to the provider at initialisation.
 */

ash.fsm.ComponentInstanceProvider = (function() {
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

//# sourceMappingURL=component_instance_provider.js.map

},{"../../../lib":34}],12:[function(require,module,exports){
'use strict';
var ash;

ash = require('../../../lib');

ash.fsm.ComponentSingletonProvider = (function() {
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

//# sourceMappingURL=component_singleton_provider.js.map

},{"../../../lib":34}],13:[function(require,module,exports){
'use strict';
var ash;

ash = require('../../../lib');

ash.fsm.ComponentTypeProvider = (function() {
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

//# sourceMappingURL=component_type_provider.js.map

},{"../../../lib":34}],14:[function(require,module,exports){
'use strict';
var ash;

ash = require('../../../lib');

ash.fsm.DynamicComponentProvider = (function() {
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

//# sourceMappingURL=dynamic_component_provider.js.map

},{"../../../lib":34}],15:[function(require,module,exports){
'use strict';
var ash;

ash = require('../../../lib');


/*
 * This System provider returns results of a method call. The method
 * is passed to the provider at initialisation.
 */

ash.fsm.DynamicSystemProvider = (function() {
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

//# sourceMappingURL=dynamic_system_provider.js.map

},{"../../../lib":34}],16:[function(require,module,exports){
'use strict';
var DynamicSystemProvider, StateSystemMapping, SystemInstanceProvider, SystemSingletonProvider, ash;

ash = require('../../../lib');

SystemInstanceProvider = ash.fsm.SystemInstanceProvider;

SystemSingletonProvider = ash.fsm.SystemSingletonProvider;

DynamicSystemProvider = ash.fsm.DynamicSystemProvider;

StateSystemMapping = ash.fsm.StateSystemMapping;


/*
 * Represents a state for a SystemStateMachine. The state contains any number of SystemProviders which
 * are used to add Systems to the Engine when this state is entered.
 */

ash.fsm.EngineState = (function() {
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

//# sourceMappingURL=engine_state.js.map

},{"../../../lib":34}],17:[function(require,module,exports){
'use strict';
var Dictionary, EngineState, ash;

ash = require('../../../lib');

EngineState = ash.fsm.EngineState;

Dictionary = (function() {
  function Dictionary() {}

  return Dictionary;

})();


/*
 * This is a state machine for the Engine. The state machine manages a set of states,
 * each of which has a set of System providers. When the state machine changes the state, it removes
 * Systems associated with the previous state and adds Systems associated with the new state.
 */

ash.fsm.EngineStateMachine = (function() {
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

//# sourceMappingURL=engine_state_machine.js.map

},{"../../../lib":34}],18:[function(require,module,exports){
'use strict';
var Dictionary, StateComponentMapping, ash;

ash = require('../../../lib');

StateComponentMapping = ash.fsm.StateComponentMapping;

Dictionary = (function() {
  function Dictionary() {}

  return Dictionary;

})();


/*
 * Represents a state for an EntityStateMachine. The state contains any number of ComponentProviders which
 * are used to add components to the entity when this state is entered.
 */

ash.fsm.EntityState = (function() {
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

//# sourceMappingURL=entity_state.js.map

},{"../../../lib":34}],19:[function(require,module,exports){
'use strict';
var Dictionary, EntityState, ash;

ash = require('../../../lib');

EntityState = ash.fsm.EntityState;

Dictionary = (function() {
  function Dictionary() {}

  return Dictionary;

})();


/*
 * This is a state machine for an entity. The state machine manages a set of states,
 * each of which has a set of component providers. When the state machine changes the state, it removes
 * components associated with the previous state and adds components associated with the new state.
 */

ash.fsm.EntityStateMachine = (function() {
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

//# sourceMappingURL=entity_state_machine.js.map

},{"../../../lib":34}],20:[function(require,module,exports){
'use strict';
var ComponentInstanceProvider, ComponentSingletonProvider, ComponentTypeProvider, DynamicComponentProvider, ash;

ash = require('../../../lib');

ComponentInstanceProvider = ash.fsm.ComponentInstanceProvider;

ComponentTypeProvider = ash.fsm.ComponentTypeProvider;

ComponentSingletonProvider = ash.fsm.ComponentSingletonProvider;

DynamicComponentProvider = ash.fsm.DynamicComponentProvider;


/*
 * Used by the EntityState class to create the mappings of components to providers via a fluent interface.
 */

ash.fsm.StateComponentMapping = (function() {
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

//# sourceMappingURL=state_component_mapping.js.map

},{"../../../lib":34}],21:[function(require,module,exports){
'use strict';
var ash;

ash = require('../../../lib');


/*
 * Used by the SystemState class to create the mappings of Systems to providers via a fluent interface.
 */

ash.fsm.StateSystemMapping = (function() {
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

//# sourceMappingURL=state_system_mapping.js.map

},{"../../../lib":34}],22:[function(require,module,exports){
'use strict';
var ash;

ash = require('../../../lib');


/*
 * This System provider always returns the same instance of the component. The system
 * is passed to the provider at initialisation.
 */

ash.fsm.SystemInstanceProvider = (function() {
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

//# sourceMappingURL=system_instance_provider.js.map

},{"../../../lib":34}],23:[function(require,module,exports){
'use strict';
var ash;

ash = require('../../../lib');


/*
 * This System provider always returns the same instance of the System. The instance
 * is created when first required and is of the type passed in to the constructor.
 */

ash.fsm.SystemSingletonProvider = (function() {
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

//# sourceMappingURL=system_singleton_provider.js.map

},{"../../../lib":34}],24:[function(require,module,exports){
'use strict';
var ash;

ash = require('../../../lib');


/*
 * A node in the list of listeners in a signal.
 */

ash.signals.ListenerNode = (function() {
  function ListenerNode() {}

  ListenerNode.prototype.previous = null;

  ListenerNode.prototype.next = null;

  ListenerNode.prototype.listener = null;

  ListenerNode.prototype.once = false;

  return ListenerNode;

})();

//# sourceMappingURL=listener_node.js.map

},{"../../../lib":34}],25:[function(require,module,exports){
'use strict';
var ListenerNode, ash;

ash = require('../../../lib');

ListenerNode = ash.signals.ListenerNode;


/*
 * This internal class maintains a pool of deleted listener nodes for reuse by framework. This reduces
 * the overhead from object creation and garbage collection.
 */

ash.signals.ListenerNodePool = (function() {
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

//# sourceMappingURL=listener_node_pool.js.map

},{"../../../lib":34}],26:[function(require,module,exports){
'use strict';
var ash,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ash = require('../../../lib');

ash.signals.Signal0 = (function(_super) {
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

})(ash.signals.SignalBase);

//# sourceMappingURL=signal0.js.map

},{"../../../lib":34}],27:[function(require,module,exports){
'use strict';
var ash,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ash = require('../../../lib');

ash.signals.Signal1 = (function(_super) {
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

})(ash.signals.SignalBase);

//# sourceMappingURL=signal1.js.map

},{"../../../lib":34}],28:[function(require,module,exports){
'use strict';
var ash,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ash = require('../../../lib');

ash.signals.Signal2 = (function(_super) {
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

})(ash.signals.SignalBase);

//# sourceMappingURL=signal2.js.map

},{"../../../lib":34}],29:[function(require,module,exports){
'use strict';
var ash,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ash = require('../../../lib');

ash.signals.Signal3 = (function(_super) {
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

})(ash.signals.SignalBase);

//# sourceMappingURL=signal3.js.map

},{"../../../lib":34}],30:[function(require,module,exports){
'use strict';
var ListenerNodePool, ash;

ash = require('../../../lib');

ListenerNodePool = ash.signals.ListenerNodePool;

ash.signals.SignalBase = (function() {
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

//# sourceMappingURL=signal_base.js.map

},{"../../../lib":34}],31:[function(require,module,exports){
'use strict';
var Signal1, ash,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ash = require('../../../lib');

Signal1 = ash.signals.Signal1;


/*
 * Uses the enter frame event to provide a frame tick where the frame duration is the time since the previous frame.
 * There is a maximum frame time parameter in the constructor that can be used to limit
 * the longest period a frame can be.
 */

ash.tick.FrameTickProvider = (function(_super) {
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

//# sourceMappingURL=frame_tick_provider.js.map

},{"../../../lib":34}],32:[function(require,module,exports){
'use strict';
var Dictionary, ash,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

ash = require('../../../lib');

Dictionary = (function() {
  function Dictionary() {}

  return Dictionary;

})();


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

ash.tools.ComponentPool = (function() {
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

//# sourceMappingURL=component_pool.js.map

},{"../../../lib":34}],33:[function(require,module,exports){
'use strict';
var Engine, Node, NodeList, System, ash,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ash = require('../../../lib');

Engine = ash.core.Engine;

Node = ash.core.Node;

NodeList = ash.core.NodeList;

System = ash.core.System;


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

ash.tools.ListIteratingSystem = (function(_super) {
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

//# sourceMappingURL=list_iterating_system.js.map

},{"../../../lib":34}],34:[function(require,module,exports){

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
'use strict';
var ash;

module.exports = ash = (function() {
  function ash() {}

  return ash;

})();

ash.signals = (function() {
  function signals() {}

  return signals;

})();

require('./ash/signals/listener_node');

require('./ash/signals/listener_node_pool');

require('./ash/signals/signal_base');

require('./ash/signals/signal0');

require('./ash/signals/signal1');

require('./ash/signals/signal2');

require('./ash/signals/signal3');

ash.core = (function() {
  function core() {}

  return core;

})();

require('./ash/core/entity');

require('./ash/core/entity_list');

require('./ash/core/node');

require('./ash/core/node_list');

require('./ash/core/node_pool');

require('./ash/core/system');

require('./ash/core/system_list');

require('./ash/core/family');

require('./ash/core/component_matching_family');

require('./ash/core/engine');

ash.fsm = (function() {
  function fsm() {}

  return fsm;

})();

require('./ash/fsm/component_instance_provider');

require('./ash/fsm/component_singleton_provider');

require('./ash/fsm/component_type_provider');

require('./ash/fsm/dynamic_component_provider');

require('./ash/fsm/dynamic_system_provider');

require('./ash/fsm/engine_state');

require('./ash/fsm/state_component_mapping');

require('./ash/fsm/engine_state_machine');

require('./ash/fsm/entity_state');

require('./ash/fsm/entity_state_machine');

require('./ash/fsm/state_system_mapping');

require('./ash/fsm/system_instance_provider');

require('./ash/fsm/system_singleton_provider');

ash.tick = (function() {
  function tick() {}

  return tick;

})();

require('./ash/tick/frame_tick_provider');

ash.tools = (function() {
  function tools() {}

  return tools;

})();

require('./ash/tools/component_pool');

require('./ash/tools/list_iterating_system');

//# sourceMappingURL=index.js.map

},{"./ash/core/component_matching_family":1,"./ash/core/engine":2,"./ash/core/entity":3,"./ash/core/entity_list":4,"./ash/core/family":5,"./ash/core/node":6,"./ash/core/node_list":7,"./ash/core/node_pool":8,"./ash/core/system":9,"./ash/core/system_list":10,"./ash/fsm/component_instance_provider":11,"./ash/fsm/component_singleton_provider":12,"./ash/fsm/component_type_provider":13,"./ash/fsm/dynamic_component_provider":14,"./ash/fsm/dynamic_system_provider":15,"./ash/fsm/engine_state":16,"./ash/fsm/engine_state_machine":17,"./ash/fsm/entity_state":18,"./ash/fsm/entity_state_machine":19,"./ash/fsm/state_component_mapping":20,"./ash/fsm/state_system_mapping":21,"./ash/fsm/system_instance_provider":22,"./ash/fsm/system_singleton_provider":23,"./ash/signals/listener_node":24,"./ash/signals/listener_node_pool":25,"./ash/signals/signal0":26,"./ash/signals/signal1":27,"./ash/signals/signal2":28,"./ash/signals/signal3":29,"./ash/signals/signal_base":30,"./ash/tick/frame_tick_provider":31,"./ash/tools/component_pool":32,"./ash/tools/list_iterating_system":33}],35:[function(require,module,exports){
module.exports = require('./dist/lib');
},{"./dist/lib":34}],36:[function(require,module,exports){
'use strict';
var AnimationSystem, AudioSystem, BulletAgeSystem, CollisionSystem, DeathThroesSystem, EntityCreator, GameConfig, GameManager, GameState, GunControlSystem, HudSystem, KeyPoll, MovementSystem, PhysicsControlSystem, PhysicsSystem, RenderSystem, SystemPriorities, WaitForStartSystem, ash, asteroids, b2Vec2, b2World;

ash = require('ash.coffee');

asteroids = require('../index');

AnimationSystem = asteroids.systems.AnimationSystem;

AudioSystem = asteroids.systems.AudioSystem;

BulletAgeSystem = asteroids.systems.BulletAgeSystem;

CollisionSystem = asteroids.systems.CollisionSystem;

DeathThroesSystem = asteroids.systems.DeathThroesSystem;

GameManager = asteroids.systems.GameManager;

GunControlSystem = asteroids.systems.GunControlSystem;

HudSystem = asteroids.systems.HudSystem;

MovementSystem = asteroids.systems.MovementSystem;

RenderSystem = asteroids.systems.RenderSystem;

SystemPriorities = asteroids.systems.SystemPriorities;

WaitForStartSystem = asteroids.systems.WaitForStartSystem;

PhysicsSystem = asteroids.systems.PhysicsSystem;

PhysicsControlSystem = asteroids.systems.PhysicsControlSystem;

GameState = asteroids.components.GameState;

EntityCreator = asteroids.EntityCreator;

GameConfig = asteroids.GameConfig;

KeyPoll = asteroids.ui.KeyPoll;

b2Vec2 = Box2D.Common.Math.b2Vec2;

b2World = Box2D.Dynamics.b2World;

asteroids.Asteroids = (function() {
  Asteroids.prototype.container = null;

  Asteroids.prototype.engine = null;

  Asteroids.prototype.tickProvider = null;

  Asteroids.prototype.creator = null;

  Asteroids.prototype.keyPoll = null;

  Asteroids.prototype.config = null;

  Asteroids.prototype.world = null;

  function Asteroids(container, width, height) {
    this.container = container;
    this.prepare(width, height);
  }

  Asteroids.prototype.prepare = function(width, height) {
    this.world = new b2World(new b2Vec2(0, 0), true);
    this.world.SetContinuousPhysics(true);
    this.engine = new ash.core.Engine();
    this.creator = new EntityCreator(this.engine, this.world);
    this.keyPoll = new KeyPoll(window);
    this.config = new GameConfig();
    this.config.height = height;
    this.config.width = width;
    this.engine.addSystem(new WaitForStartSystem(this.creator), SystemPriorities.preUpdate);
    this.engine.addSystem(new GameManager(this.creator, this.config), SystemPriorities.preUpdate);
    this.engine.addSystem(new PhysicsControlSystem(this.keyPoll), SystemPriorities.update);
    this.engine.addSystem(new GunControlSystem(this.keyPoll, this.creator), SystemPriorities.update);
    this.engine.addSystem(new BulletAgeSystem(this.creator), SystemPriorities.update);
    this.engine.addSystem(new DeathThroesSystem(this.creator), SystemPriorities.update);
    this.engine.addSystem(new PhysicsSystem(this.config, this.world), SystemPriorities.move);
    this.engine.addSystem(new CollisionSystem(this.world, this.creator), SystemPriorities.resolveCollisions);
    this.engine.addSystem(new AnimationSystem(), SystemPriorities.animate);
    this.engine.addSystem(new HudSystem(), SystemPriorities.animate);
    this.engine.addSystem(new RenderSystem(this.container), SystemPriorities.render);
    this.engine.addSystem(new AudioSystem(), SystemPriorities.render);
    this.creator.createWaitForClick();
    this.creator.createGame();
  };

  Asteroids.prototype.start = function() {
    var stats, x, y;
    if (navigator.isCocoonJS) {
      stats = null;
    } else {
      x = Math.floor(this.config.width / 2) - 40;
      y = 0;
      stats = new Stats();
      stats.setMode(0);
      stats.domElement.style.position = "absolute";
      stats.domElement.style.left = "" + x + "px";
      stats.domElement.style.top = "" + y + "px";
      document.body.appendChild(stats.domElement);
    }
    this.tickProvider = new ash.tick.FrameTickProvider(stats);
    this.tickProvider.add(this.engine.update);
    this.tickProvider.start();
  };

  return Asteroids;

})();

//# sourceMappingURL=asteroids.js.map

},{"../index":95,"ash.coffee":35}],37:[function(require,module,exports){
'use strict';
var asteroids;

asteroids = require('../../index');

asteroids.components.Animation = (function() {
  Animation.prototype.animation = null;

  function Animation(animation) {
    this.animation = animation;
  }

  return Animation;

})();

//# sourceMappingURL=animation.js.map

},{"../../index":95}],38:[function(require,module,exports){
'use strict';
var asteroids;

asteroids = require('../../index');

asteroids.components.Asteroid = (function() {
  Asteroid.prototype.fsm = null;

  function Asteroid(fsm) {
    this.fsm = fsm;
  }

  return Asteroid;

})();

//# sourceMappingURL=asteroid.js.map

},{"../../index":95}],39:[function(require,module,exports){
'use strict';
var asteroids;

asteroids = require('../../index');

asteroids.components.Audio = (function() {
  Audio.prototype.toPlay = null;

  function Audio() {
    this.toPlay = [];
  }

  Audio.prototype.play = function(sound) {
    return this.toPlay.push(sound);
  };

  return Audio;

})();

//# sourceMappingURL=audio.js.map

},{"../../index":95}],40:[function(require,module,exports){
'use strict';
var asteroids;

asteroids = require('../../index');

asteroids.components.Bullet = (function() {
  Bullet.prototype.lifeRemaining = 0;

  function Bullet(lifeRemaining) {
    this.lifeRemaining = lifeRemaining;
  }

  return Bullet;

})();

//# sourceMappingURL=bullet.js.map

},{"../../index":95}],41:[function(require,module,exports){
'use strict';
var asteroids;

asteroids = require('../../index');

asteroids.components.Collision = (function() {
  Collision.prototype.radius = 0;

  function Collision(radius) {
    this.radius = radius;
  }

  return Collision;

})();

//# sourceMappingURL=collision.js.map

},{"../../index":95}],42:[function(require,module,exports){
'use strict';
var asteroids;

asteroids = require('../../index');

asteroids.components.DeathThroes = (function() {
  DeathThroes.prototype.countdown = 0;

  DeathThroes.prototype.body = null;

  function DeathThroes(duration) {
    this.countdown = duration;
  }

  return DeathThroes;

})();

//# sourceMappingURL=death_throes.js.map

},{"../../index":95}],43:[function(require,module,exports){
'use strict';
var asteroids;

asteroids = require('../../index');

asteroids.components.Display = (function() {
  Display.prototype.graphic = 0;

  function Display(graphic) {
    this.graphic = graphic;
  }

  return Display;

})();

//# sourceMappingURL=display.js.map

},{"../../index":95}],44:[function(require,module,exports){
'use strict';
var asteroids;

asteroids = require('../../index');

asteroids.components.GameState = (function() {
  function GameState() {}

  GameState.prototype.lives = 3;

  GameState.prototype.level = 0;

  GameState.prototype.hits = 0;

  GameState.prototype.playing = false;

  GameState.prototype.setForStart = function() {
    this.lives = 3;
    this.level = 0;
    this.hits = 0;
    this.playing = true;
  };

  return GameState;

})();

//# sourceMappingURL=game_state.js.map

},{"../../index":95}],45:[function(require,module,exports){
'use strict';
var Point, asteroids;

asteroids = require('../../index');

Point = asteroids.ui.Point;

asteroids.components.Gun = (function() {
  Gun.prototype.shooting = false;

  Gun.prototype.offsetFromParent = null;

  Gun.prototype.timeSinceLastShot = 0;

  Gun.prototype.offsetFromParent = null;

  function Gun(offsetX, offsetY, minimumShotInterval, bulletLifetime) {
    this.minimumShotInterval = minimumShotInterval;
    this.bulletLifetime = bulletLifetime;
    this.shooting = false;
    this.offsetFromParent = null;
    this.timeSinceLastShot = 0;
    this.offsetFromParent = new Point(offsetX, offsetY);
  }

  return Gun;

})();

//# sourceMappingURL=gun.js.map

},{"../../index":95}],46:[function(require,module,exports){
'use strict';
var asteroids;

asteroids = require('../../index');

asteroids.components.GunControls = (function() {
  GunControls.prototype.trigger = 0;

  function GunControls(trigger) {
    this.trigger = trigger;
  }

  return GunControls;

})();

//# sourceMappingURL=gun_controls.js.map

},{"../../index":95}],47:[function(require,module,exports){
'use strict';
var asteroids;

asteroids = require('../../index');

asteroids.components.Hud = (function() {
  Hud.prototype.view = null;

  function Hud(view) {
    this.view = view;
  }

  return Hud;

})();

//# sourceMappingURL=hud.js.map

},{"../../index":95}],48:[function(require,module,exports){
'use strict';
var asteroids;

asteroids = require('../../index');

asteroids.components.MotionControls = (function() {
  MotionControls.prototype.left = 0;

  MotionControls.prototype.right = 0;

  MotionControls.prototype.accelerate = 0;

  MotionControls.prototype.accelerationRate = 0;

  MotionControls.prototype.rotationRate = 0;

  function MotionControls(left, right, accelerate, accelerationRate, rotationRate) {
    this.left = left;
    this.right = right;
    this.accelerate = accelerate;
    this.accelerationRate = accelerationRate;
    this.rotationRate = rotationRate;
  }

  return MotionControls;

})();

//# sourceMappingURL=motion_controls.js.map

},{"../../index":95}],49:[function(require,module,exports){
'use strict';
var asteroids;

asteroids = require('../../index');

asteroids.components.Physics = (function() {
  Physics.prototype.body = null;

  function Physics(body) {
    this.body = body;
  }

  return Physics;

})();

//# sourceMappingURL=physics.js.map

},{"../../index":95}],50:[function(require,module,exports){
'use strict';
var Point, asteroids;

asteroids = require('../../index');

Point = asteroids.ui.Point;

asteroids.components.Position = (function() {
  Position.prototype.position = null;

  Position.prototype.rotation = 0;

  function Position(x, y, rotation) {
    this.rotation = rotation;
    this.position = new Point(x, y);
  }

  return Position;

})();

//# sourceMappingURL=position.js.map

},{"../../index":95}],51:[function(require,module,exports){
'use strict';
var asteroids;

asteroids = require('../../index');

asteroids.components.Spaceship = (function() {
  Spaceship.prototype.fsm = null;

  function Spaceship(fsm) {
    this.fsm = fsm;
  }

  return Spaceship;

})();

//# sourceMappingURL=spaceship.js.map

},{"../../index":95}],52:[function(require,module,exports){
'use strict';
var asteroids,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

asteroids = require('../../index');

asteroids.components.WaitForStart = (function() {
  WaitForStart.prototype.waitForStart = null;

  WaitForStart.prototype.startGame = false;

  function WaitForStart(waitForStart) {
    this.waitForStart = waitForStart;
    this.setStartGame = __bind(this.setStartGame, this);
    this.waitForStart.click.add(this.setStartGame);
  }

  WaitForStart.prototype.setStartGame = function() {
    this.startGame = true;
  };

  return WaitForStart;

})();

//# sourceMappingURL=wait_for_start.js.map

},{"../../index":95}],53:[function(require,module,exports){
'use strict';
var Animation, Asteroid, AsteroidDeathView, AsteroidView, Audio, Bullet, BulletView, Collision, DeathThroes, Display, Entity, EntityStateMachine, GameState, Gun, GunControls, Hud, HudView, MotionControls, Physics, Position, Spaceship, SpaceshipDeathView, SpaceshipView, WaitForStart, WaitForStartView, ash, asteroids, b2Body, b2BodyDef, b2CircleShape, b2FixtureDef, b2PolygonShape, b2Vec2;

ash = require('ash.coffee');

asteroids = require('../index');

WaitForStartView = asteroids.sprites.WaitForStartView;

Entity = ash.core.Entity;

EntityStateMachine = ash.fsm.EntityStateMachine;


/*
 * Asteroid Game Components
 */

Animation = asteroids.components.Animation;

Asteroid = asteroids.components.Asteroid;

Audio = asteroids.components.Audio;

Bullet = asteroids.components.Bullet;

Collision = asteroids.components.Collision;

DeathThroes = asteroids.components.DeathThroes;

Display = asteroids.components.Display;

GameState = asteroids.components.GameState;

Gun = asteroids.components.Gun;

GunControls = asteroids.components.GunControls;

Hud = asteroids.components.Hud;

MotionControls = asteroids.components.MotionControls;

Physics = asteroids.components.Physics;

Position = asteroids.components.Position;

Spaceship = asteroids.components.Spaceship;

WaitForStart = asteroids.components.WaitForStart;


/*
 * Drawable Components
 */

AsteroidDeathView = asteroids.sprites.AsteroidDeathView;

AsteroidView = asteroids.sprites.AsteroidView;

BulletView = asteroids.sprites.BulletView;

HudView = asteroids.sprites.HudView;

SpaceshipDeathView = asteroids.sprites.SpaceshipDeathView;

SpaceshipView = asteroids.sprites.SpaceshipView;


/*
 * Box2D classes
 */

b2Body = Box2D.Dynamics.b2Body;

b2BodyDef = Box2D.Dynamics.b2BodyDef;

b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;

b2FixtureDef = Box2D.Dynamics.b2FixtureDef;

b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;

b2Vec2 = Box2D.Common.Math.b2Vec2;

asteroids.EntityCreator = (function() {
  var KEY_LEFT, KEY_RIGHT, KEY_UP, KEY_Z;

  KEY_LEFT = 37;

  KEY_UP = 38;

  KEY_RIGHT = 39;

  KEY_Z = 90;

  EntityCreator.prototype.engine = null;

  EntityCreator.prototype.world = null;

  EntityCreator.prototype.waitEntity = null;

  EntityCreator.prototype.bulletId = 0;

  EntityCreator.prototype.asteroidId = 0;

  EntityCreator.prototype.spaceshipId = 0;

  function EntityCreator(engine, world) {
    this.engine = engine;
    this.world = world;
  }

  EntityCreator.prototype.destroyEntity = function(entity) {
    this.engine.removeEntity(entity);
  };


  /*
   * Game State
   */

  EntityCreator.prototype.createGame = function() {
    var gameEntity, hud;
    hud = new HudView();
    gameEntity = new Entity('game').add(new GameState()).add(new Hud(hud)).add(new Display(hud)).add(new Position(0, 0, 0, 0));
    this.engine.addEntity(gameEntity);
    return gameEntity;
  };


  /*
   * Start...
   */

  EntityCreator.prototype.createWaitForClick = function() {
    var waitView;
    if (!this.waitEntity) {
      waitView = new WaitForStartView();
      this.waitEntity = new Entity('wait').add(new WaitForStart(waitView)).add(new Display(waitView)).add(new Position(0, 0, 0, 0));
    }
    this.waitEntity.get(WaitForStart).startGame = false;
    this.engine.addEntity(this.waitEntity);
    return this.waitEntity;
  };


  /*
   * Create an Asteroid with FSM Animation
   */

  EntityCreator.prototype.createAsteroid = function(radius, x, y) {

    /*
     * Model the physics using Box2D
     */
    var asteroid, body, bodyDef, deathView, fixDef, fsm;
    bodyDef = new b2BodyDef();
    bodyDef.type = b2Body.b2_dynamicBody;
    bodyDef.fixedRotation = true;
    bodyDef.position.x = x;
    bodyDef.position.y = y;
    bodyDef.linearVelocity.Set((Math.random() - 0.5) * 4 * (50 - radius), (Math.random() - 0.5) * 4 * (50 - radius));
    bodyDef.angularVelocity = Math.random() * 2 - 1;
    fixDef = new b2FixtureDef();
    fixDef.density = 1.0;
    fixDef.friction = 1.0;
    fixDef.restitution = 0.2;
    fixDef.shape = new b2CircleShape(radius);
    body = this.world.CreateBody(bodyDef);
    body.CreateFixture(fixDef);
    asteroid = new Entity();
    fsm = new EntityStateMachine(asteroid);
    fsm.createState('alive').add(Physics).withInstance(new Physics(body)).add(Collision).withInstance(new Collision(radius)).add(Display).withInstance(new Display(new AsteroidView(radius)));
    deathView = new AsteroidDeathView(radius);
    fsm.createState('destroyed').add(DeathThroes).withInstance(new DeathThroes(3)).add(Display).withInstance(new Display(deathView)).add(Animation).withInstance(new Animation(deathView));
    asteroid.add(new Asteroid(fsm)).add(new Position(x, y, 0)).add(new Audio());
    body.SetUserData({
      type: 'asteroid',
      entity: asteroid
    });
    fsm.changeState('alive');
    this.engine.addEntity(asteroid);
    return asteroid;
  };


  /*
   * Create Player Spaceship with FSM Animation
   */

  EntityCreator.prototype.createSpaceship = function() {

    /*
     * Model the physics using Box2D
     */
    var body, bodyDef, deathView, fixDef, fsm, spaceship;
    bodyDef = new b2BodyDef();
    bodyDef.type = b2Body.b2_dynamicBody;
    bodyDef.fixedRotation = false;
    bodyDef.position.x = 300;
    bodyDef.position.y = 225;
    bodyDef.linearVelocity.Set(0, 0);
    bodyDef.angularVelocity = 0;
    bodyDef.linearDamping = 0.75;
    fixDef = new b2FixtureDef();
    fixDef.density = 1.0;
    fixDef.friction = 1.0;
    fixDef.restitution = 0.2;
    fixDef.shape = new b2PolygonShape();
    fixDef.shape.SetAsArray([new b2Vec2(.45, 0), new b2Vec2(-.25, .25), new b2Vec2(-.25, -.25)], 3);
    body = this.world.CreateBody(bodyDef);
    body.CreateFixture(fixDef);
    spaceship = new Entity();
    fsm = new EntityStateMachine(spaceship);
    fsm.createState('playing').add(Physics).withInstance(new Physics(body)).add(MotionControls).withInstance(new MotionControls(KEY_LEFT, KEY_RIGHT, KEY_UP, 100, 3)).add(Gun).withInstance(new Gun(8, 0, 0.3, 2)).add(GunControls).withInstance(new GunControls(KEY_Z)).add(Collision).withInstance(new Collision(9)).add(Display).withInstance(new Display(new SpaceshipView()));
    deathView = new SpaceshipDeathView();
    fsm.createState('destroyed').add(DeathThroes).withInstance(new DeathThroes(5)).add(Display).withInstance(new Display(deathView)).add(Animation).withInstance(new Animation(deathView));
    spaceship.add(new Spaceship(fsm)).add(new Position(300, 225, 0)).add(new Audio());
    body.SetUserData({
      type: 'spaceship',
      entity: spaceship
    });
    fsm.changeState('playing');
    this.engine.addEntity(spaceship);
    return spaceship;
  };


  /*
   * Create a Bullet
   */

  EntityCreator.prototype.createUserBullet = function(gun, parentPosition) {
    var body, bodyDef, bullet, cos, fixDef, sin, x, y;
    cos = Math.cos(parentPosition.rotation);
    sin = Math.sin(parentPosition.rotation);
    x = cos * gun.offsetFromParent.x - sin * gun.offsetFromParent.y + parentPosition.position.x;
    y = sin * gun.offsetFromParent.x + cos * gun.offsetFromParent.y + parentPosition.position.y;

    /*
     * Model the physics using Box2D
     */
    bodyDef = new b2BodyDef();
    bodyDef.type = b2Body.b2_dynamicBody;
    bodyDef.fixedRotation = true;
    bodyDef.position.x = x;
    bodyDef.position.y = y;
    bodyDef.linearVelocity.Set(cos * 150, sin * 150);
    bodyDef.angularVelocity = 0;
    fixDef = new b2FixtureDef();
    fixDef.density = 1.0;
    fixDef.friction = 0.0;
    fixDef.restitution = 0.2;
    fixDef.shape = new b2CircleShape(0);
    body = this.world.CreateBody(bodyDef);
    body.CreateFixture(fixDef);
    bullet = new Entity().add(new Bullet(gun.bulletLifetime)).add(new Position(x, y, 0)).add(new Collision(0)).add(new Physics(body)).add(new Display(new BulletView()));
    body.SetUserData({
      type: 'bullet',
      entity: bullet
    });
    this.engine.addEntity(bullet);
    return bullet;
  };

  return EntityCreator;

})();

//# sourceMappingURL=entity_creator.js.map

},{"../index":95,"ash.coffee":35}],54:[function(require,module,exports){
'use strict';
var asteroids;

asteroids = require('../index');

asteroids.GameConfig = (function() {
  function GameConfig() {}

  GameConfig.prototype.width = 0;

  GameConfig.prototype.height = 0;

  return GameConfig;

})();

//# sourceMappingURL=game_config.js.map

},{"../index":95}],55:[function(require,module,exports){
'use strict';
var asteroids;

asteroids = require('../index');

asteroids.Main = (function() {
  function Main() {
    var canvas;
    canvas = this.canvas('#6A5ACD');
    asteroids = new asteroids.Asteroids(canvas.getContext('2d'), canvas.width, canvas.height);
    asteroids.start();
    return;
  }

  Main.prototype.canvas = function(backgroundColor) {
    var canvas;
    canvas = document.createElement(navigator.isCocoonJS ? 'screencanvas' : 'canvas');
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.backgroundColor = backgroundColor;
    document.body.appendChild(canvas);
    return canvas;
  };

  return Main;

})();

//# sourceMappingURL=main.js.map

},{"../index":95}],56:[function(require,module,exports){
'use strict';
var ash, asteroids,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ash = require('ash.coffee');

asteroids = require('../../index');

asteroids.nodes.AnimationNode = (function(_super) {
  __extends(AnimationNode, _super);

  function AnimationNode() {
    return AnimationNode.__super__.constructor.apply(this, arguments);
  }

  AnimationNode.components = {
    animation: asteroids.components.Animation
  };

  AnimationNode.prototype.animation = null;

  return AnimationNode;

})(ash.core.Node);

//# sourceMappingURL=animation_node.js.map

},{"../../index":95,"ash.coffee":35}],57:[function(require,module,exports){
'use strict';
var ash, asteroids,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ash = require('ash.coffee');

asteroids = require('../../index');

asteroids.nodes.AsteroidCollisionNode = (function(_super) {
  __extends(AsteroidCollisionNode, _super);

  function AsteroidCollisionNode() {
    return AsteroidCollisionNode.__super__.constructor.apply(this, arguments);
  }

  AsteroidCollisionNode.components = {
    asteroid: asteroids.components.Asteroid,
    position: asteroids.components.Position,
    collision: asteroids.components.Collision,
    audio: asteroids.components.Audio,
    physics: asteroids.components.Physics
  };

  AsteroidCollisionNode.prototype.asteroid = null;

  AsteroidCollisionNode.prototype.position = null;

  AsteroidCollisionNode.prototype.collision = null;

  AsteroidCollisionNode.prototype.audio = null;

  AsteroidCollisionNode.prototype.physics = null;

  return AsteroidCollisionNode;

})(ash.core.Node);

//# sourceMappingURL=asteroid_collision_node.js.map

},{"../../index":95,"ash.coffee":35}],58:[function(require,module,exports){
'use strict';
var ash, asteroids,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ash = require('ash.coffee');

asteroids = require('../../index');

asteroids.nodes.AudioNode = (function(_super) {
  __extends(AudioNode, _super);

  function AudioNode() {
    return AudioNode.__super__.constructor.apply(this, arguments);
  }

  AudioNode.components = {
    audio: asteroids.components.Audio
  };

  AudioNode.prototype.audio = null;

  return AudioNode;

})(ash.core.Node);

//# sourceMappingURL=audio_node.js.map

},{"../../index":95,"ash.coffee":35}],59:[function(require,module,exports){
'use strict';
var ash, asteroids,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ash = require('ash.coffee');

asteroids = require('../../index');

asteroids.nodes.BulletAgeNode = (function(_super) {
  __extends(BulletAgeNode, _super);

  function BulletAgeNode() {
    return BulletAgeNode.__super__.constructor.apply(this, arguments);
  }

  BulletAgeNode.components = {
    bullet: asteroids.components.Bullet,
    physics: asteroids.components.Physics
  };

  BulletAgeNode.prototype.bullet = null;

  BulletAgeNode.prototype.physics = null;

  return BulletAgeNode;

})(ash.core.Node);

//# sourceMappingURL=bullet_age_node.js.map

},{"../../index":95,"ash.coffee":35}],60:[function(require,module,exports){
'use strict';
var ash, asteroids,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ash = require('ash.coffee');

asteroids = require('../../index');

asteroids.nodes.BulletCollisionNode = (function(_super) {
  __extends(BulletCollisionNode, _super);

  function BulletCollisionNode() {
    return BulletCollisionNode.__super__.constructor.apply(this, arguments);
  }

  BulletCollisionNode.components = {
    bullet: asteroids.components.Bullet,
    position: asteroids.components.Position,
    collision: asteroids.components.Collision,
    physics: asteroids.components.Physics
  };

  BulletCollisionNode.prototype.bullet = null;

  BulletCollisionNode.prototype.position = null;

  BulletCollisionNode.prototype.collision = null;

  BulletCollisionNode.prototype.physics = null;

  return BulletCollisionNode;

})(ash.core.Node);

//# sourceMappingURL=bullet_collision_node.js.map

},{"../../index":95,"ash.coffee":35}],61:[function(require,module,exports){
'use strict';
var ash, asteroids,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ash = require('ash.coffee');

asteroids = require('../../index');

asteroids.nodes.DeathThroesNode = (function(_super) {
  __extends(DeathThroesNode, _super);

  function DeathThroesNode() {
    return DeathThroesNode.__super__.constructor.apply(this, arguments);
  }

  DeathThroesNode.components = {
    dead: asteroids.components.DeathThroes
  };

  DeathThroesNode.prototype.dead = null;

  return DeathThroesNode;

})(ash.core.Node);

//# sourceMappingURL=death_throes_node.js.map

},{"../../index":95,"ash.coffee":35}],62:[function(require,module,exports){
'use strict';
var ash, asteroids,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ash = require('ash.coffee');

asteroids = require('../../index');

asteroids.nodes.GameNode = (function(_super) {
  __extends(GameNode, _super);

  function GameNode() {
    return GameNode.__super__.constructor.apply(this, arguments);
  }

  GameNode.components = {
    state: asteroids.components.GameState
  };

  GameNode.prototype.state = null;

  return GameNode;

})(ash.core.Node);

//# sourceMappingURL=game_node.js.map

},{"../../index":95,"ash.coffee":35}],63:[function(require,module,exports){
'use strict';
var ash, asteroids,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ash = require('ash.coffee');

asteroids = require('../../index');

asteroids.nodes.GunControlNode = (function(_super) {
  __extends(GunControlNode, _super);

  function GunControlNode() {
    return GunControlNode.__super__.constructor.apply(this, arguments);
  }

  GunControlNode.components = {
    audio: asteroids.components.Audio,
    control: asteroids.components.GunControls,
    gun: asteroids.components.Gun,
    position: asteroids.components.Position
  };

  GunControlNode.prototype.control = null;

  GunControlNode.prototype.gun = null;

  GunControlNode.prototype.position = null;

  GunControlNode.prototype.audio = null;

  return GunControlNode;

})(ash.core.Node);

//# sourceMappingURL=gun_control_node.js.map

},{"../../index":95,"ash.coffee":35}],64:[function(require,module,exports){
'use strict';
var ash, asteroids,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ash = require('ash.coffee');

asteroids = require('../../index');

asteroids.nodes.HudNode = (function(_super) {
  __extends(HudNode, _super);

  function HudNode() {
    return HudNode.__super__.constructor.apply(this, arguments);
  }

  HudNode.components = {
    state: asteroids.components.GameState,
    hud: asteroids.components.Hud
  };

  HudNode.prototype.state = null;

  HudNode.prototype.hud = null;

  return HudNode;

})(ash.core.Node);

//# sourceMappingURL=hud_node.js.map

},{"../../index":95,"ash.coffee":35}],65:[function(require,module,exports){
'use strict';
var ash, asteroids,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ash = require('ash.coffee');

asteroids = require('../../index');

asteroids.nodes.MovementNode = (function(_super) {
  __extends(MovementNode, _super);

  function MovementNode() {
    return MovementNode.__super__.constructor.apply(this, arguments);
  }

  MovementNode.components = {
    position: asteroids.components.Position,
    motion: asteroids.components.Motion
  };

  MovementNode.prototype.position = null;

  MovementNode.prototype.motion = null;

  return MovementNode;

})(ash.core.Node);

//# sourceMappingURL=movement_node.js.map

},{"../../index":95,"ash.coffee":35}],66:[function(require,module,exports){
'use strict';
var ash, asteroids,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ash = require('ash.coffee');

asteroids = require('../../index');

asteroids.nodes.PhysicsControlNode = (function(_super) {
  __extends(PhysicsControlNode, _super);

  function PhysicsControlNode() {
    return PhysicsControlNode.__super__.constructor.apply(this, arguments);
  }

  PhysicsControlNode.components = {
    control: asteroids.components.MotionControls,
    physics: asteroids.components.Physics
  };

  PhysicsControlNode.prototype.control = null;

  PhysicsControlNode.prototype.physics = null;

  return PhysicsControlNode;

})(ash.core.Node);

//# sourceMappingURL=physics_control_node.js.map

},{"../../index":95,"ash.coffee":35}],67:[function(require,module,exports){
'use strict';
var ash, asteroids,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ash = require('ash.coffee');

asteroids = require('../../index');

asteroids.nodes.PhysicsNode = (function(_super) {
  __extends(PhysicsNode, _super);

  function PhysicsNode() {
    return PhysicsNode.__super__.constructor.apply(this, arguments);
  }

  PhysicsNode.components = {
    position: asteroids.components.Position,
    physics: asteroids.components.Physics
  };

  PhysicsNode.prototype.position = null;

  PhysicsNode.prototype.physics = null;

  return PhysicsNode;

})(ash.core.Node);

//# sourceMappingURL=physics_node.js.map

},{"../../index":95,"ash.coffee":35}],68:[function(require,module,exports){
'use strict';
var ash, asteroids,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ash = require('ash.coffee');

asteroids = require('../../index');

asteroids.nodes.RenderNode = (function(_super) {
  __extends(RenderNode, _super);

  function RenderNode() {
    return RenderNode.__super__.constructor.apply(this, arguments);
  }

  RenderNode.components = {
    position: asteroids.components.Position,
    display: asteroids.components.Display
  };

  RenderNode.prototype.position = null;

  RenderNode.prototype.display = null;

  return RenderNode;

})(ash.core.Node);

//# sourceMappingURL=render_node.js.map

},{"../../index":95,"ash.coffee":35}],69:[function(require,module,exports){
'use strict';
var ash, asteroids,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ash = require('ash.coffee');

asteroids = require('../../index');

asteroids.nodes.SpaceshipCollisionNode = (function(_super) {
  __extends(SpaceshipCollisionNode, _super);

  function SpaceshipCollisionNode() {
    return SpaceshipCollisionNode.__super__.constructor.apply(this, arguments);
  }

  SpaceshipCollisionNode.components = {
    spaceship: asteroids.components.Spaceship,
    position: asteroids.components.Position,
    collision: asteroids.components.Collision,
    audio: asteroids.components.Audio,
    physics: asteroids.components.Physics
  };

  SpaceshipCollisionNode.prototype.spaceship = null;

  SpaceshipCollisionNode.prototype.position = null;

  SpaceshipCollisionNode.prototype.collision = null;

  SpaceshipCollisionNode.prototype.audio = null;

  SpaceshipCollisionNode.prototype.physics = null;

  return SpaceshipCollisionNode;

})(ash.core.Node);

//# sourceMappingURL=spaceship_collision_node.js.map

},{"../../index":95,"ash.coffee":35}],70:[function(require,module,exports){
'use strict';
var ash, asteroids,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ash = require('ash.coffee');

asteroids = require('../../index');

asteroids.nodes.SpaceshipNode = (function(_super) {
  __extends(SpaceshipNode, _super);

  function SpaceshipNode() {
    return SpaceshipNode.__super__.constructor.apply(this, arguments);
  }

  SpaceshipNode.components = {
    spaceship: asteroids.components.Spaceship,
    position: asteroids.components.Position
  };

  SpaceshipNode.prototype.spaceship = 0;

  SpaceshipNode.prototype.position = 0;

  return SpaceshipNode;

})(ash.core.Node);

//# sourceMappingURL=spaceship_node.js.map

},{"../../index":95,"ash.coffee":35}],71:[function(require,module,exports){
'use strict';
var ash, asteroids,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ash = require('ash.coffee');

asteroids = require('../../index');

asteroids.nodes.WaitForStartNode = (function(_super) {
  __extends(WaitForStartNode, _super);

  function WaitForStartNode() {
    return WaitForStartNode.__super__.constructor.apply(this, arguments);
  }

  WaitForStartNode.components = {
    wait: asteroids.components.WaitForStart
  };

  WaitForStartNode.prototype.wait = null;

  return WaitForStartNode;

})(ash.core.Node);

//# sourceMappingURL=wait_for_start_node.js.map

},{"../../index":95,"ash.coffee":35}],72:[function(require,module,exports){
'use strict';
var Dot, Point, asteroids,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

asteroids = require('../../index');

Point = asteroids.ui.Point;

asteroids.sprites.AsteroidDeathView = (function() {
  AsteroidDeathView.prototype.x = 0;

  AsteroidDeathView.prototype.y = 0;

  AsteroidDeathView.prototype.rotation = 0;

  AsteroidDeathView.prototype.radius = 0;

  AsteroidDeathView.prototype.points = null;

  AsteroidDeathView.prototype.first = true;

  AsteroidDeathView.prototype.dots = null;

  function AsteroidDeathView(radius) {
    this.radius = radius;
    this.draw = __bind(this.draw, this);
    this.dots = [];
  }

  AsteroidDeathView.prototype.draw = function(ctx) {
    var dot, _i, _len, _ref, _results;
    _ref = this.dots;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      dot = _ref[_i];
      _results.push(dot.draw(ctx, this.x, this.y));
    }
    return _results;
  };

  AsteroidDeathView.prototype.animate = function(time) {
    var dot, i, _i, _j, _len, _ref, _results;
    if (this.first) {
      this.first = false;
      for (i = _i = 0; _i < 8; i = ++_i) {
        dot = new Dot(this.radius);
        this.dots.push(dot);
      }
    }
    _ref = this.dots;
    _results = [];
    for (_j = 0, _len = _ref.length; _j < _len; _j++) {
      dot = _ref[_j];
      dot.x += dot.velocity.x * time;
      _results.push(dot.y += dot.velocity.y * time);
    }
    return _results;
  };

  return AsteroidDeathView;

})();

Dot = (function() {
  Dot.prototype.velocity = null;

  Dot.prototype.x = 0;

  Dot.prototype.y = 0;

  function Dot(maxDistance) {
    var angle, distance, speed;
    angle = Math.random() * 2 * Math.PI;
    distance = Math.random() * maxDistance;
    this.x = Math.cos(angle) * distance;
    this.y = Math.sin(angle) * distance;
    speed = Math.random() * 10 + 10;
    this.velocity = new Point(Math.cos(angle) * speed, Math.sin(angle) * speed);
  }

  Dot.prototype.draw = function(ctx, x, y) {
    ctx.save();
    ctx.beginPath();
    ctx.translate(x, y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = "#FFFFFF";
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.restore();
  };

  return Dot;

})();

//# sourceMappingURL=asteroid_death_view.js.map

},{"../../index":95}],73:[function(require,module,exports){
'use strict';
var asteroids,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

asteroids = require('../../index');

asteroids.sprites.AsteroidView = (function() {
  AsteroidView.prototype.x = 0;

  AsteroidView.prototype.y = 0;

  AsteroidView.prototype.rotation = 0;

  AsteroidView.prototype.radius = 0;

  AsteroidView.prototype.points = null;

  function AsteroidView(radius) {
    var angle, length, posX, posY;
    this.radius = radius;
    this.draw = __bind(this.draw, this);
    this.width = this.radius;
    this.height = this.radius;
    this.points = [];
    angle = 0;
    while (angle < Math.PI * 2) {
      length = (0.75 + Math.random() * 0.25) * this.radius;
      posX = Math.cos(angle) * length;
      posY = Math.sin(angle) * length;
      this.points.push({
        x: posX,
        y: posY
      });
      angle += Math.random() * 0.5;
    }
  }

  AsteroidView.prototype.draw = function(ctx) {
    var i;
    ctx.save();
    ctx.beginPath();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = "#FFFFFF";
    ctx.moveTo(this.radius, 0);
    i = 0;
    while (i < this.points.length) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
      ++i;
    }
    ctx.lineTo(this.radius, 0);
    ctx.fill();
    ctx.restore();
  };

  return AsteroidView;

})();

//# sourceMappingURL=asteroid_view.js.map

},{"../../index":95}],74:[function(require,module,exports){
'use strict';
var asteroids,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

asteroids = require('../../index');

asteroids.sprites.BulletView = (function() {
  function BulletView() {
    this.draw = __bind(this.draw, this);
  }

  BulletView.prototype.x = 0;

  BulletView.prototype.y = 0;

  BulletView.prototype.rotation = 0;

  BulletView.prototype.draw = function(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.rotate(this.rotation);
    ctx.fillStyle = "#FFFFFF";
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.restore();
  };

  return BulletView;

})();

//# sourceMappingURL=bullet_view.js.map

},{"../../index":95}],75:[function(require,module,exports){
'use strict';
var asteroids,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

asteroids = require('../../index');

asteroids.sprites.HudView = (function() {
  function HudView() {
    this.draw = __bind(this.draw, this);
    this.setScore = __bind(this.setScore, this);
    this.setLives = __bind(this.setLives, this);
  }

  HudView.prototype.x = 0;

  HudView.prototype.y = 0;

  HudView.prototype.rotation = 0;

  HudView.prototype.score = 0;

  HudView.prototype.lives = 3;

  HudView.prototype.setLives = function(lives) {
    this.lives = lives;
  };

  HudView.prototype.setScore = function(score) {
    this.score = score;
  };

  HudView.prototype.draw = function(ctx) {
    var l, s, x, y;
    ctx.save();
    ctx.beginPath();
    ctx.font = 'bold 18px opendyslexic';
    ctx.fillStyle = '#00FFFF';
    ctx.textAlign = 'center';
    s = "LIVES: " + this.lives;
    l = ctx.measureText(s);
    x = l.width;
    y = 20;
    ctx.fillText(s, x, y);
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.beginPath();
    ctx.font = 'bold 18px opendyslexictml5 sprite';
    ctx.fillStyle = '#00FFFF';
    ctx.textAlign = 'center';
    s = "SCORE: " + this.score;
    l = ctx.measureText(s);
    x = (window.window.innerWidth * window.devicePixelRatio) - l.width;
    y = 20;
    ctx.fillText(s, x, y);
    ctx.fill();
    ctx.restore();
  };

  return HudView;

})();

//# sourceMappingURL=hud_view.js.map

},{"../../index":95}],76:[function(require,module,exports){
'use strict';
var Point, asteroids,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

asteroids = require('../../index');

Point = asteroids.ui.Point;

asteroids.sprites.SpaceshipDeathView = (function() {
  function SpaceshipDeathView() {
    this.draw = __bind(this.draw, this);
  }

  SpaceshipDeathView.prototype.x = 0;

  SpaceshipDeathView.prototype.y = 0;

  SpaceshipDeathView.prototype.rotation = 0;

  SpaceshipDeathView.prototype.vel1 = null;

  SpaceshipDeathView.prototype.vel2 = null;

  SpaceshipDeathView.prototype.rot1 = null;

  SpaceshipDeathView.prototype.rot2 = null;

  SpaceshipDeathView.prototype.x1 = 0;

  SpaceshipDeathView.prototype.y2 = 0;

  SpaceshipDeathView.prototype.y1 = 0;

  SpaceshipDeathView.prototype.y2 = 0;

  SpaceshipDeathView.prototype.first = true;

  SpaceshipDeathView.prototype.animate = function(time) {
    if (this.first) {
      this.first = false;
      this.vel1 = new Point(Math.random() * 10 - 5, Math.random() * 10 + 10);
      this.vel2 = new Point(Math.random() * 10 - 5, -(Math.random() * 10 + 10));
      this.rot1 = Math.random() * 300 - 150;
      this.rot2 = Math.random() * 300 - 150;
      this.x1 = this.x2 = this.x;
      this.y1 = this.y2 = this.y;
      this.r1 = this.r2 = this.rotation;
    }
    this.x1 += this.vel1.x * time;
    this.y1 += this.vel1.y * time;
    this.r1 += this.rot1 * time;
    this.x2 += this.vel2.x * time;
    this.y2 += this.vel2.y * time;
    this.r2 += this.rot2 * time;
  };

  SpaceshipDeathView.prototype.draw = function(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.translate(this.x + this.x1, this.y + this.y1);
    ctx.rotate(this.r1);
    ctx.fillStyle = "#FFFFFF";
    ctx.moveTo(10, 0);
    ctx.lineTo(-7, 7);
    ctx.lineTo(-4, 0);
    ctx.lineTo(10, 0);
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.beginPath();
    ctx.translate(this.x + this.x2, this.y + this.y2);
    ctx.rotate(this.r2);
    ctx.fillStyle = "#FFFFFF";
    ctx.moveTo(10, 0);
    ctx.lineTo(-7, 7);
    ctx.lineTo(-4, 0);
    ctx.lineTo(10, 0);
    ctx.fill();
    ctx.restore();
  };

  return SpaceshipDeathView;

})();

//# sourceMappingURL=spaceship_death_view.js.map

},{"../../index":95}],77:[function(require,module,exports){
'use strict';
var asteroids,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

asteroids = require('../../index');

asteroids.sprites.SpaceshipView = (function() {
  function SpaceshipView() {
    this.draw = __bind(this.draw, this);
  }

  SpaceshipView.prototype.x = 0;

  SpaceshipView.prototype.y = 0;

  SpaceshipView.prototype.rotation = 0;

  SpaceshipView.prototype.draw = function(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = "#FFFFFF";
    ctx.moveTo(10, 0);
    ctx.lineTo(-7, 7);
    ctx.lineTo(-4, 0);
    ctx.lineTo(-7, -7);
    ctx.lineTo(10, 0);
    ctx.fill();
    ctx.restore();
  };

  return SpaceshipView;

})();

//# sourceMappingURL=spaceship_view.js.map

},{"../../index":95}],78:[function(require,module,exports){
'use strict';
var Signal0, ash, asteroids,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

asteroids = require('../../index');

ash = require('ash.coffee');

Signal0 = ash.signals.Signal0;

asteroids.sprites.WaitForStartView = (function() {
  WaitForStartView.prototype.x = 0;

  WaitForStartView.prototype.y = 0;

  WaitForStartView.prototype.rotation = 0;

  WaitForStartView.prototype.first = true;

  WaitForStartView.prototype.click = null;

  function WaitForStartView() {
    this.draw = __bind(this.draw, this);
    this.click = new Signal0();
  }

  WaitForStartView.prototype.draw = function(ctx) {
    var l, s, x, y;
    if (this.first) {
      this.first = false;
      ctx.canvas.addEventListener('click', (function(_this) {
        return function(event) {
          return _this.click.dispatch();
        };
      })(this));
    }
    ctx.save();
    ctx.beginPath();
    ctx.font = 'bold 40px opendyslexic';
    ctx.fillStyle = '#FFFFFF';
    s = 'ASTEROIDS';
    l = ctx.measureText(s);
    x = Math.floor(((window.innerWidth * window.devicePixelRatio) - l.width) / 2);
    y = 175;
    ctx.fillText(s, x, y);
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.beginPath();
    ctx.font = 'bold 18px opendyslexic';
    ctx.fillStyle = '#FFFFFF';
    s = 'CLICK TO START';
    l = ctx.measureText(s);
    x = Math.floor(((window.innerWidth * window.devicePixelRatio) - l.width) / 2);
    y = 225;
    ctx.fillText(s, x, y);
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.beginPath();
    ctx.font = 'bold 14px opendyslexic';
    ctx.fillStyle = '#FFFFFF';
    s = 'Z to Fire  ~  Arrow Keys to Move';
    l = ctx.measureText(s);
    x = 10;
    y = window.innerHeight * window.devicePixelRatio - 20;
    ctx.fillText(s, x, y);
    ctx.fill();
    ctx.restore();
  };

  return WaitForStartView;

})();

//# sourceMappingURL=wait_for_start_view.js.map

},{"../../index":95,"ash.coffee":35}],79:[function(require,module,exports){
'use strict';
var AnimationNode, ash, asteroids,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ash = require('ash.coffee');

asteroids = require('../../index');

AnimationNode = asteroids.nodes.AnimationNode;

asteroids.systems.AnimationSystem = (function(_super) {
  __extends(AnimationSystem, _super);

  function AnimationSystem() {
    this.updateNode = __bind(this.updateNode, this);
    AnimationSystem.__super__.constructor.call(this, AnimationNode, this.updateNode);
  }

  AnimationSystem.prototype.updateNode = function(node, time) {
    node.animation.animation.animate(time);
  };

  return AnimationSystem;

})(ash.tools.ListIteratingSystem);

//# sourceMappingURL=animation_system.js.map

},{"../../index":95,"ash.coffee":35}],80:[function(require,module,exports){
'use strict';
var AudioNode, ash, asteroids,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ash = require('ash.coffee');

asteroids = require('../../index');

AudioNode = asteroids.nodes.AudioNode;

asteroids.systems.AudioSystem = (function(_super) {
  __extends(AudioSystem, _super);

  function AudioSystem() {
    this.updateNode = __bind(this.updateNode, this);
    AudioSystem.__super__.constructor.call(this, AudioNode, this.updateNode);
  }

  AudioSystem.prototype.updateNode = function(node, time) {
    var each, sound, type, _ref;
    _ref = node.audio.toPlay;
    for (each in _ref) {
      type = _ref[each];
      sound = new type();
      sound.play(0, 1);
    }
    node.audio.toPlay.length = 0;
  };

  return AudioSystem;

})(ash.tools.ListIteratingSystem);

//# sourceMappingURL=audio_system.js.map

},{"../../index":95,"ash.coffee":35}],81:[function(require,module,exports){
'use strict';
var BulletAgeNode, PhysicsSystem, ash, asteroids,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ash = require('ash.coffee');

asteroids = require('../../index');

BulletAgeNode = asteroids.nodes.BulletAgeNode;

PhysicsSystem = asteroids.systems.PhysicsSystem;

asteroids.systems.BulletAgeSystem = (function(_super) {
  __extends(BulletAgeSystem, _super);

  BulletAgeSystem.prototype.creator = null;

  function BulletAgeSystem(creator) {
    this.creator = creator;
    this.updateNode = __bind(this.updateNode, this);
    BulletAgeSystem.__super__.constructor.call(this, BulletAgeNode, this.updateNode);
  }

  BulletAgeSystem.prototype.updateNode = function(node, time) {
    var bullet;
    bullet = node.bullet;
    bullet.lifeRemaining -= time;
    if (bullet.lifeRemaining <= 0) {
      PhysicsSystem.deadPool.push(node.physics.body);
      this.creator.destroyEntity(node.entity);
    }
  };

  return BulletAgeSystem;

})(ash.tools.ListIteratingSystem);

//# sourceMappingURL=bullet_age_system.js.map

},{"../../index":95,"ash.coffee":35}],82:[function(require,module,exports){
'use strict';
var Asteroid, Collision, DeathThroes, GameNode, Physics, PhysicsSystem, Point, Position, Spaceship, System, ash, asteroids, b2ContactListener,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ash = require('ash.coffee');

asteroids = require('../../index');

GameNode = asteroids.nodes.GameNode;

PhysicsSystem = asteroids.systems.PhysicsSystem;

Asteroid = asteroids.components.Asteroid;

Spaceship = asteroids.components.Spaceship;

DeathThroes = asteroids.components.DeathThroes;

Physics = asteroids.components.Physics;

Collision = asteroids.components.Collision;

Position = asteroids.components.Position;

Point = asteroids.ui.Point;

System = ash.core.System;

b2ContactListener = Box2D.Dynamics.b2ContactListener;

asteroids.systems.CollisionSystem = (function(_super) {
  __extends(CollisionSystem, _super);

  CollisionSystem.prototype.world = null;

  CollisionSystem.prototype.creator = null;

  CollisionSystem.prototype.games = null;

  CollisionSystem.prototype.que = null;

  function CollisionSystem(world, creator) {
    this.world = world;
    this.creator = creator;
    this.PostSolve = __bind(this.PostSolve, this);
    this.PreSolve = __bind(this.PreSolve, this);
    this.EndContact = __bind(this.EndContact, this);
    this.BeginContact = __bind(this.BeginContact, this);
    this.AsteroidHitShip = __bind(this.AsteroidHitShip, this);
    this.BulletHitAsteroid = __bind(this.BulletHitAsteroid, this);
    this.update = __bind(this.update, this);
    this.que = [];
    this.world.SetContactListener(this);
  }

  CollisionSystem.prototype.update = function(time) {
    var contact;
    while (this.que.length) {
      contact = this.que.pop();
      switch (contact.type) {
        case 1:
          this.BulletHitAsteroid(contact.a, contact.b);
          break;
        case 2:
          this.AsteroidHitShip(contact.a, contact.b);
      }
    }
  };

  CollisionSystem.prototype.addToEngine = function(engine) {
    this.games = engine.getNodeList(GameNode);
  };

  CollisionSystem.prototype.removeFromEngine = function(engine) {
    this.games = null;
  };


  /*
   * player hit asteroid
   */

  CollisionSystem.prototype.BulletHitAsteroid = function(bullet, asteroid) {
    var body, position, radius;
    if ((bullet.get(Physics) != null)) {
      this.creator.destroyEntity(bullet);
      PhysicsSystem.deadPool.push(bullet.get(Physics).body);
    }
    if ((asteroid.get(Physics) != null)) {
      radius = asteroid.get(Collision).radius;
      position = asteroid.get(Position).position;
      if (radius > 10) {
        this.creator.createAsteroid(radius - 10, position.x + Math.random() * 10 - 5, position.y + Math.random() * 10 - 5);
        this.creator.createAsteroid(radius - 10, position.x + Math.random() * 10 - 5, position.y + Math.random() * 10 - 5);
      }
      body = asteroid.get(Physics).body;
      asteroid.get(Asteroid).fsm.changeState('destroyed');
      asteroid.get(DeathThroes).body = body;
      if (this.games.head) {
        this.games.head.state.hits++;
      }
    }
  };


  /*
   * asteroid hit spaceship
   */

  CollisionSystem.prototype.AsteroidHitShip = function(asteroid, spaceship) {
    var body;
    if ((spaceship.get(Physics) != null)) {
      body = spaceship.get(Physics).body;
      spaceship.get(Spaceship).fsm.changeState('destroyed');
      spaceship.get(DeathThroes).body = body;
      if (this.games.head) {
        this.games.head.state.lives--;
      }
    }
  };


  /*
   * b2ContactListener Interface
   */

  CollisionSystem.prototype.BeginContact = function(contact) {
    var a, b;
    a = contact.GetFixtureA().GetBody().GetUserData();
    b = contact.GetFixtureB().GetBody().GetUserData();
    switch (a.type) {
      case 'asteroid':
        switch (b.type) {
          case 'asteroid':
            return;
          case 'bullet':
            return this.que.push({
              type: 1,
              a: b.entity,
              b: a.entity
            });
          case 'spaceship':
            return this.que.push({
              type: 2,
              a: a.entity,
              b: b.entity
            });
        }
        break;
      case 'bullet':
        switch (b.type) {
          case 'asteroid':
            return this.que.push({
              type: 1,
              a: a.entity,
              b: b.entity
            });
          case 'bullet':
            return;
          case 'spaceship':
            return;
        }
        break;
      case 'spaceship':
        switch (b.type) {
          case 'asteroid':
            return this.que.push({
              type: 2,
              a: b.entity,
              b: a.entity
            });
          case 'bullet':
            return;
          case 'spaceship':
            return;
        }
    }

    /*
     * type:
     * 1 - bullet hits asteroid
     * 2 - asteroid hits spaceship
     */
  };

  CollisionSystem.prototype.EndContact = function(contact) {};

  CollisionSystem.prototype.PreSolve = function(contact, oldManifold) {};

  CollisionSystem.prototype.PostSolve = function(contact, impulse) {};

  return CollisionSystem;

})(System);

//# sourceMappingURL=collision_system.js.map

},{"../../index":95,"ash.coffee":35}],83:[function(require,module,exports){
'use strict';
var DeathThroesNode, PhysicsSystem, ash, asteroids,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ash = require('ash.coffee');

asteroids = require('../../index');

DeathThroesNode = asteroids.nodes.DeathThroesNode;

PhysicsSystem = asteroids.systems.PhysicsSystem;

asteroids.systems.DeathThroesSystem = (function(_super) {
  __extends(DeathThroesSystem, _super);

  DeathThroesSystem.prototype.creator = null;

  function DeathThroesSystem(creator) {
    this.creator = creator;
    this.updateNode = __bind(this.updateNode, this);
    DeathThroesSystem.__super__.constructor.call(this, DeathThroesNode, this.updateNode);
  }

  DeathThroesSystem.prototype.updateNode = function(node, time) {
    var dead;
    dead = node.dead;
    dead.countdown -= time;
    if (dead.countdown <= 0) {
      this.creator.destroyEntity(node.entity);
      PhysicsSystem.deadPool.push(dead.body);
    }
  };

  return DeathThroesSystem;

})(ash.tools.ListIteratingSystem);

//# sourceMappingURL=death_throes_system.js.map

},{"../../index":95,"ash.coffee":35}],84:[function(require,module,exports){
'use strict';
var AsteroidCollisionNode, BulletCollisionNode, GameNode, Point, SpaceshipNode, ash, asteroids,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ash = require('ash.coffee');

asteroids = require('../../index');

GameNode = asteroids.nodes.GameNode;

SpaceshipNode = asteroids.nodes.SpaceshipNode;

AsteroidCollisionNode = asteroids.nodes.AsteroidCollisionNode;

BulletCollisionNode = asteroids.nodes.BulletCollisionNode;

Point = asteroids.ui.Point;

asteroids.systems.GameManager = (function(_super) {
  __extends(GameManager, _super);

  GameManager.prototype.config = null;

  GameManager.prototype.creator = null;

  GameManager.prototype.gameNodes = null;

  GameManager.prototype.spaceships = null;

  GameManager.prototype.asteroids = null;

  GameManager.prototype.bullets = null;

  function GameManager(creator, config) {
    this.creator = creator;
    this.config = config;
    this.update = __bind(this.update, this);
  }

  GameManager.prototype.addToEngine = function(engine) {
    this.gameNodes = engine.getNodeList(GameNode);
    this.spaceships = engine.getNodeList(SpaceshipNode);
    this.asteroids = engine.getNodeList(AsteroidCollisionNode);
    this.bullets = engine.getNodeList(BulletCollisionNode);
  };

  GameManager.prototype.update = function(time) {
    var asteroid, asteroidCount, clearToAddSpaceship, i, newSpaceshipPosition, node, position, spaceship;
    node = this.gameNodes.head;
    if (node && node.state.playing) {
      if (this.spaceships.empty) {
        if (node.state.lives > 0) {
          newSpaceshipPosition = new Point(this.config.width * 0.5, this.config.height * 0.5);
          clearToAddSpaceship = true;
          asteroid = this.asteroids.head;
          while (asteroid) {
            if (Point.distance(asteroid.position.position, newSpaceshipPosition) <= asteroid.collision.radius + 50) {
              clearToAddSpaceship = false;
              break;
            }
            asteroid = asteroid.next;
          }
          if (clearToAddSpaceship) {
            this.creator.createSpaceship();
          }
        } else {
          node.state.playing = false;
          this.creator.createWaitForClick();
        }
      }
      if (this.asteroids.empty && this.bullets.empty && !this.spaceships.empty) {
        spaceship = this.spaceships.head;
        node.state.level++;
        asteroidCount = 2 + node.state.level;
        i = 0;
        while (i < asteroidCount) {
          while (true) {
            position = new Point(Math.random() * this.config.width, Math.random() * this.config.height);
            if (!(Point.distance(position, spaceship.position.position) <= 80)) {
              break;
            }
          }
          this.creator.createAsteroid(30, position.x, position.y);
          ++i;
        }
      }
    }
  };

  GameManager.prototype.removeFromEngine = function(engine) {
    this.gameNodes = null;
    this.spaceships = null;
    this.asteroids = null;
    this.bullets = null;
  };

  return GameManager;

})(ash.core.System);

//# sourceMappingURL=game_manager.js.map

},{"../../index":95,"ash.coffee":35}],85:[function(require,module,exports){
'use strict';
var GunControlNode, ash, asteroids,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ash = require('ash.coffee');

asteroids = require('../../index');

GunControlNode = asteroids.nodes.GunControlNode;

asteroids.systems.GunControlSystem = (function(_super) {
  __extends(GunControlSystem, _super);

  GunControlSystem.prototype.keyPoll = null;

  GunControlSystem.prototype.creator = null;

  function GunControlSystem(keyPoll, creator) {
    this.keyPoll = keyPoll;
    this.creator = creator;
    this.updateNode = __bind(this.updateNode, this);
    GunControlSystem.__super__.constructor.call(this, GunControlNode, this.updateNode);
  }

  GunControlSystem.prototype.updateNode = function(node, time) {
    var control, gun, position;
    control = node.control;
    position = node.position;
    gun = node.gun;
    gun.shooting = this.keyPoll.isDown(control.trigger);
    gun.timeSinceLastShot += time;
    if (gun.shooting && gun.timeSinceLastShot >= gun.minimumShotInterval) {
      this.creator.createUserBullet(gun, position);
      gun.timeSinceLastShot = 0;
    }
  };

  return GunControlSystem;

})(ash.tools.ListIteratingSystem);

//# sourceMappingURL=gun_control_system.js.map

},{"../../index":95,"ash.coffee":35}],86:[function(require,module,exports){
'use strict';
var HudNode, ash, asteroids,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ash = require('ash.coffee');

asteroids = require('../../index');

HudNode = asteroids.nodes.HudNode;

asteroids.systems.HudSystem = (function(_super) {
  __extends(HudSystem, _super);

  function HudSystem() {
    this.updateNode = __bind(this.updateNode, this);
    HudSystem.__super__.constructor.call(this, HudNode, this.updateNode);
  }

  HudSystem.prototype.updateNode = function(node, time) {
    node.hud.view.setLives(node.state.lives);
    node.hud.view.setScore(node.state.hits);
  };

  return HudSystem;

})(ash.tools.ListIteratingSystem);

//# sourceMappingURL=hud_system.js.map

},{"../../index":95,"ash.coffee":35}],87:[function(require,module,exports){
'use strict';
var MovementNode, ash, asteroids,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ash = require('ash.coffee');

asteroids = require('../../index');

MovementNode = asteroids.nodes.MovementNode;

asteroids.systems.MovementSystem = (function(_super) {
  __extends(MovementSystem, _super);

  MovementSystem.prototype.config = null;

  function MovementSystem(config) {
    this.config = config;
    this.updateNode = __bind(this.updateNode, this);
    MovementSystem.__super__.constructor.call(this, MovementNode, this.updateNode);
  }

  MovementSystem.prototype.updateNode = function(node, time) {
    var motion, position, xDamp, yDamp;
    position = node.position;
    motion = node.motion;
    position.position.x += motion.velocity.x * time;
    position.position.y += motion.velocity.y * time;
    if (position.position.x < 0) {
      position.position.x += this.config.width;
    }
    if (position.position.x > this.config.width) {
      position.position.x -= this.config.width;
    }
    if (position.position.y < 0) {
      position.position.y += this.config.height;
    }
    if (position.position.y > this.config.height) {
      position.position.y -= this.config.height;
    }
    position.rotation += motion.angularVelocity * time;
    if (motion.damping > 0) {
      xDamp = Math.abs(Math.cos(position.rotation) * motion.damping * time);
      yDamp = Math.abs(Math.sin(position.rotation) * motion.damping * time);
      if (motion.velocity.x > xDamp) {
        motion.velocity.x -= xDamp;
      } else if (motion.velocity.x < -xDamp) {
        motion.velocity.x += xDamp;
      } else {
        motion.velocity.x = 0;
      }
      if (motion.velocity.y > yDamp) {
        motion.velocity.y -= yDamp;
      } else if (motion.velocity.y < -yDamp) {
        motion.velocity.y += yDamp;
      } else {
        motion.velocity.y = 0;
      }
    }
  };

  return MovementSystem;

})(ash.tools.ListIteratingSystem);

//# sourceMappingURL=movement_system.js.map

},{"../../index":95,"ash.coffee":35}],88:[function(require,module,exports){
'use strict';
var PhysicsControlNode, ash, asteroids, b2Vec2,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ash = require('ash.coffee');

asteroids = require('../../index');

PhysicsControlNode = asteroids.nodes.PhysicsControlNode;

b2Vec2 = Box2D.Common.Math.b2Vec2;

asteroids.systems.PhysicsControlSystem = (function(_super) {
  __extends(PhysicsControlSystem, _super);

  PhysicsControlSystem.prototype.keyPoll = null;

  function PhysicsControlSystem(keyPoll) {
    this.keyPoll = keyPoll;
    this.updateNode = __bind(this.updateNode, this);
    PhysicsControlSystem.__super__.constructor.call(this, PhysicsControlNode, this.updateNode);
  }

  PhysicsControlSystem.prototype.updateNode = function(node, time) {
    var body, control, rotation, x, y, _ref;
    control = node.control;
    body = node.physics.body;
    rotation = body.GetAngularVelocity();
    if (this.keyPoll.isDown(control.left) && rotation < 10) {
      body.ApplyTorque(rotation / 1000 - control.rotationRate / Math.PI * time);
    }
    if (this.keyPoll.isDown(control.right) && rotation < 10) {
      body.ApplyTorque(rotation / 1000 + control.rotationRate / Math.PI * time);
    }
    if (this.keyPoll.isDown(control.accelerate)) {
      _ref = body.GetLinearVelocity(), x = _ref.x, y = _ref.y;
      x += Math.cos(rotation) * control.accelerationRate * time;
      y += Math.sin(rotation) * control.accelerationRate * time;
      body.ApplyForce(new b2Vec2(x, y), body.GetWorldCenter());
    }
  };

  return PhysicsControlSystem;

})(ash.tools.ListIteratingSystem);

//# sourceMappingURL=physics_control_system.js.map

},{"../../index":95,"ash.coffee":35}],89:[function(require,module,exports){
'use strict';
var PhysicsNode, ash, asteroids, b2Body, b2Vec2,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ash = require('ash.coffee');

asteroids = require('../../index');

PhysicsNode = asteroids.nodes.PhysicsNode;

b2Body = Box2D.Dynamics.b2Body;

b2Vec2 = Box2D.Common.Math.b2Vec2;

asteroids.systems.PhysicsSystem = (function(_super) {
  __extends(PhysicsSystem, _super);

  PhysicsSystem.prototype.config = null;

  PhysicsSystem.prototype.world = null;

  PhysicsSystem.prototype.creator = null;

  PhysicsSystem.prototype.nodes = null;

  PhysicsSystem.deadPool = [];

  function PhysicsSystem(config, world) {
    this.config = config;
    this.world = world;
    this.updateNode = __bind(this.updateNode, this);
    this.update = __bind(this.update, this);
  }

  PhysicsSystem.prototype.addToEngine = function(engine) {
    this.nodes = engine.getNodeList(PhysicsNode);
  };

  PhysicsSystem.prototype.removeFromEngine = function(engine) {
    this.nodes = null;
  };

  PhysicsSystem.prototype.update = function(time) {
    var body, node, ud;
    this.world.Step(time, 10, 10);
    this.world.ClearForces();
    node = this.nodes.head;
    while (node) {
      this.updateNode(node, time);
      node = node.next;
    }

    /*
     * Clean up the dead bodies
     */
    while ((body = PhysicsSystem.deadPool.pop())) {
      ud = body.GetUserData();
      if (ud.entity != null) {
        delete ud.entity;
      }
      body.SetUserData(ud);
      this.world.DestroyBody(body);
    }
  };


  /*
   * Process the physics for this node
   */

  PhysicsSystem.prototype.updateNode = function(node, time) {
    var body, physics, position, x, x1, y, y1, _ref;
    position = node.position;
    physics = node.physics;
    body = physics.body;

    /*
     * Update the position component from Box2D model
     * Asteroids uses wraparound space coordinates
     */
    _ref = body.GetPosition(), x = _ref.x, y = _ref.y;
    x1 = x > this.config.width ? 0 : x < 0 ? this.config.width : x;
    y1 = y > this.config.height ? 0 : y < 0 ? this.config.height : y;
    if (x1 !== x || y1 !== y) {
      body.SetPosition(new b2Vec2(x1, y1));
    }
    position.position.x = x1;
    position.position.y = y1;
    position.rotation = body.GetAngularVelocity();
  };

  return PhysicsSystem;

})(ash.core.System);

//# sourceMappingURL=physics_system.js.map

},{"../../index":95,"ash.coffee":35}],90:[function(require,module,exports){
'use strict';
var RenderNode, ash, asteroids,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ash = require('ash.coffee');

asteroids = require('../../index');

RenderNode = asteroids.nodes.RenderNode;

asteroids.systems.RenderSystem = (function(_super) {
  __extends(RenderSystem, _super);

  RenderSystem.prototype.graphic = null;

  RenderSystem.prototype.nodes = null;

  function RenderSystem(ctx) {
    this.ctx = ctx;
    this.update = __bind(this.update, this);
  }

  RenderSystem.prototype.addToEngine = function(engine) {
    var node;
    this.nodes = engine.getNodeList(RenderNode);
    node = this.nodes.head;
    while (node) {
      this.addToDisplay(node);
      node = node.next;
    }
  };

  RenderSystem.prototype.addToDisplay = function(node) {};

  RenderSystem.prototype.removeFromDisplay = function(node) {};

  RenderSystem.prototype.removeFromEngine = function(engine) {
    this.nodes = null;
  };

  RenderSystem.prototype.update = function(time) {
    var display, graphic, node, position;
    this.ctx.save();
    this.ctx.translate(0, 0);
    this.ctx.rotate(0);
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    node = this.nodes.head;
    while (node) {
      display = node.display;
      graphic = display.graphic;
      position = node.position;
      graphic.x = position.position.x;
      graphic.y = position.position.y;
      graphic.rotation = position.rotation;
      graphic.draw(this.ctx);
      node = node.next;
    }
    this.ctx.restore();
  };

  return RenderSystem;

})(ash.core.System);

//# sourceMappingURL=render_system.js.map

},{"../../index":95,"ash.coffee":35}],91:[function(require,module,exports){
'use strict';
var asteroids;

asteroids = require('../../index');

asteroids.systems.SystemPriorities = (function() {
  function SystemPriorities() {}

  SystemPriorities.preUpdate = 1;

  SystemPriorities.update = 2;

  SystemPriorities.move = 3;

  SystemPriorities.resolveCollisions = 4;

  SystemPriorities.stateMachines = 5;

  SystemPriorities.animate = 6;

  SystemPriorities.render = 7;

  return SystemPriorities;

})();

//# sourceMappingURL=system_priorities.js.map

},{"../../index":95}],92:[function(require,module,exports){
'use strict';
var AsteroidCollisionNode, GameNode, WaitForStartNode, ash, asteroids,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ash = require('ash.coffee');

asteroids = require('../../index');

WaitForStartNode = asteroids.nodes.WaitForStartNode;

AsteroidCollisionNode = asteroids.nodes.AsteroidCollisionNode;

GameNode = asteroids.nodes.GameNode;

asteroids.systems.WaitForStartSystem = (function(_super) {
  __extends(WaitForStartSystem, _super);

  WaitForStartSystem.prototype.engine = null;

  WaitForStartSystem.prototype.creator = null;

  WaitForStartSystem.prototype.gameNodes = null;

  WaitForStartSystem.prototype.waitNodes = null;

  WaitForStartSystem.prototype.asteroids = null;

  function WaitForStartSystem(creator) {
    this.creator = creator;
    this.update = __bind(this.update, this);
  }

  WaitForStartSystem.prototype.addToEngine = function(engine) {
    this.engine = engine;
    this.waitNodes = engine.getNodeList(WaitForStartNode);
    this.gameNodes = engine.getNodeList(GameNode);
    this.asteroids = engine.getNodeList(AsteroidCollisionNode);
  };

  WaitForStartSystem.prototype.removeFromEngine = function(engine) {
    this.waitNodes = null;
    this.gameNodes = null;
  };

  WaitForStartSystem.prototype.update = function(time) {
    var asteroid, game, node;
    node = this.waitNodes.head;
    game = this.gameNodes.head;
    if (node && node.wait.startGame && game) {
      asteroid = this.asteroids.head;
      while (asteroid) {
        this.creator.destroyEntity(asteroid.entity);
        asteroid = asteroid.next;
      }
      game.state.setForStart();
      node.wait.startGame = false;
      this.engine.removeEntity(node.entity);
    }
  };

  return WaitForStartSystem;

})(ash.core.System);

//# sourceMappingURL=wait_for_start_system.js.map

},{"../../index":95,"ash.coffee":35}],93:[function(require,module,exports){
'use strict';
var asteroids,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

asteroids = require('../../index');

asteroids.ui.KeyPoll = (function() {
  var displayObj, states;

  states = null;

  displayObj = null;

  function KeyPoll(displayObj) {
    this.displayObj = displayObj;
    this.isUp = __bind(this.isUp, this);
    this.isDown = __bind(this.isDown, this);
    this.keyUpListener = __bind(this.keyUpListener, this);
    this.keyDownListener = __bind(this.keyDownListener, this);
    this.states = {};
    this.displayObj.addEventListener("keydown", this.keyDownListener);
    this.displayObj.addEventListener("keyup", this.keyUpListener);
  }

  KeyPoll.prototype.keyDownListener = function(event) {
    this.states[event.keyCode] = true;
  };

  KeyPoll.prototype.keyUpListener = function(event) {
    if (this.states[event.keyCode]) {
      this.states[event.keyCode] = false;
    }
  };

  KeyPoll.prototype.isDown = function(keyCode) {
    return this.states[keyCode];
  };

  KeyPoll.prototype.isUp = function(keyCode) {
    return !this.states[keyCode];
  };

  return KeyPoll;

})();

//# sourceMappingURL=key_poll.js.map

},{"../../index":95}],94:[function(require,module,exports){
'use strict';
var asteroids;

asteroids = require('../../index');

asteroids.ui.Point = (function() {
  Point.prototype.x = 0;

  Point.prototype.y = 0;

  function Point(x, y) {
    this.x = x != null ? x : 0;
    this.y = y != null ? y : 0;
  }

  Point.distance = function(point1, point2) {
    var dx, dy;
    dx = point1.x - point2.x;
    dy = point1.y - point2.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  Point.prototype.distanceSquaredTo = function(targetPoint) {
    var dx, dy;
    dx = this.x - targetPoint.x;
    dy = this.y - targetPoint.y;
    return dx * dx + dy * dy;
  };

  Point.prototype.distanceTo = function(targetPoint) {
    var dx, dy;
    dx = this.x - targetPoint.x;
    dy = this.y - targetPoint.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  return Point;

})();

//# sourceMappingURL=point.js.map

},{"../../index":95}],95:[function(require,module,exports){
'use strict';
var asteroids;

module.exports = asteroids = (function() {
  function asteroids() {}

  return asteroids;

})();

asteroids.ui = (function() {
  function ui() {}

  return ui;

})();

require('./asteroids/ui/point');

require('./asteroids/ui/key_poll');

asteroids.sprites = (function() {
  function sprites() {}

  return sprites;

})();

require('./asteroids/sprites/asteroid_view');

require('./asteroids/sprites/asteroid_death_view');

require('./asteroids/sprites/bullet_view');

require('./asteroids/sprites/hud_view');

require('./asteroids/sprites/spaceship_death_view');

require('./asteroids/sprites/spaceship_view');

require('./asteroids/sprites/wait_for_start_view');

asteroids.components = (function() {
  function components() {}

  return components;

})();

require('./asteroids/components/animation');

require('./asteroids/components/asteroid');

require('./asteroids/components/audio');

require('./asteroids/components/bullet');

require('./asteroids/components/collision');

require('./asteroids/components/death_throes');

require('./asteroids/components/display');

require('./asteroids/components/game_state');

require('./asteroids/components/gun');

require('./asteroids/components/gun_controls');

require('./asteroids/components/hud');

require('./asteroids/components/motion_controls');

require('./asteroids/components/physics');

require('./asteroids/components/position');

require('./asteroids/components/spaceship');

require('./asteroids/components/wait_for_start');

asteroids.nodes = (function() {
  function nodes() {}

  return nodes;

})();

require('./asteroids/nodes/animation_node');

require('./asteroids/nodes/asteroid_collision_node');

require('./asteroids/nodes/audio_node');

require('./asteroids/nodes/bullet_age_node');

require('./asteroids/nodes/bullet_collision_node');

require('./asteroids/nodes/death_throes_node');

require('./asteroids/nodes/game_node');

require('./asteroids/nodes/gun_control_node');

require('./asteroids/nodes/hud_node');

require('./asteroids/nodes/movement_node');

require('./asteroids/nodes/physics_control_node');

require('./asteroids/nodes/physics_node');

require('./asteroids/nodes/render_node');

require('./asteroids/nodes/spaceship_collision_node');

require('./asteroids/nodes/spaceship_node');

require('./asteroids/nodes/wait_for_start_node');

asteroids.systems = (function() {
  function systems() {}

  return systems;

})();

require('./asteroids/systems/physics_system');

require('./asteroids/systems/animation_system');

require('./asteroids/systems/audio_system');

require('./asteroids/systems/bullet_age_system');

require('./asteroids/systems/collision_system');

require('./asteroids/systems/death_throes_system');

require('./asteroids/systems/game_manager');

require('./asteroids/systems/gun_control_system');

require('./asteroids/systems/hud_system');

require('./asteroids/systems/movement_system');

require('./asteroids/systems/physics_control_system');

require('./asteroids/systems/render_system');

require('./asteroids/systems/system_priorities');

require('./asteroids/systems/wait_for_start_system');

require('./asteroids/entity_creator');

require('./asteroids/game_config');

require('./asteroids/asteroids');

require('./asteroids/main');

//# sourceMappingURL=index.js.map

},{"./asteroids/asteroids":36,"./asteroids/components/animation":37,"./asteroids/components/asteroid":38,"./asteroids/components/audio":39,"./asteroids/components/bullet":40,"./asteroids/components/collision":41,"./asteroids/components/death_throes":42,"./asteroids/components/display":43,"./asteroids/components/game_state":44,"./asteroids/components/gun":45,"./asteroids/components/gun_controls":46,"./asteroids/components/hud":47,"./asteroids/components/motion_controls":48,"./asteroids/components/physics":49,"./asteroids/components/position":50,"./asteroids/components/spaceship":51,"./asteroids/components/wait_for_start":52,"./asteroids/entity_creator":53,"./asteroids/game_config":54,"./asteroids/main":55,"./asteroids/nodes/animation_node":56,"./asteroids/nodes/asteroid_collision_node":57,"./asteroids/nodes/audio_node":58,"./asteroids/nodes/bullet_age_node":59,"./asteroids/nodes/bullet_collision_node":60,"./asteroids/nodes/death_throes_node":61,"./asteroids/nodes/game_node":62,"./asteroids/nodes/gun_control_node":63,"./asteroids/nodes/hud_node":64,"./asteroids/nodes/movement_node":65,"./asteroids/nodes/physics_control_node":66,"./asteroids/nodes/physics_node":67,"./asteroids/nodes/render_node":68,"./asteroids/nodes/spaceship_collision_node":69,"./asteroids/nodes/spaceship_node":70,"./asteroids/nodes/wait_for_start_node":71,"./asteroids/sprites/asteroid_death_view":72,"./asteroids/sprites/asteroid_view":73,"./asteroids/sprites/bullet_view":74,"./asteroids/sprites/hud_view":75,"./asteroids/sprites/spaceship_death_view":76,"./asteroids/sprites/spaceship_view":77,"./asteroids/sprites/wait_for_start_view":78,"./asteroids/systems/animation_system":79,"./asteroids/systems/audio_system":80,"./asteroids/systems/bullet_age_system":81,"./asteroids/systems/collision_system":82,"./asteroids/systems/death_throes_system":83,"./asteroids/systems/game_manager":84,"./asteroids/systems/gun_control_system":85,"./asteroids/systems/hud_system":86,"./asteroids/systems/movement_system":87,"./asteroids/systems/physics_control_system":88,"./asteroids/systems/physics_system":89,"./asteroids/systems/render_system":90,"./asteroids/systems/system_priorities":91,"./asteroids/systems/wait_for_start_system":92,"./asteroids/ui/key_poll":93,"./asteroids/ui/point":94}]},{},[95])(95)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYXNoLmNvZmZlZS9kaXN0L2xpYi9hc2gvY29yZS9jb21wb25lbnRfbWF0Y2hpbmdfZmFtaWx5LmpzIiwibm9kZV9tb2R1bGVzL2FzaC5jb2ZmZWUvZGlzdC9saWIvYXNoL2NvcmUvZW5naW5lLmpzIiwibm9kZV9tb2R1bGVzL2FzaC5jb2ZmZWUvZGlzdC9saWIvYXNoL2NvcmUvZW50aXR5LmpzIiwibm9kZV9tb2R1bGVzL2FzaC5jb2ZmZWUvZGlzdC9saWIvYXNoL2NvcmUvZW50aXR5X2xpc3QuanMiLCJub2RlX21vZHVsZXMvYXNoLmNvZmZlZS9kaXN0L2xpYi9hc2gvY29yZS9mYW1pbHkuanMiLCJub2RlX21vZHVsZXMvYXNoLmNvZmZlZS9kaXN0L2xpYi9hc2gvY29yZS9ub2RlLmpzIiwibm9kZV9tb2R1bGVzL2FzaC5jb2ZmZWUvZGlzdC9saWIvYXNoL2NvcmUvbm9kZV9saXN0LmpzIiwibm9kZV9tb2R1bGVzL2FzaC5jb2ZmZWUvZGlzdC9saWIvYXNoL2NvcmUvbm9kZV9wb29sLmpzIiwibm9kZV9tb2R1bGVzL2FzaC5jb2ZmZWUvZGlzdC9saWIvYXNoL2NvcmUvc3lzdGVtLmpzIiwibm9kZV9tb2R1bGVzL2FzaC5jb2ZmZWUvZGlzdC9saWIvYXNoL2NvcmUvc3lzdGVtX2xpc3QuanMiLCJub2RlX21vZHVsZXMvYXNoLmNvZmZlZS9kaXN0L2xpYi9hc2gvZnNtL2NvbXBvbmVudF9pbnN0YW5jZV9wcm92aWRlci5qcyIsIm5vZGVfbW9kdWxlcy9hc2guY29mZmVlL2Rpc3QvbGliL2FzaC9mc20vY29tcG9uZW50X3NpbmdsZXRvbl9wcm92aWRlci5qcyIsIm5vZGVfbW9kdWxlcy9hc2guY29mZmVlL2Rpc3QvbGliL2FzaC9mc20vY29tcG9uZW50X3R5cGVfcHJvdmlkZXIuanMiLCJub2RlX21vZHVsZXMvYXNoLmNvZmZlZS9kaXN0L2xpYi9hc2gvZnNtL2R5bmFtaWNfY29tcG9uZW50X3Byb3ZpZGVyLmpzIiwibm9kZV9tb2R1bGVzL2FzaC5jb2ZmZWUvZGlzdC9saWIvYXNoL2ZzbS9keW5hbWljX3N5c3RlbV9wcm92aWRlci5qcyIsIm5vZGVfbW9kdWxlcy9hc2guY29mZmVlL2Rpc3QvbGliL2FzaC9mc20vZW5naW5lX3N0YXRlLmpzIiwibm9kZV9tb2R1bGVzL2FzaC5jb2ZmZWUvZGlzdC9saWIvYXNoL2ZzbS9lbmdpbmVfc3RhdGVfbWFjaGluZS5qcyIsIm5vZGVfbW9kdWxlcy9hc2guY29mZmVlL2Rpc3QvbGliL2FzaC9mc20vZW50aXR5X3N0YXRlLmpzIiwibm9kZV9tb2R1bGVzL2FzaC5jb2ZmZWUvZGlzdC9saWIvYXNoL2ZzbS9lbnRpdHlfc3RhdGVfbWFjaGluZS5qcyIsIm5vZGVfbW9kdWxlcy9hc2guY29mZmVlL2Rpc3QvbGliL2FzaC9mc20vc3RhdGVfY29tcG9uZW50X21hcHBpbmcuanMiLCJub2RlX21vZHVsZXMvYXNoLmNvZmZlZS9kaXN0L2xpYi9hc2gvZnNtL3N0YXRlX3N5c3RlbV9tYXBwaW5nLmpzIiwibm9kZV9tb2R1bGVzL2FzaC5jb2ZmZWUvZGlzdC9saWIvYXNoL2ZzbS9zeXN0ZW1faW5zdGFuY2VfcHJvdmlkZXIuanMiLCJub2RlX21vZHVsZXMvYXNoLmNvZmZlZS9kaXN0L2xpYi9hc2gvZnNtL3N5c3RlbV9zaW5nbGV0b25fcHJvdmlkZXIuanMiLCJub2RlX21vZHVsZXMvYXNoLmNvZmZlZS9kaXN0L2xpYi9hc2gvc2lnbmFscy9saXN0ZW5lcl9ub2RlLmpzIiwibm9kZV9tb2R1bGVzL2FzaC5jb2ZmZWUvZGlzdC9saWIvYXNoL3NpZ25hbHMvbGlzdGVuZXJfbm9kZV9wb29sLmpzIiwibm9kZV9tb2R1bGVzL2FzaC5jb2ZmZWUvZGlzdC9saWIvYXNoL3NpZ25hbHMvc2lnbmFsMC5qcyIsIm5vZGVfbW9kdWxlcy9hc2guY29mZmVlL2Rpc3QvbGliL2FzaC9zaWduYWxzL3NpZ25hbDEuanMiLCJub2RlX21vZHVsZXMvYXNoLmNvZmZlZS9kaXN0L2xpYi9hc2gvc2lnbmFscy9zaWduYWwyLmpzIiwibm9kZV9tb2R1bGVzL2FzaC5jb2ZmZWUvZGlzdC9saWIvYXNoL3NpZ25hbHMvc2lnbmFsMy5qcyIsIm5vZGVfbW9kdWxlcy9hc2guY29mZmVlL2Rpc3QvbGliL2FzaC9zaWduYWxzL3NpZ25hbF9iYXNlLmpzIiwibm9kZV9tb2R1bGVzL2FzaC5jb2ZmZWUvZGlzdC9saWIvYXNoL3RpY2svZnJhbWVfdGlja19wcm92aWRlci5qcyIsIm5vZGVfbW9kdWxlcy9hc2guY29mZmVlL2Rpc3QvbGliL2FzaC90b29scy9jb21wb25lbnRfcG9vbC5qcyIsIm5vZGVfbW9kdWxlcy9hc2guY29mZmVlL2Rpc3QvbGliL2FzaC90b29scy9saXN0X2l0ZXJhdGluZ19zeXN0ZW0uanMiLCJub2RlX21vZHVsZXMvYXNoLmNvZmZlZS9kaXN0L2xpYi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hc2guY29mZmVlL2luZGV4LmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvYXN0ZXJvaWRzLmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvY29tcG9uZW50cy9hbmltYXRpb24uanMiLCJ0bXAvbGliL2FzdGVyb2lkcy9jb21wb25lbnRzL2FzdGVyb2lkLmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvY29tcG9uZW50cy9hdWRpby5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL2NvbXBvbmVudHMvYnVsbGV0LmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvY29tcG9uZW50cy9jb2xsaXNpb24uanMiLCJ0bXAvbGliL2FzdGVyb2lkcy9jb21wb25lbnRzL2RlYXRoX3Rocm9lcy5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL2NvbXBvbmVudHMvZGlzcGxheS5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL2NvbXBvbmVudHMvZ2FtZV9zdGF0ZS5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL2NvbXBvbmVudHMvZ3VuLmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvY29tcG9uZW50cy9ndW5fY29udHJvbHMuanMiLCJ0bXAvbGliL2FzdGVyb2lkcy9jb21wb25lbnRzL2h1ZC5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL2NvbXBvbmVudHMvbW90aW9uX2NvbnRyb2xzLmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvY29tcG9uZW50cy9waHlzaWNzLmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvY29tcG9uZW50cy9wb3NpdGlvbi5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL2NvbXBvbmVudHMvc3BhY2VzaGlwLmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvY29tcG9uZW50cy93YWl0X2Zvcl9zdGFydC5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL2VudGl0eV9jcmVhdG9yLmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvZ2FtZV9jb25maWcuanMiLCJ0bXAvbGliL2FzdGVyb2lkcy9tYWluLmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvbm9kZXMvYW5pbWF0aW9uX25vZGUuanMiLCJ0bXAvbGliL2FzdGVyb2lkcy9ub2Rlcy9hc3Rlcm9pZF9jb2xsaXNpb25fbm9kZS5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL25vZGVzL2F1ZGlvX25vZGUuanMiLCJ0bXAvbGliL2FzdGVyb2lkcy9ub2Rlcy9idWxsZXRfYWdlX25vZGUuanMiLCJ0bXAvbGliL2FzdGVyb2lkcy9ub2Rlcy9idWxsZXRfY29sbGlzaW9uX25vZGUuanMiLCJ0bXAvbGliL2FzdGVyb2lkcy9ub2Rlcy9kZWF0aF90aHJvZXNfbm9kZS5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL25vZGVzL2dhbWVfbm9kZS5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL25vZGVzL2d1bl9jb250cm9sX25vZGUuanMiLCJ0bXAvbGliL2FzdGVyb2lkcy9ub2Rlcy9odWRfbm9kZS5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL25vZGVzL21vdmVtZW50X25vZGUuanMiLCJ0bXAvbGliL2FzdGVyb2lkcy9ub2Rlcy9waHlzaWNzX2NvbnRyb2xfbm9kZS5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL25vZGVzL3BoeXNpY3Nfbm9kZS5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL25vZGVzL3JlbmRlcl9ub2RlLmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvbm9kZXMvc3BhY2VzaGlwX2NvbGxpc2lvbl9ub2RlLmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvbm9kZXMvc3BhY2VzaGlwX25vZGUuanMiLCJ0bXAvbGliL2FzdGVyb2lkcy9ub2Rlcy93YWl0X2Zvcl9zdGFydF9ub2RlLmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvc3ByaXRlcy9hc3Rlcm9pZF9kZWF0aF92aWV3LmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvc3ByaXRlcy9hc3Rlcm9pZF92aWV3LmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvc3ByaXRlcy9idWxsZXRfdmlldy5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL3Nwcml0ZXMvaHVkX3ZpZXcuanMiLCJ0bXAvbGliL2FzdGVyb2lkcy9zcHJpdGVzL3NwYWNlc2hpcF9kZWF0aF92aWV3LmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvc3ByaXRlcy9zcGFjZXNoaXBfdmlldy5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL3Nwcml0ZXMvd2FpdF9mb3Jfc3RhcnRfdmlldy5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL3N5c3RlbXMvYW5pbWF0aW9uX3N5c3RlbS5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL3N5c3RlbXMvYXVkaW9fc3lzdGVtLmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvc3lzdGVtcy9idWxsZXRfYWdlX3N5c3RlbS5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL3N5c3RlbXMvY29sbGlzaW9uX3N5c3RlbS5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL3N5c3RlbXMvZGVhdGhfdGhyb2VzX3N5c3RlbS5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL3N5c3RlbXMvZ2FtZV9tYW5hZ2VyLmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvc3lzdGVtcy9ndW5fY29udHJvbF9zeXN0ZW0uanMiLCJ0bXAvbGliL2FzdGVyb2lkcy9zeXN0ZW1zL2h1ZF9zeXN0ZW0uanMiLCJ0bXAvbGliL2FzdGVyb2lkcy9zeXN0ZW1zL21vdmVtZW50X3N5c3RlbS5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL3N5c3RlbXMvcGh5c2ljc19jb250cm9sX3N5c3RlbS5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL3N5c3RlbXMvcGh5c2ljc19zeXN0ZW0uanMiLCJ0bXAvbGliL2FzdGVyb2lkcy9zeXN0ZW1zL3JlbmRlcl9zeXN0ZW0uanMiLCJ0bXAvbGliL2FzdGVyb2lkcy9zeXN0ZW1zL3N5c3RlbV9wcmlvcml0aWVzLmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvc3lzdGVtcy93YWl0X2Zvcl9zdGFydF9zeXN0ZW0uanMiLCJ0bXAvbGliL2FzdGVyb2lkcy91aS9rZXlfcG9sbC5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL3VpL3BvaW50LmpzIiwidG1wL2xpYi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6VkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbFRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFKQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG52YXIgRGljdGlvbmFyeSwgTm9kZUxpc3QsIE5vZGVQb29sLCBhc2gsXG4gIF9fYmluZCA9IGZ1bmN0aW9uKGZuLCBtZSl7IHJldHVybiBmdW5jdGlvbigpeyByZXR1cm4gZm4uYXBwbHkobWUsIGFyZ3VtZW50cyk7IH07IH07XG5cbmFzaCA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5Ob2RlTGlzdCA9IGFzaC5jb3JlLk5vZGVMaXN0O1xuXG5Ob2RlUG9vbCA9IGFzaC5jb3JlLk5vZGVQb29sO1xuXG5EaWN0aW9uYXJ5ID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBEaWN0aW9uYXJ5KCkge31cblxuICByZXR1cm4gRGljdGlvbmFyeTtcblxufSkoKTtcblxuXG4vKlxuICogVGhlIGRlZmF1bHQgY2xhc3MgZm9yIG1hbmFnaW5nIGEgTm9kZUxpc3QuIFRoaXMgY2xhc3MgY3JlYXRlcyB0aGUgTm9kZUxpc3QgYW5kIGFkZHMgYW5kIHJlbW92ZXNcbiAqIG5vZGVzIHRvL2Zyb20gdGhlIGxpc3QgYXMgdGhlIGVudGl0aWVzIGFuZCB0aGUgY29tcG9uZW50cyBpbiB0aGUgZW5naW5lIGNoYW5nZS5cbiAqXG4gKiBJdCB1c2VzIHRoZSBiYXNpYyBlbnRpdHkgbWF0Y2hpbmcgcGF0dGVybiBvZiBhbiBlbnRpdHkgc3lzdGVtIC0gZW50aXRpZXMgYXJlIGFkZGVkIHRvIHRoZSBsaXN0IGlmXG4gKiB0aGV5IGNvbnRhaW4gY29tcG9uZW50cyBtYXRjaGluZyBhbGwgdGhlIHB1YmxpYyBwcm9wZXJ0aWVzIG9mIHRoZSBub2RlIGNsYXNzLlxuICovXG5cbmFzaC5jb3JlLkNvbXBvbmVudE1hdGNoaW5nRmFtaWx5ID0gKGZ1bmN0aW9uKCkge1xuICBDb21wb25lbnRNYXRjaGluZ0ZhbWlseS5wcm90b3R5cGUubm9kZXMgPSBudWxsO1xuXG4gIENvbXBvbmVudE1hdGNoaW5nRmFtaWx5LnByb3RvdHlwZS5lbnRpdGllcyA9IG51bGw7XG5cbiAgQ29tcG9uZW50TWF0Y2hpbmdGYW1pbHkucHJvdG90eXBlLm5vZGVDbGFzcyA9IG51bGw7XG5cbiAgQ29tcG9uZW50TWF0Y2hpbmdGYW1pbHkucHJvdG90eXBlLmNvbXBvbmVudHMgPSBudWxsO1xuXG4gIENvbXBvbmVudE1hdGNoaW5nRmFtaWx5LnByb3RvdHlwZS5ub2RlUG9vbCA9IG51bGw7XG5cbiAgQ29tcG9uZW50TWF0Y2hpbmdGYW1pbHkucHJvdG90eXBlLmVuZ2luZSA9IG51bGw7XG5cblxuICAvKlxuICAgKiBUaGUgY29uc3RydWN0b3IuIENyZWF0ZXMgYSBDb21wb25lbnRNYXRjaGluZ0ZhbWlseSB0byBwcm92aWRlIGEgTm9kZUxpc3QgZm9yIHRoZVxuICAgKiBnaXZlbiBub2RlIGNsYXNzLlxuICAgKlxuICAgKiBAcGFyYW0gbm9kZUNsYXNzIFRoZSB0eXBlIG9mIG5vZGUgdG8gY3JlYXRlIGFuZCBtYW5hZ2UgYSBOb2RlTGlzdCBmb3IuXG4gICAqIEBwYXJhbSBlbmdpbmUgVGhlIGVuZ2luZSB0aGF0IHRoaXMgZmFtaWx5IGlzIG1hbmFnaW5nIHRlaCBOb2RlTGlzdCBmb3IuXG4gICAqL1xuXG4gIGZ1bmN0aW9uIENvbXBvbmVudE1hdGNoaW5nRmFtaWx5KG5vZGVDbGFzcywgZW5naW5lKSB7XG4gICAgdGhpcy5ub2RlQ2xhc3MgPSBub2RlQ2xhc3M7XG4gICAgdGhpcy5lbmdpbmUgPSBlbmdpbmU7XG4gICAgdGhpcy5yZWxlYXNlTm9kZVBvb2xDYWNoZSA9IF9fYmluZCh0aGlzLnJlbGVhc2VOb2RlUG9vbENhY2hlLCB0aGlzKTtcbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG5cbiAgLypcbiAgICogSW5pdGlhbGlzZXMgdGhlIGNsYXNzLiBDcmVhdGVzIHRoZSBub2RlbGlzdCBhbmQgb3RoZXIgdG9vbHMuIEFuYWx5c2VzIHRoZSBub2RlIHRvIGRldGVybWluZVxuICAgKiB3aGF0IGNvbXBvbmVudCB0eXBlcyB0aGUgbm9kZSByZXF1aXJlcy5cbiAgICovXG5cbiAgQ29tcG9uZW50TWF0Y2hpbmdGYW1pbHkucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbmFtZSwgdHlwZSwgX3JlZjtcbiAgICB0aGlzLm5vZGVzID0gbmV3IE5vZGVMaXN0KCk7XG4gICAgdGhpcy5lbnRpdGllcyA9IG5ldyBEaWN0aW9uYXJ5KCk7XG4gICAgdGhpcy5jb21wb25lbnRzID0gbmV3IERpY3Rpb25hcnkoKTtcbiAgICB0aGlzLm5vZGVQb29sID0gbmV3IE5vZGVQb29sKHRoaXMubm9kZUNsYXNzLCB0aGlzLm5vZGVDbGFzcy5jb21wb25lbnRzKTtcbiAgICBfcmVmID0gdGhpcy5ub2RlQ2xhc3MuY29tcG9uZW50cztcbiAgICBmb3IgKG5hbWUgaW4gX3JlZikge1xuICAgICAgdHlwZSA9IF9yZWZbbmFtZV07XG4gICAgICB0aGlzLmNvbXBvbmVudHNbdHlwZS5uYW1lXSA9IHR5cGU7XG4gICAgfVxuICB9O1xuXG5cbiAgLypcbiAgICogVGhlIG5vZGVsaXN0IG1hbmFnZWQgYnkgdGhpcyBmYW1pbHkuIFRoaXMgaXMgYSByZWZlcmVuY2UgdGhhdCByZW1haW5zIHZhbGlkIGFsd2F5c1xuICAgKiBzaW5jZSBpdCBpcyByZXRhaW5lZCBhbmQgcmV1c2VkIGJ5IFN5c3RlbXMgdGhhdCB1c2UgdGhlIGxpc3QuIGkuZS4gd2UgbmV2ZXIgcmVjcmVhdGUgdGhlIGxpc3QsXG4gICAqIHdlIGFsd2F5cyBtb2RpZnkgaXQgaW4gcGxhY2UuXG4gICAqL1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKENvbXBvbmVudE1hdGNoaW5nRmFtaWx5LnByb3RvdHlwZSwge1xuICAgIG5vZGVMaXN0OiB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5ub2RlcztcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG5cbiAgLypcbiAgICogQ2FsbGVkIGJ5IHRoZSBlbmdpbmUgd2hlbiBhbiBlbnRpdHkgaGFzIGJlZW4gYWRkZWQgdG8gaXQuIFdlIGNoZWNrIGlmIHRoZSBlbnRpdHkgc2hvdWxkIGJlIGluXG4gICAqIHRoaXMgZmFtaWx5J3MgTm9kZUxpc3QgYW5kIGFkZCBpdCBpZiBhcHByb3ByaWF0ZS5cbiAgICovXG5cbiAgQ29tcG9uZW50TWF0Y2hpbmdGYW1pbHkucHJvdG90eXBlLm5ld0VudGl0eSA9IGZ1bmN0aW9uKGVudGl0eSkge1xuICAgIHRoaXMuYWRkSWZNYXRjaChlbnRpdHkpO1xuICB9O1xuXG5cbiAgLypcbiAgICogQ2FsbGVkIGJ5IHRoZSBlbmdpbmUgd2hlbiBhIGNvbXBvbmVudCBoYXMgYmVlbiBhZGRlZCB0byBhbiBlbnRpdHkuIFdlIGNoZWNrIGlmIHRoZSBlbnRpdHkgaXMgbm90IGluXG4gICAqIHRoaXMgZmFtaWx5J3MgTm9kZUxpc3QgYW5kIHNob3VsZCBiZSwgYW5kIGFkZCBpdCBpZiBhcHByb3ByaWF0ZS5cbiAgICovXG5cbiAgQ29tcG9uZW50TWF0Y2hpbmdGYW1pbHkucHJvdG90eXBlLmNvbXBvbmVudEFkZGVkVG9FbnRpdHkgPSBmdW5jdGlvbihlbnRpdHksIGNvbXBvbmVudENsYXNzKSB7XG4gICAgdGhpcy5hZGRJZk1hdGNoKGVudGl0eSk7XG4gIH07XG5cblxuICAvKlxuICAgKiBDYWxsZWQgYnkgdGhlIGVuZ2luZSB3aGVuIGEgY29tcG9uZW50IGhhcyBiZWVuIHJlbW92ZWQgZnJvbSBhbiBlbnRpdHkuIFdlIGNoZWNrIGlmIHRoZSByZW1vdmVkIGNvbXBvbmVudFxuICAgKiBpcyByZXF1aXJlZCBieSB0aGlzIGZhbWlseSdzIE5vZGVMaXN0IGFuZCBpZiBzbywgd2UgY2hlY2sgaWYgdGhlIGVudGl0eSBpcyBpbiB0aGlzIHRoaXMgTm9kZUxpc3QgYW5kXG4gICAqIHJlbW92ZSBpdCBpZiBzby5cbiAgICovXG5cbiAgQ29tcG9uZW50TWF0Y2hpbmdGYW1pbHkucHJvdG90eXBlLmNvbXBvbmVudFJlbW92ZWRGcm9tRW50aXR5ID0gZnVuY3Rpb24oZW50aXR5LCBjb21wb25lbnRDbGFzcykge1xuICAgIHZhciBuYW1lO1xuICAgIG5hbWUgPSBjb21wb25lbnRDbGFzcy5uYW1lICE9IG51bGwgPyBjb21wb25lbnRDbGFzcy5uYW1lIDogY29tcG9uZW50Q2xhc3M7XG4gICAgaWYgKG5hbWUgaW4gdGhpcy5jb21wb25lbnRzKSB7XG4gICAgICB0aGlzLnJlbW92ZUlmTWF0Y2goZW50aXR5KTtcbiAgICB9XG4gIH07XG5cblxuICAvKlxuICAgKiBDYWxsZWQgYnkgdGhlIGVuZ2luZSB3aGVuIGFuIGVudGl0eSBoYXMgYmVlbiBybW92ZWQgZnJvbSBpdC4gV2UgY2hlY2sgaWYgdGhlIGVudGl0eSBpcyBpblxuICAgKiB0aGlzIGZhbWlseSdzIE5vZGVMaXN0IGFuZCByZW1vdmUgaXQgaWYgc28uXG4gICAqL1xuXG4gIENvbXBvbmVudE1hdGNoaW5nRmFtaWx5LnByb3RvdHlwZS5yZW1vdmVFbnRpdHkgPSBmdW5jdGlvbihlbnRpdHkpIHtcbiAgICB0aGlzLnJlbW92ZUlmTWF0Y2goZW50aXR5KTtcbiAgfTtcblxuXG4gIC8qXG4gICAqIElmIHRoZSBlbnRpdHkgaXMgbm90IGluIHRoaXMgZmFtaWx5J3MgTm9kZUxpc3QsIHRlc3RzIHRoZSBjb21wb25lbnRzIG9mIHRoZSBlbnRpdHkgdG8gc2VlXG4gICAqIGlmIGl0IHNob3VsZCBiZSBpbiB0aGlzIE5vZGVMaXN0IGFuZCBhZGRzIGl0IGlmIHNvLlxuICAgKi9cblxuICBDb21wb25lbnRNYXRjaGluZ0ZhbWlseS5wcm90b3R5cGUuYWRkSWZNYXRjaCA9IGZ1bmN0aW9uKGVudGl0eSkge1xuICAgIHZhciBjb21wb25lbnRDbGFzcywgbmFtZSwgbm9kZSwgX3JlZiwgX3JlZjE7XG4gICAgaWYgKHRoaXMuZW50aXRpZXNbZW50aXR5Lm5hbWVdID09IG51bGwpIHtcbiAgICAgIF9yZWYgPSB0aGlzLm5vZGVDbGFzcy5jb21wb25lbnRzO1xuICAgICAgZm9yIChuYW1lIGluIF9yZWYpIHtcbiAgICAgICAgY29tcG9uZW50Q2xhc3MgPSBfcmVmW25hbWVdO1xuICAgICAgICBpZiAoIWVudGl0eS5oYXMoY29tcG9uZW50Q2xhc3MpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBub2RlID0gdGhpcy5ub2RlUG9vbC5nZXQoKTtcbiAgICAgIG5vZGUuZW50aXR5ID0gZW50aXR5O1xuICAgICAgX3JlZjEgPSB0aGlzLm5vZGVDbGFzcy5jb21wb25lbnRzO1xuICAgICAgZm9yIChuYW1lIGluIF9yZWYxKSB7XG4gICAgICAgIGNvbXBvbmVudENsYXNzID0gX3JlZjFbbmFtZV07XG4gICAgICAgIG5vZGVbbmFtZV0gPSBlbnRpdHkuZ2V0KGNvbXBvbmVudENsYXNzKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZW50aXRpZXNbZW50aXR5Lm5hbWVdID0gbm9kZTtcbiAgICAgIHRoaXMubm9kZXMuYWRkKG5vZGUpO1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gICAqIFJlbW92ZXMgdGhlIGVudGl0eSBpZiBpdCBpcyBpbiB0aGlzIGZhbWlseSdzIE5vZGVMaXN0LlxuICAgKi9cblxuICBDb21wb25lbnRNYXRjaGluZ0ZhbWlseS5wcm90b3R5cGUucmVtb3ZlSWZNYXRjaCA9IGZ1bmN0aW9uKGVudGl0eSkge1xuICAgIHZhciBub2RlO1xuICAgIGlmIChlbnRpdHkubmFtZSBpbiB0aGlzLmVudGl0aWVzKSB7XG4gICAgICBub2RlID0gdGhpcy5lbnRpdGllc1tlbnRpdHkubmFtZV07XG4gICAgICBkZWxldGUgdGhpcy5lbnRpdGllc1tlbnRpdHkubmFtZV07XG4gICAgICB0aGlzLm5vZGVzLnJlbW92ZShub2RlKTtcbiAgICAgIGlmICh0aGlzLmVuZ2luZS51cGRhdGluZykge1xuICAgICAgICB0aGlzLm5vZGVQb29sLmNhY2hlKG5vZGUpO1xuICAgICAgICB0aGlzLmVuZ2luZS51cGRhdGVDb21wbGV0ZS5hZGQodGhpcy5yZWxlYXNlTm9kZVBvb2xDYWNoZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm5vZGVQb29sLmRpc3Bvc2Uobm9kZSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG5cbiAgLypcbiAgICogUmVsZWFzZXMgdGhlIG5vZGVzIHRoYXQgd2VyZSBhZGRlZCB0byB0aGUgbm9kZSBwb29sIGR1cmluZyB0aGlzIGVuZ2luZSB1cGRhdGUsIHNvIHRoZXkgY2FuXG4gICAqIGJlIHJldXNlZC5cbiAgICovXG5cbiAgQ29tcG9uZW50TWF0Y2hpbmdGYW1pbHkucHJvdG90eXBlLnJlbGVhc2VOb2RlUG9vbENhY2hlID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5lbmdpbmUudXBkYXRlQ29tcGxldGUucmVtb3ZlKHRoaXMucmVsZWFzZU5vZGVQb29sQ2FjaGUpO1xuICAgIHRoaXMubm9kZVBvb2wucmVsZWFzZUNhY2hlKCk7XG4gIH07XG5cblxuICAvKlxuICAgKiBSZW1vdmVzIGFsbCBub2RlcyBmcm9tIHRoZSBOb2RlTGlzdC5cbiAgICovXG5cbiAgQ29tcG9uZW50TWF0Y2hpbmdGYW1pbHkucHJvdG90eXBlLmNsZWFuVXAgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbm9kZTtcbiAgICBub2RlID0gdGhpcy5ub2Rlcy5oZWFkO1xuICAgIHdoaWxlIChub2RlKSB7XG4gICAgICB0aGlzLmVudGl0aWVzLnJlbW92ZShub2RlLmVudGl0eSk7XG4gICAgICBub2RlID0gbm9kZS5uZXh0O1xuICAgIH1cbiAgICB0aGlzLm5vZGVzLnJlbW92ZUFsbCgpO1xuICB9O1xuXG4gIHJldHVybiBDb21wb25lbnRNYXRjaGluZ0ZhbWlseTtcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29tcG9uZW50X21hdGNoaW5nX2ZhbWlseS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBDb21wb25lbnRNYXRjaGluZ0ZhbWlseSwgRGljdGlvbmFyeSwgRW50aXR5TGlzdCwgU2lnbmFsMCwgU3lzdGVtTGlzdCwgYXNoLFxuICBfX2JpbmQgPSBmdW5jdGlvbihmbiwgbWUpeyByZXR1cm4gZnVuY3Rpb24oKXsgcmV0dXJuIGZuLmFwcGx5KG1lLCBhcmd1bWVudHMpOyB9OyB9O1xuXG5hc2ggPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuQ29tcG9uZW50TWF0Y2hpbmdGYW1pbHkgPSBhc2guY29yZS5Db21wb25lbnRNYXRjaGluZ0ZhbWlseTtcblxuRW50aXR5TGlzdCA9IGFzaC5jb3JlLkVudGl0eUxpc3Q7XG5cblNpZ25hbDAgPSBhc2guc2lnbmFscy5TaWduYWwwO1xuXG5TeXN0ZW1MaXN0ID0gYXNoLmNvcmUuU3lzdGVtTGlzdDtcblxuRGljdGlvbmFyeSA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gRGljdGlvbmFyeSgpIHt9XG5cbiAgcmV0dXJuIERpY3Rpb25hcnk7XG5cbn0pKCk7XG5cblxuLypcbiAqIFRoZSBFbmdpbmUgY2xhc3MgaXMgdGhlIGNlbnRyYWwgcG9pbnQgZm9yIGNyZWF0aW5nIGFuZCBtYW5hZ2luZyB5b3VyIGdhbWUgc3RhdGUuIEFkZFxuICogZW50aXRpZXMgYW5kIHN5c3RlbXMgdG8gdGhlIGVuZ2luZSwgYW5kIGZldGNoIGZhbWlsaWVzIG9mIG5vZGVzIGZyb20gdGhlIGVuZ2luZS5cbiAqL1xuXG5hc2guY29yZS5FbmdpbmUgPSAoZnVuY3Rpb24oKSB7XG4gIEVuZ2luZS5wcm90b3R5cGUuZW50aXR5TmFtZXMgPSBudWxsO1xuXG4gIEVuZ2luZS5wcm90b3R5cGUuZW50aXR5TGlzdCA9IG51bGw7XG5cbiAgRW5naW5lLnByb3RvdHlwZS5zeXN0ZW1MaXN0ID0gbnVsbDtcblxuICBFbmdpbmUucHJvdG90eXBlLmZhbWlsaWVzID0gbnVsbDtcblxuXG4gIC8qXG4gICAqIEluZGljYXRlcyBpZiB0aGUgZW5naW5lIGlzIGN1cnJlbnRseSBpbiBpdHMgdXBkYXRlIGxvb3AuXG4gICAqL1xuXG4gIEVuZ2luZS5wcm90b3R5cGUudXBkYXRpbmcgPSBmYWxzZTtcblxuXG4gIC8qXG4gICAqIERpc3BhdGNoZWQgd2hlbiB0aGUgdXBkYXRlIGxvb3AgZW5kcy4gSWYgeW91IHdhbnQgdG8gYWRkIGFuZCByZW1vdmUgc3lzdGVtcyBmcm9tIHRoZVxuICAgKiBlbmdpbmUgaXQgaXMgdXN1YWxseSBiZXN0IG5vdCB0byBkbyBzbyBkdXJpbmcgdGhlIHVwZGF0ZSBsb29wLiBUbyBhdm9pZCB0aGlzIHlvdSBjYW5cbiAgICogbGlzdGVuIGZvciB0aGlzIHNpZ25hbCBhbmQgbWFrZSB0aGUgY2hhbmdlIHdoZW4gdGhlIHNpZ25hbCBpcyBkaXNwYXRjaGVkLlxuICAgKi9cblxuICBFbmdpbmUucHJvdG90eXBlLnVwZGF0ZUNvbXBsZXRlID0gbnVsbDtcblxuXG4gIC8qXG4gICAqIFRoZSBjbGFzcyB1c2VkIHRvIG1hbmFnZSBub2RlIGxpc3RzLiBJbiBtb3N0IGNhc2VzIHRoZSBkZWZhdWx0IGNsYXNzIGlzIHN1ZmZpY2llbnRcbiAgICogYnV0IGl0IGlzIGV4cG9zZWQgaGVyZSBzbyBhZHZhbmNlZCBkZXZlbG9wZXJzIGNhbiBjaG9vc2UgdG8gY3JlYXRlIGFuZCB1c2UgYVxuICAgKiBkaWZmZXJlbnQgaW1wbGVtZW50YXRpb24uXG4gICAqXG4gICAqIFRoZSBjbGFzcyBtdXN0IGltcGxlbWVudCB0aGUgSUZhbWlseSBpbnRlcmZhY2UuXG4gICAqL1xuXG4gIEVuZ2luZS5wcm90b3R5cGUuZmFtaWx5Q2xhc3MgPSBDb21wb25lbnRNYXRjaGluZ0ZhbWlseTtcblxuICBmdW5jdGlvbiBFbmdpbmUoKSB7XG4gICAgdGhpcy51cGRhdGUgPSBfX2JpbmQodGhpcy51cGRhdGUsIHRoaXMpO1xuICAgIHRoaXMuY29tcG9uZW50UmVtb3ZlZCA9IF9fYmluZCh0aGlzLmNvbXBvbmVudFJlbW92ZWQsIHRoaXMpO1xuICAgIHRoaXMuY29tcG9uZW50QWRkZWQgPSBfX2JpbmQodGhpcy5jb21wb25lbnRBZGRlZCwgdGhpcyk7XG4gICAgdGhpcy5lbnRpdHlOYW1lQ2hhbmdlZCA9IF9fYmluZCh0aGlzLmVudGl0eU5hbWVDaGFuZ2VkLCB0aGlzKTtcbiAgICB0aGlzLmVudGl0eUxpc3QgPSBuZXcgRW50aXR5TGlzdCgpO1xuICAgIHRoaXMuZW50aXR5TmFtZXMgPSBuZXcgRGljdGlvbmFyeSgpO1xuICAgIHRoaXMuc3lzdGVtTGlzdCA9IG5ldyBTeXN0ZW1MaXN0KCk7XG4gICAgdGhpcy5mYW1pbGllcyA9IG5ldyBEaWN0aW9uYXJ5KCk7XG4gICAgdGhpcy51cGRhdGVDb21wbGV0ZSA9IG5ldyBTaWduYWwwKCk7XG4gIH1cblxuICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhFbmdpbmUucHJvdG90eXBlLCB7XG5cbiAgICAvKlxuICAgICAqIFJldHVybnMgYSB2ZWN0b3IgY29udGFpbmluZyBhbGwgdGhlIGVudGl0aWVzIGluIHRoZSBlbmdpbmUuXG4gICAgICovXG4gICAgZW50aXRpZXM6IHtcbiAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBlbnRpdGllcywgZW50aXR5O1xuICAgICAgICBlbnRpdGllcyA9IFtdO1xuICAgICAgICBlbnRpdHkgPSB0aGlzLmVudGl0eUxpc3QuaGVhZDtcbiAgICAgICAgd2hpbGUgKGVudGl0eSkge1xuICAgICAgICAgIHRoaXMuZW50aXRpZXMucHVzaChlbnRpdHkpO1xuICAgICAgICAgIGVudGl0eSA9IGVudGl0eS5uZXh0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbnRpdGllcztcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLypcbiAgICAgKiBSZXR1cm5zIGEgdmVjdG9yIGNvbnRhaW5pbmcgYWxsIHRoZSBzeXN0ZW1zIGluIHRoZSBlbmdpbmUuXG4gICAgICovXG4gICAgc3lzdGVtczoge1xuICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHN5c3RlbSwgc3lzdGVtcztcbiAgICAgICAgc3lzdGVtcyA9IFtdO1xuICAgICAgICBzeXN0ZW0gPSB0aGlzLnN5c3RlbUxpc3QuaGVhZDtcbiAgICAgICAgd2hpbGUgKHN5c3RlbSkge1xuICAgICAgICAgIHN5c3RlbXMucHVzaChzeXN0ZW0pO1xuICAgICAgICAgIHN5c3RlbSA9IHN5c3RlbS5uZXh0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzeXN0ZW1zO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cblxuICAvKlxuICAgKiBBZGQgYW4gZW50aXR5IHRvIHRoZSBlbmdpbmUuXG4gICAqXG4gICAqIEBwYXJhbSBlbnRpdHkgVGhlIGVudGl0eSB0byBhZGQuXG4gICAqL1xuXG4gIEVuZ2luZS5wcm90b3R5cGUuYWRkRW50aXR5ID0gZnVuY3Rpb24oZW50aXR5KSB7XG4gICAgdmFyIGVhY2gsIGZhbWlseSwgX3JlZjtcbiAgICBpZiAodGhpcy5lbnRpdHlOYW1lc1tlbnRpdHkubmFtZV0pIHtcbiAgICAgIHRocm93IFwiVGhlIGVudGl0eSBuYW1lIFwiICsgZW50aXR5Lm5hbWUgKyBcIiBpcyBhbHJlYWR5IGluIHVzZSBieSBhbm90aGVyIGVudGl0eS5cIjtcbiAgICB9XG4gICAgdGhpcy5lbnRpdHlMaXN0LmFkZChlbnRpdHkpO1xuICAgIHRoaXMuZW50aXR5TmFtZXNbZW50aXR5Lm5hbWVdID0gZW50aXR5O1xuICAgIGVudGl0eS5jb21wb25lbnRBZGRlZC5hZGQodGhpcy5jb21wb25lbnRBZGRlZCk7XG4gICAgZW50aXR5LmNvbXBvbmVudFJlbW92ZWQuYWRkKHRoaXMuY29tcG9uZW50UmVtb3ZlZCk7XG4gICAgZW50aXR5Lm5hbWVDaGFuZ2VkLmFkZCh0aGlzLmVudGl0eU5hbWVDaGFuZ2VkKTtcbiAgICBfcmVmID0gdGhpcy5mYW1pbGllcztcbiAgICBmb3IgKGVhY2ggaW4gX3JlZikge1xuICAgICAgZmFtaWx5ID0gX3JlZltlYWNoXTtcbiAgICAgIGZhbWlseS5uZXdFbnRpdHkoZW50aXR5KTtcbiAgICB9XG4gIH07XG5cblxuICAvKlxuICAgKiBSZW1vdmUgYW4gZW50aXR5IGZyb20gdGhlIGVuZ2luZS5cbiAgICpcbiAgICogQHBhcmFtIGVudGl0eSBUaGUgZW50aXR5IHRvIHJlbW92ZS5cbiAgICovXG5cbiAgRW5naW5lLnByb3RvdHlwZS5yZW1vdmVFbnRpdHkgPSBmdW5jdGlvbihlbnRpdHkpIHtcbiAgICB2YXIgZWFjaCwgZmFtaWx5LCBfcmVmO1xuICAgIGVudGl0eS5jb21wb25lbnRBZGRlZC5yZW1vdmUodGhpcy5jb21wb25lbnRBZGRlZCk7XG4gICAgZW50aXR5LmNvbXBvbmVudFJlbW92ZWQucmVtb3ZlKHRoaXMuY29tcG9uZW50UmVtb3ZlZCk7XG4gICAgZW50aXR5Lm5hbWVDaGFuZ2VkLnJlbW92ZSh0aGlzLmVudGl0eU5hbWVDaGFuZ2VkKTtcbiAgICBfcmVmID0gdGhpcy5mYW1pbGllcztcbiAgICBmb3IgKGVhY2ggaW4gX3JlZikge1xuICAgICAgZmFtaWx5ID0gX3JlZltlYWNoXTtcbiAgICAgIGZhbWlseS5yZW1vdmVFbnRpdHkoZW50aXR5KTtcbiAgICB9XG4gICAgZGVsZXRlIHRoaXMuZW50aXR5TmFtZXNbZW50aXR5Lm5hbWVdO1xuICAgIHRoaXMuZW50aXR5TGlzdC5yZW1vdmUoZW50aXR5KTtcbiAgfTtcblxuICBFbmdpbmUucHJvdG90eXBlLmVudGl0eU5hbWVDaGFuZ2VkID0gZnVuY3Rpb24oZW50aXR5LCBvbGROYW1lKSB7XG4gICAgaWYgKHRoaXMuZW50aXR5TmFtZXNbb2xkTmFtZV0gPT09IGVudGl0eSkge1xuICAgICAgZGVsZXRlIHRoaXMuZW50aXR5TmFtZXNbb2xkTmFtZV07XG4gICAgICB0aGlzLmVudGl0eU5hbWVzW2VudGl0eS5uYW1lXSA9IGVudGl0eTtcbiAgICB9XG4gIH07XG5cblxuICAvKlxuICAgKiBHZXQgYW4gZW50aXR5IGJhc2VkIG4gaXRzIG5hbWUuXG4gICAqXG4gICAqIEBwYXJhbSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBlbnRpdHlcbiAgICogQHJldHVybiBUaGUgZW50aXR5LCBvciBudWxsIGlmIG5vIGVudGl0eSB3aXRoIHRoYXQgbmFtZSBleGlzdHMgb24gdGhlIGVuZ2luZVxuICAgKi9cblxuICBFbmdpbmUucHJvdG90eXBlLmdldEVudGl0eUJ5TmFtZSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5lbnRpdHlOYW1lc1tuYW1lXTtcbiAgfTtcblxuXG4gIC8qXG4gICAqIFJlbW92ZSBhbGwgZW50aXRpZXMgZnJvbSB0aGUgZW5naW5lLlxuICAgKi9cblxuICBFbmdpbmUucHJvdG90eXBlLnJlbW92ZUFsbEVudGl0aWVzID0gZnVuY3Rpb24oKSB7XG4gICAgd2hpbGUgKHRoaXMuZW50aXR5TGlzdC5oZWFkICE9PSBudWxsKSB7XG4gICAgICB0aGlzLnJlbW92ZUVudGl0eSh0aGlzLmVudGl0eUxpc3QuaGVhZCk7XG4gICAgfVxuICB9O1xuXG5cbiAgLypcbiAgIEBwcml2YXRlXG4gICAqL1xuXG4gIEVuZ2luZS5wcm90b3R5cGUuY29tcG9uZW50QWRkZWQgPSBmdW5jdGlvbihlbnRpdHksIGNvbXBvbmVudENsYXNzKSB7XG4gICAgdmFyIGVhY2gsIGZhbWlseSwgX3JlZjtcbiAgICBfcmVmID0gdGhpcy5mYW1pbGllcztcbiAgICBmb3IgKGVhY2ggaW4gX3JlZikge1xuICAgICAgZmFtaWx5ID0gX3JlZltlYWNoXTtcbiAgICAgIGZhbWlseS5jb21wb25lbnRBZGRlZFRvRW50aXR5KGVudGl0eSwgY29tcG9uZW50Q2xhc3MpO1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gICBAcHJpdmF0ZVxuICAgKi9cblxuICBFbmdpbmUucHJvdG90eXBlLmNvbXBvbmVudFJlbW92ZWQgPSBmdW5jdGlvbihlbnRpdHksIGNvbXBvbmVudENsYXNzKSB7XG4gICAgdmFyIGVhY2gsIGZhbWlseSwgX3JlZjtcbiAgICBfcmVmID0gdGhpcy5mYW1pbGllcztcbiAgICBmb3IgKGVhY2ggaW4gX3JlZikge1xuICAgICAgZmFtaWx5ID0gX3JlZltlYWNoXTtcbiAgICAgIGZhbWlseS5jb21wb25lbnRSZW1vdmVkRnJvbUVudGl0eShlbnRpdHksIGNvbXBvbmVudENsYXNzKTtcbiAgICB9XG4gIH07XG5cblxuICAvKlxuICAgKiBHZXQgYSBjb2xsZWN0aW9uIG9mIG5vZGVzIGZyb20gdGhlIGVuZ2luZSwgYmFzZWQgb24gdGhlIHR5cGUgb2YgdGhlIG5vZGUgcmVxdWlyZWQuXG4gICAqXG4gICAqIDxwPlRoZSBlbmdpbmUgd2lsbCBjcmVhdGUgdGhlIGFwcHJvcHJpYXRlIE5vZGVMaXN0IGlmIGl0IGRvZXNuJ3QgYWxyZWFkeSBleGlzdCBhbmRcbiAgICogd2lsbCBrZWVwIGl0cyBjb250ZW50cyB1cCB0byBkYXRlIGFzIGVudGl0aWVzIGFyZSBhZGRlZCB0byBhbmQgcmVtb3ZlZCBmcm9tIHRoZVxuICAgKiBlbmdpbmUuPC9wPlxuICAgKlxuICAgKiA8cD5JZiBhIE5vZGVMaXN0IGlzIG5vIGxvbmdlciByZXF1aXJlZCwgcmVsZWFzZSBpdCB3aXRoIHRoZSByZWxlYXNlTm9kZUxpc3QgbWV0aG9kLjwvcD5cbiAgICpcbiAgICogQHBhcmFtIG5vZGVDbGFzcyBUaGUgdHlwZSBvZiBub2RlIHJlcXVpcmVkLlxuICAgKiBAcmV0dXJuIEEgbGlua2VkIGxpc3Qgb2YgYWxsIG5vZGVzIG9mIHRoaXMgdHlwZSBmcm9tIGFsbCBlbnRpdGllcyBpbiB0aGUgZW5naW5lLlxuICAgKi9cblxuICBFbmdpbmUucHJvdG90eXBlLmdldE5vZGVMaXN0ID0gZnVuY3Rpb24obm9kZUNsYXNzKSB7XG4gICAgdmFyIGVudGl0eSwgZmFtaWx5O1xuICAgIGlmIChub2RlQ2xhc3MubmFtZSBpbiB0aGlzLmZhbWlsaWVzKSB7XG4gICAgICByZXR1cm4gdGhpcy5mYW1pbGllc1tub2RlQ2xhc3MubmFtZV0ubm9kZUxpc3Q7XG4gICAgfVxuICAgIGZhbWlseSA9IG5ldyB0aGlzLmZhbWlseUNsYXNzKG5vZGVDbGFzcywgdGhpcyk7XG4gICAgdGhpcy5mYW1pbGllc1tub2RlQ2xhc3MubmFtZV0gPSBmYW1pbHk7XG4gICAgZW50aXR5ID0gdGhpcy5lbnRpdHlMaXN0LmhlYWQ7XG4gICAgd2hpbGUgKGVudGl0eSkge1xuICAgICAgZmFtaWx5Lm5ld0VudGl0eShlbnRpdHkpO1xuICAgICAgZW50aXR5ID0gZW50aXR5Lm5leHQ7XG4gICAgfVxuICAgIHJldHVybiBmYW1pbHkubm9kZUxpc3Q7XG4gIH07XG5cblxuICAvKlxuICAgKiBJZiBhIE5vZGVMaXN0IGlzIG5vIGxvbmdlciByZXF1aXJlZCwgdGhpcyBtZXRob2Qgd2lsbCBzdG9wIHRoZSBlbmdpbmUgdXBkYXRpbmdcbiAgICogdGhlIGxpc3QgYW5kIHdpbGwgcmVsZWFzZSBhbGwgcmVmZXJlbmNlcyB0byB0aGUgbGlzdCB3aXRoaW4gdGhlIGZyYW1ld29ya1xuICAgKiBjbGFzc2VzLCBlbmFibGluZyBpdCB0byBiZSBnYXJiYWdlIGNvbGxlY3RlZC5cbiAgICpcbiAgICogPHA+SXQgaXMgbm90IGVzc2VudGlhbCB0byByZWxlYXNlIGEgbGlzdCwgYnV0IHJlbGVhc2luZyBpdCB3aWxsIGZyZWVcbiAgICogdXAgbWVtb3J5IGFuZCBwcm9jZXNzb3IgcmVzb3VyY2VzLjwvcD5cbiAgICpcbiAgICogQHBhcmFtIG5vZGVDbGFzcyBUaGUgdHlwZSBvZiB0aGUgbm9kZSBjbGFzcyBpZiB0aGUgbGlzdCB0byBiZSByZWxlYXNlZC5cbiAgICovXG5cbiAgRW5naW5lLnByb3RvdHlwZS5yZWxlYXNlTm9kZUxpc3QgPSBmdW5jdGlvbihub2RlQ2xhc3MpIHtcbiAgICBpZiAobm9kZUNsYXNzLm5hbWUgaW4gdGhpcy5mYW1pbGllcykge1xuICAgICAgdGhpcy5mYW1pbGllc1tub2RlQ2xhc3MubmFtZV0uY2xlYW5VcCgpO1xuICAgICAgZGVsZXRlIHRoaXMuZmFtaWxpZXNbbm9kZUNsYXNzLm5hbWVdO1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gICAqIEFkZCBhIHN5c3RlbSB0byB0aGUgZW5naW5lLCBhbmQgc2V0IGl0cyBwcmlvcml0eSBmb3IgdGhlIG9yZGVyIGluIHdoaWNoIHRoZVxuICAgKiBzeXN0ZW1zIGFyZSB1cGRhdGVkIGJ5IHRoZSBlbmdpbmUgdXBkYXRlIGxvb3AuXG4gICAqXG4gICAqIDxwPlRoZSBwcmlvcml0eSBkaWN0YXRlcyB0aGUgb3JkZXIgaW4gd2hpY2ggdGhlIHN5c3RlbXMgYXJlIHVwZGF0ZWQgYnkgdGhlIGVuZ2luZSB1cGRhdGVcbiAgICogbG9vcC4gTG93ZXIgbnVtYmVycyBmb3IgcHJpb3JpdHkgYXJlIHVwZGF0ZWQgZmlyc3QuIGkuZS4gYSBwcmlvcml0eSBvZiAxIGlzXG4gICAqIHVwZGF0ZWQgYmVmb3JlIGEgcHJpb3JpdHkgb2YgMi48L3A+XG4gICAqXG4gICAqIEBwYXJhbSBzeXN0ZW0gVGhlIHN5c3RlbSB0byBhZGQgdG8gdGhlIGVuZ2luZS5cbiAgICogQHBhcmFtIHByaW9yaXR5IFRoZSBwcmlvcml0eSBmb3IgdXBkYXRpbmcgdGhlIHN5c3RlbXMgZHVyaW5nIHRoZSBlbmdpbmUgbG9vcC4gQVxuICAgKiBsb3dlciBudW1iZXIgbWVhbnMgdGhlIHN5c3RlbSBpcyB1cGRhdGVkIHNvb25lci5cbiAgICovXG5cbiAgRW5naW5lLnByb3RvdHlwZS5hZGRTeXN0ZW0gPSBmdW5jdGlvbihzeXN0ZW0sIHByaW9yaXR5KSB7XG4gICAgc3lzdGVtLnByaW9yaXR5ID0gcHJpb3JpdHk7XG4gICAgc3lzdGVtLmFkZFRvRW5naW5lKHRoaXMpO1xuICAgIHRoaXMuc3lzdGVtTGlzdC5hZGQoc3lzdGVtKTtcbiAgfTtcblxuXG4gIC8qXG4gICAqIEdldCB0aGUgc3lzdGVtIGluc3RhbmNlIG9mIGEgcGFydGljdWxhciB0eXBlIGZyb20gd2l0aGluIHRoZSBlbmdpbmUuXG4gICAqXG4gICAqIEBwYXJhbSB0eXBlIFRoZSB0eXBlIG9mIHN5c3RlbVxuICAgKiBAcmV0dXJuIFRoZSBpbnN0YW5jZSBvZiB0aGUgc3lzdGVtIHR5cGUgdGhhdCBpcyBpbiB0aGUgZW5naW5lLCBvclxuICAgKiBudWxsIGlmIG5vIHN5c3RlbXMgb2YgdGhpcyB0eXBlIGFyZSBpbiB0aGUgZW5naW5lLlxuICAgKi9cblxuICBFbmdpbmUucHJvdG90eXBlLmdldFN5c3RlbSA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgICByZXR1cm4gc3lzdGVtTGlzdC5nZXQodHlwZSk7XG4gIH07XG5cblxuICAvKlxuICAgKiBSZW1vdmUgYSBzeXN0ZW0gZnJvbSB0aGUgZW5naW5lLlxuICAgKlxuICAgKiBAcGFyYW0gc3lzdGVtIFRoZSBzeXN0ZW0gdG8gcmVtb3ZlIGZyb20gdGhlIGVuZ2luZS5cbiAgICovXG5cbiAgRW5naW5lLnByb3RvdHlwZS5yZW1vdmVTeXN0ZW0gPSBmdW5jdGlvbihzeXN0ZW0pIHtcbiAgICB0aGlzLnN5c3RlbUxpc3QucmVtb3ZlKHN5c3RlbSk7XG4gICAgc3lzdGVtLnJlbW92ZUZyb21FbmdpbmUodGhpcyk7XG4gIH07XG5cblxuICAvKlxuICAgKiBSZW1vdmUgYWxsIHN5c3RlbXMgZnJvbSB0aGUgZW5naW5lLlxuICAgKi9cblxuICBFbmdpbmUucHJvdG90eXBlLnJlbW92ZUFsbFN5c3RlbXMgPSBmdW5jdGlvbigpIHtcbiAgICB3aGlsZSAodGhpcy5zeXN0ZW1MaXN0LmhlYWQgIT09IG51bGwpIHtcbiAgICAgIHRoaXMucmVtb3ZlU3lzdGVtKHRoaXMuc3lzdGVtTGlzdC5oZWFkKTtcbiAgICB9XG4gIH07XG5cblxuICAvKlxuICAgKiBVcGRhdGUgdGhlIGVuZ2luZS4gVGhpcyBjYXVzZXMgdGhlIGVuZ2luZSB1cGRhdGUgbG9vcCB0byBydW4sIGNhbGxpbmcgdXBkYXRlIG9uIGFsbCB0aGVcbiAgICogc3lzdGVtcyBpbiB0aGUgZW5naW5lLlxuICAgKlxuICAgKiA8cD5UaGUgcGFja2FnZSBhc2gudGljayBjb250YWlucyBjbGFzc2VzIHRoYXQgY2FuIGJlIHVzZWQgdG8gcHJvdmlkZVxuICAgKiBhIHN0ZWFkeSBvciB2YXJpYWJsZSB0aWNrIHRoYXQgY2FsbHMgdGhpcyB1cGRhdGUgbWV0aG9kLjwvcD5cbiAgICpcbiAgICogQHRpbWUgVGhlIGR1cmF0aW9uLCBpbiBzZWNvbmRzLCBvZiB0aGlzIHVwZGF0ZSBzdGVwLlxuICAgKi9cblxuICBFbmdpbmUucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKHRpbWUpIHtcbiAgICB2YXIgc3lzdGVtO1xuICAgIHRoaXMudXBkYXRpbmcgPSB0cnVlO1xuICAgIHN5c3RlbSA9IHRoaXMuc3lzdGVtTGlzdC5oZWFkO1xuICAgIHdoaWxlIChzeXN0ZW0pIHtcbiAgICAgIHN5c3RlbS51cGRhdGUodGltZSk7XG4gICAgICBzeXN0ZW0gPSBzeXN0ZW0ubmV4dDtcbiAgICB9XG4gICAgdGhpcy51cGRhdGluZyA9IGZhbHNlO1xuICAgIHRoaXMudXBkYXRlQ29tcGxldGUuZGlzcGF0Y2goKTtcbiAgfTtcblxuICByZXR1cm4gRW5naW5lO1xuXG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1lbmdpbmUuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgRGljdGlvbmFyeSwgU2lnbmFsMiwgYXNoO1xuXG5hc2ggPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuU2lnbmFsMiA9IGFzaC5zaWduYWxzLlNpZ25hbDI7XG5cbkRpY3Rpb25hcnkgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIERpY3Rpb25hcnkoKSB7fVxuXG4gIHJldHVybiBEaWN0aW9uYXJ5O1xuXG59KSgpO1xuXG5cbi8qXG4gKiBBbiBlbnRpdHkgaXMgY29tcG9zZWQgZnJvbSBjb21wb25lbnRzLiBBcyBzdWNoLCBpdCBpcyBlc3NlbnRpYWxseSBhIGNvbGxlY3Rpb24gb2JqZWN0IGZvciBjb21wb25lbnRzLlxuICogU29tZXRpbWVzLCB0aGUgZW50aXRpZXMgaW4gYSBnYW1lIHdpbGwgbWlycm9yIHRoZSBhY3R1YWwgY2hhcmFjdGVycyBhbmQgb2JqZWN0cyBpbiB0aGUgZ2FtZSwgYnV0IHRoaXNcbiAqIGlzIG5vdCBuZWNlc3NhcnkuXG4gKlxuICogPHA+Q29tcG9uZW50cyBhcmUgc2ltcGxlIHZhbHVlIG9iamVjdHMgdGhhdCBjb250YWluIGRhdGEgcmVsZXZhbnQgdG8gdGhlIGVudGl0eS4gRW50aXRpZXNcbiAqIHdpdGggc2ltaWxhciBmdW5jdGlvbmFsaXR5IHdpbGwgaGF2ZSBpbnN0YW5jZXMgb2YgdGhlIHNhbWUgY29tcG9uZW50cy4gU28gd2UgbWlnaHQgaGF2ZVxuICogYSBwb3NpdGlvbiBjb21wb25lbnQ8L3A+XG4gKlxuICogPHA+PGNvZGU+Y2xhc3MgUG9zaXRpb25Db21wb25lbnRcbiAqIHtcbiAqICAgcHVibGljIHZhciB4OkZsb2F0O1xuICogICBwdWJsaWMgdmFyIHk6RmxvYXQ7XG4gKiB9PC9jb2RlPjwvcD5cbiAqXG4gKiA8cD5BbGwgZW50aXRpZXMgdGhhdCBoYXZlIGEgcG9zaXRpb24gaW4gdGhlIGdhbWUgd29ybGQsIHdpbGwgaGF2ZSBhbiBpbnN0YW5jZSBvZiB0aGVcbiAqIHBvc2l0aW9uIGNvbXBvbmVudC4gU3lzdGVtcyBvcGVyYXRlIG9uIGVudGl0aWVzIGJhc2VkIG9uIHRoZSBjb21wb25lbnRzIHRoZXkgaGF2ZS48L3A+XG4gKi9cblxuYXNoLmNvcmUuRW50aXR5ID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgbmFtZUNvdW50O1xuXG4gIG5hbWVDb3VudCA9IDA7XG5cblxuICAvKlxuICAgKiBPcHRpb25hbCwgZ2l2ZSB0aGUgZW50aXR5IGEgbmFtZS4gVGhpcyBjYW4gaGVscCB3aXRoIGRlYnVnZ2luZyBhbmQgd2l0aCBzZXJpYWxpc2luZyB0aGUgZW50aXR5LlxuICAgKi9cblxuICBFbnRpdHkucHJvdG90eXBlLl9uYW1lID0gJyc7XG5cblxuICAvKlxuICAgKiBUaGlzIHNpZ25hbCBpcyBkaXNwYXRjaGVkIHdoZW4gYSBjb21wb25lbnQgaXMgYWRkZWQgdG8gdGhlIGVudGl0eS5cbiAgICovXG5cbiAgRW50aXR5LnByb3RvdHlwZS5jb21wb25lbnRBZGRlZCA9IG51bGw7XG5cblxuICAvKlxuICAgKiBUaGlzIHNpZ25hbCBpcyBkaXNwYXRjaGVkIHdoZW4gYSBjb21wb25lbnQgaXMgcmVtb3ZlZCBmcm9tIHRoZSBlbnRpdHkuXG4gICAqL1xuXG4gIEVudGl0eS5wcm90b3R5cGUuY29tcG9uZW50UmVtb3ZlZCA9IG51bGw7XG5cblxuICAvKlxuICAgKiBEaXNwYXRjaGVkIHdoZW4gdGhlIG5hbWUgb2YgdGhlIGVudGl0eSBjaGFuZ2VzLiBVc2VkIGludGVybmFsbHkgYnkgdGhlIGVuZ2luZSB0byB0cmFjayBlbnRpdGllcyBiYXNlZCBvbiB0aGVpciBuYW1lcy5cbiAgICovXG5cbiAgRW50aXR5LnByb3RvdHlwZS5uYW1lQ2hhbmdlZCA9IG51bGw7XG5cbiAgRW50aXR5LnByb3RvdHlwZS5wcmV2aW91cyA9IG51bGw7XG5cbiAgRW50aXR5LnByb3RvdHlwZS5uZXh0ID0gbnVsbDtcblxuICBFbnRpdHkucHJvdG90eXBlLmNvbXBvbmVudHMgPSBudWxsO1xuXG4gIGZ1bmN0aW9uIEVudGl0eShuYW1lKSB7XG4gICAgaWYgKG5hbWUgPT0gbnVsbCkge1xuICAgICAgbmFtZSA9ICcnO1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG5cbiAgICAgIC8qXG4gICAgICAgKiBBbGwgZW50aXRpZXMgaGF2ZSBhIG5hbWUuIElmIG5vIG5hbWUgaXMgc2V0LCBhIGRlZmF1bHQgbmFtZSBpcyB1c2VkLiBOYW1lcyBhcmUgdXNlZCB0b1xuICAgICAgICogZmV0Y2ggc3BlY2lmaWMgZW50aXRpZXMgZnJvbSB0aGUgZW5naW5lLCBhbmQgY2FuIGFsc28gaGVscCB0byBpZGVudGlmeSBhbiBlbnRpdHkgd2hlbiBkZWJ1Z2dpbmcuXG4gICAgICAgKi9cbiAgICAgIG5hbWU6IHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5fbmFtZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgIHZhciBwcmV2aW91cztcbiAgICAgICAgICBpZiAodGhpcy5fbmFtZSAhPT0gdmFsdWUpIHtcbiAgICAgICAgICAgIHByZXZpb3VzID0gdGhpcy5fbmFtZTtcbiAgICAgICAgICAgIHRoaXMuX25hbWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm5hbWVDaGFuZ2VkLmRpc3BhdGNoKHRoaXMsIHByZXZpb3VzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLmNvbXBvbmVudEFkZGVkID0gbmV3IFNpZ25hbDIoKTtcbiAgICB0aGlzLmNvbXBvbmVudFJlbW92ZWQgPSBuZXcgU2lnbmFsMigpO1xuICAgIHRoaXMubmFtZUNoYW5nZWQgPSBuZXcgU2lnbmFsMigpO1xuICAgIHRoaXMuY29tcG9uZW50cyA9IG5ldyBEaWN0aW9uYXJ5KCk7XG4gICAgaWYgKG5hbWUgIT09ICcnKSB7XG4gICAgICB0aGlzLl9uYW1lID0gbmFtZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fbmFtZSA9IFwiX2VudGl0eVwiICsgKCsrbmFtZUNvdW50KTtcbiAgICB9XG4gIH1cblxuXG4gIC8qXG4gICAqIEFkZCBhIGNvbXBvbmVudCB0byB0aGUgZW50aXR5LlxuICAgKlxuICAgKiBAcGFyYW0gY29tcG9uZW50IFRoZSBjb21wb25lbnQgb2JqZWN0IHRvIGFkZC5cbiAgICogQHBhcmFtIGNvbXBvbmVudENsYXNzIFRoZSBjbGFzcyBvZiB0aGUgY29tcG9uZW50LiBUaGlzIGlzIG9ubHkgbmVjZXNzYXJ5IGlmIHRoZSBjb21wb25lbnRcbiAgICogZXh0ZW5kcyBhbm90aGVyIGNvbXBvbmVudCBjbGFzcyBhbmQgeW91IHdhbnQgdGhlIGZyYW1ld29yayB0byB0cmVhdCB0aGUgY29tcG9uZW50IGFzIG9mXG4gICAqIHRoZSBiYXNlIGNsYXNzIHR5cGUuIElmIG5vdCBzZXQsIHRoZSBjbGFzcyB0eXBlIGlzIGRldGVybWluZWQgZGlyZWN0bHkgZnJvbSB0aGUgY29tcG9uZW50LlxuICAgKlxuICAgKiBAcmV0dXJuIEEgcmVmZXJlbmNlIHRvIHRoZSBlbnRpdHkuIFRoaXMgZW5hYmxlcyB0aGUgY2hhaW5pbmcgb2YgY2FsbHMgdG8gYWRkLCB0byBtYWtlXG4gICAqIGNyZWF0aW5nIGFuZCBjb25maWd1cmluZyBlbnRpdGllcyBjbGVhbmVyLiBlLmcuXG4gICAqXG4gICAqIDxjb2RlPnZhciBlbnRpdHk6RW50aXR5ID0gbmV3IEVudGl0eSgpXG4gICAqICAgICAuYWRkKG5ldyBQb3NpdGlvbigxMDAsIDIwMClcbiAgICogICAgIC5hZGQobmV3IERpc3BsYXkobmV3IFBsYXllckNsaXAoKSk7PC9jb2RlPlxuICAgKi9cblxuICBFbnRpdHkucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKGNvbXBvbmVudCwgY29tcG9uZW50Q2xhc3MpIHtcbiAgICBpZiAoY29tcG9uZW50Q2xhc3MgPT0gbnVsbCkge1xuICAgICAgY29tcG9uZW50Q2xhc3MgPSBjb21wb25lbnQuY29uc3RydWN0b3I7XG4gICAgfVxuICAgIGlmIChjb21wb25lbnRDbGFzcy5uYW1lIGluIHRoaXMuY29tcG9uZW50cykge1xuICAgICAgdGhpcy5yZW1vdmUoY29tcG9uZW50Q2xhc3MpO1xuICAgIH1cbiAgICB0aGlzLmNvbXBvbmVudHNbY29tcG9uZW50Q2xhc3MubmFtZV0gPSBjb21wb25lbnQ7XG4gICAgdGhpcy5jb21wb25lbnRBZGRlZC5kaXNwYXRjaCh0aGlzLCBjb21wb25lbnRDbGFzcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cblxuICAvKlxuICAgKiBSZW1vdmUgYSBjb21wb25lbnQgZnJvbSB0aGUgZW50aXR5LlxuICAgKlxuICAgKiBAcGFyYW0gY29tcG9uZW50Q2xhc3MgVGhlIGNsYXNzIG9mIHRoZSBjb21wb25lbnQgdG8gYmUgcmVtb3ZlZC5cbiAgICogQHJldHVybiB0aGUgY29tcG9uZW50LCBvciBudWxsIGlmIHRoZSBjb21wb25lbnQgZG9lc24ndCBleGlzdCBpbiB0aGUgZW50aXR5XG4gICAqL1xuXG4gIEVudGl0eS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oY29tcG9uZW50Q2xhc3MpIHtcbiAgICB2YXIgY29tcG9uZW50LCBuYW1lO1xuICAgIG5hbWUgPSBjb21wb25lbnRDbGFzcy5uYW1lICE9IG51bGwgPyBjb21wb25lbnRDbGFzcy5uYW1lIDogY29tcG9uZW50Q2xhc3M7XG4gICAgY29tcG9uZW50ID0gdGhpcy5jb21wb25lbnRzW25hbWVdO1xuICAgIGlmIChjb21wb25lbnQpIHtcbiAgICAgIGRlbGV0ZSB0aGlzLmNvbXBvbmVudHNbbmFtZV07XG4gICAgICB0aGlzLmNvbXBvbmVudFJlbW92ZWQuZGlzcGF0Y2godGhpcywgbmFtZSk7XG4gICAgICByZXR1cm4gY29tcG9uZW50O1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfTtcblxuXG4gIC8qXG4gICAqIEdldCBhIGNvbXBvbmVudCBmcm9tIHRoZSBlbnRpdHkuXG4gICAqXG4gICAqIEBwYXJhbSBjb21wb25lbnRDbGFzcyBUaGUgY2xhc3Mgb2YgdGhlIGNvbXBvbmVudCByZXF1ZXN0ZWQuXG4gICAqIEByZXR1cm4gVGhlIGNvbXBvbmVudCwgb3IgbnVsbCBpZiBub25lIHdhcyBmb3VuZC5cbiAgICovXG5cbiAgRW50aXR5LnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihjb21wb25lbnRDbGFzcykge1xuICAgIHJldHVybiB0aGlzLmNvbXBvbmVudHNbY29tcG9uZW50Q2xhc3MubmFtZV07XG4gIH07XG5cblxuICAvKlxuICAgKiBHZXQgYWxsIGNvbXBvbmVudHMgZnJvbSB0aGUgZW50aXR5LlxuICAgKlxuICAgKiBAcmV0dXJuIEFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIHRoZSBjb21wb25lbnRzIHRoYXQgYXJlIG9uIHRoZSBlbnRpdHkuXG4gICAqL1xuXG4gIEVudGl0eS5wcm90b3R5cGUuZ2V0QWxsID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNvbXBvbmVudCwgY29tcG9uZW50QXJyYXksIF9pLCBfbGVuLCBfcmVmO1xuICAgIGNvbXBvbmVudEFycmF5ID0gW107XG4gICAgX3JlZiA9IHRoaXMuY29tcG9uZW50cztcbiAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgIGNvbXBvbmVudCA9IF9yZWZbX2ldO1xuICAgICAgY29tcG9uZW50QXJyYXkucHVzaChjb21wb25lbnQpO1xuICAgIH1cbiAgICByZXR1cm4gY29tcG9uZW50QXJyYXk7XG4gIH07XG5cblxuICAvKlxuICAgKiBEb2VzIHRoZSBlbnRpdHkgaGF2ZSBhIGNvbXBvbmVudCBvZiBhIHBhcnRpY3VsYXIgdHlwZS5cbiAgICpcbiAgICogQHBhcmFtIGNvbXBvbmVudENsYXNzIFRoZSBjbGFzcyBvZiB0aGUgY29tcG9uZW50IHNvdWdodC5cbiAgICogQHJldHVybiB0cnVlIGlmIHRoZSBlbnRpdHkgaGFzIGEgY29tcG9uZW50IG9mIHRoZSB0eXBlLCBmYWxzZSBpZiBub3QuXG4gICAqL1xuXG4gIEVudGl0eS5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24oY29tcG9uZW50Q2xhc3MpIHtcbiAgICByZXR1cm4gY29tcG9uZW50Q2xhc3MubmFtZSBpbiB0aGlzLmNvbXBvbmVudHM7XG4gIH07XG5cbiAgcmV0dXJuIEVudGl0eTtcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZW50aXR5LmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzaDtcblxuYXNoID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cblxuLypcbiAqIEFuIGludGVybmFsIGNsYXNzIGZvciBhIGxpbmtlZCBsaXN0IG9mIGVudGl0aWVzLiBVc2VkIGluc2lkZSB0aGUgZnJhbWV3b3JrIGZvclxuICogbWFuYWdpbmcgdGhlIGVudGl0aWVzLlxuICovXG5cbmFzaC5jb3JlLkVudGl0eUxpc3QgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIEVudGl0eUxpc3QoKSB7fVxuXG4gIEVudGl0eUxpc3QucHJvdG90eXBlLmhlYWQgPSBudWxsO1xuXG4gIEVudGl0eUxpc3QucHJvdG90eXBlLnRhaWwgPSBudWxsO1xuXG4gIEVudGl0eUxpc3QucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKGVudGl0eSkge1xuICAgIGlmICghdGhpcy5oZWFkKSB7XG4gICAgICB0aGlzLmhlYWQgPSB0aGlzLnRhaWwgPSBlbnRpdHk7XG4gICAgICBlbnRpdHkubmV4dCA9IGVudGl0eS5wcmV2aW91cyA9IG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudGFpbC5uZXh0ID0gZW50aXR5O1xuICAgICAgZW50aXR5LnByZXZpb3VzID0gdGhpcy50YWlsO1xuICAgICAgZW50aXR5Lm5leHQgPSBudWxsO1xuICAgICAgdGhpcy50YWlsID0gZW50aXR5O1xuICAgIH1cbiAgfTtcblxuICBFbnRpdHlMaXN0LnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbihlbnRpdHkpIHtcbiAgICBpZiAodGhpcy5oZWFkID09PSBlbnRpdHkpIHtcbiAgICAgIHRoaXMuaGVhZCA9IHRoaXMuaGVhZC5uZXh0O1xuICAgIH1cbiAgICBpZiAodGhpcy50YWlsID09PSBlbnRpdHkpIHtcbiAgICAgIHRoaXMudGFpbCA9IHRoaXMudGFpbC5wcmV2aW91cztcbiAgICB9XG4gICAgaWYgKGVudGl0eS5wcmV2aW91cykge1xuICAgICAgZW50aXR5LnByZXZpb3VzLm5leHQgPSBlbnRpdHkubmV4dDtcbiAgICB9XG4gICAgaWYgKGVudGl0eS5uZXh0KSB7XG4gICAgICBlbnRpdHkubmV4dC5wcmV2aW91cyA9IGVudGl0eS5wcmV2aW91cztcbiAgICB9XG4gIH07XG5cbiAgRW50aXR5TGlzdC5wcm90b3R5cGUucmVtb3ZlQWxsID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGVudGl0eTtcbiAgICB3aGlsZSAodGhpcy5oZWFkKSB7XG4gICAgICBlbnRpdHkgPSB0aGlzLmhlYWQ7XG4gICAgICB0aGlzLmhlYWQgPSB0aGlzLmhlYWQubmV4dDtcbiAgICAgIGVudGl0eS5wcmV2aW91cyA9IG51bGw7XG4gICAgICBlbnRpdHkubmV4dCA9IG51bGw7XG4gICAgfVxuICAgIHRoaXMudGFpbCA9IG51bGw7XG4gIH07XG5cbiAgcmV0dXJuIEVudGl0eUxpc3Q7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWVudGl0eV9saXN0LmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzaDtcblxuYXNoID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cblxuLypcbiAqIFRoZSBpbnRlcmZhY2UgZm9yIGNsYXNzZXMgdGhhdCBhcmUgdXNlZCB0byBtYW5hZ2UgTm9kZUxpc3RzIChzZXQgYXMgdGhlIGZhbWlseUNsYXNzIHByb3BlcnR5XG4gKiBpbiB0aGUgRW5naW5lIG9iamVjdCkuIE1vc3QgZGV2ZWxvcGVycyBkb24ndCBuZWVkIHRvIHVzZSB0aGlzIHNpbmNlIHRoZSBkZWZhdWx0IGltcGxlbWVudGF0aW9uXG4gKiBpcyB1c2VkIGJ5IGRlZmF1bHQgYW5kIHN1aXRzIG1vc3QgbmVlZHMuXG4gKi9cblxuYXNoLmNvcmUuRmFtaWx5ID0gKGZ1bmN0aW9uKCkge1xuICBGYW1pbHkucHJvdG90eXBlLm5vZGVzID0gbnVsbDtcblxuXG4gIC8qXG4gICAqIFJldHVybnMgdGhlIE5vZGVMaXN0IG1hbmFnZWQgYnkgdGhpcyBjbGFzcy4gVGhpcyBzaG91bGQgYmUgYSByZWZlcmVuY2UgdGhhdCByZW1haW5zIHZhbGlkIGFsd2F5c1xuICAgKiBzaW5jZSBpdCBpcyByZXRhaW5lZCBhbmQgcmV1c2VkIGJ5IFN5c3RlbXMgdGhhdCB1c2UgdGhlIGxpc3QuIGkuZS4gbmV2ZXIgcmVjcmVhdGUgdGhlIGxpc3QsXG4gICAqIGFsd2F5cyBtb2RpZnkgaXQgaW4gcGxhY2UuXG4gICAqL1xuXG4gIGZ1bmN0aW9uIEZhbWlseSgpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICBub2RlTGlzdDoge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLm5vZGVzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuXG4gIC8qXG4gICAqIEFuIGVudGl0eSBoYXMgYmVlbiBhZGRlZCB0byB0aGUgZW5naW5lLiBJdCBtYXkgYWxyZWFkeSBoYXZlIGNvbXBvbmVudHMgc28gdGVzdCB0aGUgZW50aXR5XG4gICAqIGZvciBpbmNsdXNpb24gaW4gdGhpcyBmYW1pbHkncyBOb2RlTGlzdC5cbiAgICovXG5cbiAgRmFtaWx5LnByb3RvdHlwZS5uZXdFbnRpdHkgPSBmdW5jdGlvbihlbnRpdHkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ01ldGhvZCBtdXN0IGJlIG92ZXJyaWRlbicpO1xuICB9O1xuXG5cbiAgLypcbiAgICogQW4gZW50aXR5IGhhcyBiZWVuIHJlbW92ZWQgZnJvbSB0aGUgZW5naW5lLiBJZiBpdCdzIGluIHRoaXMgZmFtaWx5J3MgTm9kZUxpc3QgaXQgc2hvdWxkIGJlIHJlbW92ZWQuXG4gICAqL1xuXG4gIEZhbWlseS5wcm90b3R5cGUucmVtb3ZlRW50aXR5ID0gZnVuY3Rpb24oZW50aXR5KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdNZXRob2QgbXVzdCBiZSBvdmVycmlkZW4nKTtcbiAgfTtcblxuXG4gIC8qXG4gICAqIEEgY29tcG9uZW50IGhhcyBiZWVuIGFkZGVkIHRvIGFuIGVudGl0eS4gVGVzdCB3aGV0aGVyIHRoZSBlbnRpdHkncyBpbmNsdXNpb24gaW4gdGhpcyBmYW1pbHknc1xuICAgKiBOb2RlTGlzdCBzaG91bGQgYmUgbW9kaWZpZWQuXG4gICAqL1xuXG4gIEZhbWlseS5wcm90b3R5cGUuY29tcG9uZW50QWRkZWRUb0VudGl0eSA9IGZ1bmN0aW9uKGVudGl0eSwgY29tcG9uZW50Q2xhc3MpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ01ldGhvZCBtdXN0IGJlIG92ZXJyaWRlbicpO1xuICB9O1xuXG5cbiAgLypcbiAgICogQSBjb21wb25lbnQgaGFzIGJlZW4gcmVtb3ZlZCBmcm9tIGFuIGVudGl0eS4gVGVzdCB3aGV0aGVyIHRoZSBlbnRpdHkncyBpbmNsdXNpb24gaW4gdGhpcyBmYW1pbHknc1xuICAgKiBOb2RlTGlzdCBzaG91bGQgYmUgbW9kaWZpZWQuXG4gICAqL1xuXG4gIEZhbWlseS5wcm90b3R5cGUuY29tcG9uZW50UmVtb3ZlZEZyb21FbnRpdHkgPSBmdW5jdGlvbihlbnRpdHksIGNvbXBvbmVudENsYXNzKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdNZXRob2QgbXVzdCBiZSBvdmVycmlkZW4nKTtcbiAgfTtcblxuXG4gIC8qXG4gICAqIFRoZSBmYW1pbHkgaXMgYWJvdXQgdG8gYmUgZGlzY2FyZGVkLiBDbGVhbiB1cCBhbGwgcHJvcGVydGllcyBhcyBuZWNlc3NhcnkuIFVzdWFsbHksIHlvdSB3aWxsXG4gICAqIHdhbnQgdG8gZW1wdHkgdGhlIE5vZGVMaXN0IGF0IHRoaXMgdGltZS5cbiAgICovXG5cbiAgRmFtaWx5LnByb3RvdHlwZS5jbGVhblVwID0gZnVuY3Rpb24oKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdNZXRob2QgbXVzdCBiZSBvdmVycmlkZW4nKTtcbiAgfTtcblxuICByZXR1cm4gRmFtaWx5O1xuXG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1mYW1pbHkuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXNoO1xuXG5hc2ggPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuYXNoLmNvcmUuTm9kZSA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gTm9kZSgpIHt9XG5cbiAgTm9kZS5wcm90b3R5cGUuZW50aXR5ID0gbnVsbDtcblxuICBOb2RlLnByb3RvdHlwZS5wcmV2aW91cyA9IG51bGw7XG5cbiAgTm9kZS5wcm90b3R5cGUubmV4dCA9IG51bGw7XG5cbiAgcmV0dXJuIE5vZGU7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW5vZGUuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgU2lnbmFsMSwgYXNoO1xuXG5hc2ggPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuU2lnbmFsMSA9IGFzaC5zaWduYWxzLlNpZ25hbDE7XG5cblxuLypcbiAqIEEgY29sbGVjdGlvbiBvZiBub2Rlcy5cbiAqXG4gKiA8cD5TeXN0ZW1zIHdpdGhpbiB0aGUgZW5naW5lIGFjY2VzcyB0aGUgY29tcG9uZW50cyBvZiBlbnRpdGllcyB2aWEgTm9kZUxpc3RzLiBBIE5vZGVMaXN0IGNvbnRhaW5zXG4gKiBhIG5vZGUgZm9yIGVhY2ggRW50aXR5IGluIHRoZSBlbmdpbmUgdGhhdCBoYXMgYWxsIHRoZSBjb21wb25lbnRzIHJlcXVpcmVkIGJ5IHRoZSBub2RlLiBUbyBpdGVyYXRlXG4gKiBvdmVyIGEgTm9kZUxpc3QsIHN0YXJ0IGZyb20gdGhlIGhlYWQgYW5kIHN0ZXAgdG8gdGhlIG5leHQgb24gZWFjaCBsb29wLCB1bnRpbCB0aGUgcmV0dXJuZWQgdmFsdWVcbiAqIGlzIG51bGwuIE9yIGp1c3QgdXNlIGZvciBpbiBzeW50YXguPC9wPlxuICpcbiAqIDxwPmZvciAobm9kZSBpbiBub2RlTGlzdClcbiAqIHtcbiAqICAgLy8gZG8gc3R1ZmZcbiAqIH08L3A+XG4gKlxuICogPHA+SXQgaXMgc2FmZSB0byByZW1vdmUgaXRlbXMgZnJvbSBhIG5vZGVsaXN0IGR1cmluZyB0aGUgbG9vcC4gV2hlbiBhIE5vZGUgaXMgcmVtb3ZlZCBmb3JtIHRoZVxuICogTm9kZUxpc3QgaXQncyBwcmV2aW91cyBhbmQgbmV4dCBwcm9wZXJ0aWVzIHN0aWxsIHBvaW50IHRvIHRoZSBub2RlcyB0aGF0IHdlcmUgYmVmb3JlIGFuZCBhZnRlclxuICogaXQgaW4gdGhlIE5vZGVMaXN0IGp1c3QgYmVmb3JlIGl0IHdhcyByZW1vdmVkLjwvcD5cbiAqL1xuXG5hc2guY29yZS5Ob2RlTGlzdCA9IChmdW5jdGlvbigpIHtcblxuICAvKlxuICAgKiBUaGUgZmlyc3QgaXRlbSBpbiB0aGUgbm9kZSBsaXN0LCBvciBudWxsIGlmIHRoZSBsaXN0IGNvbnRhaW5zIG5vIG5vZGVzLlxuICAgKi9cbiAgTm9kZUxpc3QucHJvdG90eXBlLmhlYWQgPSBudWxsO1xuXG5cbiAgLypcbiAgICogVGhlIGxhc3QgaXRlbSBpbiB0aGUgbm9kZSBsaXN0LCBvciBudWxsIGlmIHRoZSBsaXN0IGNvbnRhaW5zIG5vIG5vZGVzLlxuICAgKi9cblxuICBOb2RlTGlzdC5wcm90b3R5cGUudGFpbCA9IG51bGw7XG5cblxuICAvKlxuICAgKiBBIHNpZ25hbCB0aGF0IGlzIGRpc3BhdGNoZWQgd2hlbmV2ZXIgYSBub2RlIGlzIGFkZGVkIHRvIHRoZSBub2RlIGxpc3QuXG4gICAqXG4gICAqIDxwPlRoZSBzaWduYWwgd2lsbCBwYXNzIGEgc2luZ2xlIHBhcmFtZXRlciB0byB0aGUgbGlzdGVuZXJzIC0gdGhlIG5vZGUgdGhhdCB3YXMgYWRkZWQuPC9wPlxuICAgKi9cblxuICBOb2RlTGlzdC5wcm90b3R5cGUubm9kZUFkZGVkID0gbnVsbDtcblxuXG4gIC8qXG4gICAqIEEgc2lnbmFsIHRoYXQgaXMgZGlzcGF0Y2hlZCB3aGVuZXZlciBhIG5vZGUgaXMgcmVtb3ZlZCBmcm9tIHRoZSBub2RlIGxpc3QuXG4gICAqXG4gICAqIDxwPlRoZSBzaWduYWwgd2lsbCBwYXNzIGEgc2luZ2xlIHBhcmFtZXRlciB0byB0aGUgbGlzdGVuZXJzIC0gdGhlIG5vZGUgdGhhdCB3YXMgcmVtb3ZlZC48L3A+XG4gICAqL1xuXG4gIE5vZGVMaXN0LnByb3RvdHlwZS5ub2RlUmVtb3ZlZCA9IG51bGw7XG5cbiAgZnVuY3Rpb24gTm9kZUxpc3QoKSB7XG4gICAgdGhpcy5ub2RlQWRkZWQgPSBuZXcgU2lnbmFsMSgpO1xuICAgIHRoaXMubm9kZVJlbW92ZWQgPSBuZXcgU2lnbmFsMSgpO1xuICB9XG5cbiAgTm9kZUxpc3QucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICBpZiAoIXRoaXMuaGVhZCkge1xuICAgICAgdGhpcy5oZWFkID0gdGhpcy50YWlsID0gbm9kZTtcbiAgICAgIG5vZGUubmV4dCA9IG5vZGUucHJldmlvdXMgPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnRhaWwubmV4dCA9IG5vZGU7XG4gICAgICBub2RlLnByZXZpb3VzID0gdGhpcy50YWlsO1xuICAgICAgbm9kZS5uZXh0ID0gbnVsbDtcbiAgICAgIHRoaXMudGFpbCA9IG5vZGU7XG4gICAgfVxuICAgIHRoaXMubm9kZUFkZGVkLmRpc3BhdGNoKG5vZGUpO1xuICB9O1xuXG4gIE5vZGVMaXN0LnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbihub2RlKSB7XG4gICAgaWYgKHRoaXMuaGVhZCA9PT0gbm9kZSkge1xuICAgICAgdGhpcy5oZWFkID0gdGhpcy5oZWFkLm5leHQ7XG4gICAgfVxuICAgIGlmICh0aGlzLnRhaWwgPT09IG5vZGUpIHtcbiAgICAgIHRoaXMudGFpbCA9IHRoaXMudGFpbC5wcmV2aW91cztcbiAgICB9XG4gICAgaWYgKG5vZGUucHJldmlvdXMpIHtcbiAgICAgIG5vZGUucHJldmlvdXMubmV4dCA9IG5vZGUubmV4dDtcbiAgICB9XG4gICAgaWYgKG5vZGUubmV4dCkge1xuICAgICAgbm9kZS5uZXh0LnByZXZpb3VzID0gbm9kZS5wcmV2aW91cztcbiAgICB9XG4gICAgdGhpcy5ub2RlUmVtb3ZlZC5kaXNwYXRjaChub2RlKTtcbiAgfTtcblxuICBOb2RlTGlzdC5wcm90b3R5cGUucmVtb3ZlQWxsID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG5vZGU7XG4gICAgd2hpbGUgKHRoaXMuaGVhZCkge1xuICAgICAgbm9kZSA9IHRoaXMuaGVhZDtcbiAgICAgIHRoaXMuaGVhZCA9IHRoaXMuaGVhZC5uZXh0O1xuICAgICAgbm9kZS5wcmV2aW91cyA9IG51bGw7XG4gICAgICBub2RlLm5leHQgPSBudWxsO1xuICAgICAgdGhpcy5ub2RlUmVtb3ZlZC5kaXNwYXRjaChub2RlKTtcbiAgICB9XG4gICAgdGhpcy50YWlsID0gbnVsbDtcbiAgfTtcblxuXG4gIC8qXG4gICAqIHRydWUgaWYgdGhlIGxpc3QgaXMgZW1wdHksIGZhbHNlIG90aGVyd2lzZS5cbiAgICovXG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoTm9kZUxpc3QucHJvdG90eXBlLCB7XG4gICAgZW1wdHk6IHtcbiAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhlYWQgPT09IG51bGw7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuXG4gIC8qXG4gICAqIFN3YXBzIHRoZSBwb3NpdGlvbnMgb2YgdHdvIG5vZGVzIGluIHRoZSBsaXN0LiBVc2VmdWwgd2hlbiBzb3J0aW5nIGEgbGlzdC5cbiAgICovXG5cbiAgTm9kZUxpc3QucHJvdG90eXBlLnN3YXAgPSBmdW5jdGlvbihub2RlMSwgbm9kZTIpIHtcbiAgICB2YXIgdGVtcDtcbiAgICBpZiAobm9kZTEucHJldmlvdXMgPT09IG5vZGUyKSB7XG4gICAgICBub2RlMS5wcmV2aW91cyA9IG5vZGUyLnByZXZpb3VzO1xuICAgICAgbm9kZTIucHJldmlvdXMgPSBub2RlMTtcbiAgICAgIG5vZGUyLm5leHQgPSBub2RlMS5uZXh0O1xuICAgICAgbm9kZTEubmV4dCA9IG5vZGUyO1xuICAgIH0gZWxzZSBpZiAobm9kZTIucHJldmlvdXMgPT09IG5vZGUxKSB7XG4gICAgICBub2RlMi5wcmV2aW91cyA9IG5vZGUxLnByZXZpb3VzO1xuICAgICAgbm9kZTEucHJldmlvdXMgPSBub2RlMjtcbiAgICAgIG5vZGUxLm5leHQgPSBub2RlMi5uZXh0O1xuICAgICAgbm9kZTIubmV4dCA9IG5vZGUxO1xuICAgIH0gZWxzZSB7XG4gICAgICB0ZW1wID0gbm9kZTEucHJldmlvdXM7XG4gICAgICBub2RlMS5wcmV2aW91cyA9IG5vZGUyLnByZXZpb3VzO1xuICAgICAgbm9kZTIucHJldmlvdXMgPSB0ZW1wO1xuICAgICAgdGVtcCA9IG5vZGUxLm5leHQ7XG4gICAgICBub2RlMS5uZXh0ID0gbm9kZTIubmV4dDtcbiAgICAgIG5vZGUyLm5leHQgPSB0ZW1wO1xuICAgIH1cbiAgICBpZiAodGhpcy5oZWFkID09PSBub2RlMSkge1xuICAgICAgdGhpcy5oZWFkID0gbm9kZTI7XG4gICAgfSBlbHNlIGlmICh0aGlzLmhlYWQgPT09IG5vZGUyKSB7XG4gICAgICB0aGlzLmhlYWQgPSBub2RlMTtcbiAgICB9XG4gICAgaWYgKHRoaXMudGFpbCA9PT0gbm9kZTEpIHtcbiAgICAgIHRoaXMudGFpbCA9IG5vZGUyO1xuICAgIH0gZWxzZSBpZiAodGhpcy50YWlsID09PSBub2RlMikge1xuICAgICAgdGhpcy50YWlsID0gbm9kZTE7XG4gICAgfVxuICAgIGlmIChub2RlMS5wcmV2aW91cyAhPT0gbnVsbCkge1xuICAgICAgbm9kZTEucHJldmlvdXMubmV4dCA9IG5vZGUxO1xuICAgIH1cbiAgICBpZiAobm9kZTIucHJldmlvdXMgIT09IG51bGwpIHtcbiAgICAgIG5vZGUyLnByZXZpb3VzLm5leHQgPSBub2RlMjtcbiAgICB9XG4gICAgaWYgKG5vZGUxLm5leHQgIT09IG51bGwpIHtcbiAgICAgIG5vZGUxLm5leHQucHJldmlvdXMgPSBub2RlMTtcbiAgICB9XG4gICAgaWYgKG5vZGUyLm5leHQgIT09IG51bGwpIHtcbiAgICAgIG5vZGUyLm5leHQucHJldmlvdXMgPSBub2RlMjtcbiAgICB9XG4gIH07XG5cblxuICAvKlxuICAgKiBQZXJmb3JtcyBhbiBpbnNlcnRpb24gc29ydCBvbiB0aGUgbm9kZSBsaXN0LiBJbiBnZW5lcmFsLCBpbnNlcnRpb24gc29ydCBpcyB2ZXJ5IGVmZmljaWVudCB3aXRoIHNob3J0IGxpc3RzXG4gICAqIGFuZCB3aXRoIGxpc3RzIHRoYXQgYXJlIG1vc3RseSBzb3J0ZWQsIGJ1dCBpcyBpbmVmZmljaWVudCB3aXRoIGxhcmdlIGxpc3RzIHRoYXQgYXJlIHJhbmRvbWx5IG9yZGVyZWQuXG4gICAqXG4gICAqIDxwPlRoZSBzb3J0IGZ1bmN0aW9uIHRha2VzIHR3byBub2RlcyBhbmQgcmV0dXJucyBhbiBJbnQuPC9wPlxuICAgKlxuICAgKiA8cD48Y29kZT5mdW5jdGlvbiBzb3J0RnVuY3Rpb24oIG5vZGUxIDogTW9ja05vZGUsIG5vZGUyIDogTW9ja05vZGUgKSA6IEludDwvY29kZT48L3A+XG4gICAqXG4gICAqIDxwPklmIHRoZSByZXR1cm5lZCBudW1iZXIgaXMgbGVzcyB0aGFuIHplcm8sIHRoZSBmaXJzdCBub2RlIHNob3VsZCBiZSBiZWZvcmUgdGhlIHNlY29uZC4gSWYgaXQgaXMgZ3JlYXRlclxuICAgKiB0aGFuIHplcm8gdGhlIHNlY29uZCBub2RlIHNob3VsZCBiZSBiZWZvcmUgdGhlIGZpcnN0LiBJZiBpdCBpcyB6ZXJvIHRoZSBvcmRlciBvZiB0aGUgbm9kZXMgZG9lc24ndCBtYXR0ZXJcbiAgICogYW5kIHRoZSBvcmlnaW5hbCBvcmRlciB3aWxsIGJlIHJldGFpbmVkLjwvcD5cbiAgICpcbiAgICogPHA+VGhpcyBpbnNlcnRpb24gc29ydCBpbXBsZW1lbnRhdGlvbiBydW5zIGluIHBsYWNlIHNvIG5vIG9iamVjdHMgYXJlIGNyZWF0ZWQgZHVyaW5nIHRoZSBzb3J0LjwvcD5cbiAgICovXG5cbiAgTm9kZUxpc3QucHJvdG90eXBlLmluc2VydGlvblNvcnQgPSBmdW5jdGlvbihzb3J0RnVuY3Rpb24pIHtcbiAgICB2YXIgbm9kZSwgb3RoZXIsIHJlbWFpbnM7XG4gICAgaWYgKHRoaXMuaGVhZCA9PT0gdGhpcy50YWlsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJlbWFpbnMgPSB0aGlzLmhlYWQubmV4dDtcbiAgICBub2RlID0gcmVtYWlucztcbiAgICB3aGlsZSAobm9kZSAhPT0gbnVsbCkge1xuICAgICAgcmVtYWlucyA9IG5vZGUubmV4dDtcbiAgICAgIG90aGVyID0gbm9kZS5wcmV2aW91cztcbiAgICAgIHdoaWxlIChvdGhlciAhPT0gbnVsbCkge1xuICAgICAgICBpZiAoc29ydEZ1bmN0aW9uKG5vZGUsIG90aGVyKSA+PSAwKSB7XG4gICAgICAgICAgaWYgKG5vZGUgIT09IG90aGVyLm5leHQpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnRhaWwgPT09IG5vZGUpIHtcbiAgICAgICAgICAgICAgdGhpcy50YWlsID0gbm9kZS5wcmV2aW91cztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5vZGUucHJldmlvdXMubmV4dCA9IG5vZGUubmV4dDtcbiAgICAgICAgICAgIGlmIChub2RlLm5leHQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgbm9kZS5uZXh0LnByZXZpb3VzID0gbm9kZS5wcmV2aW91cztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5vZGUubmV4dCA9IG90aGVyLm5leHQ7XG4gICAgICAgICAgICBub2RlLnByZXZpb3VzID0gb3RoZXI7XG4gICAgICAgICAgICBub2RlLm5leHQucHJldmlvdXMgPSBub2RlO1xuICAgICAgICAgICAgb3RoZXIubmV4dCA9IG5vZGU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIG90aGVyID0gb3RoZXIucHJldmlvdXM7XG4gICAgICB9XG4gICAgICBpZiAob3RoZXIgPT09IG51bGwpIHtcbiAgICAgICAgaWYgKHRoaXMudGFpbCA9PT0gbm9kZSkge1xuICAgICAgICAgIHRoaXMudGFpbCA9IG5vZGUucHJldmlvdXM7XG4gICAgICAgIH1cbiAgICAgICAgbm9kZS5wcmV2aW91cy5uZXh0ID0gbm9kZS5uZXh0O1xuICAgICAgICBpZiAobm9kZS5uZXh0ICE9PSBudWxsKSB7XG4gICAgICAgICAgbm9kZS5uZXh0LnByZXZpb3VzID0gbm9kZS5wcmV2aW91cztcbiAgICAgICAgfVxuICAgICAgICBub2RlLm5leHQgPSB0aGlzLmhlYWQ7XG4gICAgICAgIHRoaXMuaGVhZC5wcmV2aW91cyA9IG5vZGU7XG4gICAgICAgIG5vZGUucHJldmlvdXMgPSBudWxsO1xuICAgICAgICB0aGlzLmhlYWQgPSBub2RlO1xuICAgICAgfVxuICAgICAgbm9kZSA9IHJlbWFpbnM7XG4gICAgfVxuICB9O1xuXG5cbiAgLypcbiAgICogUGVyZm9ybXMgYSBtZXJnZSBzb3J0IG9uIHRoZSBub2RlIGxpc3QuIEluIGdlbmVyYWwsIG1lcmdlIHNvcnQgaXMgbW9yZSBlZmZpY2llbnQgdGhhbiBpbnNlcnRpb24gc29ydFxuICAgKiB3aXRoIGxvbmcgbGlzdHMgdGhhdCBhcmUgdmVyeSB1bnNvcnRlZC5cbiAgICpcbiAgICogPHA+VGhlIHNvcnQgZnVuY3Rpb24gdGFrZXMgdHdvIG5vZGVzIGFuZCByZXR1cm5zIGFuIEludC48L3A+XG4gICAqXG4gICAqIDxwPjxjb2RlPmZ1bmN0aW9uIHNvcnRGdW5jdGlvbiggbm9kZTEgOiBNb2NrTm9kZSwgbm9kZTIgOiBNb2NrTm9kZSApIDogSW50PC9jb2RlPjwvcD5cbiAgICpcbiAgICogPHA+SWYgdGhlIHJldHVybmVkIG51bWJlciBpcyBsZXNzIHRoYW4gemVybywgdGhlIGZpcnN0IG5vZGUgc2hvdWxkIGJlIGJlZm9yZSB0aGUgc2Vjb25kLiBJZiBpdCBpcyBncmVhdGVyXG4gICAqIHRoYW4gemVybyB0aGUgc2Vjb25kIG5vZGUgc2hvdWxkIGJlIGJlZm9yZSB0aGUgZmlyc3QuIElmIGl0IGlzIHplcm8gdGhlIG9yZGVyIG9mIHRoZSBub2RlcyBkb2Vzbid0IG1hdHRlci48L3A+XG4gICAqXG4gICAqIDxwPlRoaXMgbWVyZ2Ugc29ydCBpbXBsZW1lbnRhdGlvbiBjcmVhdGVzIGFuZCB1c2VzIGEgc2luZ2xlIFZlY3RvciBkdXJpbmcgdGhlIHNvcnQgb3BlcmF0aW9uLjwvcD5cbiAgICovXG5cbiAgTm9kZUxpc3QucHJvdG90eXBlLm1lcmdlU29ydCA9IGZ1bmN0aW9uKHNvcnRGdW5jdGlvbikge1xuICAgIHZhciBlbmQsIGxpc3RzLCBuZXh0LCBzdGFydDtcbiAgICBpZiAodGhpcy5oZWFkID09PSB0aGlzLnRhaWwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGlzdHMgPSBbXTtcbiAgICBzdGFydCA9IHRoaXMuaGVhZDtcbiAgICB3aGlsZSAoc3RhcnQgIT09IG51bGwpIHtcbiAgICAgIGVuZCA9IHN0YXJ0O1xuICAgICAgd2hpbGUgKGVuZC5uZXh0ICE9PSBudWxsICYmIHNvcnRGdW5jdGlvbihlbmQsIGVuZC5uZXh0KSA8PSAwKSB7XG4gICAgICAgIGVuZCA9IGVuZC5uZXh0O1xuICAgICAgfVxuICAgICAgbmV4dCA9IGVuZC5uZXh0O1xuICAgICAgc3RhcnQucHJldmlvdXMgPSBlbmQubmV4dCA9IG51bGw7XG4gICAgICBsaXN0cy5wdXNoKHN0YXJ0KTtcbiAgICAgIHN0YXJ0ID0gbmV4dDtcbiAgICB9XG4gICAgd2hpbGUgKGxpc3RzLmxlbmd0aCA+IDEpIHtcbiAgICAgIGxpc3RzLnB1c2godGhpcy5tZXJnZShsaXN0cy5zaGlmdCgpLCBsaXN0cy5zaGlmdCgpLCBzb3J0RnVuY3Rpb24pKTtcbiAgICB9XG4gICAgdGhpcy50YWlsID0gdGhpcy5oZWFkID0gbGlzdHNbMF07XG4gICAgd2hpbGUgKHRoaXMudGFpbC5uZXh0ICE9PSBudWxsKSB7XG4gICAgICB0aGlzLnRhaWwgPSB0aGlzLnRhaWwubmV4dDtcbiAgICB9XG4gIH07XG5cbiAgTm9kZUxpc3QucHJvdG90eXBlLm1lcmdlID0gZnVuY3Rpb24oaGVhZDEsIGhlYWQyLCBzb3J0RnVuY3Rpb24pIHtcbiAgICB2YXIgaGVhZCwgbm9kZTtcbiAgICBpZiAoc29ydEZ1bmN0aW9uKGhlYWQxLCBoZWFkMikgPD0gMCkge1xuICAgICAgaGVhZCA9IG5vZGUgPSBoZWFkMTtcbiAgICAgIGhlYWQxID0gaGVhZDEubmV4dDtcbiAgICB9IGVsc2Uge1xuICAgICAgaGVhZCA9IG5vZGUgPSBoZWFkMjtcbiAgICAgIGhlYWQyID0gaGVhZDIubmV4dDtcbiAgICB9XG4gICAgd2hpbGUgKGhlYWQxICE9PSBudWxsICYmIGhlYWQyICE9PSBudWxsKSB7XG4gICAgICBpZiAoc29ydEZ1bmN0aW9uKGhlYWQxLCBoZWFkMikgPD0gMCkge1xuICAgICAgICBub2RlLm5leHQgPSBoZWFkMTtcbiAgICAgICAgaGVhZDEucHJldmlvdXMgPSBub2RlO1xuICAgICAgICBub2RlID0gaGVhZDE7XG4gICAgICAgIGhlYWQxID0gaGVhZDEubmV4dDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5vZGUubmV4dCA9IGhlYWQyO1xuICAgICAgICBoZWFkMi5wcmV2aW91cyA9IG5vZGU7XG4gICAgICAgIG5vZGUgPSBoZWFkMjtcbiAgICAgICAgaGVhZDIgPSBoZWFkMi5uZXh0O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoaGVhZDEgIT09IG51bGwpIHtcbiAgICAgIG5vZGUubmV4dCA9IGhlYWQxO1xuICAgICAgaGVhZDEucHJldmlvdXMgPSBub2RlO1xuICAgIH0gZWxzZSB7XG4gICAgICBub2RlLm5leHQgPSBoZWFkMjtcbiAgICAgIGhlYWQyLnByZXZpb3VzID0gbm9kZTtcbiAgICB9XG4gICAgcmV0dXJuIGhlYWQ7XG4gIH07XG5cbiAgcmV0dXJuIE5vZGVMaXN0O1xuXG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1ub2RlX2xpc3QuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXNoO1xuXG5hc2ggPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuXG4vKlxuICogVGhpcyBpbnRlcm5hbCBjbGFzcyBtYWludGFpbnMgYSBwb29sIG9mIGRlbGV0ZWQgbm9kZXMgZm9yIHJldXNlIGJ5IHRoZSBmcmFtZXdvcmsuIFRoaXMgcmVkdWNlcyB0aGUgb3ZlcmhlYWRcbiAqIGZyb20gb2JqZWN0IGNyZWF0aW9uIGFuZCBnYXJiYWdlIGNvbGxlY3Rpb24uXG4gKlxuICogQmVjYXVzZSBub2RlcyBtYXkgYmUgZGVsZXRlZCBmcm9tIGEgTm9kZUxpc3Qgd2hpbGUgaW4gdXNlLCBieSBkZWxldGluZyBOb2RlcyBmcm9tIGEgTm9kZUxpc3RcbiAqIHdoaWxlIGl0ZXJhdGluZyB0aHJvdWdoIHRoZSBOb2RlTGlzdCwgdGhlIHBvb2wgYWxzbyBtYWludGFpbnMgYSBjYWNoZSBvZiBub2RlcyB0aGF0IGFyZSBhZGRlZCB0byB0aGUgcG9vbFxuICogYnV0IHNob3VsZCBub3QgYmUgcmV1c2VkIHlldC4gVGhleSBhcmUgdGhlbiByZWxlYXNlZCBpbnRvIHRoZSBwb29sIGJ5IGNhbGxpbmcgdGhlIHJlbGVhc2VDYWNoZSBtZXRob2QuXG4gKi9cblxuYXNoLmNvcmUuTm9kZVBvb2wgPSAoZnVuY3Rpb24oKSB7XG4gIE5vZGVQb29sLnByb3RvdHlwZS50YWlsID0gbnVsbDtcblxuICBOb2RlUG9vbC5wcm90b3R5cGUubm9kZUNsYXNzID0gbnVsbDtcblxuICBOb2RlUG9vbC5wcm90b3R5cGUuY2FjaGVUYWlsID0gbnVsbDtcblxuICBOb2RlUG9vbC5wcm90b3R5cGUuY29tcG9uZW50cyA9IG51bGw7XG5cblxuICAvKlxuICAgKiBDcmVhdGVzIGEgcG9vbCBmb3IgdGhlIGdpdmVuIG5vZGUgY2xhc3MuXG4gICAqL1xuXG4gIGZ1bmN0aW9uIE5vZGVQb29sKG5vZGVDbGFzcywgY29tcG9uZW50cykge1xuICAgIHRoaXMubm9kZUNsYXNzID0gbm9kZUNsYXNzO1xuICAgIHRoaXMuY29tcG9uZW50cyA9IGNvbXBvbmVudHM7XG4gIH1cblxuXG4gIC8qXG4gICAqIEZldGNoZXMgYSBub2RlIGZyb20gdGhlIHBvb2wuXG4gICAqL1xuXG4gIE5vZGVQb29sLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbm9kZTtcbiAgICBpZiAodGhpcy50YWlsKSB7XG4gICAgICBub2RlID0gdGhpcy50YWlsO1xuICAgICAgdGhpcy50YWlsID0gdGhpcy50YWlsLnByZXZpb3VzO1xuICAgICAgbm9kZS5wcmV2aW91cyA9IG51bGw7XG4gICAgICByZXR1cm4gbm9kZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG5ldyB0aGlzLm5vZGVDbGFzcygpO1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gICAqIEFkZHMgYSBub2RlIHRvIHRoZSBwb29sLlxuICAgKi9cblxuICBOb2RlUG9vbC5wcm90b3R5cGUuZGlzcG9zZSA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICB2YXIgY29tcG9uZW50TmFtZTtcbiAgICBmb3IgKGNvbXBvbmVudE5hbWUgaW4gdGhpcy5jb21wb25lbnRzKSB7XG4gICAgICBub2RlW2NvbXBvbmVudE5hbWVdID0gbnVsbDtcbiAgICB9XG4gICAgbm9kZS5lbnRpdHkgPSBudWxsO1xuICAgIG5vZGUubmV4dCA9IG51bGw7XG4gICAgbm9kZS5wcmV2aW91cyA9IHRoaXMudGFpbDtcbiAgICB0aGlzLnRhaWwgPSBub2RlO1xuICB9O1xuXG5cbiAgLypcbiAgICogQWRkcyBhIG5vZGUgdG8gdGhlIGNhY2hlXG4gICAqL1xuXG4gIE5vZGVQb29sLnByb3RvdHlwZS5jYWNoZSA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICBub2RlLnByZXZpb3VzID0gdGhpcy5jYWNoZVRhaWw7XG4gICAgdGhpcy5jYWNoZVRhaWwgPSBub2RlO1xuICB9O1xuXG5cbiAgLypcbiAgICogUmVsZWFzZXMgYWxsIG5vZGVzIGZyb20gdGhlIGNhY2hlIGludG8gdGhlIHBvb2xcbiAgICovXG5cbiAgTm9kZVBvb2wucHJvdG90eXBlLnJlbGVhc2VDYWNoZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBub2RlO1xuICAgIHdoaWxlICh0aGlzLmNhY2hlVGFpbCkge1xuICAgICAgbm9kZSA9IHRoaXMuY2FjaGVUYWlsO1xuICAgICAgdGhpcy5jYWNoZVRhaWwgPSBub2RlLnByZXZpb3VzO1xuICAgICAgdGhpcy5kaXNwb3NlKG5vZGUpO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gTm9kZVBvb2w7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW5vZGVfcG9vbC5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc2gsXG4gIF9fYmluZCA9IGZ1bmN0aW9uKGZuLCBtZSl7IHJldHVybiBmdW5jdGlvbigpeyByZXR1cm4gZm4uYXBwbHkobWUsIGFyZ3VtZW50cyk7IH07IH07XG5cbmFzaCA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5cbi8qXG4gKiBUaGUgYmFzZSBjbGFzcyBmb3IgYSBzeXN0ZW0uXG4gKlxuICogPHA+QSBzeXN0ZW0gaXMgcGFydCBvZiB0aGUgY29yZSBmdW5jdGlvbmFsaXR5IG9mIHRoZSBnYW1lLiBBZnRlciBhIHN5c3RlbSBpcyBhZGRlZCB0byB0aGUgZW5naW5lLCBpdHNcbiAqIHVwZGF0ZSBtZXRob2Qgd2lsbCBiZSBjYWxsZWQgb24gZXZlcnkgZnJhbWUgb2YgdGhlIGVuZ2luZS4gV2hlbiB0aGUgc3lzdGVtIGlzIHJlbW92ZWQgZnJvbSB0aGUgZW5naW5lLFxuICogdGhlIHVwZGF0ZSBtZXRob2QgaXMgbm8gbG9uZ2VyIGNhbGxlZC48L3A+XG4gKlxuICogPHA+VGhlIGFnZ3JlZ2F0ZSBvZiBhbGwgc3lzdGVtcyBpbiB0aGUgZW5naW5lIGlzIHRoZSBmdW5jdGlvbmFsaXR5IG9mIHRoZSBnYW1lLCB3aXRoIHRoZSB1cGRhdGVcbiAqIG1ldGhvZHMgb2YgdGhvc2Ugc3lzdGVtcyBjb2xsZWN0aXZlbHkgY29uc3RpdHV0aW5nIHRoZSBlbmdpbmUgdXBkYXRlIGxvb3AuIFN5c3RlbXMgZ2VuZXJhbGx5IG9wZXJhdGUgb25cbiAqIG5vZGUgbGlzdHMgLSBjb2xsZWN0aW9ucyBvZiBub2Rlcy4gRWFjaCBub2RlIGNvbnRhaW5zIHRoZSBjb21wb25lbnRzIGZyb20gYW4gZW50aXR5IGluIHRoZSBlbmdpbmVcbiAqIHRoYXQgbWF0Y2ggdGhlIG5vZGUuPC9wPlxuICovXG5cbmFzaC5jb3JlLlN5c3RlbSA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gU3lzdGVtKCkge1xuICAgIHRoaXMudXBkYXRlID0gX19iaW5kKHRoaXMudXBkYXRlLCB0aGlzKTtcbiAgfVxuXG5cbiAgLypcbiAgICAqIFVzZWQgaW50ZXJuYWxseSB0byBtYW5hZ2UgdGhlIGxpc3Qgb2Ygc3lzdGVtcyB3aXRoaW4gdGhlIGVuZ2luZS4gVGhlIHByZXZpb3VzIHN5c3RlbSBpbiB0aGUgbGlzdC5cbiAgICovXG5cbiAgU3lzdGVtLnByb3RvdHlwZS5wcmV2aW91cyA9IG51bGw7XG5cblxuICAvKlxuICAgKiBVc2VkIGludGVybmFsbHkgdG8gbWFuYWdlIHRoZSBsaXN0IG9mIHN5c3RlbXMgd2l0aGluIHRoZSBlbmdpbmUuIFRoZSBuZXh0IHN5c3RlbSBpbiB0aGUgbGlzdC5cbiAgICovXG5cbiAgU3lzdGVtLnByb3RvdHlwZS5uZXh0ID0gbnVsbDtcblxuXG4gIC8qXG4gICAqIFVzZWQgaW50ZXJuYWxseSB0byBob2xkIHRoZSBwcmlvcml0eSBvZiB0aGlzIHN5c3RlbSB3aXRoaW4gdGhlIHN5c3RlbSBsaXN0LiBUaGlzIGlzXG4gICAqIHVzZWQgdG8gb3JkZXIgdGhlIHN5c3RlbXMgc28gdGhleSBhcmUgdXBkYXRlZCBpbiB0aGUgY29ycmVjdCBvcmRlci5cbiAgICovXG5cbiAgU3lzdGVtLnByb3RvdHlwZS5wcmlvcml0eSA9IDA7XG5cblxuICAvKlxuICAgKiBDYWxsZWQganVzdCBhZnRlciB0aGUgc3lzdGVtIGlzIGFkZGVkIHRvIHRoZSBlbmdpbmUsIGJlZm9yZSBhbnkgY2FsbHMgdG8gdGhlIHVwZGF0ZSBtZXRob2QuXG4gICAqIE92ZXJyaWRlIHRoaXMgbWV0aG9kIHRvIGFkZCB5b3VyIG93biBmdW5jdGlvbmFsaXR5LlxuICAgKlxuICAgKiBAcGFyYW0gZW5naW5lIFRoZSBlbmdpbmUgdGhlIHN5c3RlbSB3YXMgYWRkZWQgdG8uXG4gICAqL1xuXG4gIFN5c3RlbS5wcm90b3R5cGUuYWRkVG9FbmdpbmUgPSBmdW5jdGlvbihlbmdpbmUpIHt9O1xuXG5cbiAgLypcbiAgICogQ2FsbGVkIGp1c3QgYWZ0ZXIgdGhlIHN5c3RlbSBpcyByZW1vdmVkIGZyb20gdGhlIGVuZ2luZSwgYWZ0ZXIgYWxsIGNhbGxzIHRvIHRoZSB1cGRhdGUgbWV0aG9kLlxuICAgKiBPdmVycmlkZSB0aGlzIG1ldGhvZCB0byBhZGQgeW91ciBvd24gZnVuY3Rpb25hbGl0eS5cbiAgICpcbiAgICogQHBhcmFtIGVuZ2luZSBUaGUgZW5naW5lIHRoZSBzeXN0ZW0gd2FzIHJlbW92ZWQgZnJvbS5cbiAgICovXG5cbiAgU3lzdGVtLnByb3RvdHlwZS5yZW1vdmVGcm9tRW5naW5lID0gZnVuY3Rpb24oZW5naW5lKSB7fTtcblxuXG4gIC8qXG4gICAqIEFmdGVyIHRoZSBzeXN0ZW0gaXMgYWRkZWQgdG8gdGhlIGVuZ2luZSwgdGhpcyBtZXRob2QgaXMgY2FsbGVkIGV2ZXJ5IGZyYW1lIHVudGlsIHRoZSBzeXN0ZW1cbiAgICogaXMgcmVtb3ZlZCBmcm9tIHRoZSBlbmdpbmUuIE92ZXJyaWRlIHRoaXMgbWV0aG9kIHRvIGFkZCB5b3VyIG93biBmdW5jdGlvbmFsaXR5LlxuICAgKlxuICAgKiA8cD5JZiB5b3UgbmVlZCB0byBwZXJmb3JtIGFuIGFjdGlvbiBvdXRzaWRlIG9mIHRoZSB1cGRhdGUgbG9vcCAoZS5nLiB5b3UgbmVlZCB0byBjaGFuZ2UgdGhlXG4gICAqIHN5c3RlbXMgaW4gdGhlIGVuZ2luZSBhbmQgeW91IGRvbid0IHdhbnQgdG8gZG8gaXQgd2hpbGUgdGhleSdyZSB1cGRhdGluZykgYWRkIGEgbGlzdGVuZXIgdG9cbiAgICogdGhlIGVuZ2luZSdzIHVwZGF0ZUNvbXBsZXRlIHNpZ25hbCB0byBiZSBub3RpZmllZCB3aGVuIHRoZSB1cGRhdGUgbG9vcCBjb21wbGV0ZXMuPC9wPlxuICAgKlxuICAgKiBAcGFyYW0gdGltZSBUaGUgZHVyYXRpb24sIGluIHNlY29uZHMsIG9mIHRoZSBmcmFtZS5cbiAgICovXG5cbiAgU3lzdGVtLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbih0aW1lKSB7fTtcblxuICByZXR1cm4gU3lzdGVtO1xuXG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zeXN0ZW0uanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXNoO1xuXG5hc2ggPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuXG4vKlxuICogVXNlZCBpbnRlcm5hbGx5LCB0aGlzIGlzIGFuIG9yZGVyZWQgbGlzdCBvZiBTeXN0ZW1zIGZvciB1c2UgYnkgdGhlIGVuZ2luZSB1cGRhdGUgbG9vcC5cbiAqL1xuXG5hc2guY29yZS5TeXN0ZW1MaXN0ID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBTeXN0ZW1MaXN0KCkge31cblxuICBTeXN0ZW1MaXN0LnByb3RvdHlwZS5oZWFkID0gbnVsbDtcblxuICBTeXN0ZW1MaXN0LnByb3RvdHlwZS50YWlsID0gbnVsbDtcblxuICBTeXN0ZW1MaXN0LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbihzeXN0ZW0pIHtcbiAgICB2YXIgbm9kZTtcbiAgICBpZiAoIXRoaXMuaGVhZCkge1xuICAgICAgdGhpcy5oZWFkID0gdGhpcy50YWlsID0gc3lzdGVtO1xuICAgICAgc3lzdGVtLm5leHQgPSBzeXN0ZW0ucHJldmlvdXMgPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICBub2RlID0gdGhpcy50YWlsO1xuICAgICAgd2hpbGUgKG5vZGUpIHtcbiAgICAgICAgaWYgKG5vZGUucHJpb3JpdHkgPD0gc3lzdGVtLnByaW9yaXR5KSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgbm9kZSA9IG5vZGUucHJldmlvdXM7XG4gICAgICB9XG4gICAgICBpZiAobm9kZSA9PT0gdGhpcy50YWlsKSB7XG4gICAgICAgIHRoaXMudGFpbC5uZXh0ID0gc3lzdGVtO1xuICAgICAgICBzeXN0ZW0ucHJldmlvdXMgPSB0aGlzLnRhaWw7XG4gICAgICAgIHN5c3RlbS5uZXh0ID0gbnVsbDtcbiAgICAgICAgdGhpcy50YWlsID0gc3lzdGVtO1xuICAgICAgfSBlbHNlIGlmICghbm9kZSkge1xuICAgICAgICBzeXN0ZW0ubmV4dCA9IHRoaXMuaGVhZDtcbiAgICAgICAgc3lzdGVtLnByZXZpb3VzID0gbnVsbDtcbiAgICAgICAgdGhpcy5oZWFkLnByZXZpb3VzID0gc3lzdGVtO1xuICAgICAgICB0aGlzLmhlYWQgPSBzeXN0ZW07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzeXN0ZW0ubmV4dCA9IG5vZGUubmV4dDtcbiAgICAgICAgc3lzdGVtLnByZXZpb3VzID0gbm9kZTtcbiAgICAgICAgbm9kZS5uZXh0LnByZXZpb3VzID0gc3lzdGVtO1xuICAgICAgICBub2RlLm5leHQgPSBzeXN0ZW07XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIFN5c3RlbUxpc3QucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uKHN5c3RlbSkge1xuICAgIGlmICh0aGlzLmhlYWQgPT09IHN5c3RlbSkge1xuICAgICAgdGhpcy5oZWFkID0gdGhpcy5oZWFkLm5leHQ7XG4gICAgfVxuICAgIGlmICh0aGlzLnRhaWwgPT09IHN5c3RlbSkge1xuICAgICAgdGhpcy50YWlsID0gdGhpcy50YWlsLnByZXZpb3VzO1xuICAgIH1cbiAgICBpZiAoc3lzdGVtLnByZXZpb3VzKSB7XG4gICAgICBzeXN0ZW0ucHJldmlvdXMubmV4dCA9IHN5c3RlbS5uZXh0O1xuICAgIH1cbiAgICBpZiAoc3lzdGVtLm5leHQpIHtcbiAgICAgIHN5c3RlbS5uZXh0LnByZXZpb3VzID0gc3lzdGVtLnByZXZpb3VzO1xuICAgIH1cbiAgfTtcblxuICBTeXN0ZW1MaXN0LnByb3RvdHlwZS5yZW1vdmVBbGwgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc3lzdGVtO1xuICAgIHdoaWxlICh0aGlzLmhlYWQpIHtcbiAgICAgIHN5c3RlbSA9IHRoaXMuaGVhZDtcbiAgICAgIHRoaXMuaGVhZCA9IHRoaXMuaGVhZC5uZXh0O1xuICAgICAgc3lzdGVtLnByZXZpb3VzID0gbnVsbDtcbiAgICAgIHN5c3RlbS5uZXh0ID0gbnVsbDtcbiAgICB9XG4gICAgdGhpcy50YWlsID0gbnVsbDtcbiAgfTtcblxuICBTeXN0ZW1MaXN0LnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gICAgdmFyIHN5c3RlbTtcbiAgICBzeXN0ZW0gPSB0aGlzLmhlYWQ7XG4gICAgd2hpbGUgKHN5c3RlbSkge1xuICAgICAgaWYgKHN5c3RlbS5jb25zdHJ1Y3RvciA9PT0gdHlwZSkge1xuICAgICAgICByZXR1cm4gc3lzdGVtO1xuICAgICAgfVxuICAgICAgc3lzdGVtID0gc3lzdGVtLm5leHQ7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9O1xuXG4gIHJldHVybiBTeXN0ZW1MaXN0O1xuXG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zeXN0ZW1fbGlzdC5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc2g7XG5cbmFzaCA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5cbi8qXG4gKiBUaGlzIGNvbXBvbmVudCBwcm92aWRlciBhbHdheXMgcmV0dXJucyB0aGUgc2FtZSBpbnN0YW5jZSBvZiB0aGUgY29tcG9uZW50LiBUaGUgaW5zdGFuY2VcbiAqIGlzIHBhc3NlZCB0byB0aGUgcHJvdmlkZXIgYXQgaW5pdGlhbGlzYXRpb24uXG4gKi9cblxuYXNoLmZzbS5Db21wb25lbnRJbnN0YW5jZVByb3ZpZGVyID0gKGZ1bmN0aW9uKCkge1xuICBDb21wb25lbnRJbnN0YW5jZVByb3ZpZGVyLnByb3RvdHlwZS5pbnN0YW5jZSA9IG51bGw7XG5cblxuICAvKlxuICAgKiBDb25zdHJ1Y3RvclxuICAgKlxuICAgKiBAcGFyYW0gaW5zdGFuY2UgVGhlIGluc3RhbmNlIHRvIHJldHVybiB3aGVuZXZlciBhIGNvbXBvbmVudCBpcyByZXF1ZXN0ZWQuXG4gICAqL1xuXG4gIGZ1bmN0aW9uIENvbXBvbmVudEluc3RhbmNlUHJvdmlkZXIoaW5zdGFuY2UpIHtcbiAgICB0aGlzLmluc3RhbmNlID0gaW5zdGFuY2U7XG4gIH1cblxuXG4gIC8qXG4gICAqIFVzZWQgdG8gcmVxdWVzdCBhIGNvbXBvbmVudCBmcm9tIHRoaXMgcHJvdmlkZXJcbiAgICpcbiAgICogQHJldHVybiBUaGUgaW5zdGFuY2VcbiAgICovXG5cbiAgQ29tcG9uZW50SW5zdGFuY2VQcm92aWRlci5wcm90b3R5cGUuZ2V0Q29tcG9uZW50ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5zdGFuY2U7XG4gIH07XG5cblxuICAvKlxuICAgKiBVc2VkIHRvIGNvbXBhcmUgdGhpcyBwcm92aWRlciB3aXRoIG90aGVycy4gQW55IHByb3ZpZGVyIHRoYXQgcmV0dXJucyB0aGUgc2FtZSBjb21wb25lbnRcbiAgICogaW5zdGFuY2Ugd2lsbCBiZSByZWdhcmRlZCBhcyBlcXVpdmFsZW50LlxuICAgKlxuICAgKiBAcmV0dXJuIFRoZSBpbnN0YW5jZVxuICAgKi9cblxuICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhDb21wb25lbnRJbnN0YW5jZVByb3ZpZGVyLnByb3RvdHlwZSwge1xuICAgIGlkZW50aWZpZXI6IHtcbiAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIENvbXBvbmVudEluc3RhbmNlUHJvdmlkZXI7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNvbXBvbmVudF9pbnN0YW5jZV9wcm92aWRlci5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc2g7XG5cbmFzaCA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5hc2guZnNtLkNvbXBvbmVudFNpbmdsZXRvblByb3ZpZGVyID0gKGZ1bmN0aW9uKCkge1xuICBDb21wb25lbnRTaW5nbGV0b25Qcm92aWRlci5wcm90b3R5cGUuY29tcG9uZW50VHlwZSA9IG51bGw7XG5cbiAgQ29tcG9uZW50U2luZ2xldG9uUHJvdmlkZXIucHJvdG90eXBlLmluc3RhbmNlID0gbnVsbDtcblxuXG4gIC8qXG4gICAqIENvbnN0cnVjdG9yXG4gICAqXG4gICAqIEBwYXJhbSB0eXBlIFRoZSB0eXBlIG9mIHRoZSBzaW5nbGUgaW5zdGFuY2VcbiAgICovXG5cbiAgZnVuY3Rpb24gQ29tcG9uZW50U2luZ2xldG9uUHJvdmlkZXIodHlwZSkge1xuICAgIHRoaXMuY29tcG9uZW50VHlwZSA9IHR5cGU7XG5cbiAgICAvKlxuICAgICAqIFVzZWQgdG8gcmVxdWVzdCBhIGNvbXBvbmVudCBmcm9tIHRoaXMgcHJvdmlkZXJcbiAgICAgKlxuICAgICAqIEByZXR1cm4gVGhlIGluc3RhbmNlXG4gICAgICovXG4gIH1cblxuICBDb21wb25lbnRTaW5nbGV0b25Qcm92aWRlci5wcm90b3R5cGUuZ2V0Q29tcG9uZW50ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuaW5zdGFuY2UgPT0gbnVsbCkge1xuICAgICAgdGhpcy5pbnN0YW5jZSA9IG5ldyB0aGlzLmNvbXBvbmVudFR5cGUoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuaW5zdGFuY2U7XG4gIH07XG5cblxuICAvKlxuICAgKiBVc2VkIHRvIGNvbXBhcmUgdGhpcyBwcm92aWRlciB3aXRoIG90aGVycy4gQW55IHByb3ZpZGVyIHRoYXQgcmV0dXJucyB0aGUgc2FtZSBjb21wb25lbnRcbiAgICogaW5zdGFuY2Ugd2lsbCBiZSByZWdhcmRlZCBhcyBlcXVpdmFsZW50LlxuICAgKlxuICAgKiBAcmV0dXJuIFRoZSBpbnN0YW5jZVxuICAgKi9cblxuICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhDb21wb25lbnRTaW5nbGV0b25Qcm92aWRlci5wcm90b3R5cGUsIHtcbiAgICBpZGVudGlmaWVyOiB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRDb21wb25lbnQoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBDb21wb25lbnRTaW5nbGV0b25Qcm92aWRlcjtcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29tcG9uZW50X3NpbmdsZXRvbl9wcm92aWRlci5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc2g7XG5cbmFzaCA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5hc2guZnNtLkNvbXBvbmVudFR5cGVQcm92aWRlciA9IChmdW5jdGlvbigpIHtcbiAgQ29tcG9uZW50VHlwZVByb3ZpZGVyLnByb3RvdHlwZS5jb21wb25lbnRUeXBlID0gbnVsbDtcblxuXG4gIC8qXG4gICAqIENvbnN0cnVjdG9yXG4gICAqXG4gICAqIEBwYXJhbSB0eXBlIFRoZSB0eXBlIG9mIHRoZSBzaW5nbGUgaW5zdGFuY2VcbiAgICovXG5cbiAgZnVuY3Rpb24gQ29tcG9uZW50VHlwZVByb3ZpZGVyKHR5cGUpIHtcbiAgICB0aGlzLmNvbXBvbmVudFR5cGUgPSB0eXBlO1xuICB9XG5cblxuICAvKlxuICAgKiBVc2VkIHRvIHJlcXVlc3QgYSBjb21wb25lbnQgZnJvbSB0aGlzIHByb3ZpZGVyXG4gICAqXG4gICAqIEByZXR1cm4gVGhlIGluc3RhbmNlXG4gICAqL1xuXG4gIENvbXBvbmVudFR5cGVQcm92aWRlci5wcm90b3R5cGUuZ2V0Q29tcG9uZW50ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyB0aGlzLmNvbXBvbmVudFR5cGUoKTtcbiAgfTtcblxuXG4gIC8qXG4gICAqIFVzZWQgdG8gY29tcGFyZSB0aGlzIHByb3ZpZGVyIHdpdGggb3RoZXJzLiBBbnkgcHJvdmlkZXIgdGhhdCByZXR1cm5zIHRoZSBzYW1lIGNvbXBvbmVudFxuICAgKiBpbnN0YW5jZSB3aWxsIGJlIHJlZ2FyZGVkIGFzIGVxdWl2YWxlbnQuXG4gICAqXG4gICAqIEByZXR1cm4gVGhlIGluc3RhbmNlXG4gICAqL1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKENvbXBvbmVudFR5cGVQcm92aWRlci5wcm90b3R5cGUsIHtcbiAgICBpZGVudGlmaWVyOiB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb21wb25lbnRUeXBlO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIENvbXBvbmVudFR5cGVQcm92aWRlcjtcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29tcG9uZW50X3R5cGVfcHJvdmlkZXIuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXNoO1xuXG5hc2ggPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuYXNoLmZzbS5EeW5hbWljQ29tcG9uZW50UHJvdmlkZXIgPSAoZnVuY3Rpb24oKSB7XG4gIER5bmFtaWNDb21wb25lbnRQcm92aWRlci5wcm90b3R5cGUuX2Nsb3N1cmUgPSBudWxsO1xuXG5cbiAgLypcbiAgICogQ29uc3RydWN0b3JcbiAgICpcbiAgICogQHBhcmFtIGNsb3N1cmUgVGhlIGZ1bmN0aW9uIHRoYXQgd2lsbCByZXR1cm4gdGhlIGNvbXBvbmVudCBpbnN0YW5jZSB3aGVuIGNhbGxlZC5cbiAgICovXG5cbiAgZnVuY3Rpb24gRHluYW1pY0NvbXBvbmVudFByb3ZpZGVyKGNsb3N1cmUpIHtcbiAgICB0aGlzLl9jbG9zdXJlID0gY2xvc3VyZTtcblxuICAgIC8qXG4gICAgICogVXNlZCB0byByZXF1ZXN0IGEgY29tcG9uZW50IGZyb20gdGhpcyBwcm92aWRlclxuICAgICAqXG4gICAgICogQHJldHVybiBUaGUgaW5zdGFuY2VcbiAgICAgKi9cbiAgfVxuXG4gIER5bmFtaWNDb21wb25lbnRQcm92aWRlci5wcm90b3R5cGUuZ2V0Q29tcG9uZW50ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Nsb3N1cmU7XG4gIH07XG5cblxuICAvKlxuICAgKiBVc2VkIHRvIGNvbXBhcmUgdGhpcyBwcm92aWRlciB3aXRoIG90aGVycy4gQW55IHByb3ZpZGVyIHRoYXQgcmV0dXJucyB0aGUgc2FtZSBjb21wb25lbnRcbiAgICogaW5zdGFuY2Ugd2lsbCBiZSByZWdhcmRlZCBhcyBlcXVpdmFsZW50LlxuICAgKlxuICAgKiBAcmV0dXJuIFRoZSBpbnN0YW5jZVxuICAgKi9cblxuICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhEeW5hbWljQ29tcG9uZW50UHJvdmlkZXIucHJvdG90eXBlLCB7XG4gICAgaWRlbnRpZmllcjoge1xuICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Nsb3N1cmU7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gRHluYW1pY0NvbXBvbmVudFByb3ZpZGVyO1xuXG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1keW5hbWljX2NvbXBvbmVudF9wcm92aWRlci5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc2g7XG5cbmFzaCA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5cbi8qXG4gKiBUaGlzIFN5c3RlbSBwcm92aWRlciByZXR1cm5zIHJlc3VsdHMgb2YgYSBtZXRob2QgY2FsbC4gVGhlIG1ldGhvZFxuICogaXMgcGFzc2VkIHRvIHRoZSBwcm92aWRlciBhdCBpbml0aWFsaXNhdGlvbi5cbiAqL1xuXG5hc2guZnNtLkR5bmFtaWNTeXN0ZW1Qcm92aWRlciA9IChmdW5jdGlvbigpIHtcbiAgRHluYW1pY1N5c3RlbVByb3ZpZGVyLnByb3RvdHlwZS5tZXRob2QgPSBmdW5jdGlvbigpIHt9O1xuXG4gIER5bmFtaWNTeXN0ZW1Qcm92aWRlci5wcm90b3R5cGUuc3lzdGVtUHJpb3JpdHkgPSAwO1xuXG5cbiAgLypcbiAgICogQ29uc3RydWN0b3JcbiAgICpcbiAgICogQHBhcmFtIG1ldGhvZCBUaGUgbWV0aG9kIHRoYXQgcmV0dXJucyB0aGUgU3lzdGVtIGluc3RhbmNlO1xuICAgKi9cblxuICBmdW5jdGlvbiBEeW5hbWljU3lzdGVtUHJvdmlkZXIobWV0aG9kKSB7XG4gICAgdGhpcy5tZXRob2QgPSBtZXRob2Q7XG4gIH1cblxuXG4gIC8qXG4gICAqIFVzZWQgdG8gY29tcGFyZSB0aGlzIHByb3ZpZGVyIHdpdGggb3RoZXJzLiBBbnkgcHJvdmlkZXIgdGhhdCByZXR1cm5zIHRoZSBzYW1lIGNvbXBvbmVudFxuICAgKiBpbnN0YW5jZSB3aWxsIGJlIHJlZ2FyZGVkIGFzIGVxdWl2YWxlbnQuXG4gICAqXG4gICAqIEByZXR1cm4gVGhlIG1ldGhvZCB1c2VkIHRvIGNhbGwgdGhlIFN5c3RlbSBpbnN0YW5jZXNcbiAgICovXG5cbiAgRHluYW1pY1N5c3RlbVByb3ZpZGVyLnByb3RvdHlwZS5nZXRTeXN0ZW0gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5tZXRob2QoKTtcbiAgfTtcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhEeW5hbWljU3lzdGVtUHJvdmlkZXIucHJvdG90eXBlLCB7XG5cbiAgICAvKlxuICAgICAqIFRoZSBwcmlvcml0eSBhdCB3aGljaCB0aGUgU3lzdGVtIHNob3VsZCBiZSBhZGRlZCB0byB0aGUgRW5naW5lXG4gICAgICovXG4gICAgaWRlbnRpZmllcjoge1xuICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWV0aG9kO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIFRoZSBwcmlvcml0eSBhdCB3aGljaCB0aGUgU3lzdGVtIHNob3VsZCBiZSBhZGRlZCB0byB0aGUgRW5naW5lXG4gICAgICovXG4gICAgcHJpb3JpdHk6IHtcbiAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN5c3RlbVByaW9yaXR5O1xuICAgICAgfSxcbiAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3lzdGVtUHJpb3JpdHkgPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBEeW5hbWljU3lzdGVtUHJvdmlkZXI7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWR5bmFtaWNfc3lzdGVtX3Byb3ZpZGVyLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIER5bmFtaWNTeXN0ZW1Qcm92aWRlciwgU3RhdGVTeXN0ZW1NYXBwaW5nLCBTeXN0ZW1JbnN0YW5jZVByb3ZpZGVyLCBTeXN0ZW1TaW5nbGV0b25Qcm92aWRlciwgYXNoO1xuXG5hc2ggPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuU3lzdGVtSW5zdGFuY2VQcm92aWRlciA9IGFzaC5mc20uU3lzdGVtSW5zdGFuY2VQcm92aWRlcjtcblxuU3lzdGVtU2luZ2xldG9uUHJvdmlkZXIgPSBhc2guZnNtLlN5c3RlbVNpbmdsZXRvblByb3ZpZGVyO1xuXG5EeW5hbWljU3lzdGVtUHJvdmlkZXIgPSBhc2guZnNtLkR5bmFtaWNTeXN0ZW1Qcm92aWRlcjtcblxuU3RhdGVTeXN0ZW1NYXBwaW5nID0gYXNoLmZzbS5TdGF0ZVN5c3RlbU1hcHBpbmc7XG5cblxuLypcbiAqIFJlcHJlc2VudHMgYSBzdGF0ZSBmb3IgYSBTeXN0ZW1TdGF0ZU1hY2hpbmUuIFRoZSBzdGF0ZSBjb250YWlucyBhbnkgbnVtYmVyIG9mIFN5c3RlbVByb3ZpZGVycyB3aGljaFxuICogYXJlIHVzZWQgdG8gYWRkIFN5c3RlbXMgdG8gdGhlIEVuZ2luZSB3aGVuIHRoaXMgc3RhdGUgaXMgZW50ZXJlZC5cbiAqL1xuXG5hc2guZnNtLkVuZ2luZVN0YXRlID0gKGZ1bmN0aW9uKCkge1xuICBFbmdpbmVTdGF0ZS5wcm90b3R5cGUucHJvdmlkZXJzID0gbnVsbDtcblxuICBmdW5jdGlvbiBFbmdpbmVTdGF0ZSgpIHtcbiAgICB0aGlzLnByb3ZpZGVycyA9IFtdO1xuICB9XG5cblxuICAvKlxuICAgKiBDcmVhdGVzIGEgbWFwcGluZyBmb3IgdGhlIFN5c3RlbSB0eXBlIHRvIGEgc3BlY2lmaWMgU3lzdGVtIGluc3RhbmNlLiBBXG4gICAqIFN5c3RlbUluc3RhbmNlUHJvdmlkZXIgaXMgdXNlZCBmb3IgdGhlIG1hcHBpbmcuXG4gICAqXG4gICAqIEBwYXJhbSBzeXN0ZW0gVGhlIFN5c3RlbSBpbnN0YW5jZSB0byB1c2UgZm9yIHRoZSBtYXBwaW5nXG4gICAqIEByZXR1cm4gVGhpcyBTdGF0ZVN5c3RlbU1hcHBpbmcsIHNvIG1vcmUgbW9kaWZpY2F0aW9ucyBjYW4gYmUgYXBwbGllZFxuICAgKi9cblxuICBFbmdpbmVTdGF0ZS5wcm90b3R5cGUuYWRkSW5zdGFuY2UgPSBmdW5jdGlvbihzeXN0ZW0pIHtcbiAgICByZXR1cm4gdGhpcy5hZGRQcm92aWRlcihuZXcgU3lzdGVtSW5zdGFuY2VQcm92aWRlcihzeXN0ZW0pKTtcbiAgfTtcblxuXG4gIC8qXG4gICAqIENyZWF0ZXMgYSBtYXBwaW5nIGZvciB0aGUgU3lzdGVtIHR5cGUgdG8gYSBzaW5nbGUgaW5zdGFuY2Ugb2YgdGhlIHByb3ZpZGVkIHR5cGUuXG4gICAqIFRoZSBpbnN0YW5jZSBpcyBub3QgY3JlYXRlZCB1bnRpbCBpdCBpcyBmaXJzdCByZXF1ZXN0ZWQuIFRoZSB0eXBlIHNob3VsZCBiZSB0aGUgc2FtZVxuICAgKiBhcyBvciBleHRlbmQgdGhlIHR5cGUgZm9yIHRoaXMgbWFwcGluZy4gQSBTeXN0ZW1TaW5nbGV0b25Qcm92aWRlciBpcyB1c2VkIGZvclxuICAgKiB0aGUgbWFwcGluZy5cbiAgICpcbiAgICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgb2YgdGhlIHNpbmdsZSBpbnN0YW5jZSB0byBiZSBjcmVhdGVkLiBJZiBvbWl0dGVkLCB0aGUgdHlwZSBvZiB0aGVcbiAgICogbWFwcGluZyBpcyB1c2VkLlxuICAgKiBAcmV0dXJuIFRoaXMgU3RhdGVTeXN0ZW1NYXBwaW5nLCBzbyBtb3JlIG1vZGlmaWNhdGlvbnMgY2FuIGJlIGFwcGxpZWRcbiAgICovXG5cbiAgRW5naW5lU3RhdGUucHJvdG90eXBlLmFkZFNpbmdsZXRvbiA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgICByZXR1cm4gdGhpcy5hZGRQcm92aWRlcihuZXcgU3lzdGVtU2luZ2xldG9uUHJvdmlkZXIodHlwZSkpO1xuICB9O1xuXG5cbiAgLypcbiAgICogQ3JlYXRlcyBhIG1hcHBpbmcgZm9yIHRoZSBTeXN0ZW0gdHlwZSB0byBhIG1ldGhvZCBjYWxsLlxuICAgKiBUaGUgbWV0aG9kIHNob3VsZCByZXR1cm4gYSBTeXN0ZW0gaW5zdGFuY2UuIEEgRHluYW1pY1N5c3RlbVByb3ZpZGVyIGlzIHVzZWQgZm9yXG4gICAqIHRoZSBtYXBwaW5nLlxuICAgKlxuICAgKiBAcGFyYW0gbWV0aG9kIFRoZSBtZXRob2QgdG8gcHJvdmlkZSB0aGUgU3lzdGVtIGluc3RhbmNlLlxuICAgKiBAcmV0dXJuIFRoaXMgU3RhdGVTeXN0ZW1NYXBwaW5nLCBzbyBtb3JlIG1vZGlmaWNhdGlvbnMgY2FuIGJlIGFwcGxpZWQuXG4gICAqL1xuXG4gIEVuZ2luZVN0YXRlLnByb3RvdHlwZS5hZGRNZXRob2QgPSBmdW5jdGlvbihtZXRob2QpIHtcbiAgICByZXR1cm4gdGhpcy5hZGRQcm92aWRlcihuZXcgRHluYW1pY1N5c3RlbVByb3ZpZGVyKG1ldGhvZCkpO1xuICB9O1xuXG5cbiAgLypcbiAgICogQWRkcyBhbnkgU3lzdGVtUHJvdmlkZXIuXG4gICAqXG4gICAqIEBwYXJhbSBwcm92aWRlciBUaGUgY29tcG9uZW50IHByb3ZpZGVyIHRvIHVzZS5cbiAgICogQHJldHVybiBUaGlzIFN0YXRlU3lzdGVtTWFwcGluZywgc28gbW9yZSBtb2RpZmljYXRpb25zIGNhbiBiZSBhcHBsaWVkLlxuICAgKi9cblxuICBFbmdpbmVTdGF0ZS5wcm90b3R5cGUuYWRkUHJvdmlkZXIgPSBmdW5jdGlvbihwcm92aWRlcikge1xuICAgIHZhciBtYXBwaW5nO1xuICAgIG1hcHBpbmcgPSBuZXcgU3RhdGVTeXN0ZW1NYXBwaW5nKHRoaXMsIHByb3ZpZGVyKTtcbiAgICB0aGlzLnByb3ZpZGVycy5wdXNoKHByb3ZpZGVyKTtcbiAgICByZXR1cm4gbWFwcGluZztcbiAgfTtcblxuICByZXR1cm4gRW5naW5lU3RhdGU7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWVuZ2luZV9zdGF0ZS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBEaWN0aW9uYXJ5LCBFbmdpbmVTdGF0ZSwgYXNoO1xuXG5hc2ggPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuRW5naW5lU3RhdGUgPSBhc2guZnNtLkVuZ2luZVN0YXRlO1xuXG5EaWN0aW9uYXJ5ID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBEaWN0aW9uYXJ5KCkge31cblxuICByZXR1cm4gRGljdGlvbmFyeTtcblxufSkoKTtcblxuXG4vKlxuICogVGhpcyBpcyBhIHN0YXRlIG1hY2hpbmUgZm9yIHRoZSBFbmdpbmUuIFRoZSBzdGF0ZSBtYWNoaW5lIG1hbmFnZXMgYSBzZXQgb2Ygc3RhdGVzLFxuICogZWFjaCBvZiB3aGljaCBoYXMgYSBzZXQgb2YgU3lzdGVtIHByb3ZpZGVycy4gV2hlbiB0aGUgc3RhdGUgbWFjaGluZSBjaGFuZ2VzIHRoZSBzdGF0ZSwgaXQgcmVtb3Zlc1xuICogU3lzdGVtcyBhc3NvY2lhdGVkIHdpdGggdGhlIHByZXZpb3VzIHN0YXRlIGFuZCBhZGRzIFN5c3RlbXMgYXNzb2NpYXRlZCB3aXRoIHRoZSBuZXcgc3RhdGUuXG4gKi9cblxuYXNoLmZzbS5FbmdpbmVTdGF0ZU1hY2hpbmUgPSAoZnVuY3Rpb24oKSB7XG4gIEVuZ2luZVN0YXRlTWFjaGluZS5wcm90b3R5cGUuZW5naW5lID0gbnVsbDtcblxuICBFbmdpbmVTdGF0ZU1hY2hpbmUucHJvdG90eXBlLnN0YXRlcyA9IG51bGw7XG5cbiAgRW5naW5lU3RhdGVNYWNoaW5lLnByb3RvdHlwZS5jdXJyZW50U3RhdGUgPSBudWxsO1xuXG5cbiAgLypcbiAgICogQ29uc3RydWN0b3IuIENyZWF0ZXMgYW4gU3lzdGVtU3RhdGVNYWNoaW5lLlxuICAgKi9cblxuICBmdW5jdGlvbiBFbmdpbmVTdGF0ZU1hY2hpbmUoZW5naW5lKSB7XG4gICAgdGhpcy5lbmdpbmUgPSBlbmdpbmU7XG4gICAgdGhpcy5zdGF0ZXMgPSBuZXcgRGljdGlvbmFyeSgpO1xuICB9XG5cblxuICAvKlxuICAgKiBBZGQgYSBzdGF0ZSB0byB0aGlzIHN0YXRlIG1hY2hpbmUuXG4gICAqXG4gICAqIEBwYXJhbSBuYW1lIFRoZSBuYW1lIG9mIHRoaXMgc3RhdGUgLSB1c2VkIHRvIGlkZW50aWZ5IGl0IGxhdGVyIGluIHRoZSBjaGFuZ2VTdGF0ZSBtZXRob2QgY2FsbC5cbiAgICogQHBhcmFtIHN0YXRlIFRoZSBzdGF0ZS5cbiAgICogQHJldHVybiBUaGlzIHN0YXRlIG1hY2hpbmUsIHNvIG1ldGhvZHMgY2FuIGJlIGNoYWluZWQuXG4gICAqL1xuXG4gIEVuZ2luZVN0YXRlTWFjaGluZS5wcm90b3R5cGUuYWRkU3RhdGUgPSBmdW5jdGlvbihuYW1lLCBzdGF0ZSkge1xuICAgIHRoaXMuc3RhdGVzW25hbWVdID0gc3RhdGU7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cblxuICAvKlxuICAgKiBDcmVhdGUgYSBuZXcgc3RhdGUgaW4gdGhpcyBzdGF0ZSBtYWNoaW5lLlxuICAgKlxuICAgKiBAcGFyYW0gbmFtZSBUaGUgbmFtZSBvZiB0aGUgbmV3IHN0YXRlIC0gdXNlZCB0byBpZGVudGlmeSBpdCBsYXRlciBpbiB0aGUgY2hhbmdlU3RhdGUgbWV0aG9kIGNhbGwuXG4gICAqIEByZXR1cm4gVGhlIG5ldyBFbnRpdHlTdGF0ZSBvYmplY3QgdGhhdCBpcyB0aGUgc3RhdGUuIFRoaXMgd2lsbCBuZWVkIHRvIGJlIGNvbmZpZ3VyZWQgd2l0aFxuICAgKiB0aGUgYXBwcm9wcmlhdGUgY29tcG9uZW50IHByb3ZpZGVycy5cbiAgICovXG5cbiAgRW5naW5lU3RhdGVNYWNoaW5lLnByb3RvdHlwZS5jcmVhdGVTdGF0ZSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgc3RhdGU7XG4gICAgc3RhdGUgPSBuZXcgRW5naW5lU3RhdGUoKTtcbiAgICB0aGlzLnN0YXRlc1tuYW1lXSA9IHN0YXRlO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG5cbiAgLypcbiAgICogQ2hhbmdlIHRvIGEgbmV3IHN0YXRlLiBUaGUgU3lzdGVtcyBmcm9tIHRoZSBvbGQgc3RhdGUgd2lsbCBiZSByZW1vdmVkIGFuZCB0aGUgU3lzdGVtc1xuICAgKiBmb3IgdGhlIG5ldyBzdGF0ZSB3aWxsIGJlIGFkZGVkLlxuICAgKlxuICAgKiBAcGFyYW0gbmFtZSBUaGUgbmFtZSBvZiB0aGUgc3RhdGUgdG8gY2hhbmdlIHRvLlxuICAgKi9cblxuICBFbmdpbmVTdGF0ZU1hY2hpbmUucHJvdG90eXBlLmNoYW5nZVN0YXRlID0gZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBlYWNoLCBpZCwgbmV3U3RhdGUsIG90aGVyLCBwcm92aWRlciwgdG9BZGQsIF9yZWYsIF9yZWYxO1xuICAgIG5ld1N0YXRlID0gdGhpcy5zdGF0ZXNbbmFtZV07XG4gICAgaWYgKG5ld1N0YXRlID09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkVuZ2luZSBzdGF0ZSBcIiArIG5hbWUgKyBcIiBkb2Vzbid0IGV4aXN0XCIpO1xuICAgIH1cbiAgICBpZiAobmV3U3RhdGUgPT09IHRoaXMuY3VycmVudFN0YXRlKSB7XG4gICAgICBuZXdTdGF0ZSA9IG51bGw7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRvQWRkID0gbmV3IERpY3Rpb25hcnkoKTtcbiAgICBfcmVmID0gbmV3U3RhdGUucHJvdmlkZXJzO1xuICAgIGZvciAoZWFjaCBpbiBfcmVmKSB7XG4gICAgICBwcm92aWRlciA9IF9yZWZbZWFjaF07XG4gICAgICBpZCA9IHByb3ZpZGVyLmlkZW50aWZpZXI7XG4gICAgICB0b0FkZFtpZF0gPSBwcm92aWRlcjtcbiAgICB9XG4gICAgaWYgKGN1cnJlbnRTdGF0ZSkge1xuICAgICAgX3JlZjEgPSB0aGlzLmN1cnJlbnRTdGF0ZS5wcm92aWRlcnM7XG4gICAgICBmb3IgKGVhY2ggaW4gX3JlZjEpIHtcbiAgICAgICAgcHJvdmlkZXIgPSBfcmVmMVtlYWNoXTtcbiAgICAgICAgaWQgPSBwcm92aWRlci5pZGVudGlmaWVyO1xuICAgICAgICBvdGhlciA9IHRvQWRkW2lkXTtcbiAgICAgICAgaWYgKG90aGVyKSB7XG4gICAgICAgICAgZGVsZXRlIHRvQWRkW2lkXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmVuZ2luZS5yZW1vdmVTeXN0ZW0ocHJvdmlkZXIuZ2V0U3lzdGVtKCkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAoZWFjaCBpbiB0b0FkZCkge1xuICAgICAgcHJvdmlkZXIgPSB0b0FkZFtlYWNoXTtcbiAgICAgIHRoaXMuZW5naW5lLmFkZFN5c3RlbShwcm92aWRlci5nZXRTeXN0ZW0oKSwgcHJvdmlkZXIucHJpb3JpdHkpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5jdXJyZW50U3RhdGUgPSBuZXdTdGF0ZTtcbiAgfTtcblxuICByZXR1cm4gRW5naW5lU3RhdGVNYWNoaW5lO1xuXG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1lbmdpbmVfc3RhdGVfbWFjaGluZS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBEaWN0aW9uYXJ5LCBTdGF0ZUNvbXBvbmVudE1hcHBpbmcsIGFzaDtcblxuYXNoID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cblN0YXRlQ29tcG9uZW50TWFwcGluZyA9IGFzaC5mc20uU3RhdGVDb21wb25lbnRNYXBwaW5nO1xuXG5EaWN0aW9uYXJ5ID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBEaWN0aW9uYXJ5KCkge31cblxuICByZXR1cm4gRGljdGlvbmFyeTtcblxufSkoKTtcblxuXG4vKlxuICogUmVwcmVzZW50cyBhIHN0YXRlIGZvciBhbiBFbnRpdHlTdGF0ZU1hY2hpbmUuIFRoZSBzdGF0ZSBjb250YWlucyBhbnkgbnVtYmVyIG9mIENvbXBvbmVudFByb3ZpZGVycyB3aGljaFxuICogYXJlIHVzZWQgdG8gYWRkIGNvbXBvbmVudHMgdG8gdGhlIGVudGl0eSB3aGVuIHRoaXMgc3RhdGUgaXMgZW50ZXJlZC5cbiAqL1xuXG5hc2guZnNtLkVudGl0eVN0YXRlID0gKGZ1bmN0aW9uKCkge1xuICBFbnRpdHlTdGF0ZS5wcm90b3R5cGUucHJvdmlkZXJzID0gbnVsbDtcblxuICBmdW5jdGlvbiBFbnRpdHlTdGF0ZSgpIHtcbiAgICB0aGlzLnByb3ZpZGVycyA9IG5ldyBEaWN0aW9uYXJ5KCk7XG4gIH1cblxuXG4gIC8qXG4gICAqIEFkZCBhIG5ldyBDb21wb25lbnRNYXBwaW5nIHRvIHRoaXMgc3RhdGUuIFRoZSBtYXBwaW5nIGlzIGEgdXRpbGl0eSBjbGFzcyB0aGF0IGlzIHVzZWQgdG9cbiAgICogbWFwIGEgY29tcG9uZW50IHR5cGUgdG8gdGhlIHByb3ZpZGVyIHRoYXQgcHJvdmlkZXMgdGhlIGNvbXBvbmVudC5cbiAgICpcbiAgICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgb2YgY29tcG9uZW50IHRvIGJlIG1hcHBlZFxuICAgKiBAcmV0dXJuIFRoZSBjb21wb25lbnQgbWFwcGluZyB0byB1c2Ugd2hlbiBzZXR0aW5nIHRoZSBwcm92aWRlciBmb3IgdGhlIGNvbXBvbmVudFxuICAgKi9cblxuICBFbnRpdHlTdGF0ZS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24odHlwZSkge1xuICAgIHJldHVybiBuZXcgU3RhdGVDb21wb25lbnRNYXBwaW5nKHRoaXMsIHR5cGUubmFtZSk7XG4gIH07XG5cblxuICAvKlxuICAgKiBHZXQgdGhlIENvbXBvbmVudFByb3ZpZGVyIGZvciBhIHBhcnRpY3VsYXIgY29tcG9uZW50IHR5cGUuXG4gICAqXG4gICAqIEBwYXJhbSB0eXBlIFRoZSB0eXBlIG9mIGNvbXBvbmVudCB0byBnZXQgdGhlIHByb3ZpZGVyIGZvclxuICAgKiBAcmV0dXJuIFRoZSBDb21wb25lbnRQcm92aWRlclxuICAgKi9cblxuICBFbnRpdHlTdGF0ZS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24odHlwZSkge1xuICAgIHJldHVybiB0aGlzLnByb3ZpZGVyc1t0eXBlXTtcbiAgfTtcblxuXG4gIC8qXG4gICAqIFRvIGRldGVybWluZSB3aGV0aGVyIHRoaXMgc3RhdGUgaGFzIGEgcHJvdmlkZXIgZm9yIGEgc3BlY2lmaWMgY29tcG9uZW50IHR5cGUuXG4gICAqXG4gICAqIEBwYXJhbSB0eXBlIFRoZSB0eXBlIG9mIGNvbXBvbmVudCB0byBsb29rIGZvciBhIHByb3ZpZGVyIGZvclxuICAgKiBAcmV0dXJuIHRydWUgaWYgdGhlcmUgaXMgYSBwcm92aWRlciBmb3IgdGhlIGdpdmVuIHR5cGUsIGZhbHNlIG90aGVyd2lzZVxuICAgKi9cblxuICBFbnRpdHlTdGF0ZS5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24odHlwZSkge1xuICAgIHJldHVybiB0aGlzLnByb3ZpZGVyc1t0eXBlXSAhPT0gbnVsbDtcbiAgfTtcblxuICByZXR1cm4gRW50aXR5U3RhdGU7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWVudGl0eV9zdGF0ZS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBEaWN0aW9uYXJ5LCBFbnRpdHlTdGF0ZSwgYXNoO1xuXG5hc2ggPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuRW50aXR5U3RhdGUgPSBhc2guZnNtLkVudGl0eVN0YXRlO1xuXG5EaWN0aW9uYXJ5ID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBEaWN0aW9uYXJ5KCkge31cblxuICByZXR1cm4gRGljdGlvbmFyeTtcblxufSkoKTtcblxuXG4vKlxuICogVGhpcyBpcyBhIHN0YXRlIG1hY2hpbmUgZm9yIGFuIGVudGl0eS4gVGhlIHN0YXRlIG1hY2hpbmUgbWFuYWdlcyBhIHNldCBvZiBzdGF0ZXMsXG4gKiBlYWNoIG9mIHdoaWNoIGhhcyBhIHNldCBvZiBjb21wb25lbnQgcHJvdmlkZXJzLiBXaGVuIHRoZSBzdGF0ZSBtYWNoaW5lIGNoYW5nZXMgdGhlIHN0YXRlLCBpdCByZW1vdmVzXG4gKiBjb21wb25lbnRzIGFzc29jaWF0ZWQgd2l0aCB0aGUgcHJldmlvdXMgc3RhdGUgYW5kIGFkZHMgY29tcG9uZW50cyBhc3NvY2lhdGVkIHdpdGggdGhlIG5ldyBzdGF0ZS5cbiAqL1xuXG5hc2guZnNtLkVudGl0eVN0YXRlTWFjaGluZSA9IChmdW5jdGlvbigpIHtcbiAgRW50aXR5U3RhdGVNYWNoaW5lLnByb3RvdHlwZS5zdGF0ZXMgPSBudWxsO1xuXG5cbiAgLypcbiAgXHQgKiBUaGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgc3RhdGUgbWFjaGluZS5cbiAgICovXG5cbiAgRW50aXR5U3RhdGVNYWNoaW5lLnByb3RvdHlwZS5jdXJyZW50U3RhdGUgPSBudWxsO1xuXG5cbiAgLypcbiAgICogVGhlIGVudGl0eSB3aG9zZSBzdGF0ZSBtYWNoaW5lIHRoaXMgaXNcbiAgICovXG5cbiAgRW50aXR5U3RhdGVNYWNoaW5lLnByb3RvdHlwZS5lbnRpdHkgPSBudWxsO1xuXG5cbiAgLypcbiAgICogQ29uc3RydWN0b3IuIENyZWF0ZXMgYW4gRW50aXR5U3RhdGVNYWNoaW5lLlxuICAgKi9cblxuICBmdW5jdGlvbiBFbnRpdHlTdGF0ZU1hY2hpbmUoZW50aXR5KSB7XG4gICAgdGhpcy5lbnRpdHkgPSBlbnRpdHk7XG4gICAgdGhpcy5zdGF0ZXMgPSBuZXcgRGljdGlvbmFyeSgpO1xuICB9XG5cblxuICAvKlxuICBcdFx0ICogQWRkIGEgc3RhdGUgdG8gdGhpcyBzdGF0ZSBtYWNoaW5lLlxuICBcdFx0ICpcbiAgXHRcdCAqIEBwYXJhbSBuYW1lIFRoZSBuYW1lIG9mIHRoaXMgc3RhdGUgLSB1c2VkIHRvIGlkZW50aWZ5IGl0IGxhdGVyIGluIHRoZSBjaGFuZ2VTdGF0ZSBtZXRob2QgY2FsbC5cbiAgXHRcdCAqIEBwYXJhbSBzdGF0ZSBUaGUgc3RhdGUuXG4gIFx0XHQgKiBAcmV0dXJuIFRoaXMgc3RhdGUgbWFjaGluZSwgc28gbWV0aG9kcyBjYW4gYmUgY2hhaW5lZC5cbiAgICovXG5cbiAgRW50aXR5U3RhdGVNYWNoaW5lLnByb3RvdHlwZS5hZGRTdGF0ZSA9IGZ1bmN0aW9uKG5hbWUsIHN0YXRlKSB7XG4gICAgdGhpcy5zdGF0ZXNbbmFtZV0gPSBzdGF0ZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuXG4gIC8qXG4gICAqIENyZWF0ZSBhIG5ldyBzdGF0ZSBpbiB0aGlzIHN0YXRlIG1hY2hpbmUuXG4gICAqXG4gICAqIEBwYXJhbSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBuZXcgc3RhdGUgLSB1c2VkIHRvIGlkZW50aWZ5IGl0IGxhdGVyIGluIHRoZSBjaGFuZ2VTdGF0ZSBtZXRob2QgY2FsbC5cbiAgICogQHJldHVybiBUaGUgbmV3IEVudGl0eVN0YXRlIG9iamVjdCB0aGF0IGlzIHRoZSBzdGF0ZS4gVGhpcyB3aWxsIG5lZWQgdG8gYmUgY29uZmlndXJlZCB3aXRoXG4gICAqIHRoZSBhcHByb3ByaWF0ZSBjb21wb25lbnQgcHJvdmlkZXJzLlxuICAgKi9cblxuICBFbnRpdHlTdGF0ZU1hY2hpbmUucHJvdG90eXBlLmNyZWF0ZVN0YXRlID0gZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBzdGF0ZTtcbiAgICBzdGF0ZSA9IG5ldyBFbnRpdHlTdGF0ZSgpO1xuICAgIHRoaXMuc3RhdGVzW25hbWVdID0gc3RhdGU7XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9O1xuXG5cbiAgLypcbiAgICogQ2hhbmdlIHRvIGEgbmV3IHN0YXRlLiBUaGUgY29tcG9uZW50cyBmcm9tIHRoZSBvbGQgc3RhdGUgd2lsbCBiZSByZW1vdmVkIGFuZCB0aGUgY29tcG9uZW50c1xuICAgKiBmb3IgdGhlIG5ldyBzdGF0ZSB3aWxsIGJlIGFkZGVkLlxuICAgKlxuICAgKiBAcGFyYW0gbmFtZSBUaGUgbmFtZSBvZiB0aGUgc3RhdGUgdG8gY2hhbmdlIHRvLlxuICAgKi9cblxuICBFbnRpdHlTdGF0ZU1hY2hpbmUucHJvdG90eXBlLmNoYW5nZVN0YXRlID0gZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBuZXdTdGF0ZSwgb3RoZXIsIHRvQWRkLCB0eXBlO1xuICAgIG5ld1N0YXRlID0gdGhpcy5zdGF0ZXNbbmFtZV07XG4gICAgaWYgKCFuZXdTdGF0ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRW50aXR5IHN0YXRlIFwiICsgbmFtZSArIFwiIGRvZXNuJ3QgZXhpc3RcIik7XG4gICAgfVxuICAgIGlmIChuZXdTdGF0ZSA9PT0gdGhpcy5jdXJyZW50U3RhdGUpIHtcbiAgICAgIG5ld1N0YXRlID0gbnVsbDtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMuY3VycmVudFN0YXRlKSB7XG4gICAgICB0b0FkZCA9IG5ldyBEaWN0aW9uYXJ5KCk7XG4gICAgICBmb3IgKHR5cGUgaW4gbmV3U3RhdGUucHJvdmlkZXJzKSB7XG4gICAgICAgIHRvQWRkW3R5cGVdID0gbmV3U3RhdGUucHJvdmlkZXJzW3R5cGVdO1xuICAgICAgfVxuICAgICAgZm9yICh0eXBlIGluIHRoaXMuY3VycmVudFN0YXRlLnByb3ZpZGVycykge1xuICAgICAgICBvdGhlciA9IHRvQWRkW3R5cGVdO1xuICAgICAgICBpZiAob3RoZXIgJiYgb3RoZXIuaWRlbnRpZmllciA9PT0gdGhpcy5jdXJyZW50U3RhdGUucHJvdmlkZXJzW3R5cGVdLmlkZW50aWZpZXIpIHtcbiAgICAgICAgICBkZWxldGUgdG9BZGRbdHlwZV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5lbnRpdHkucmVtb3ZlKHR5cGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRvQWRkID0gbmV3U3RhdGUucHJvdmlkZXJzO1xuICAgIH1cbiAgICBmb3IgKHR5cGUgaW4gdG9BZGQpIHtcbiAgICAgIHRoaXMuZW50aXR5LmFkZCh0b0FkZFt0eXBlXS5nZXRDb21wb25lbnQoKSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmN1cnJlbnRTdGF0ZSA9IG5ld1N0YXRlO1xuICB9O1xuXG4gIHJldHVybiBFbnRpdHlTdGF0ZU1hY2hpbmU7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWVudGl0eV9zdGF0ZV9tYWNoaW5lLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIENvbXBvbmVudEluc3RhbmNlUHJvdmlkZXIsIENvbXBvbmVudFNpbmdsZXRvblByb3ZpZGVyLCBDb21wb25lbnRUeXBlUHJvdmlkZXIsIER5bmFtaWNDb21wb25lbnRQcm92aWRlciwgYXNoO1xuXG5hc2ggPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuQ29tcG9uZW50SW5zdGFuY2VQcm92aWRlciA9IGFzaC5mc20uQ29tcG9uZW50SW5zdGFuY2VQcm92aWRlcjtcblxuQ29tcG9uZW50VHlwZVByb3ZpZGVyID0gYXNoLmZzbS5Db21wb25lbnRUeXBlUHJvdmlkZXI7XG5cbkNvbXBvbmVudFNpbmdsZXRvblByb3ZpZGVyID0gYXNoLmZzbS5Db21wb25lbnRTaW5nbGV0b25Qcm92aWRlcjtcblxuRHluYW1pY0NvbXBvbmVudFByb3ZpZGVyID0gYXNoLmZzbS5EeW5hbWljQ29tcG9uZW50UHJvdmlkZXI7XG5cblxuLypcbiAqIFVzZWQgYnkgdGhlIEVudGl0eVN0YXRlIGNsYXNzIHRvIGNyZWF0ZSB0aGUgbWFwcGluZ3Mgb2YgY29tcG9uZW50cyB0byBwcm92aWRlcnMgdmlhIGEgZmx1ZW50IGludGVyZmFjZS5cbiAqL1xuXG5hc2guZnNtLlN0YXRlQ29tcG9uZW50TWFwcGluZyA9IChmdW5jdGlvbigpIHtcbiAgU3RhdGVDb21wb25lbnRNYXBwaW5nLnByb3RvdHlwZS5jb21wb25lbnRUeXBlID0gbnVsbDtcblxuICBTdGF0ZUNvbXBvbmVudE1hcHBpbmcucHJvdG90eXBlLmNyZWF0aW5nU3RhdGUgPSBudWxsO1xuXG4gIFN0YXRlQ29tcG9uZW50TWFwcGluZy5wcm90b3R5cGUucHJvdmlkZXIgPSBudWxsO1xuXG5cbiAgLypcbiAgICogVXNlZCBpbnRlcm5hbGx5LCB0aGUgY29uc3RydWN0b3IgY3JlYXRlcyBhIGNvbXBvbmVudCBtYXBwaW5nLiBUaGUgY29uc3RydWN0b3JcbiAgICogY3JlYXRlcyBhIENvbXBvbmVudFR5cGVQcm92aWRlciBhcyB0aGUgZGVmYXVsdCBtYXBwaW5nLCB3aGljaCB3aWxsIGJlIHJlcGxhY2VkXG4gICAqIGJ5IG1vcmUgc3BlY2lmaWMgbWFwcGluZ3MgaWYgb3RoZXIgbWV0aG9kcyBhcmUgY2FsbGVkLlxuICAgKlxuICAgKiBAcGFyYW0gY3JlYXRpbmdTdGF0ZSBUaGUgRW50aXR5U3RhdGUgdGhhdCB0aGUgbWFwcGluZyB3aWxsIGJlbG9uZyB0b1xuICAgKiBAcGFyYW0gdHlwZSBUaGUgY29tcG9uZW50IHR5cGUgZm9yIHRoZSBtYXBwaW5nXG4gICAqL1xuXG4gIGZ1bmN0aW9uIFN0YXRlQ29tcG9uZW50TWFwcGluZyhjcmVhdGluZ1N0YXRlLCB0eXBlKSB7XG4gICAgdGhpcy5jcmVhdGluZ1N0YXRlID0gY3JlYXRpbmdTdGF0ZTtcbiAgICB0aGlzLmNvbXBvbmVudFR5cGUgPSB0eXBlO1xuICAgIHRoaXMud2l0aFR5cGUodHlwZSk7XG4gIH1cblxuXG4gIC8qXG4gICAqIENyZWF0ZXMgYSBtYXBwaW5nIGZvciB0aGUgY29tcG9uZW50IHR5cGUgdG8gYSBzcGVjaWZpYyBjb21wb25lbnQgaW5zdGFuY2UuIEFcbiAgICogQ29tcG9uZW50SW5zdGFuY2VQcm92aWRlciBpcyB1c2VkIGZvciB0aGUgbWFwcGluZy5cbiAgICpcbiAgICogQHBhcmFtIGNvbXBvbmVudCBUaGUgY29tcG9uZW50IGluc3RhbmNlIHRvIHVzZSBmb3IgdGhlIG1hcHBpbmdcbiAgICogQHJldHVybiBUaGlzIENvbXBvbmVudE1hcHBpbmcsIHNvIG1vcmUgbW9kaWZpY2F0aW9ucyBjYW4gYmUgYXBwbGllZFxuICAgKi9cblxuICBTdGF0ZUNvbXBvbmVudE1hcHBpbmcucHJvdG90eXBlLndpdGhJbnN0YW5jZSA9IGZ1bmN0aW9uKGNvbXBvbmVudCkge1xuICAgIHRoaXMuc2V0UHJvdmlkZXIobmV3IENvbXBvbmVudEluc3RhbmNlUHJvdmlkZXIoY29tcG9uZW50KSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cblxuICAvKlxuICAgKiBDcmVhdGVzIGEgbWFwcGluZyBmb3IgdGhlIGNvbXBvbmVudCB0eXBlIHRvIG5ldyBpbnN0YW5jZXMgb2YgdGhlIHByb3ZpZGVkIHR5cGUuXG4gICAqIFRoZSB0eXBlIHNob3VsZCBiZSB0aGUgc2FtZSBhcyBvciBleHRlbmQgdGhlIHR5cGUgZm9yIHRoaXMgbWFwcGluZy4gQSBDb21wb25lbnRUeXBlUHJvdmlkZXJcbiAgICogaXMgdXNlZCBmb3IgdGhlIG1hcHBpbmcuXG4gICAqXG4gICAqIEBwYXJhbSB0eXBlIFRoZSB0eXBlIG9mIGNvbXBvbmVudHMgdG8gYmUgY3JlYXRlZCBieSB0aGlzIG1hcHBpbmdcbiAgICogQHJldHVybiBUaGlzIENvbXBvbmVudE1hcHBpbmcsIHNvIG1vcmUgbW9kaWZpY2F0aW9ucyBjYW4gYmUgYXBwbGllZFxuICAgKi9cblxuICBTdGF0ZUNvbXBvbmVudE1hcHBpbmcucHJvdG90eXBlLndpdGhUeXBlID0gZnVuY3Rpb24odHlwZSkge1xuICAgIHRoaXMuc2V0UHJvdmlkZXIobmV3IENvbXBvbmVudFR5cGVQcm92aWRlcih0eXBlKSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cblxuICAvKlxuICAgKiBDcmVhdGVzIGEgbWFwcGluZyBmb3IgdGhlIGNvbXBvbmVudCB0eXBlIHRvIGEgc2luZ2xlIGluc3RhbmNlIG9mIHRoZSBwcm92aWRlZCB0eXBlLlxuICAgKiBUaGUgaW5zdGFuY2UgaXMgbm90IGNyZWF0ZWQgdW50aWwgaXQgaXMgZmlyc3QgcmVxdWVzdGVkLiBUaGUgdHlwZSBzaG91bGQgYmUgdGhlIHNhbWVcbiAgICogYXMgb3IgZXh0ZW5kIHRoZSB0eXBlIGZvciB0aGlzIG1hcHBpbmcuIEEgQ29tcG9uZW50U2luZ2xldG9uUHJvdmlkZXIgaXMgdXNlZCBmb3JcbiAgICogdGhlIG1hcHBpbmcuXG4gICAqXG4gICAqIEBwYXJhbSBUaGUgdHlwZSBvZiB0aGUgc2luZ2xlIGluc3RhbmNlIHRvIGJlIGNyZWF0ZWQuIElmIG9taXR0ZWQsIHRoZSB0eXBlIG9mIHRoZVxuICAgKiBtYXBwaW5nIGlzIHVzZWQuXG4gICAqIEByZXR1cm4gVGhpcyBDb21wb25lbnRNYXBwaW5nLCBzbyBtb3JlIG1vZGlmaWNhdGlvbnMgY2FuIGJlIGFwcGxpZWRcbiAgICovXG5cbiAgU3RhdGVDb21wb25lbnRNYXBwaW5nLnByb3RvdHlwZS53aXRoU2luZ2xldG9uID0gZnVuY3Rpb24odHlwZSkge1xuICAgIGlmICh0eXBlID09IG51bGwpIHtcbiAgICAgIHR5cGUgPSB0aGlzLmNvbXBvbmVudFR5cGU7XG4gICAgfVxuICAgIHRoaXMuc2V0UHJvdmlkZXIobmV3IENvbXBvbmVudFNpbmdsZXRvblByb3ZpZGVyKHR5cGUpKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuXG4gIC8qXG4gICAqIENyZWF0ZXMgYSBtYXBwaW5nIGZvciB0aGUgY29tcG9uZW50IHR5cGUgdG8gYSBtZXRob2QgY2FsbC4gQVxuICAgKiBEeW5hbWljQ29tcG9uZW50UHJvdmlkZXIgaXMgdXNlZCBmb3IgdGhlIG1hcHBpbmcuXG4gICAqXG4gICAqIEBwYXJhbSBtZXRob2QgVGhlIG1ldGhvZCB0byByZXR1cm4gdGhlIGNvbXBvbmVudCBpbnN0YW5jZVxuICAgKiBAcmV0dXJuIFRoaXMgQ29tcG9uZW50TWFwcGluZywgc28gbW9yZSBtb2RpZmljYXRpb25zIGNhbiBiZSBhcHBsaWVkXG4gICAqL1xuXG4gIFN0YXRlQ29tcG9uZW50TWFwcGluZy5wcm90b3R5cGUud2l0aE1ldGhvZCA9IGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgIHRoaXMuc2V0UHJvdmlkZXIobmV3IER5bmFtaWNDb21wb25lbnRQcm92aWRlcihtZXRob2QpKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuXG4gIC8qXG4gICAqIENyZWF0ZXMgYSBtYXBwaW5nIGZvciB0aGUgY29tcG9uZW50IHR5cGUgdG8gYW55IENvbXBvbmVudFByb3ZpZGVyLlxuICAgKlxuICAgKiBAcGFyYW0gcHJvdmlkZXIgVGhlIGNvbXBvbmVudCBwcm92aWRlciB0byB1c2UuXG4gICAqIEByZXR1cm4gVGhpcyBDb21wb25lbnRNYXBwaW5nLCBzbyBtb3JlIG1vZGlmaWNhdGlvbnMgY2FuIGJlIGFwcGxpZWQuXG4gICAqL1xuXG4gIFN0YXRlQ29tcG9uZW50TWFwcGluZy5wcm90b3R5cGUud2l0aFByb3ZpZGVyID0gZnVuY3Rpb24ocHJvdmlkZXIpIHtcbiAgICB0aGlzLnNldFByb3ZpZGVyKHByb3ZpZGVyKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuXG4gIC8qXG4gICAqIE1hcHMgdGhyb3VnaCB0byB0aGUgYWRkIG1ldGhvZCBvZiB0aGUgRW50aXR5U3RhdGUgdGhhdCB0aGlzIG1hcHBpbmcgYmVsb25ncyB0b1xuICAgKiBzbyB0aGF0IGEgZmx1ZW50IGludGVyZmFjZSBjYW4gYmUgdXNlZCB3aGVuIGNvbmZpZ3VyaW5nIGVudGl0eSBzdGF0ZXMuXG4gICAqXG4gICAqIEBwYXJhbSB0eXBlIFRoZSB0eXBlIG9mIGNvbXBvbmVudCB0byBhZGQgYSBtYXBwaW5nIHRvIHRoZSBzdGF0ZSBmb3JcbiAgICogQHJldHVybiBUaGUgbmV3IENvbXBvbmVudE1hcHBpbmcgZm9yIHRoYXQgdHlwZVxuICAgKi9cblxuICBTdGF0ZUNvbXBvbmVudE1hcHBpbmcucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgICByZXR1cm4gdGhpcy5jcmVhdGluZ1N0YXRlLmFkZCh0eXBlKTtcbiAgfTtcblxuICBTdGF0ZUNvbXBvbmVudE1hcHBpbmcucHJvdG90eXBlLnNldFByb3ZpZGVyID0gZnVuY3Rpb24ocHJvdmlkZXIpIHtcbiAgICB0aGlzLnByb3ZpZGVyID0gcHJvdmlkZXI7XG4gICAgcmV0dXJuIHRoaXMuY3JlYXRpbmdTdGF0ZS5wcm92aWRlcnNbdGhpcy5jb21wb25lbnRUeXBlXSA9IHByb3ZpZGVyO1xuICB9O1xuXG4gIHJldHVybiBTdGF0ZUNvbXBvbmVudE1hcHBpbmc7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXN0YXRlX2NvbXBvbmVudF9tYXBwaW5nLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzaDtcblxuYXNoID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cblxuLypcbiAqIFVzZWQgYnkgdGhlIFN5c3RlbVN0YXRlIGNsYXNzIHRvIGNyZWF0ZSB0aGUgbWFwcGluZ3Mgb2YgU3lzdGVtcyB0byBwcm92aWRlcnMgdmlhIGEgZmx1ZW50IGludGVyZmFjZS5cbiAqL1xuXG5hc2guZnNtLlN0YXRlU3lzdGVtTWFwcGluZyA9IChmdW5jdGlvbigpIHtcbiAgU3RhdGVTeXN0ZW1NYXBwaW5nLnByb3RvdHlwZS5jcmVhdGluZ1N0YXRlID0gbnVsbDtcblxuICBTdGF0ZVN5c3RlbU1hcHBpbmcucHJvdG90eXBlLnByb3ZpZGVyID0gbnVsbDtcblxuXG4gIC8qXG4gICAqIFVzZWQgaW50ZXJuYWxseSwgdGhlIGNvbnN0cnVjdG9yIGNyZWF0ZXMgYSBjb21wb25lbnQgbWFwcGluZy4gVGhlIGNvbnN0cnVjdG9yXG4gICAqIGNyZWF0ZXMgYSBTeXN0ZW1TaW5nbGV0b25Qcm92aWRlciBhcyB0aGUgZGVmYXVsdCBtYXBwaW5nLCB3aGljaCB3aWxsIGJlIHJlcGxhY2VkXG4gICAqIGJ5IG1vcmUgc3BlY2lmaWMgbWFwcGluZ3MgaWYgb3RoZXIgbWV0aG9kcyBhcmUgY2FsbGVkLlxuICAgKlxuICAgKiBAcGFyYW0gY3JlYXRpbmdTdGF0ZSBUaGUgU3lzdGVtU3RhdGUgdGhhdCB0aGUgbWFwcGluZyB3aWxsIGJlbG9uZyB0b1xuICAgKiBAcGFyYW0gdHlwZSBUaGUgU3lzdGVtIHR5cGUgZm9yIHRoZSBtYXBwaW5nXG4gICAqL1xuXG4gIGZ1bmN0aW9uIFN0YXRlU3lzdGVtTWFwcGluZyhjcmVhdGluZ1N0YXRlLCBwcm92aWRlcikge1xuICAgIHRoaXMuY3JlYXRpbmdTdGF0ZSA9IGNyZWF0aW5nU3RhdGU7XG4gICAgdGhpcy5wcm92aWRlciA9IHByb3ZpZGVyO1xuICB9XG5cblxuICAvKlxuICAgKiBBcHBsaWVzIHRoZSBwcmlvcml0eSB0byB0aGUgcHJvdmlkZXIgdGhhdCB0aGUgU3lzdGVtIHdpbGwgYmUuXG4gICAqXG4gICAqIEBwYXJhbSBwcmlvcml0eSBUaGUgY29tcG9uZW50IHByb3ZpZGVyIHRvIHVzZS5cbiAgICogQHJldHVybiBUaGlzIFN0YXRlU3lzdGVtTWFwcGluZywgc28gbW9yZSBtb2RpZmljYXRpb25zIGNhbiBiZSBhcHBsaWVkLlxuICAgKi9cblxuICBTdGF0ZVN5c3RlbU1hcHBpbmcucHJvdG90eXBlLndpdGhQcmlvcml0eSA9IGZ1bmN0aW9uKHByaW9yaXR5KSB7XG4gICAgdGhpcy5wcm92aWRlci5wcmlvcml0eSA9IHByaW9yaXR5O1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG5cbiAgLypcbiAgICogQ3JlYXRlcyBhIG1hcHBpbmcgZm9yIHRoZSBTeXN0ZW0gdHlwZSB0byBhIHNwZWNpZmljIFN5c3RlbSBpbnN0YW5jZS4gQVxuICAgKiBTeXN0ZW1JbnN0YW5jZVByb3ZpZGVyIGlzIHVzZWQgZm9yIHRoZSBtYXBwaW5nLlxuICAgKlxuICAgKiBAcGFyYW0gc3lzdGVtIFRoZSBTeXN0ZW0gaW5zdGFuY2UgdG8gdXNlIGZvciB0aGUgbWFwcGluZ1xuICAgKiBAcmV0dXJuIFRoaXMgU3RhdGVTeXN0ZW1NYXBwaW5nLCBzbyBtb3JlIG1vZGlmaWNhdGlvbnMgY2FuIGJlIGFwcGxpZWRcbiAgICovXG5cbiAgU3RhdGVTeXN0ZW1NYXBwaW5nLnByb3RvdHlwZS5hZGRJbnN0YW5jZSA9IGZ1bmN0aW9uKHN5c3RlbSkge1xuICAgIHJldHVybiBjcmVhdGluZ1N0YXRlLmFkZEluc3RhbmNlKHN5c3RlbSk7XG4gIH07XG5cblxuICAvKlxuICAgKiBDcmVhdGVzIGEgbWFwcGluZyBmb3IgdGhlIFN5c3RlbSB0eXBlIHRvIGEgc2luZ2xlIGluc3RhbmNlIG9mIHRoZSBwcm92aWRlZCB0eXBlLlxuICAgKiBUaGUgaW5zdGFuY2UgaXMgbm90IGNyZWF0ZWQgdW50aWwgaXQgaXMgZmlyc3QgcmVxdWVzdGVkLiBUaGUgdHlwZSBzaG91bGQgYmUgdGhlIHNhbWVcbiAgICogYXMgb3IgZXh0ZW5kIHRoZSB0eXBlIGZvciB0aGlzIG1hcHBpbmcuIEEgU3lzdGVtU2luZ2xldG9uUHJvdmlkZXIgaXMgdXNlZCBmb3JcbiAgICogdGhlIG1hcHBpbmcuXG4gICAqXG4gICAqIEBwYXJhbSB0eXBlIFRoZSB0eXBlIG9mIHRoZSBzaW5nbGUgaW5zdGFuY2UgdG8gYmUgY3JlYXRlZC4gSWYgb21pdHRlZCwgdGhlIHR5cGUgb2YgdGhlXG4gICAqIG1hcHBpbmcgaXMgdXNlZC5cbiAgICogQHJldHVybiBUaGlzIFN0YXRlU3lzdGVtTWFwcGluZywgc28gbW9yZSBtb2RpZmljYXRpb25zIGNhbiBiZSBhcHBsaWVkXG4gICAqL1xuXG4gIFN0YXRlU3lzdGVtTWFwcGluZy5wcm90b3R5cGUuYWRkU2luZ2xldG9uID0gZnVuY3Rpb24odHlwZSkge1xuICAgIHJldHVybiBjcmVhdGluZ1N0YXRlLmFkZFNpbmdsZXRvbih0eXBlKTtcbiAgfTtcblxuXG4gIC8qXG4gICAqIENyZWF0ZXMgYSBtYXBwaW5nIGZvciB0aGUgU3lzdGVtIHR5cGUgdG8gYSBtZXRob2QgY2FsbC5cbiAgICogVGhlIG1ldGhvZCBzaG91bGQgcmV0dXJuIGEgU3lzdGVtIGluc3RhbmNlLiBBIER5bmFtaWNTeXN0ZW1Qcm92aWRlciBpcyB1c2VkIGZvclxuICAgKiB0aGUgbWFwcGluZy5cbiAgICpcbiAgICogQHBhcmFtIG1ldGhvZCBUaGUgbWV0aG9kIHRvIHByb3ZpZGUgdGhlIFN5c3RlbSBpbnN0YW5jZS5cbiAgICogQHJldHVybiBUaGlzIFN0YXRlU3lzdGVtTWFwcGluZywgc28gbW9yZSBtb2RpZmljYXRpb25zIGNhbiBiZSBhcHBsaWVkLlxuICAgKi9cblxuICBTdGF0ZVN5c3RlbU1hcHBpbmcucHJvdG90eXBlLmFkZE1ldGhvZCA9IGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgIHJldHVybiBjcmVhdGluZ1N0YXRlLmFkZE1ldGhvZChtZXRob2QpO1xuICB9O1xuXG5cbiAgLypcbiAgICogTWFwcyB0aHJvdWdoIHRvIHRoZSBhZGRQcm92aWRlciBtZXRob2Qgb2YgdGhlIFN5c3RlbVN0YXRlIHRoYXQgdGhpcyBtYXBwaW5nIGJlbG9uZ3MgdG9cbiAgICogc28gdGhhdCBhIGZsdWVudCBpbnRlcmZhY2UgY2FuIGJlIHVzZWQgd2hlbiBjb25maWd1cmluZyBlbnRpdHkgc3RhdGVzLlxuICAgKlxuICAgKiBAcGFyYW0gcHJvdmlkZXIgVGhlIGNvbXBvbmVudCBwcm92aWRlciB0byB1c2UuXG4gICAqIEByZXR1cm4gVGhpcyBTdGF0ZVN5c3RlbU1hcHBpbmcsIHNvIG1vcmUgbW9kaWZpY2F0aW9ucyBjYW4gYmUgYXBwbGllZC5cbiAgICovXG5cbiAgU3RhdGVTeXN0ZW1NYXBwaW5nLnByb3RvdHlwZS5hZGRQcm92aWRlciA9IGZ1bmN0aW9uKHByb3ZpZGVyKSB7XG4gICAgcmV0dXJuIGNyZWF0aW5nU3RhdGUuYWRkUHJvdmlkZXIocHJvdmlkZXIpO1xuICB9O1xuXG5cbiAgLypcbiAgICovXG5cbiAgcmV0dXJuIFN0YXRlU3lzdGVtTWFwcGluZztcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3RhdGVfc3lzdGVtX21hcHBpbmcuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXNoO1xuXG5hc2ggPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuXG4vKlxuICogVGhpcyBTeXN0ZW0gcHJvdmlkZXIgYWx3YXlzIHJldHVybnMgdGhlIHNhbWUgaW5zdGFuY2Ugb2YgdGhlIGNvbXBvbmVudC4gVGhlIHN5c3RlbVxuICogaXMgcGFzc2VkIHRvIHRoZSBwcm92aWRlciBhdCBpbml0aWFsaXNhdGlvbi5cbiAqL1xuXG5hc2guZnNtLlN5c3RlbUluc3RhbmNlUHJvdmlkZXIgPSAoZnVuY3Rpb24oKSB7XG4gIFN5c3RlbUluc3RhbmNlUHJvdmlkZXIucHJvdG90eXBlLmluc3RhbmNlID0gbnVsbDtcblxuICBTeXN0ZW1JbnN0YW5jZVByb3ZpZGVyLnByb3RvdHlwZS5zeXN0ZW1Qcmlvcml0eSA9IDA7XG5cblxuICAvKlxuICAgKiBDb25zdHJ1Y3RvclxuICAgKlxuICAgKiBAcGFyYW0gaW5zdGFuY2UgVGhlIGluc3RhbmNlIHRvIHJldHVybiB3aGVuZXZlciBhIFN5c3RlbSBpcyByZXF1ZXN0ZWQuXG4gICAqL1xuXG4gIGZ1bmN0aW9uIFN5c3RlbUluc3RhbmNlUHJvdmlkZXIoaW5zdGFuY2UpIHtcbiAgICB0aGlzLmluc3RhbmNlID0gaW5zdGFuY2U7XG4gIH1cblxuXG4gIC8qXG4gICAqIFVzZWQgdG8gcmVxdWVzdCBhIGNvbXBvbmVudCBmcm9tIHRoaXMgcHJvdmlkZXJcbiAgICpcbiAgICogQHJldHVybiBUaGUgaW5zdGFuY2Ugb2YgdGhlIFN5c3RlbVxuICAgKi9cblxuICBTeXN0ZW1JbnN0YW5jZVByb3ZpZGVyLnByb3RvdHlwZS5nZXRTeXN0ZW0gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5pbnN0YW5jZTtcbiAgfTtcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhTeXN0ZW1JbnN0YW5jZVByb3ZpZGVyLnByb3RvdHlwZSwge1xuXG4gICAgLypcbiAgICAgKiBVc2VkIHRvIGNvbXBhcmUgdGhpcyBwcm92aWRlciB3aXRoIG90aGVycy4gQW55IHByb3ZpZGVyIHRoYXQgcmV0dXJucyB0aGUgc2FtZSBjb21wb25lbnRcbiAgICAgKiBpbnN0YW5jZSB3aWxsIGJlIHJlZ2FyZGVkIGFzIGVxdWl2YWxlbnQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIFRoZSBpbnN0YW5jZVxuICAgICAqL1xuICAgIGlkZW50aWZpZXI6IHtcbiAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIFRoZSBwcmlvcml0eSBhdCB3aGljaCB0aGUgU3lzdGVtIHNob3VsZCBiZSBhZGRlZCB0byB0aGUgRW5naW5lXG4gICAgICovXG4gICAgcHJpb3JpdHk6IHtcbiAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN5c3RlbVByaW9yaXR5O1xuICAgICAgfSxcbiAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3lzdGVtUHJpb3JpdHkgPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBTeXN0ZW1JbnN0YW5jZVByb3ZpZGVyO1xuXG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zeXN0ZW1faW5zdGFuY2VfcHJvdmlkZXIuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXNoO1xuXG5hc2ggPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuXG4vKlxuICogVGhpcyBTeXN0ZW0gcHJvdmlkZXIgYWx3YXlzIHJldHVybnMgdGhlIHNhbWUgaW5zdGFuY2Ugb2YgdGhlIFN5c3RlbS4gVGhlIGluc3RhbmNlXG4gKiBpcyBjcmVhdGVkIHdoZW4gZmlyc3QgcmVxdWlyZWQgYW5kIGlzIG9mIHRoZSB0eXBlIHBhc3NlZCBpbiB0byB0aGUgY29uc3RydWN0b3IuXG4gKi9cblxuYXNoLmZzbS5TeXN0ZW1TaW5nbGV0b25Qcm92aWRlciA9IChmdW5jdGlvbigpIHtcbiAgU3lzdGVtU2luZ2xldG9uUHJvdmlkZXIucHJvdG90eXBlLmNvbXBvbmVudFR5cGUgPSBudWxsO1xuXG4gIFN5c3RlbVNpbmdsZXRvblByb3ZpZGVyLnByb3RvdHlwZS5pbnN0YW5jZSA9IG51bGw7XG5cbiAgU3lzdGVtU2luZ2xldG9uUHJvdmlkZXIucHJvdG90eXBlLnN5c3RlbVByaW9yaXR5ID0gMDtcblxuXG4gIC8qXG4gICAqIENvbnN0cnVjdG9yXG4gICAqXG4gICAqIEBwYXJhbSB0eXBlIFRoZSB0eXBlIG9mIHRoZSBzaW5nbGUgU3lzdGVtIGluc3RhbmNlXG4gICAqL1xuXG4gIGZ1bmN0aW9uIFN5c3RlbVNpbmdsZXRvblByb3ZpZGVyKHR5cGUpIHtcbiAgICB0aGlzLmNvbXBvbmVudFR5cGUgPSB0eXBlO1xuICB9XG5cblxuICAvKlxuICAgKiBVc2VkIHRvIHJlcXVlc3QgYSBTeXN0ZW0gZnJvbSB0aGlzIHByb3ZpZGVyXG4gICAqXG4gICAqIEByZXR1cm4gVGhlIHNpbmdsZSBpbnN0YW5jZVxuICAgKi9cblxuICBTeXN0ZW1TaW5nbGV0b25Qcm92aWRlci5wcm90b3R5cGUuZ2V0U3lzdGVtID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKCF0aGlzLmluc3RhbmNlKSB7XG4gICAgICB0aGlzLmluc3RhbmNlID0gbmV3IHRoaXMuY29tcG9uZW50VHlwZSgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5pbnN0YW5jZTtcbiAgfTtcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhTeXN0ZW1TaW5nbGV0b25Qcm92aWRlci5wcm90b3R5cGUsIHtcblxuICAgIC8qXG4gICAgXHRcdCAqIFVzZWQgdG8gY29tcGFyZSB0aGlzIHByb3ZpZGVyIHdpdGggb3RoZXJzLiBBbnkgcHJvdmlkZXIgdGhhdCByZXR1cm5zIHRoZSBzYW1lIHNpbmdsZVxuICAgIFx0XHQgKiBpbnN0YW5jZSB3aWxsIGJlIHJlZ2FyZGVkIGFzIGVxdWl2YWxlbnQuXG4gICAgXHRcdCAqXG4gICAgXHRcdCAqIEByZXR1cm4gVGhlIHNpbmdsZSBpbnN0YW5jZVxuICAgICAqL1xuICAgIGlkZW50aWZpZXI6IHtcbiAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFN5c3RlbSgpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIFRoZSBwcmlvcml0eSBhdCB3aGljaCB0aGUgU3lzdGVtIHNob3VsZCBiZSBhZGRlZCB0byB0aGUgRW5naW5lXG4gICAgICovXG4gICAgcHJpb3JpdHk6IHtcbiAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN5c3RlbVByaW9yaXR5O1xuICAgICAgfSxcbiAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3lzdGVtUHJpb3JpdHkgPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBTeXN0ZW1TaW5nbGV0b25Qcm92aWRlcjtcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3lzdGVtX3NpbmdsZXRvbl9wcm92aWRlci5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc2g7XG5cbmFzaCA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5cbi8qXG4gKiBBIG5vZGUgaW4gdGhlIGxpc3Qgb2YgbGlzdGVuZXJzIGluIGEgc2lnbmFsLlxuICovXG5cbmFzaC5zaWduYWxzLkxpc3RlbmVyTm9kZSA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gTGlzdGVuZXJOb2RlKCkge31cblxuICBMaXN0ZW5lck5vZGUucHJvdG90eXBlLnByZXZpb3VzID0gbnVsbDtcblxuICBMaXN0ZW5lck5vZGUucHJvdG90eXBlLm5leHQgPSBudWxsO1xuXG4gIExpc3RlbmVyTm9kZS5wcm90b3R5cGUubGlzdGVuZXIgPSBudWxsO1xuXG4gIExpc3RlbmVyTm9kZS5wcm90b3R5cGUub25jZSA9IGZhbHNlO1xuXG4gIHJldHVybiBMaXN0ZW5lck5vZGU7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxpc3RlbmVyX25vZGUuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgTGlzdGVuZXJOb2RlLCBhc2g7XG5cbmFzaCA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5MaXN0ZW5lck5vZGUgPSBhc2guc2lnbmFscy5MaXN0ZW5lck5vZGU7XG5cblxuLypcbiAqIFRoaXMgaW50ZXJuYWwgY2xhc3MgbWFpbnRhaW5zIGEgcG9vbCBvZiBkZWxldGVkIGxpc3RlbmVyIG5vZGVzIGZvciByZXVzZSBieSBmcmFtZXdvcmsuIFRoaXMgcmVkdWNlc1xuICogdGhlIG92ZXJoZWFkIGZyb20gb2JqZWN0IGNyZWF0aW9uIGFuZCBnYXJiYWdlIGNvbGxlY3Rpb24uXG4gKi9cblxuYXNoLnNpZ25hbHMuTGlzdGVuZXJOb2RlUG9vbCA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gTGlzdGVuZXJOb2RlUG9vbCgpIHt9XG5cbiAgTGlzdGVuZXJOb2RlUG9vbC5wcm90b3R5cGUudGFpbCA9IG51bGw7XG5cbiAgTGlzdGVuZXJOb2RlUG9vbC5wcm90b3R5cGUuY2FjaGVUYWlsID0gbnVsbDtcblxuICBMaXN0ZW5lck5vZGVQb29sLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbm9kZTtcbiAgICBpZiAodGhpcy50YWlsICE9PSBudWxsKSB7XG4gICAgICBub2RlID0gdGhpcy50YWlsO1xuICAgICAgdGhpcy50YWlsID0gdGhpcy50YWlsLnByZXZpb3VzO1xuICAgICAgbm9kZS5wcmV2aW91cyA9IG51bGw7XG4gICAgICByZXR1cm4gbm9kZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG5ldyBMaXN0ZW5lck5vZGUoKTtcbiAgICB9XG4gIH07XG5cbiAgTGlzdGVuZXJOb2RlUG9vbC5wcm90b3R5cGUuZGlzcG9zZSA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICBub2RlLmxpc3RlbmVyID0gbnVsbDtcbiAgICBub2RlLm9uY2UgPSBmYWxzZTtcbiAgICBub2RlLm5leHQgPSBudWxsO1xuICAgIG5vZGUucHJldmlvdXMgPSB0aGlzLnRhaWw7XG4gICAgdGhpcy50YWlsID0gbm9kZTtcbiAgfTtcblxuICBMaXN0ZW5lck5vZGVQb29sLnByb3RvdHlwZS5jYWNoZSA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICBub2RlLmxpc3RlbmVyID0gbnVsbDtcbiAgICBub2RlLnByZXZpb3VzID0gdGhpcy5jYWNoZVRhaWw7XG4gICAgdGhpcy5jYWNoZVRhaWwgPSBub2RlO1xuICB9O1xuXG4gIExpc3RlbmVyTm9kZVBvb2wucHJvdG90eXBlLnJlbGVhc2VDYWNoZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBub2RlO1xuICAgIHdoaWxlICh0aGlzLmNhY2hlVGFpbCAhPT0gbnVsbCkge1xuICAgICAgbm9kZSA9IHRoaXMuY2FjaGVUYWlsO1xuICAgICAgdGhpcy5jYWNoZVRhaWwgPSBub2RlLnByZXZpb3VzO1xuICAgICAgbm9kZS5uZXh0ID0gbnVsbDtcbiAgICAgIG5vZGUucHJldmlvdXMgPSB0aGlzLnRhaWw7XG4gICAgICB0aGlzLnRhaWwgPSBub2RlO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gTGlzdGVuZXJOb2RlUG9vbDtcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bGlzdGVuZXJfbm9kZV9wb29sLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzaCxcbiAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9O1xuXG5hc2ggPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuYXNoLnNpZ25hbHMuU2lnbmFsMCA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgX19leHRlbmRzKFNpZ25hbDAsIF9zdXBlcik7XG5cbiAgZnVuY3Rpb24gU2lnbmFsMCgpIHtcbiAgICByZXR1cm4gU2lnbmFsMC5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFNpZ25hbDAucHJvdG90eXBlLmRpc3BhdGNoID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG5vZGU7XG4gICAgdGhpcy5zdGFydERpc3BhdGNoKCk7XG4gICAgbm9kZSA9IHRoaXMuaGVhZDtcbiAgICB3aGlsZSAobm9kZSAhPT0gbnVsbCkge1xuICAgICAgbm9kZS5saXN0ZW5lcigpO1xuICAgICAgaWYgKG5vZGUub25jZSkge1xuICAgICAgICB0aGlzLnJlbW92ZShub2RlLmxpc3RlbmVyKTtcbiAgICAgIH1cbiAgICAgIG5vZGUgPSBub2RlLm5leHQ7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmVuZERpc3BhdGNoKCk7XG4gIH07XG5cbiAgcmV0dXJuIFNpZ25hbDA7XG5cbn0pKGFzaC5zaWduYWxzLlNpZ25hbEJhc2UpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zaWduYWwwLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzaCxcbiAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9O1xuXG5hc2ggPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuYXNoLnNpZ25hbHMuU2lnbmFsMSA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgX19leHRlbmRzKFNpZ25hbDEsIF9zdXBlcik7XG5cbiAgZnVuY3Rpb24gU2lnbmFsMSgpIHtcbiAgICByZXR1cm4gU2lnbmFsMS5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFNpZ25hbDEucHJvdG90eXBlLmRpc3BhdGNoID0gZnVuY3Rpb24oJDEpIHtcbiAgICB2YXIgbm9kZTtcbiAgICB0aGlzLnN0YXJ0RGlzcGF0Y2goKTtcbiAgICBub2RlID0gdGhpcy5oZWFkO1xuICAgIHdoaWxlIChub2RlICE9PSBudWxsKSB7XG4gICAgICBub2RlLmxpc3RlbmVyKCQxKTtcbiAgICAgIGlmIChub2RlLm9uY2UpIHtcbiAgICAgICAgdGhpcy5yZW1vdmUobm9kZS5saXN0ZW5lcik7XG4gICAgICB9XG4gICAgICBub2RlID0gbm9kZS5uZXh0O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5lbmREaXNwYXRjaCgpO1xuICB9O1xuXG4gIHJldHVybiBTaWduYWwxO1xuXG59KShhc2guc2lnbmFscy5TaWduYWxCYXNlKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2lnbmFsMS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc2gsXG4gIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICBfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfTtcblxuYXNoID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cbmFzaC5zaWduYWxzLlNpZ25hbDIgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gIF9fZXh0ZW5kcyhTaWduYWwyLCBfc3VwZXIpO1xuXG4gIGZ1bmN0aW9uIFNpZ25hbDIoKSB7XG4gICAgcmV0dXJuIFNpZ25hbDIuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBTaWduYWwyLnByb3RvdHlwZS5kaXNwYXRjaCA9IGZ1bmN0aW9uKCQxLCAkMikge1xuICAgIHZhciBub2RlO1xuICAgIHRoaXMuc3RhcnREaXNwYXRjaCgpO1xuICAgIG5vZGUgPSB0aGlzLmhlYWQ7XG4gICAgd2hpbGUgKG5vZGUpIHtcbiAgICAgIG5vZGUubGlzdGVuZXIoJDEsICQyKTtcbiAgICAgIGlmIChub2RlLm9uY2UpIHtcbiAgICAgICAgdGhpcy5yZW1vdmUobm9kZS5saXN0ZW5lcik7XG4gICAgICB9XG4gICAgICBub2RlID0gbm9kZS5uZXh0O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5lbmREaXNwYXRjaCgpO1xuICB9O1xuXG4gIHJldHVybiBTaWduYWwyO1xuXG59KShhc2guc2lnbmFscy5TaWduYWxCYXNlKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2lnbmFsMi5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc2gsXG4gIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICBfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfTtcblxuYXNoID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cbmFzaC5zaWduYWxzLlNpZ25hbDMgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gIF9fZXh0ZW5kcyhTaWduYWwzLCBfc3VwZXIpO1xuXG4gIGZ1bmN0aW9uIFNpZ25hbDMoKSB7XG4gICAgcmV0dXJuIFNpZ25hbDMuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBTaWduYWwzLnByb3RvdHlwZS5kaXNwYXRjaCA9IGZ1bmN0aW9uKCQxLCAkMiwgJDMpIHtcbiAgICB2YXIgbm9kZTtcbiAgICB0aGlzLnN0YXJ0RGlzcGF0Y2goKTtcbiAgICBub2RlID0gdGhpcy5oZWFkO1xuICAgIHdoaWxlIChub2RlICE9PSBudWxsKSB7XG4gICAgICBub2RlLmxpc3RlbmVyKCQxLCAkMiwgJDMpO1xuICAgICAgaWYgKG5vZGUub25jZSkge1xuICAgICAgICB0aGlzLnJlbW92ZShub2RlLmxpc3RlbmVyKTtcbiAgICAgIH1cbiAgICAgIG5vZGUgPSBub2RlLm5leHQ7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmVuZERpc3BhdGNoKCk7XG4gIH07XG5cbiAgcmV0dXJuIFNpZ25hbDM7XG5cbn0pKGFzaC5zaWduYWxzLlNpZ25hbEJhc2UpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zaWduYWwzLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIExpc3RlbmVyTm9kZVBvb2wsIGFzaDtcblxuYXNoID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cbkxpc3RlbmVyTm9kZVBvb2wgPSBhc2guc2lnbmFscy5MaXN0ZW5lck5vZGVQb29sO1xuXG5hc2guc2lnbmFscy5TaWduYWxCYXNlID0gKGZ1bmN0aW9uKCkge1xuICBTaWduYWxCYXNlLnByb3RvdHlwZS5oZWFkID0gbnVsbDtcblxuICBTaWduYWxCYXNlLnByb3RvdHlwZS50YWlsID0gbnVsbDtcblxuICBTaWduYWxCYXNlLnByb3RvdHlwZS5udW1MaXN0ZW5lcnMgPSAwO1xuXG4gIFNpZ25hbEJhc2UucHJvdG90eXBlLmtleXMgPSBudWxsO1xuXG4gIFNpZ25hbEJhc2UucHJvdG90eXBlLm5vZGVzID0gbnVsbDtcblxuICBTaWduYWxCYXNlLnByb3RvdHlwZS5saXN0ZW5lck5vZGVQb29sID0gbnVsbDtcblxuICBTaWduYWxCYXNlLnByb3RvdHlwZS50b0FkZEhlYWQgPSBudWxsO1xuXG4gIFNpZ25hbEJhc2UucHJvdG90eXBlLnRvQWRkVGFpbCA9IG51bGw7XG5cbiAgU2lnbmFsQmFzZS5wcm90b3R5cGUuZGlzcGF0Y2hpbmcgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBTaWduYWxCYXNlKCkge1xuICAgIHRoaXMubm9kZXMgPSBbXTtcbiAgICB0aGlzLmtleXMgPSBbXTtcbiAgICB0aGlzLmxpc3RlbmVyTm9kZVBvb2wgPSBuZXcgTGlzdGVuZXJOb2RlUG9vbCgpO1xuICAgIHRoaXMubnVtTGlzdGVuZXJzID0gMDtcbiAgfVxuXG4gIFNpZ25hbEJhc2UucHJvdG90eXBlLnN0YXJ0RGlzcGF0Y2ggPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmRpc3BhdGNoaW5nID0gdHJ1ZTtcbiAgfTtcblxuICBTaWduYWxCYXNlLnByb3RvdHlwZS5lbmREaXNwYXRjaCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZGlzcGF0Y2hpbmcgPSBmYWxzZTtcbiAgICBpZiAodGhpcy50b0FkZEhlYWQpIHtcbiAgICAgIGlmICghdGhpcy5oZWFkKSB7XG4gICAgICAgIHRoaXMuaGVhZCA9IHRoaXMudG9BZGRIZWFkO1xuICAgICAgICB0aGlzLnRhaWwgPSB0aGlzLnRvQWRkVGFpbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudGFpbC5uZXh0ID0gdGhpcy50b0FkZEhlYWQ7XG4gICAgICAgIHRoaXMudG9BZGRIZWFkLnByZXZpb3VzID0gdGhpcy50YWlsO1xuICAgICAgICB0aGlzLnRhaWwgPSB0aGlzLnRvQWRkVGFpbDtcbiAgICAgIH1cbiAgICAgIHRoaXMudG9BZGRIZWFkID0gbnVsbDtcbiAgICAgIHRoaXMudG9BZGRUYWlsID0gbnVsbDtcbiAgICB9XG4gICAgdGhpcy5saXN0ZW5lck5vZGVQb29sLnJlbGVhc2VDYWNoZSgpO1xuICB9O1xuXG4gIFNpZ25hbEJhc2UucHJvdG90eXBlLmdldE5vZGUgPSBmdW5jdGlvbihsaXN0ZW5lcikge1xuICAgIHZhciBub2RlO1xuICAgIG5vZGUgPSB0aGlzLmhlYWQ7XG4gICAgd2hpbGUgKG5vZGUgIT09IG51bGwpIHtcbiAgICAgIGlmIChub2RlLmxpc3RlbmVyID09PSBsaXN0ZW5lcikge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIG5vZGUgPSBub2RlLm5leHQ7XG4gICAgfVxuICAgIGlmIChub2RlID09PSBudWxsKSB7XG4gICAgICBub2RlID0gdGhpcy50b0FkZEhlYWQ7XG4gICAgICB3aGlsZSAobm9kZSAhPT0gbnVsbCkge1xuICAgICAgICBpZiAobm9kZS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBub2RlID0gbm9kZS5uZXh0O1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbm9kZTtcbiAgfTtcblxuICBTaWduYWxCYXNlLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbihsaXN0ZW5lcikge1xuICAgIHZhciBub2RlO1xuICAgIGlmICh0aGlzLmtleXMuaW5kZXhPZihsaXN0ZW5lcikgIT09IC0xKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIG5vZGUgPSB0aGlzLmxpc3RlbmVyTm9kZVBvb2wuZ2V0KCk7XG4gICAgbm9kZS5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICAgIHRoaXMubm9kZXMucHVzaChub2RlKTtcbiAgICB0aGlzLmtleXMucHVzaChsaXN0ZW5lcik7XG4gICAgdGhpcy5hZGROb2RlKG5vZGUpO1xuICB9O1xuXG4gIFNpZ25hbEJhc2UucHJvdG90eXBlLmFkZE9uY2UgPSBmdW5jdGlvbihsaXN0ZW5lcikge1xuICAgIHZhciBub2RlO1xuICAgIGlmICh0aGlzLmtleXMuaW5kZXhPZihsaXN0ZW5lcikgIT09IC0xKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIG5vZGUgPSB0aGlzLmxpc3RlbmVyTm9kZVBvb2wuZ2V0KCk7XG4gICAgbm9kZS5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICAgIG5vZGUub25jZSA9IHRydWU7XG4gICAgdGhpcy5ub2Rlcy5wdXNoKG5vZGUpO1xuICAgIHRoaXMua2V5cy5wdXNoKGxpc3RlbmVyKTtcbiAgICB0aGlzLmFkZE5vZGUobm9kZSk7XG4gIH07XG5cbiAgU2lnbmFsQmFzZS5wcm90b3R5cGUuYWRkTm9kZSA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICBpZiAodGhpcy5kaXNwYXRjaGluZykge1xuICAgICAgaWYgKHRoaXMudG9BZGRIZWFkID09PSBudWxsKSB7XG4gICAgICAgIHRoaXMudG9BZGRIZWFkID0gdGhpcy50b0FkZFRhaWwgPSBub2RlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy50b0FkZFRhaWwubmV4dCA9IG5vZGU7XG4gICAgICAgIG5vZGUucHJldmlvdXMgPSB0aGlzLnRvQWRkVGFpbDtcbiAgICAgICAgdGhpcy50b0FkZFRhaWwgPSBub2RlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5oZWFkID09PSBudWxsKSB7XG4gICAgICAgIHRoaXMuaGVhZCA9IHRoaXMudGFpbCA9IG5vZGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnRhaWwubmV4dCA9IG5vZGU7XG4gICAgICAgIG5vZGUucHJldmlvdXMgPSB0aGlzLnRhaWw7XG4gICAgICAgIHRoaXMudGFpbCA9IG5vZGU7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMubnVtTGlzdGVuZXJzKys7XG4gIH07XG5cbiAgU2lnbmFsQmFzZS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24obGlzdGVuZXIpIHtcbiAgICB2YXIgaW5kZXgsIG5vZGU7XG4gICAgaW5kZXggPSB0aGlzLmtleXMuaW5kZXhPZihsaXN0ZW5lcik7XG4gICAgbm9kZSA9IHRoaXMubm9kZXNbaW5kZXhdO1xuICAgIGlmIChub2RlKSB7XG4gICAgICBpZiAodGhpcy5oZWFkID09PSBub2RlKSB7XG4gICAgICAgIHRoaXMuaGVhZCA9IHRoaXMuaGVhZC5uZXh0O1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMudGFpbCA9PT0gbm9kZSkge1xuICAgICAgICB0aGlzLnRhaWwgPSB0aGlzLnRhaWwucHJldmlvdXM7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy50b0FkZEhlYWQgPT09IG5vZGUpIHtcbiAgICAgICAgdGhpcy50b0FkZEhlYWQgPSB0aGlzLnRvQWRkSGVhZC5uZXh0O1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMudG9BZGRUYWlsID09PSBub2RlKSB7XG4gICAgICAgIHRoaXMudG9BZGRUYWlsID0gdGhpcy50b0FkZFRhaWwucHJldmlvdXM7XG4gICAgICB9XG4gICAgICBpZiAobm9kZS5wcmV2aW91cykge1xuICAgICAgICBub2RlLnByZXZpb3VzLm5leHQgPSBub2RlLm5leHQ7XG4gICAgICB9XG4gICAgICBpZiAobm9kZS5uZXh0KSB7XG4gICAgICAgIG5vZGUubmV4dC5wcmV2aW91cyA9IG5vZGUucHJldmlvdXM7XG4gICAgICB9XG4gICAgICB0aGlzLm5vZGVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICB0aGlzLmtleXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIGlmICh0aGlzLmRpc3BhdGNoaW5nKSB7XG4gICAgICAgIHRoaXMubGlzdGVuZXJOb2RlUG9vbC5jYWNoZShub2RlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubGlzdGVuZXJOb2RlUG9vbC5kaXNwb3NlKG5vZGUpO1xuICAgICAgfVxuICAgICAgdGhpcy5udW1MaXN0ZW5lcnMtLTtcbiAgICB9XG4gIH07XG5cbiAgU2lnbmFsQmFzZS5wcm90b3R5cGUucmVtb3ZlQWxsID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG5vZGU7XG4gICAgd2hpbGUgKHRoaXMuaGVhZCkge1xuICAgICAgbm9kZSA9IHRoaXMuaGVhZDtcbiAgICAgIHRoaXMuaGVhZCA9IHRoaXMuaGVhZC5uZXh0O1xuICAgICAgdGhpcy5ub2Rlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgdGhpcy5saXN0ZW5lck5vZGVQb29sLmRpc3Bvc2Uobm9kZSk7XG4gICAgfVxuICAgIHRoaXMubm9kZXMgPSBbXTtcbiAgICB0aGlzLmtleXMgPSBbXTtcbiAgICB0aGlzLnRhaWwgPSBudWxsO1xuICAgIHRoaXMudG9BZGRIZWFkID0gbnVsbDtcbiAgICB0aGlzLnRvQWRkVGFpbCA9IG51bGw7XG4gICAgdGhpcy5udW1MaXN0ZW5lcnMgPSAwO1xuICB9O1xuXG4gIHJldHVybiBTaWduYWxCYXNlO1xuXG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zaWduYWxfYmFzZS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBTaWduYWwxLCBhc2gsXG4gIF9fYmluZCA9IGZ1bmN0aW9uKGZuLCBtZSl7IHJldHVybiBmdW5jdGlvbigpeyByZXR1cm4gZm4uYXBwbHkobWUsIGFyZ3VtZW50cyk7IH07IH0sXG4gIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICBfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfTtcblxuYXNoID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cblNpZ25hbDEgPSBhc2guc2lnbmFscy5TaWduYWwxO1xuXG5cbi8qXG4gKiBVc2VzIHRoZSBlbnRlciBmcmFtZSBldmVudCB0byBwcm92aWRlIGEgZnJhbWUgdGljayB3aGVyZSB0aGUgZnJhbWUgZHVyYXRpb24gaXMgdGhlIHRpbWUgc2luY2UgdGhlIHByZXZpb3VzIGZyYW1lLlxuICogVGhlcmUgaXMgYSBtYXhpbXVtIGZyYW1lIHRpbWUgcGFyYW1ldGVyIGluIHRoZSBjb25zdHJ1Y3RvciB0aGF0IGNhbiBiZSB1c2VkIHRvIGxpbWl0XG4gKiB0aGUgbG9uZ2VzdCBwZXJpb2QgYSBmcmFtZSBjYW4gYmUuXG4gKi9cblxuYXNoLnRpY2suRnJhbWVUaWNrUHJvdmlkZXIgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gIF9fZXh0ZW5kcyhGcmFtZVRpY2tQcm92aWRlciwgX3N1cGVyKTtcblxuICBGcmFtZVRpY2tQcm92aWRlci5wcm90b3R5cGUuZGlzcGxheU9iamVjdCA9IG51bGw7XG5cbiAgRnJhbWVUaWNrUHJvdmlkZXIucHJvdG90eXBlLnByZXZpb3VzVGltZSA9IDA7XG5cbiAgRnJhbWVUaWNrUHJvdmlkZXIucHJvdG90eXBlLm1heGltdW1GcmFtZVRpbWUgPSAwO1xuXG4gIEZyYW1lVGlja1Byb3ZpZGVyLnByb3RvdHlwZS5pc1BsYXlpbmcgPSBmYWxzZTtcblxuICBGcmFtZVRpY2tQcm92aWRlci5wcm90b3R5cGUucmVxdWVzdCA9IG51bGw7XG5cblxuICAvKlxuICAgKiBBcHBsaWVzIGEgdGltZSBhZGp1c3RlbWVudCBmYWN0b3IgdG8gdGhlIHRpY2ssIHNvIHlvdSBjYW4gc2xvdyBkb3duIG9yIHNwZWVkIHVwIHRoZSBlbnRpcmUgZW5naW5lLlxuICAgKiBUaGUgdXBkYXRlIHRpY2sgdGltZSBpcyBtdWx0aXBsaWVkIGJ5IHRoaXMgdmFsdWUsIHNvIGEgdmFsdWUgb2YgMSB3aWxsIHJ1biB0aGUgZW5naW5lIGF0IHRoZSBub3JtYWwgcmF0ZS5cbiAgICovXG5cbiAgRnJhbWVUaWNrUHJvdmlkZXIucHJvdG90eXBlLnRpbWVBZGp1c3RtZW50ID0gMTtcblxuICBmdW5jdGlvbiBGcmFtZVRpY2tQcm92aWRlcihkaXNwbGF5T2JqZWN0LCBtYXhpbXVtRnJhbWVUaW1lKSB7XG4gICAgdGhpcy5kaXNwbGF5T2JqZWN0ID0gZGlzcGxheU9iamVjdDtcbiAgICB0aGlzLm1heGltdW1GcmFtZVRpbWUgPSBtYXhpbXVtRnJhbWVUaW1lO1xuICAgIHRoaXMuZGlzcGF0Y2hUaWNrID0gX19iaW5kKHRoaXMuZGlzcGF0Y2hUaWNrLCB0aGlzKTtcbiAgICBGcmFtZVRpY2tQcm92aWRlci5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKEZyYW1lVGlja1Byb3ZpZGVyLnByb3RvdHlwZSwge1xuICAgIHBsYXlpbmc6IHtcbiAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzUGxheWluZztcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIEZyYW1lVGlja1Byb3ZpZGVyLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmVxdWVzdCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmRpc3BhdGNoVGljayk7XG4gICAgdGhpcy5pc1BsYXlpbmcgPSB0cnVlO1xuICB9O1xuXG4gIEZyYW1lVGlja1Byb3ZpZGVyLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24oKSB7XG4gICAgY2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMucmVxdWVzdCk7XG4gICAgdGhpcy5pc1BsYXlpbmcgPSBmYWxzZTtcbiAgfTtcblxuICBGcmFtZVRpY2tQcm92aWRlci5wcm90b3R5cGUuZGlzcGF0Y2hUaWNrID0gZnVuY3Rpb24odGltZXN0YW1wKSB7XG4gICAgdmFyIGZyYW1lVGltZSwgdGVtcDtcbiAgICBpZiAodGltZXN0YW1wID09IG51bGwpIHtcbiAgICAgIHRpbWVzdGFtcCA9IERhdGUubm93KCk7XG4gICAgfVxuICAgIGlmICh0aGlzLmRpc3BsYXlPYmplY3QpIHtcbiAgICAgIHRoaXMuZGlzcGxheU9iamVjdC5iZWdpbigpO1xuICAgIH1cbiAgICB0ZW1wID0gdGhpcy5wcmV2aW91c1RpbWUgfHwgdGltZXN0YW1wO1xuICAgIHRoaXMucHJldmlvdXNUaW1lID0gdGltZXN0YW1wO1xuICAgIGZyYW1lVGltZSA9ICh0aW1lc3RhbXAgLSB0ZW1wKSAqIDAuMDAxO1xuICAgIHRoaXMuZGlzcGF0Y2goZnJhbWVUaW1lKTtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5kaXNwYXRjaFRpY2spO1xuICAgIGlmICh0aGlzLmRpc3BsYXlPYmplY3QpIHtcbiAgICAgIHRoaXMuZGlzcGxheU9iamVjdC5lbmQoKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIEZyYW1lVGlja1Byb3ZpZGVyO1xuXG59KShTaWduYWwxKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZnJhbWVfdGlja19wcm92aWRlci5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBEaWN0aW9uYXJ5LCBhc2gsXG4gIF9faW5kZXhPZiA9IFtdLmluZGV4T2YgfHwgZnVuY3Rpb24oaXRlbSkgeyBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7IGlmIChpIGluIHRoaXMgJiYgdGhpc1tpXSA9PT0gaXRlbSkgcmV0dXJuIGk7IH0gcmV0dXJuIC0xOyB9O1xuXG5hc2ggPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuRGljdGlvbmFyeSA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gRGljdGlvbmFyeSgpIHt9XG5cbiAgcmV0dXJuIERpY3Rpb25hcnk7XG5cbn0pKCk7XG5cblxuLypcbiAqIEFuIG9iamVjdCBwb29sIGZvciByZS11c2luZyBjb21wb25lbnRzLiBUaGlzIGlzIG5vdCBpbnRlZ3JhdGVkIGluIHRvIEFzaCBidXQgaXMgdXNlZCBkaWVyZWN0bHkgYnlcbiAqIHRoZSBkZXZlbG9wZXIuIEl0IGV4cGVjdHMgY29tcG9uZW50cyB0byBub3QgcmVxdWlyZSBhbnkgcGFyYW1ldGVycyBpbiB0aGVpciBjb25zdHJ1Y3Rvci5cbiAqXG4gKiA8cD5GZXRjaCBhbiBvYmplY3QgZnJvbSB0aGUgcG9vbCB3aXRoPC9wPlxuICpcbiAqIDxwPkNvbXBvbmVudFBvb2wuZ2V0KCBDb21wb25lbnRDbGFzcyApOzwvcD5cbiAqXG4gKiA8cD5JZiB0aGUgcG9vbCBjb250YWlucyBhbiBvYmplY3Qgb2YgdGhlIHJlcXVpcmVkIHR5cGUsIGl0IHdpbGwgYmUgcmV0dXJuZWQuIElmIGl0IGRvZXMgbm90LCBhIG5ldyBvYmplY3RcbiAqIHdpbGwgYmUgY3JlYXRlZCBhbmQgcmV0dXJuZWQuPC9wPlxuICpcbiAqIDxwPlRoZSBvYmplY3QgcmV0dXJuZWQgbWF5IGhhdmUgcHJvcGVydGllcyBzZXQgb24gaXQgZnJvbSB0aGUgdGltZSBpdCB3YXMgcHJldmlvdXNseSB1c2VkLCBzbyBhbGwgcHJvcGVydGllc1xuICogc2hvdWxkIGJlIHJlc2V0IGluIHRoZSBvYmplY3Qgb25jZSBpdCBpcyByZWNlaXZlZC48L3A+XG4gKlxuICogPHA+QWRkIGFuIG9iamVjdCB0byB0aGUgcG9vbCB3aXRoPC9wPlxuICpcbiAqIDxwPkNvbXBvbmVudFBvb2wuZGlzcG9zZSggY29tcG9uZW50ICk7PC9wPlxuICpcbiAqIDxwPllvdSB3aWxsIHVzdWFsbHkgd2FudCB0byBkbyB0aGlzIHdoZW4gcmVtb3ZpbmcgYSBjb21wb25lbnQgZnJvbSBhbiBlbnRpdHkuIFRoZSByZW1vdmUgbWV0aG9kIG9uIHRoZSBlbnRpdHlcbiAqIHJldHVybnMgdGhlIGNvbXBvbmVudCB0aGF0IHdhcyByZW1vdmVkLCBzbyB0aGlzIGNhbiBiZSBkb25lIGluIG9uZSBsaW5lIG9mIGNvZGUgbGlrZSB0aGlzPC9wPlxuICpcbiAqIDxwPkNvbXBvbmVudFBvb2wuZGlzcG9zZSggZW50aXR5LnJlbW92ZSggY29tcG9uZW50ICkgKTs8L3A+XG4gKi9cblxuYXNoLnRvb2xzLkNvbXBvbmVudFBvb2wgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBnZXRQb29sLCBwb29scztcblxuICBmdW5jdGlvbiBDb21wb25lbnRQb29sKCkge31cblxuICBwb29scyA9IG5ldyBEaWN0aW9uYXJ5KCk7XG5cbiAgZ2V0UG9vbCA9IGZ1bmN0aW9uKGNvbXBvbmVudENsYXNzKSB7XG4gICAgdmFyIF9yZWY7XG4gICAgaWYgKChfcmVmID0gY29tcG9uZW50Q2xhc3MubmFtZSwgX19pbmRleE9mLmNhbGwocG9vbHMsIF9yZWYpID49IDApKSB7XG4gICAgICByZXR1cm4gcG9vbHNbY29tcG9uZW50Q2xhc3MubmFtZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBwb29sc1tjb21wb25lbnRDbGFzcy5uYW1lXSA9IFtdO1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gICAqIEdldCBhbiBvYmplY3QgZnJvbSB0aGUgcG9vbC5cbiAgICpcbiAgICogQHBhcmFtIGNvbXBvbmVudENsYXNzIFRoZSB0eXBlIG9mIGNvbXBvbmVudCB3YW50ZWQuXG4gICAqIEByZXR1cm4gVGhlIGNvbXBvbmVudC5cbiAgICovXG5cbiAgQ29tcG9uZW50UG9vbC5nZXQgPSBmdW5jdGlvbihjb21wb25lbnRDbGFzcykge1xuICAgIHZhciBwb29sO1xuICAgIHBvb2wgPSBnZXRQb29sKGNvbXBvbmVudENsYXNzKTtcbiAgICBpZiAocG9vbC5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gcG9vbC5wb3AoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG5ldyBjb21wb25lbnRDbGFzcygpO1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gICAqIFJldHVybiBhbiBvYmplY3QgdG8gdGhlIHBvb2wgZm9yIHJldXNlLlxuICAgKlxuICAgKiBAcGFyYW0gY29tcG9uZW50IFRoZSBjb21wb25lbnQgdG8gcmV0dXJuIHRvIHRoZSBwb29sLlxuICAgKi9cblxuICBDb21wb25lbnRQb29sLmRpc3Bvc2UgPSBmdW5jdGlvbihjb21wb25lbnQpIHtcbiAgICB2YXIgcG9vbCwgdHlwZTtcbiAgICBpZiAoY29tcG9uZW50KSB7XG4gICAgICB0eXBlID0gY29tcG9uZW50LmNvbnN0cnVjdG9yO1xuICAgICAgcG9vbCA9IGdldFBvb2wodHlwZSk7XG4gICAgICBwb29sLnB1c2goY29tcG9uZW50KTtcbiAgICB9XG4gIH07XG5cblxuICAvKlxuICAgKiBEaXNwb3NlIG9mIGFsbCBwb29sZWQgcmVzb3VyY2VzLCBmcmVlaW5nIHRoZW0gZm9yIGdhcmJhZ2UgY29sbGVjdGlvbi5cbiAgICovXG5cbiAgQ29tcG9uZW50UG9vbC5lbXB0eSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBwb29scyA9IG5ldyBEaWN0aW9uYXJ5KCk7XG4gIH07XG5cbiAgcmV0dXJuIENvbXBvbmVudFBvb2w7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNvbXBvbmVudF9wb29sLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIEVuZ2luZSwgTm9kZSwgTm9kZUxpc3QsIFN5c3RlbSwgYXNoLFxuICBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgX19leHRlbmRzID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChfX2hhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH07XG5cbmFzaCA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5FbmdpbmUgPSBhc2guY29yZS5FbmdpbmU7XG5cbk5vZGUgPSBhc2guY29yZS5Ob2RlO1xuXG5Ob2RlTGlzdCA9IGFzaC5jb3JlLk5vZGVMaXN0O1xuXG5TeXN0ZW0gPSBhc2guY29yZS5TeXN0ZW07XG5cblxuLypcbiAqIEEgdXNlZnVsIGNsYXNzIGZvciBzeXN0ZW1zIHdoaWNoIHNpbXBseSBpdGVyYXRlIG92ZXIgYSBzZXQgb2Ygbm9kZXMsIHBlcmZvcm1pbmcgdGhlIHNhbWUgYWN0aW9uIG9uIGVhY2ggbm9kZS4gVGhpc1xuICogY2xhc3MgcmVtb3ZlcyB0aGUgbmVlZCBmb3IgYSBsb3Qgb2YgYm9pbGVycGxhdGUgY29kZSBpbiBzdWNoIHN5c3RlbXMuIEV4dGVuZCB0aGlzIGNsYXNzIGFuZCBwYXNzIHRoZSBub2RlIHR5cGUgYW5kXG4gKiBhIG5vZGUgdXBkYXRlIG1ldGhvZCBpbnRvIHRoZSBjb25zdHJ1Y3Rvci4gVGhlIG5vZGUgdXBkYXRlIG1ldGhvZCB3aWxsIGJlIGNhbGxlZCBvbmNlIHBlciBub2RlIG9uIHRoZSB1cGRhdGUgY3ljbGVcbiAqIHdpdGggdGhlIG5vZGUgaW5zdGFuY2UgYW5kIHRoZSBmcmFtZSB0aW1lIGFzIHBhcmFtZXRlcnMuIGUuZy5cbiAqXG4gKiA8Y29kZT5wYWNrYWdlO1xuICogY2xhc3MgTXlTeXN0ZW0gZXh0ZW5kcyBMaXN0SXRlcmF0aW5nU3lzdGVtPE15Tm9kZT5cbiAqIHtcbiAqICAgICBwdWJsaWMgZnVuY3Rpb24gbmV3KClcbiAqICAgICB7XG4gKiAgICAgICAgIHN1cGVyKE15Tm9kZSwgdXBkYXRlTm9kZSk7XG4gKiAgICAgfVxuICpcbiAqICAgICBwcml2YXRlIGZ1bmN0aW9uIHVwZGF0ZU5vZGUobm9kZTpNeU5vZGUsIHRpbWU6RmxvYXQpOlZvaWRcbiAqICAgICB7XG4gKiAgICAgICAgIC8vIHByb2Nlc3MgdGhlIG5vZGUgaGVyZVxuICogICAgIH1cbiAqIH1cbiAqIDwvY29kZT5cbiAqL1xuXG5hc2gudG9vbHMuTGlzdEl0ZXJhdGluZ1N5c3RlbSA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgX19leHRlbmRzKExpc3RJdGVyYXRpbmdTeXN0ZW0sIF9zdXBlcik7XG5cbiAgTGlzdEl0ZXJhdGluZ1N5c3RlbS5wcm90b3R5cGUubm9kZUxpc3QgPSBudWxsO1xuXG4gIExpc3RJdGVyYXRpbmdTeXN0ZW0ucHJvdG90eXBlLm5vZGVDbGFzcyA9IG51bGw7XG5cbiAgTGlzdEl0ZXJhdGluZ1N5c3RlbS5wcm90b3R5cGUubm9kZVVwZGF0ZUZ1bmN0aW9uID0gbnVsbDtcblxuICBMaXN0SXRlcmF0aW5nU3lzdGVtLnByb3RvdHlwZS5ub2RlQWRkZWRGdW5jdGlvbiA9IG51bGw7XG5cbiAgTGlzdEl0ZXJhdGluZ1N5c3RlbS5wcm90b3R5cGUubm9kZVJlbW92ZWRGdW5jdGlvbiA9IG51bGw7XG5cbiAgZnVuY3Rpb24gTGlzdEl0ZXJhdGluZ1N5c3RlbShub2RlQ2xhc3MsIG5vZGVVcGRhdGVGdW5jdGlvbiwgbm9kZUFkZGVkRnVuY3Rpb24sIG5vZGVSZW1vdmVkRnVuY3Rpb24pIHtcbiAgICBpZiAobm9kZUFkZGVkRnVuY3Rpb24gPT0gbnVsbCkge1xuICAgICAgbm9kZUFkZGVkRnVuY3Rpb24gPSBudWxsO1xuICAgIH1cbiAgICBpZiAobm9kZVJlbW92ZWRGdW5jdGlvbiA9PSBudWxsKSB7XG4gICAgICBub2RlUmVtb3ZlZEZ1bmN0aW9uID0gbnVsbDtcbiAgICB9XG4gICAgdGhpcy5ub2RlQ2xhc3MgPSBub2RlQ2xhc3M7XG4gICAgdGhpcy5ub2RlVXBkYXRlRnVuY3Rpb24gPSBub2RlVXBkYXRlRnVuY3Rpb247XG4gICAgdGhpcy5ub2RlQWRkZWRGdW5jdGlvbiA9IG5vZGVBZGRlZEZ1bmN0aW9uO1xuICAgIHRoaXMubm9kZVJlbW92ZWRGdW5jdGlvbiA9IG5vZGVSZW1vdmVkRnVuY3Rpb247XG4gIH1cblxuICBMaXN0SXRlcmF0aW5nU3lzdGVtLnByb3RvdHlwZS5hZGRUb0VuZ2luZSA9IGZ1bmN0aW9uKGVuZ2luZSkge1xuICAgIHZhciBub2RlO1xuICAgIHRoaXMubm9kZUxpc3QgPSBlbmdpbmUuZ2V0Tm9kZUxpc3QodGhpcy5ub2RlQ2xhc3MpO1xuICAgIGlmICh0aGlzLm5vZGVBZGRlZEZ1bmN0aW9uICE9PSBudWxsKSB7XG4gICAgICBub2RlID0gdGhpcy5ub2RlTGlzdC5oZWFkO1xuICAgICAgd2hpbGUgKG5vZGUpIHtcbiAgICAgICAgdGhpcy5ub2RlQWRkZWRGdW5jdGlvbihub2RlKTtcbiAgICAgICAgbm9kZSA9IG5vZGUubmV4dDtcbiAgICAgIH1cbiAgICAgIHRoaXMubm9kZUxpc3Qubm9kZUFkZGVkLmFkZCh0aGlzLm5vZGVBZGRlZEZ1bmN0aW9uKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubm9kZVJlbW92ZWRGdW5jdGlvbiAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5ub2RlTGlzdC5ub2RlUmVtb3ZlZC5hZGQodGhpcy5ub2RlUmVtb3ZlZEZ1bmN0aW9uKTtcbiAgICB9XG4gIH07XG5cbiAgTGlzdEl0ZXJhdGluZ1N5c3RlbS5wcm90b3R5cGUucmVtb3ZlRnJvbUVuZ2luZSA9IGZ1bmN0aW9uKGVuZ2luZSkge1xuICAgIGlmICh0aGlzLm5vZGVBZGRlZEZ1bmN0aW9uICE9PSBudWxsKSB7XG4gICAgICB0aGlzLm5vZGVMaXN0Lm5vZGVBZGRlZC5yZW1vdmUodGhpcy5ub2RlQWRkZWRGdW5jdGlvbik7XG4gICAgfVxuICAgIGlmICh0aGlzLm5vZGVSZW1vdmVkRnVuY3Rpb24gIT09IG51bGwpIHtcbiAgICAgIHRoaXMubm9kZUxpc3Qubm9kZVJlbW92ZWQucmVtb3ZlKHRoaXMubm9kZVJlbW92ZWRGdW5jdGlvbik7XG4gICAgfVxuICAgIHRoaXMubm9kZUxpc3QgPSBudWxsO1xuICB9O1xuXG4gIExpc3RJdGVyYXRpbmdTeXN0ZW0ucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKHRpbWUpIHtcbiAgICB2YXIgbm9kZTtcbiAgICBub2RlID0gdGhpcy5ub2RlTGlzdC5oZWFkO1xuICAgIHdoaWxlIChub2RlKSB7XG4gICAgICB0aGlzLm5vZGVVcGRhdGVGdW5jdGlvbihub2RlLCB0aW1lKTtcbiAgICAgIG5vZGUgPSBub2RlLm5leHQ7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBMaXN0SXRlcmF0aW5nU3lzdGVtO1xuXG59KShTeXN0ZW0pO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1saXN0X2l0ZXJhdGluZ19zeXN0ZW0uanMubWFwXG4iLCJcbi8qXG5cbiAgIF8gICAgICAgX1xuICAvX1xcICBfX198IHxfX1xuIC8vX1xcXFwvIF9ffCAnXyBcXFxuLyAgXyAgXFxfXyBcXCB8IHwgfFxuXFxfLyBcXF8vX19fL198IHxffFxuXG4gICAgICAgICAgICAgIF9fICBfX1xuICAgIF9fXyBfX18gIC8gX3wvIF98IF9fXyAgX19fXG4gICAvIF9fLyBfIFxcfCB8X3wgfF8gLyBfIFxcLyBfIFxcXG4gIHwgKF98IChfKSB8ICBffCAgX3wgIF9fLyAgX18vXG4gKF8pX19fXFxfX18vfF98IHxffCAgXFxfX198XFxfX198XG5cblxuQ29weXJpZ2h0IChjKSAyMDE1IEJydWNlIERhdmlkc29uICZsdDtkYXJrb3ZlcmxvcmRvZmRhdGFAZ21haWwuY29tJmd0O1xuXG5BdXRob3I6IFJpY2hhcmQgTG9yZFxuQ29weXJpZ2h0IChjKSBSaWNoYXJkIExvcmQgMjAxMS0yMDEyXG5odHRwOi8vd3d3LnJpY2hhcmRsb3JkLm5ldFxuXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZ1xuYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4nU29mdHdhcmUnKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG53aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG5kaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG9cbnBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0b1xudGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZVxuaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCAnQVMgSVMnLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG5NRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuXG5JTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWVxuQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCxcblRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFXG5TT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xudmFyIGFzaDtcblxubW9kdWxlLmV4cG9ydHMgPSBhc2ggPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIGFzaCgpIHt9XG5cbiAgcmV0dXJuIGFzaDtcblxufSkoKTtcblxuYXNoLnNpZ25hbHMgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIHNpZ25hbHMoKSB7fVxuXG4gIHJldHVybiBzaWduYWxzO1xuXG59KSgpO1xuXG5yZXF1aXJlKCcuL2FzaC9zaWduYWxzL2xpc3RlbmVyX25vZGUnKTtcblxucmVxdWlyZSgnLi9hc2gvc2lnbmFscy9saXN0ZW5lcl9ub2RlX3Bvb2wnKTtcblxucmVxdWlyZSgnLi9hc2gvc2lnbmFscy9zaWduYWxfYmFzZScpO1xuXG5yZXF1aXJlKCcuL2FzaC9zaWduYWxzL3NpZ25hbDAnKTtcblxucmVxdWlyZSgnLi9hc2gvc2lnbmFscy9zaWduYWwxJyk7XG5cbnJlcXVpcmUoJy4vYXNoL3NpZ25hbHMvc2lnbmFsMicpO1xuXG5yZXF1aXJlKCcuL2FzaC9zaWduYWxzL3NpZ25hbDMnKTtcblxuYXNoLmNvcmUgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIGNvcmUoKSB7fVxuXG4gIHJldHVybiBjb3JlO1xuXG59KSgpO1xuXG5yZXF1aXJlKCcuL2FzaC9jb3JlL2VudGl0eScpO1xuXG5yZXF1aXJlKCcuL2FzaC9jb3JlL2VudGl0eV9saXN0Jyk7XG5cbnJlcXVpcmUoJy4vYXNoL2NvcmUvbm9kZScpO1xuXG5yZXF1aXJlKCcuL2FzaC9jb3JlL25vZGVfbGlzdCcpO1xuXG5yZXF1aXJlKCcuL2FzaC9jb3JlL25vZGVfcG9vbCcpO1xuXG5yZXF1aXJlKCcuL2FzaC9jb3JlL3N5c3RlbScpO1xuXG5yZXF1aXJlKCcuL2FzaC9jb3JlL3N5c3RlbV9saXN0Jyk7XG5cbnJlcXVpcmUoJy4vYXNoL2NvcmUvZmFtaWx5Jyk7XG5cbnJlcXVpcmUoJy4vYXNoL2NvcmUvY29tcG9uZW50X21hdGNoaW5nX2ZhbWlseScpO1xuXG5yZXF1aXJlKCcuL2FzaC9jb3JlL2VuZ2luZScpO1xuXG5hc2guZnNtID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBmc20oKSB7fVxuXG4gIHJldHVybiBmc207XG5cbn0pKCk7XG5cbnJlcXVpcmUoJy4vYXNoL2ZzbS9jb21wb25lbnRfaW5zdGFuY2VfcHJvdmlkZXInKTtcblxucmVxdWlyZSgnLi9hc2gvZnNtL2NvbXBvbmVudF9zaW5nbGV0b25fcHJvdmlkZXInKTtcblxucmVxdWlyZSgnLi9hc2gvZnNtL2NvbXBvbmVudF90eXBlX3Byb3ZpZGVyJyk7XG5cbnJlcXVpcmUoJy4vYXNoL2ZzbS9keW5hbWljX2NvbXBvbmVudF9wcm92aWRlcicpO1xuXG5yZXF1aXJlKCcuL2FzaC9mc20vZHluYW1pY19zeXN0ZW1fcHJvdmlkZXInKTtcblxucmVxdWlyZSgnLi9hc2gvZnNtL2VuZ2luZV9zdGF0ZScpO1xuXG5yZXF1aXJlKCcuL2FzaC9mc20vc3RhdGVfY29tcG9uZW50X21hcHBpbmcnKTtcblxucmVxdWlyZSgnLi9hc2gvZnNtL2VuZ2luZV9zdGF0ZV9tYWNoaW5lJyk7XG5cbnJlcXVpcmUoJy4vYXNoL2ZzbS9lbnRpdHlfc3RhdGUnKTtcblxucmVxdWlyZSgnLi9hc2gvZnNtL2VudGl0eV9zdGF0ZV9tYWNoaW5lJyk7XG5cbnJlcXVpcmUoJy4vYXNoL2ZzbS9zdGF0ZV9zeXN0ZW1fbWFwcGluZycpO1xuXG5yZXF1aXJlKCcuL2FzaC9mc20vc3lzdGVtX2luc3RhbmNlX3Byb3ZpZGVyJyk7XG5cbnJlcXVpcmUoJy4vYXNoL2ZzbS9zeXN0ZW1fc2luZ2xldG9uX3Byb3ZpZGVyJyk7XG5cbmFzaC50aWNrID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiB0aWNrKCkge31cblxuICByZXR1cm4gdGljaztcblxufSkoKTtcblxucmVxdWlyZSgnLi9hc2gvdGljay9mcmFtZV90aWNrX3Byb3ZpZGVyJyk7XG5cbmFzaC50b29scyA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gdG9vbHMoKSB7fVxuXG4gIHJldHVybiB0b29scztcblxufSkoKTtcblxucmVxdWlyZSgnLi9hc2gvdG9vbHMvY29tcG9uZW50X3Bvb2wnKTtcblxucmVxdWlyZSgnLi9hc2gvdG9vbHMvbGlzdF9pdGVyYXRpbmdfc3lzdGVtJyk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcFxuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Rpc3QvbGliJyk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyIEFuaW1hdGlvblN5c3RlbSwgQXVkaW9TeXN0ZW0sIEJ1bGxldEFnZVN5c3RlbSwgQ29sbGlzaW9uU3lzdGVtLCBEZWF0aFRocm9lc1N5c3RlbSwgRW50aXR5Q3JlYXRvciwgR2FtZUNvbmZpZywgR2FtZU1hbmFnZXIsIEdhbWVTdGF0ZSwgR3VuQ29udHJvbFN5c3RlbSwgSHVkU3lzdGVtLCBLZXlQb2xsLCBNb3ZlbWVudFN5c3RlbSwgUGh5c2ljc0NvbnRyb2xTeXN0ZW0sIFBoeXNpY3NTeXN0ZW0sIFJlbmRlclN5c3RlbSwgU3lzdGVtUHJpb3JpdGllcywgV2FpdEZvclN0YXJ0U3lzdGVtLCBhc2gsIGFzdGVyb2lkcywgYjJWZWMyLCBiMldvcmxkO1xuXG5hc2ggPSByZXF1aXJlKCdhc2guY29mZmVlJyk7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uL2luZGV4Jyk7XG5cbkFuaW1hdGlvblN5c3RlbSA9IGFzdGVyb2lkcy5zeXN0ZW1zLkFuaW1hdGlvblN5c3RlbTtcblxuQXVkaW9TeXN0ZW0gPSBhc3Rlcm9pZHMuc3lzdGVtcy5BdWRpb1N5c3RlbTtcblxuQnVsbGV0QWdlU3lzdGVtID0gYXN0ZXJvaWRzLnN5c3RlbXMuQnVsbGV0QWdlU3lzdGVtO1xuXG5Db2xsaXNpb25TeXN0ZW0gPSBhc3Rlcm9pZHMuc3lzdGVtcy5Db2xsaXNpb25TeXN0ZW07XG5cbkRlYXRoVGhyb2VzU3lzdGVtID0gYXN0ZXJvaWRzLnN5c3RlbXMuRGVhdGhUaHJvZXNTeXN0ZW07XG5cbkdhbWVNYW5hZ2VyID0gYXN0ZXJvaWRzLnN5c3RlbXMuR2FtZU1hbmFnZXI7XG5cbkd1bkNvbnRyb2xTeXN0ZW0gPSBhc3Rlcm9pZHMuc3lzdGVtcy5HdW5Db250cm9sU3lzdGVtO1xuXG5IdWRTeXN0ZW0gPSBhc3Rlcm9pZHMuc3lzdGVtcy5IdWRTeXN0ZW07XG5cbk1vdmVtZW50U3lzdGVtID0gYXN0ZXJvaWRzLnN5c3RlbXMuTW92ZW1lbnRTeXN0ZW07XG5cblJlbmRlclN5c3RlbSA9IGFzdGVyb2lkcy5zeXN0ZW1zLlJlbmRlclN5c3RlbTtcblxuU3lzdGVtUHJpb3JpdGllcyA9IGFzdGVyb2lkcy5zeXN0ZW1zLlN5c3RlbVByaW9yaXRpZXM7XG5cbldhaXRGb3JTdGFydFN5c3RlbSA9IGFzdGVyb2lkcy5zeXN0ZW1zLldhaXRGb3JTdGFydFN5c3RlbTtcblxuUGh5c2ljc1N5c3RlbSA9IGFzdGVyb2lkcy5zeXN0ZW1zLlBoeXNpY3NTeXN0ZW07XG5cblBoeXNpY3NDb250cm9sU3lzdGVtID0gYXN0ZXJvaWRzLnN5c3RlbXMuUGh5c2ljc0NvbnRyb2xTeXN0ZW07XG5cbkdhbWVTdGF0ZSA9IGFzdGVyb2lkcy5jb21wb25lbnRzLkdhbWVTdGF0ZTtcblxuRW50aXR5Q3JlYXRvciA9IGFzdGVyb2lkcy5FbnRpdHlDcmVhdG9yO1xuXG5HYW1lQ29uZmlnID0gYXN0ZXJvaWRzLkdhbWVDb25maWc7XG5cbktleVBvbGwgPSBhc3Rlcm9pZHMudWkuS2V5UG9sbDtcblxuYjJWZWMyID0gQm94MkQuQ29tbW9uLk1hdGguYjJWZWMyO1xuXG5iMldvcmxkID0gQm94MkQuRHluYW1pY3MuYjJXb3JsZDtcblxuYXN0ZXJvaWRzLkFzdGVyb2lkcyA9IChmdW5jdGlvbigpIHtcbiAgQXN0ZXJvaWRzLnByb3RvdHlwZS5jb250YWluZXIgPSBudWxsO1xuXG4gIEFzdGVyb2lkcy5wcm90b3R5cGUuZW5naW5lID0gbnVsbDtcblxuICBBc3Rlcm9pZHMucHJvdG90eXBlLnRpY2tQcm92aWRlciA9IG51bGw7XG5cbiAgQXN0ZXJvaWRzLnByb3RvdHlwZS5jcmVhdG9yID0gbnVsbDtcblxuICBBc3Rlcm9pZHMucHJvdG90eXBlLmtleVBvbGwgPSBudWxsO1xuXG4gIEFzdGVyb2lkcy5wcm90b3R5cGUuY29uZmlnID0gbnVsbDtcblxuICBBc3Rlcm9pZHMucHJvdG90eXBlLndvcmxkID0gbnVsbDtcblxuICBmdW5jdGlvbiBBc3Rlcm9pZHMoY29udGFpbmVyLCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG4gICAgdGhpcy5wcmVwYXJlKHdpZHRoLCBoZWlnaHQpO1xuICB9XG5cbiAgQXN0ZXJvaWRzLnByb3RvdHlwZS5wcmVwYXJlID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCkge1xuICAgIHRoaXMud29ybGQgPSBuZXcgYjJXb3JsZChuZXcgYjJWZWMyKDAsIDApLCB0cnVlKTtcbiAgICB0aGlzLndvcmxkLlNldENvbnRpbnVvdXNQaHlzaWNzKHRydWUpO1xuICAgIHRoaXMuZW5naW5lID0gbmV3IGFzaC5jb3JlLkVuZ2luZSgpO1xuICAgIHRoaXMuY3JlYXRvciA9IG5ldyBFbnRpdHlDcmVhdG9yKHRoaXMuZW5naW5lLCB0aGlzLndvcmxkKTtcbiAgICB0aGlzLmtleVBvbGwgPSBuZXcgS2V5UG9sbCh3aW5kb3cpO1xuICAgIHRoaXMuY29uZmlnID0gbmV3IEdhbWVDb25maWcoKTtcbiAgICB0aGlzLmNvbmZpZy5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgdGhpcy5jb25maWcud2lkdGggPSB3aWR0aDtcbiAgICB0aGlzLmVuZ2luZS5hZGRTeXN0ZW0obmV3IFdhaXRGb3JTdGFydFN5c3RlbSh0aGlzLmNyZWF0b3IpLCBTeXN0ZW1Qcmlvcml0aWVzLnByZVVwZGF0ZSk7XG4gICAgdGhpcy5lbmdpbmUuYWRkU3lzdGVtKG5ldyBHYW1lTWFuYWdlcih0aGlzLmNyZWF0b3IsIHRoaXMuY29uZmlnKSwgU3lzdGVtUHJpb3JpdGllcy5wcmVVcGRhdGUpO1xuICAgIHRoaXMuZW5naW5lLmFkZFN5c3RlbShuZXcgUGh5c2ljc0NvbnRyb2xTeXN0ZW0odGhpcy5rZXlQb2xsKSwgU3lzdGVtUHJpb3JpdGllcy51cGRhdGUpO1xuICAgIHRoaXMuZW5naW5lLmFkZFN5c3RlbShuZXcgR3VuQ29udHJvbFN5c3RlbSh0aGlzLmtleVBvbGwsIHRoaXMuY3JlYXRvciksIFN5c3RlbVByaW9yaXRpZXMudXBkYXRlKTtcbiAgICB0aGlzLmVuZ2luZS5hZGRTeXN0ZW0obmV3IEJ1bGxldEFnZVN5c3RlbSh0aGlzLmNyZWF0b3IpLCBTeXN0ZW1Qcmlvcml0aWVzLnVwZGF0ZSk7XG4gICAgdGhpcy5lbmdpbmUuYWRkU3lzdGVtKG5ldyBEZWF0aFRocm9lc1N5c3RlbSh0aGlzLmNyZWF0b3IpLCBTeXN0ZW1Qcmlvcml0aWVzLnVwZGF0ZSk7XG4gICAgdGhpcy5lbmdpbmUuYWRkU3lzdGVtKG5ldyBQaHlzaWNzU3lzdGVtKHRoaXMuY29uZmlnLCB0aGlzLndvcmxkKSwgU3lzdGVtUHJpb3JpdGllcy5tb3ZlKTtcbiAgICB0aGlzLmVuZ2luZS5hZGRTeXN0ZW0obmV3IENvbGxpc2lvblN5c3RlbSh0aGlzLndvcmxkLCB0aGlzLmNyZWF0b3IpLCBTeXN0ZW1Qcmlvcml0aWVzLnJlc29sdmVDb2xsaXNpb25zKTtcbiAgICB0aGlzLmVuZ2luZS5hZGRTeXN0ZW0obmV3IEFuaW1hdGlvblN5c3RlbSgpLCBTeXN0ZW1Qcmlvcml0aWVzLmFuaW1hdGUpO1xuICAgIHRoaXMuZW5naW5lLmFkZFN5c3RlbShuZXcgSHVkU3lzdGVtKCksIFN5c3RlbVByaW9yaXRpZXMuYW5pbWF0ZSk7XG4gICAgdGhpcy5lbmdpbmUuYWRkU3lzdGVtKG5ldyBSZW5kZXJTeXN0ZW0odGhpcy5jb250YWluZXIpLCBTeXN0ZW1Qcmlvcml0aWVzLnJlbmRlcik7XG4gICAgdGhpcy5lbmdpbmUuYWRkU3lzdGVtKG5ldyBBdWRpb1N5c3RlbSgpLCBTeXN0ZW1Qcmlvcml0aWVzLnJlbmRlcik7XG4gICAgdGhpcy5jcmVhdG9yLmNyZWF0ZVdhaXRGb3JDbGljaygpO1xuICAgIHRoaXMuY3JlYXRvci5jcmVhdGVHYW1lKCk7XG4gIH07XG5cbiAgQXN0ZXJvaWRzLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzdGF0cywgeCwgeTtcbiAgICBpZiAobmF2aWdhdG9yLmlzQ29jb29uSlMpIHtcbiAgICAgIHN0YXRzID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgeCA9IE1hdGguZmxvb3IodGhpcy5jb25maWcud2lkdGggLyAyKSAtIDQwO1xuICAgICAgeSA9IDA7XG4gICAgICBzdGF0cyA9IG5ldyBTdGF0cygpO1xuICAgICAgc3RhdHMuc2V0TW9kZSgwKTtcbiAgICAgIHN0YXRzLmRvbUVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG4gICAgICBzdGF0cy5kb21FbGVtZW50LnN0eWxlLmxlZnQgPSBcIlwiICsgeCArIFwicHhcIjtcbiAgICAgIHN0YXRzLmRvbUVsZW1lbnQuc3R5bGUudG9wID0gXCJcIiArIHkgKyBcInB4XCI7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHN0YXRzLmRvbUVsZW1lbnQpO1xuICAgIH1cbiAgICB0aGlzLnRpY2tQcm92aWRlciA9IG5ldyBhc2gudGljay5GcmFtZVRpY2tQcm92aWRlcihzdGF0cyk7XG4gICAgdGhpcy50aWNrUHJvdmlkZXIuYWRkKHRoaXMuZW5naW5lLnVwZGF0ZSk7XG4gICAgdGhpcy50aWNrUHJvdmlkZXIuc3RhcnQoKTtcbiAgfTtcblxuICByZXR1cm4gQXN0ZXJvaWRzO1xuXG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hc3Rlcm9pZHMuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXN0ZXJvaWRzO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi9pbmRleCcpO1xuXG5hc3Rlcm9pZHMuY29tcG9uZW50cy5BbmltYXRpb24gPSAoZnVuY3Rpb24oKSB7XG4gIEFuaW1hdGlvbi5wcm90b3R5cGUuYW5pbWF0aW9uID0gbnVsbDtcblxuICBmdW5jdGlvbiBBbmltYXRpb24oYW5pbWF0aW9uKSB7XG4gICAgdGhpcy5hbmltYXRpb24gPSBhbmltYXRpb247XG4gIH1cblxuICByZXR1cm4gQW5pbWF0aW9uO1xuXG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hbmltYXRpb24uanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXN0ZXJvaWRzO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi9pbmRleCcpO1xuXG5hc3Rlcm9pZHMuY29tcG9uZW50cy5Bc3Rlcm9pZCA9IChmdW5jdGlvbigpIHtcbiAgQXN0ZXJvaWQucHJvdG90eXBlLmZzbSA9IG51bGw7XG5cbiAgZnVuY3Rpb24gQXN0ZXJvaWQoZnNtKSB7XG4gICAgdGhpcy5mc20gPSBmc207XG4gIH1cblxuICByZXR1cm4gQXN0ZXJvaWQ7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFzdGVyb2lkLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzdGVyb2lkcztcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vaW5kZXgnKTtcblxuYXN0ZXJvaWRzLmNvbXBvbmVudHMuQXVkaW8gPSAoZnVuY3Rpb24oKSB7XG4gIEF1ZGlvLnByb3RvdHlwZS50b1BsYXkgPSBudWxsO1xuXG4gIGZ1bmN0aW9uIEF1ZGlvKCkge1xuICAgIHRoaXMudG9QbGF5ID0gW107XG4gIH1cblxuICBBdWRpby5wcm90b3R5cGUucGxheSA9IGZ1bmN0aW9uKHNvdW5kKSB7XG4gICAgcmV0dXJuIHRoaXMudG9QbGF5LnB1c2goc291bmQpO1xuICB9O1xuXG4gIHJldHVybiBBdWRpbztcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXVkaW8uanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXN0ZXJvaWRzO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi9pbmRleCcpO1xuXG5hc3Rlcm9pZHMuY29tcG9uZW50cy5CdWxsZXQgPSAoZnVuY3Rpb24oKSB7XG4gIEJ1bGxldC5wcm90b3R5cGUubGlmZVJlbWFpbmluZyA9IDA7XG5cbiAgZnVuY3Rpb24gQnVsbGV0KGxpZmVSZW1haW5pbmcpIHtcbiAgICB0aGlzLmxpZmVSZW1haW5pbmcgPSBsaWZlUmVtYWluaW5nO1xuICB9XG5cbiAgcmV0dXJuIEJ1bGxldDtcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YnVsbGV0LmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzdGVyb2lkcztcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vaW5kZXgnKTtcblxuYXN0ZXJvaWRzLmNvbXBvbmVudHMuQ29sbGlzaW9uID0gKGZ1bmN0aW9uKCkge1xuICBDb2xsaXNpb24ucHJvdG90eXBlLnJhZGl1cyA9IDA7XG5cbiAgZnVuY3Rpb24gQ29sbGlzaW9uKHJhZGl1cykge1xuICAgIHRoaXMucmFkaXVzID0gcmFkaXVzO1xuICB9XG5cbiAgcmV0dXJuIENvbGxpc2lvbjtcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29sbGlzaW9uLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzdGVyb2lkcztcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vaW5kZXgnKTtcblxuYXN0ZXJvaWRzLmNvbXBvbmVudHMuRGVhdGhUaHJvZXMgPSAoZnVuY3Rpb24oKSB7XG4gIERlYXRoVGhyb2VzLnByb3RvdHlwZS5jb3VudGRvd24gPSAwO1xuXG4gIERlYXRoVGhyb2VzLnByb3RvdHlwZS5ib2R5ID0gbnVsbDtcblxuICBmdW5jdGlvbiBEZWF0aFRocm9lcyhkdXJhdGlvbikge1xuICAgIHRoaXMuY291bnRkb3duID0gZHVyYXRpb247XG4gIH1cblxuICByZXR1cm4gRGVhdGhUaHJvZXM7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRlYXRoX3Rocm9lcy5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc3Rlcm9pZHM7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uL2luZGV4Jyk7XG5cbmFzdGVyb2lkcy5jb21wb25lbnRzLkRpc3BsYXkgPSAoZnVuY3Rpb24oKSB7XG4gIERpc3BsYXkucHJvdG90eXBlLmdyYXBoaWMgPSAwO1xuXG4gIGZ1bmN0aW9uIERpc3BsYXkoZ3JhcGhpYykge1xuICAgIHRoaXMuZ3JhcGhpYyA9IGdyYXBoaWM7XG4gIH1cblxuICByZXR1cm4gRGlzcGxheTtcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGlzcGxheS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc3Rlcm9pZHM7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uL2luZGV4Jyk7XG5cbmFzdGVyb2lkcy5jb21wb25lbnRzLkdhbWVTdGF0ZSA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gR2FtZVN0YXRlKCkge31cblxuICBHYW1lU3RhdGUucHJvdG90eXBlLmxpdmVzID0gMztcblxuICBHYW1lU3RhdGUucHJvdG90eXBlLmxldmVsID0gMDtcblxuICBHYW1lU3RhdGUucHJvdG90eXBlLmhpdHMgPSAwO1xuXG4gIEdhbWVTdGF0ZS5wcm90b3R5cGUucGxheWluZyA9IGZhbHNlO1xuXG4gIEdhbWVTdGF0ZS5wcm90b3R5cGUuc2V0Rm9yU3RhcnQgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmxpdmVzID0gMztcbiAgICB0aGlzLmxldmVsID0gMDtcbiAgICB0aGlzLmhpdHMgPSAwO1xuICAgIHRoaXMucGxheWluZyA9IHRydWU7XG4gIH07XG5cbiAgcmV0dXJuIEdhbWVTdGF0ZTtcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Z2FtZV9zdGF0ZS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBQb2ludCwgYXN0ZXJvaWRzO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi9pbmRleCcpO1xuXG5Qb2ludCA9IGFzdGVyb2lkcy51aS5Qb2ludDtcblxuYXN0ZXJvaWRzLmNvbXBvbmVudHMuR3VuID0gKGZ1bmN0aW9uKCkge1xuICBHdW4ucHJvdG90eXBlLnNob290aW5nID0gZmFsc2U7XG5cbiAgR3VuLnByb3RvdHlwZS5vZmZzZXRGcm9tUGFyZW50ID0gbnVsbDtcblxuICBHdW4ucHJvdG90eXBlLnRpbWVTaW5jZUxhc3RTaG90ID0gMDtcblxuICBHdW4ucHJvdG90eXBlLm9mZnNldEZyb21QYXJlbnQgPSBudWxsO1xuXG4gIGZ1bmN0aW9uIEd1bihvZmZzZXRYLCBvZmZzZXRZLCBtaW5pbXVtU2hvdEludGVydmFsLCBidWxsZXRMaWZldGltZSkge1xuICAgIHRoaXMubWluaW11bVNob3RJbnRlcnZhbCA9IG1pbmltdW1TaG90SW50ZXJ2YWw7XG4gICAgdGhpcy5idWxsZXRMaWZldGltZSA9IGJ1bGxldExpZmV0aW1lO1xuICAgIHRoaXMuc2hvb3RpbmcgPSBmYWxzZTtcbiAgICB0aGlzLm9mZnNldEZyb21QYXJlbnQgPSBudWxsO1xuICAgIHRoaXMudGltZVNpbmNlTGFzdFNob3QgPSAwO1xuICAgIHRoaXMub2Zmc2V0RnJvbVBhcmVudCA9IG5ldyBQb2ludChvZmZzZXRYLCBvZmZzZXRZKTtcbiAgfVxuXG4gIHJldHVybiBHdW47XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWd1bi5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc3Rlcm9pZHM7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uL2luZGV4Jyk7XG5cbmFzdGVyb2lkcy5jb21wb25lbnRzLkd1bkNvbnRyb2xzID0gKGZ1bmN0aW9uKCkge1xuICBHdW5Db250cm9scy5wcm90b3R5cGUudHJpZ2dlciA9IDA7XG5cbiAgZnVuY3Rpb24gR3VuQ29udHJvbHModHJpZ2dlcikge1xuICAgIHRoaXMudHJpZ2dlciA9IHRyaWdnZXI7XG4gIH1cblxuICByZXR1cm4gR3VuQ29udHJvbHM7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWd1bl9jb250cm9scy5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc3Rlcm9pZHM7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uL2luZGV4Jyk7XG5cbmFzdGVyb2lkcy5jb21wb25lbnRzLkh1ZCA9IChmdW5jdGlvbigpIHtcbiAgSHVkLnByb3RvdHlwZS52aWV3ID0gbnVsbDtcblxuICBmdW5jdGlvbiBIdWQodmlldykge1xuICAgIHRoaXMudmlldyA9IHZpZXc7XG4gIH1cblxuICByZXR1cm4gSHVkO1xuXG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1odWQuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXN0ZXJvaWRzO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi9pbmRleCcpO1xuXG5hc3Rlcm9pZHMuY29tcG9uZW50cy5Nb3Rpb25Db250cm9scyA9IChmdW5jdGlvbigpIHtcbiAgTW90aW9uQ29udHJvbHMucHJvdG90eXBlLmxlZnQgPSAwO1xuXG4gIE1vdGlvbkNvbnRyb2xzLnByb3RvdHlwZS5yaWdodCA9IDA7XG5cbiAgTW90aW9uQ29udHJvbHMucHJvdG90eXBlLmFjY2VsZXJhdGUgPSAwO1xuXG4gIE1vdGlvbkNvbnRyb2xzLnByb3RvdHlwZS5hY2NlbGVyYXRpb25SYXRlID0gMDtcblxuICBNb3Rpb25Db250cm9scy5wcm90b3R5cGUucm90YXRpb25SYXRlID0gMDtcblxuICBmdW5jdGlvbiBNb3Rpb25Db250cm9scyhsZWZ0LCByaWdodCwgYWNjZWxlcmF0ZSwgYWNjZWxlcmF0aW9uUmF0ZSwgcm90YXRpb25SYXRlKSB7XG4gICAgdGhpcy5sZWZ0ID0gbGVmdDtcbiAgICB0aGlzLnJpZ2h0ID0gcmlnaHQ7XG4gICAgdGhpcy5hY2NlbGVyYXRlID0gYWNjZWxlcmF0ZTtcbiAgICB0aGlzLmFjY2VsZXJhdGlvblJhdGUgPSBhY2NlbGVyYXRpb25SYXRlO1xuICAgIHRoaXMucm90YXRpb25SYXRlID0gcm90YXRpb25SYXRlO1xuICB9XG5cbiAgcmV0dXJuIE1vdGlvbkNvbnRyb2xzO1xuXG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1tb3Rpb25fY29udHJvbHMuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXN0ZXJvaWRzO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi9pbmRleCcpO1xuXG5hc3Rlcm9pZHMuY29tcG9uZW50cy5QaHlzaWNzID0gKGZ1bmN0aW9uKCkge1xuICBQaHlzaWNzLnByb3RvdHlwZS5ib2R5ID0gbnVsbDtcblxuICBmdW5jdGlvbiBQaHlzaWNzKGJvZHkpIHtcbiAgICB0aGlzLmJvZHkgPSBib2R5O1xuICB9XG5cbiAgcmV0dXJuIFBoeXNpY3M7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBoeXNpY3MuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgUG9pbnQsIGFzdGVyb2lkcztcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vaW5kZXgnKTtcblxuUG9pbnQgPSBhc3Rlcm9pZHMudWkuUG9pbnQ7XG5cbmFzdGVyb2lkcy5jb21wb25lbnRzLlBvc2l0aW9uID0gKGZ1bmN0aW9uKCkge1xuICBQb3NpdGlvbi5wcm90b3R5cGUucG9zaXRpb24gPSBudWxsO1xuXG4gIFBvc2l0aW9uLnByb3RvdHlwZS5yb3RhdGlvbiA9IDA7XG5cbiAgZnVuY3Rpb24gUG9zaXRpb24oeCwgeSwgcm90YXRpb24pIHtcbiAgICB0aGlzLnJvdGF0aW9uID0gcm90YXRpb247XG4gICAgdGhpcy5wb3NpdGlvbiA9IG5ldyBQb2ludCh4LCB5KTtcbiAgfVxuXG4gIHJldHVybiBQb3NpdGlvbjtcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cG9zaXRpb24uanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXN0ZXJvaWRzO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi9pbmRleCcpO1xuXG5hc3Rlcm9pZHMuY29tcG9uZW50cy5TcGFjZXNoaXAgPSAoZnVuY3Rpb24oKSB7XG4gIFNwYWNlc2hpcC5wcm90b3R5cGUuZnNtID0gbnVsbDtcblxuICBmdW5jdGlvbiBTcGFjZXNoaXAoZnNtKSB7XG4gICAgdGhpcy5mc20gPSBmc207XG4gIH1cblxuICByZXR1cm4gU3BhY2VzaGlwO1xuXG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zcGFjZXNoaXAuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXN0ZXJvaWRzLFxuICBfX2JpbmQgPSBmdW5jdGlvbihmbiwgbWUpeyByZXR1cm4gZnVuY3Rpb24oKXsgcmV0dXJuIGZuLmFwcGx5KG1lLCBhcmd1bWVudHMpOyB9OyB9O1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi9pbmRleCcpO1xuXG5hc3Rlcm9pZHMuY29tcG9uZW50cy5XYWl0Rm9yU3RhcnQgPSAoZnVuY3Rpb24oKSB7XG4gIFdhaXRGb3JTdGFydC5wcm90b3R5cGUud2FpdEZvclN0YXJ0ID0gbnVsbDtcblxuICBXYWl0Rm9yU3RhcnQucHJvdG90eXBlLnN0YXJ0R2FtZSA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIFdhaXRGb3JTdGFydCh3YWl0Rm9yU3RhcnQpIHtcbiAgICB0aGlzLndhaXRGb3JTdGFydCA9IHdhaXRGb3JTdGFydDtcbiAgICB0aGlzLnNldFN0YXJ0R2FtZSA9IF9fYmluZCh0aGlzLnNldFN0YXJ0R2FtZSwgdGhpcyk7XG4gICAgdGhpcy53YWl0Rm9yU3RhcnQuY2xpY2suYWRkKHRoaXMuc2V0U3RhcnRHYW1lKTtcbiAgfVxuXG4gIFdhaXRGb3JTdGFydC5wcm90b3R5cGUuc2V0U3RhcnRHYW1lID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zdGFydEdhbWUgPSB0cnVlO1xuICB9O1xuXG4gIHJldHVybiBXYWl0Rm9yU3RhcnQ7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXdhaXRfZm9yX3N0YXJ0LmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIEFuaW1hdGlvbiwgQXN0ZXJvaWQsIEFzdGVyb2lkRGVhdGhWaWV3LCBBc3Rlcm9pZFZpZXcsIEF1ZGlvLCBCdWxsZXQsIEJ1bGxldFZpZXcsIENvbGxpc2lvbiwgRGVhdGhUaHJvZXMsIERpc3BsYXksIEVudGl0eSwgRW50aXR5U3RhdGVNYWNoaW5lLCBHYW1lU3RhdGUsIEd1biwgR3VuQ29udHJvbHMsIEh1ZCwgSHVkVmlldywgTW90aW9uQ29udHJvbHMsIFBoeXNpY3MsIFBvc2l0aW9uLCBTcGFjZXNoaXAsIFNwYWNlc2hpcERlYXRoVmlldywgU3BhY2VzaGlwVmlldywgV2FpdEZvclN0YXJ0LCBXYWl0Rm9yU3RhcnRWaWV3LCBhc2gsIGFzdGVyb2lkcywgYjJCb2R5LCBiMkJvZHlEZWYsIGIyQ2lyY2xlU2hhcGUsIGIyRml4dHVyZURlZiwgYjJQb2x5Z29uU2hhcGUsIGIyVmVjMjtcblxuYXNoID0gcmVxdWlyZSgnYXNoLmNvZmZlZScpO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi9pbmRleCcpO1xuXG5XYWl0Rm9yU3RhcnRWaWV3ID0gYXN0ZXJvaWRzLnNwcml0ZXMuV2FpdEZvclN0YXJ0VmlldztcblxuRW50aXR5ID0gYXNoLmNvcmUuRW50aXR5O1xuXG5FbnRpdHlTdGF0ZU1hY2hpbmUgPSBhc2guZnNtLkVudGl0eVN0YXRlTWFjaGluZTtcblxuXG4vKlxuICogQXN0ZXJvaWQgR2FtZSBDb21wb25lbnRzXG4gKi9cblxuQW5pbWF0aW9uID0gYXN0ZXJvaWRzLmNvbXBvbmVudHMuQW5pbWF0aW9uO1xuXG5Bc3Rlcm9pZCA9IGFzdGVyb2lkcy5jb21wb25lbnRzLkFzdGVyb2lkO1xuXG5BdWRpbyA9IGFzdGVyb2lkcy5jb21wb25lbnRzLkF1ZGlvO1xuXG5CdWxsZXQgPSBhc3Rlcm9pZHMuY29tcG9uZW50cy5CdWxsZXQ7XG5cbkNvbGxpc2lvbiA9IGFzdGVyb2lkcy5jb21wb25lbnRzLkNvbGxpc2lvbjtcblxuRGVhdGhUaHJvZXMgPSBhc3Rlcm9pZHMuY29tcG9uZW50cy5EZWF0aFRocm9lcztcblxuRGlzcGxheSA9IGFzdGVyb2lkcy5jb21wb25lbnRzLkRpc3BsYXk7XG5cbkdhbWVTdGF0ZSA9IGFzdGVyb2lkcy5jb21wb25lbnRzLkdhbWVTdGF0ZTtcblxuR3VuID0gYXN0ZXJvaWRzLmNvbXBvbmVudHMuR3VuO1xuXG5HdW5Db250cm9scyA9IGFzdGVyb2lkcy5jb21wb25lbnRzLkd1bkNvbnRyb2xzO1xuXG5IdWQgPSBhc3Rlcm9pZHMuY29tcG9uZW50cy5IdWQ7XG5cbk1vdGlvbkNvbnRyb2xzID0gYXN0ZXJvaWRzLmNvbXBvbmVudHMuTW90aW9uQ29udHJvbHM7XG5cblBoeXNpY3MgPSBhc3Rlcm9pZHMuY29tcG9uZW50cy5QaHlzaWNzO1xuXG5Qb3NpdGlvbiA9IGFzdGVyb2lkcy5jb21wb25lbnRzLlBvc2l0aW9uO1xuXG5TcGFjZXNoaXAgPSBhc3Rlcm9pZHMuY29tcG9uZW50cy5TcGFjZXNoaXA7XG5cbldhaXRGb3JTdGFydCA9IGFzdGVyb2lkcy5jb21wb25lbnRzLldhaXRGb3JTdGFydDtcblxuXG4vKlxuICogRHJhd2FibGUgQ29tcG9uZW50c1xuICovXG5cbkFzdGVyb2lkRGVhdGhWaWV3ID0gYXN0ZXJvaWRzLnNwcml0ZXMuQXN0ZXJvaWREZWF0aFZpZXc7XG5cbkFzdGVyb2lkVmlldyA9IGFzdGVyb2lkcy5zcHJpdGVzLkFzdGVyb2lkVmlldztcblxuQnVsbGV0VmlldyA9IGFzdGVyb2lkcy5zcHJpdGVzLkJ1bGxldFZpZXc7XG5cbkh1ZFZpZXcgPSBhc3Rlcm9pZHMuc3ByaXRlcy5IdWRWaWV3O1xuXG5TcGFjZXNoaXBEZWF0aFZpZXcgPSBhc3Rlcm9pZHMuc3ByaXRlcy5TcGFjZXNoaXBEZWF0aFZpZXc7XG5cblNwYWNlc2hpcFZpZXcgPSBhc3Rlcm9pZHMuc3ByaXRlcy5TcGFjZXNoaXBWaWV3O1xuXG5cbi8qXG4gKiBCb3gyRCBjbGFzc2VzXG4gKi9cblxuYjJCb2R5ID0gQm94MkQuRHluYW1pY3MuYjJCb2R5O1xuXG5iMkJvZHlEZWYgPSBCb3gyRC5EeW5hbWljcy5iMkJvZHlEZWY7XG5cbmIyQ2lyY2xlU2hhcGUgPSBCb3gyRC5Db2xsaXNpb24uU2hhcGVzLmIyQ2lyY2xlU2hhcGU7XG5cbmIyRml4dHVyZURlZiA9IEJveDJELkR5bmFtaWNzLmIyRml4dHVyZURlZjtcblxuYjJQb2x5Z29uU2hhcGUgPSBCb3gyRC5Db2xsaXNpb24uU2hhcGVzLmIyUG9seWdvblNoYXBlO1xuXG5iMlZlYzIgPSBCb3gyRC5Db21tb24uTWF0aC5iMlZlYzI7XG5cbmFzdGVyb2lkcy5FbnRpdHlDcmVhdG9yID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgS0VZX0xFRlQsIEtFWV9SSUdIVCwgS0VZX1VQLCBLRVlfWjtcblxuICBLRVlfTEVGVCA9IDM3O1xuXG4gIEtFWV9VUCA9IDM4O1xuXG4gIEtFWV9SSUdIVCA9IDM5O1xuXG4gIEtFWV9aID0gOTA7XG5cbiAgRW50aXR5Q3JlYXRvci5wcm90b3R5cGUuZW5naW5lID0gbnVsbDtcblxuICBFbnRpdHlDcmVhdG9yLnByb3RvdHlwZS53b3JsZCA9IG51bGw7XG5cbiAgRW50aXR5Q3JlYXRvci5wcm90b3R5cGUud2FpdEVudGl0eSA9IG51bGw7XG5cbiAgRW50aXR5Q3JlYXRvci5wcm90b3R5cGUuYnVsbGV0SWQgPSAwO1xuXG4gIEVudGl0eUNyZWF0b3IucHJvdG90eXBlLmFzdGVyb2lkSWQgPSAwO1xuXG4gIEVudGl0eUNyZWF0b3IucHJvdG90eXBlLnNwYWNlc2hpcElkID0gMDtcblxuICBmdW5jdGlvbiBFbnRpdHlDcmVhdG9yKGVuZ2luZSwgd29ybGQpIHtcbiAgICB0aGlzLmVuZ2luZSA9IGVuZ2luZTtcbiAgICB0aGlzLndvcmxkID0gd29ybGQ7XG4gIH1cblxuICBFbnRpdHlDcmVhdG9yLnByb3RvdHlwZS5kZXN0cm95RW50aXR5ID0gZnVuY3Rpb24oZW50aXR5KSB7XG4gICAgdGhpcy5lbmdpbmUucmVtb3ZlRW50aXR5KGVudGl0eSk7XG4gIH07XG5cblxuICAvKlxuICAgKiBHYW1lIFN0YXRlXG4gICAqL1xuXG4gIEVudGl0eUNyZWF0b3IucHJvdG90eXBlLmNyZWF0ZUdhbWUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZ2FtZUVudGl0eSwgaHVkO1xuICAgIGh1ZCA9IG5ldyBIdWRWaWV3KCk7XG4gICAgZ2FtZUVudGl0eSA9IG5ldyBFbnRpdHkoJ2dhbWUnKS5hZGQobmV3IEdhbWVTdGF0ZSgpKS5hZGQobmV3IEh1ZChodWQpKS5hZGQobmV3IERpc3BsYXkoaHVkKSkuYWRkKG5ldyBQb3NpdGlvbigwLCAwLCAwLCAwKSk7XG4gICAgdGhpcy5lbmdpbmUuYWRkRW50aXR5KGdhbWVFbnRpdHkpO1xuICAgIHJldHVybiBnYW1lRW50aXR5O1xuICB9O1xuXG5cbiAgLypcbiAgICogU3RhcnQuLi5cbiAgICovXG5cbiAgRW50aXR5Q3JlYXRvci5wcm90b3R5cGUuY3JlYXRlV2FpdEZvckNsaWNrID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHdhaXRWaWV3O1xuICAgIGlmICghdGhpcy53YWl0RW50aXR5KSB7XG4gICAgICB3YWl0VmlldyA9IG5ldyBXYWl0Rm9yU3RhcnRWaWV3KCk7XG4gICAgICB0aGlzLndhaXRFbnRpdHkgPSBuZXcgRW50aXR5KCd3YWl0JykuYWRkKG5ldyBXYWl0Rm9yU3RhcnQod2FpdFZpZXcpKS5hZGQobmV3IERpc3BsYXkod2FpdFZpZXcpKS5hZGQobmV3IFBvc2l0aW9uKDAsIDAsIDAsIDApKTtcbiAgICB9XG4gICAgdGhpcy53YWl0RW50aXR5LmdldChXYWl0Rm9yU3RhcnQpLnN0YXJ0R2FtZSA9IGZhbHNlO1xuICAgIHRoaXMuZW5naW5lLmFkZEVudGl0eSh0aGlzLndhaXRFbnRpdHkpO1xuICAgIHJldHVybiB0aGlzLndhaXRFbnRpdHk7XG4gIH07XG5cblxuICAvKlxuICAgKiBDcmVhdGUgYW4gQXN0ZXJvaWQgd2l0aCBGU00gQW5pbWF0aW9uXG4gICAqL1xuXG4gIEVudGl0eUNyZWF0b3IucHJvdG90eXBlLmNyZWF0ZUFzdGVyb2lkID0gZnVuY3Rpb24ocmFkaXVzLCB4LCB5KSB7XG5cbiAgICAvKlxuICAgICAqIE1vZGVsIHRoZSBwaHlzaWNzIHVzaW5nIEJveDJEXG4gICAgICovXG4gICAgdmFyIGFzdGVyb2lkLCBib2R5LCBib2R5RGVmLCBkZWF0aFZpZXcsIGZpeERlZiwgZnNtO1xuICAgIGJvZHlEZWYgPSBuZXcgYjJCb2R5RGVmKCk7XG4gICAgYm9keURlZi50eXBlID0gYjJCb2R5LmIyX2R5bmFtaWNCb2R5O1xuICAgIGJvZHlEZWYuZml4ZWRSb3RhdGlvbiA9IHRydWU7XG4gICAgYm9keURlZi5wb3NpdGlvbi54ID0geDtcbiAgICBib2R5RGVmLnBvc2l0aW9uLnkgPSB5O1xuICAgIGJvZHlEZWYubGluZWFyVmVsb2NpdHkuU2V0KChNYXRoLnJhbmRvbSgpIC0gMC41KSAqIDQgKiAoNTAgLSByYWRpdXMpLCAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiA0ICogKDUwIC0gcmFkaXVzKSk7XG4gICAgYm9keURlZi5hbmd1bGFyVmVsb2NpdHkgPSBNYXRoLnJhbmRvbSgpICogMiAtIDE7XG4gICAgZml4RGVmID0gbmV3IGIyRml4dHVyZURlZigpO1xuICAgIGZpeERlZi5kZW5zaXR5ID0gMS4wO1xuICAgIGZpeERlZi5mcmljdGlvbiA9IDEuMDtcbiAgICBmaXhEZWYucmVzdGl0dXRpb24gPSAwLjI7XG4gICAgZml4RGVmLnNoYXBlID0gbmV3IGIyQ2lyY2xlU2hhcGUocmFkaXVzKTtcbiAgICBib2R5ID0gdGhpcy53b3JsZC5DcmVhdGVCb2R5KGJvZHlEZWYpO1xuICAgIGJvZHkuQ3JlYXRlRml4dHVyZShmaXhEZWYpO1xuICAgIGFzdGVyb2lkID0gbmV3IEVudGl0eSgpO1xuICAgIGZzbSA9IG5ldyBFbnRpdHlTdGF0ZU1hY2hpbmUoYXN0ZXJvaWQpO1xuICAgIGZzbS5jcmVhdGVTdGF0ZSgnYWxpdmUnKS5hZGQoUGh5c2ljcykud2l0aEluc3RhbmNlKG5ldyBQaHlzaWNzKGJvZHkpKS5hZGQoQ29sbGlzaW9uKS53aXRoSW5zdGFuY2UobmV3IENvbGxpc2lvbihyYWRpdXMpKS5hZGQoRGlzcGxheSkud2l0aEluc3RhbmNlKG5ldyBEaXNwbGF5KG5ldyBBc3Rlcm9pZFZpZXcocmFkaXVzKSkpO1xuICAgIGRlYXRoVmlldyA9IG5ldyBBc3Rlcm9pZERlYXRoVmlldyhyYWRpdXMpO1xuICAgIGZzbS5jcmVhdGVTdGF0ZSgnZGVzdHJveWVkJykuYWRkKERlYXRoVGhyb2VzKS53aXRoSW5zdGFuY2UobmV3IERlYXRoVGhyb2VzKDMpKS5hZGQoRGlzcGxheSkud2l0aEluc3RhbmNlKG5ldyBEaXNwbGF5KGRlYXRoVmlldykpLmFkZChBbmltYXRpb24pLndpdGhJbnN0YW5jZShuZXcgQW5pbWF0aW9uKGRlYXRoVmlldykpO1xuICAgIGFzdGVyb2lkLmFkZChuZXcgQXN0ZXJvaWQoZnNtKSkuYWRkKG5ldyBQb3NpdGlvbih4LCB5LCAwKSkuYWRkKG5ldyBBdWRpbygpKTtcbiAgICBib2R5LlNldFVzZXJEYXRhKHtcbiAgICAgIHR5cGU6ICdhc3Rlcm9pZCcsXG4gICAgICBlbnRpdHk6IGFzdGVyb2lkXG4gICAgfSk7XG4gICAgZnNtLmNoYW5nZVN0YXRlKCdhbGl2ZScpO1xuICAgIHRoaXMuZW5naW5lLmFkZEVudGl0eShhc3Rlcm9pZCk7XG4gICAgcmV0dXJuIGFzdGVyb2lkO1xuICB9O1xuXG5cbiAgLypcbiAgICogQ3JlYXRlIFBsYXllciBTcGFjZXNoaXAgd2l0aCBGU00gQW5pbWF0aW9uXG4gICAqL1xuXG4gIEVudGl0eUNyZWF0b3IucHJvdG90eXBlLmNyZWF0ZVNwYWNlc2hpcCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgLypcbiAgICAgKiBNb2RlbCB0aGUgcGh5c2ljcyB1c2luZyBCb3gyRFxuICAgICAqL1xuICAgIHZhciBib2R5LCBib2R5RGVmLCBkZWF0aFZpZXcsIGZpeERlZiwgZnNtLCBzcGFjZXNoaXA7XG4gICAgYm9keURlZiA9IG5ldyBiMkJvZHlEZWYoKTtcbiAgICBib2R5RGVmLnR5cGUgPSBiMkJvZHkuYjJfZHluYW1pY0JvZHk7XG4gICAgYm9keURlZi5maXhlZFJvdGF0aW9uID0gZmFsc2U7XG4gICAgYm9keURlZi5wb3NpdGlvbi54ID0gMzAwO1xuICAgIGJvZHlEZWYucG9zaXRpb24ueSA9IDIyNTtcbiAgICBib2R5RGVmLmxpbmVhclZlbG9jaXR5LlNldCgwLCAwKTtcbiAgICBib2R5RGVmLmFuZ3VsYXJWZWxvY2l0eSA9IDA7XG4gICAgYm9keURlZi5saW5lYXJEYW1waW5nID0gMC43NTtcbiAgICBmaXhEZWYgPSBuZXcgYjJGaXh0dXJlRGVmKCk7XG4gICAgZml4RGVmLmRlbnNpdHkgPSAxLjA7XG4gICAgZml4RGVmLmZyaWN0aW9uID0gMS4wO1xuICAgIGZpeERlZi5yZXN0aXR1dGlvbiA9IDAuMjtcbiAgICBmaXhEZWYuc2hhcGUgPSBuZXcgYjJQb2x5Z29uU2hhcGUoKTtcbiAgICBmaXhEZWYuc2hhcGUuU2V0QXNBcnJheShbbmV3IGIyVmVjMiguNDUsIDApLCBuZXcgYjJWZWMyKC0uMjUsIC4yNSksIG5ldyBiMlZlYzIoLS4yNSwgLS4yNSldLCAzKTtcbiAgICBib2R5ID0gdGhpcy53b3JsZC5DcmVhdGVCb2R5KGJvZHlEZWYpO1xuICAgIGJvZHkuQ3JlYXRlRml4dHVyZShmaXhEZWYpO1xuICAgIHNwYWNlc2hpcCA9IG5ldyBFbnRpdHkoKTtcbiAgICBmc20gPSBuZXcgRW50aXR5U3RhdGVNYWNoaW5lKHNwYWNlc2hpcCk7XG4gICAgZnNtLmNyZWF0ZVN0YXRlKCdwbGF5aW5nJykuYWRkKFBoeXNpY3MpLndpdGhJbnN0YW5jZShuZXcgUGh5c2ljcyhib2R5KSkuYWRkKE1vdGlvbkNvbnRyb2xzKS53aXRoSW5zdGFuY2UobmV3IE1vdGlvbkNvbnRyb2xzKEtFWV9MRUZULCBLRVlfUklHSFQsIEtFWV9VUCwgMTAwLCAzKSkuYWRkKEd1bikud2l0aEluc3RhbmNlKG5ldyBHdW4oOCwgMCwgMC4zLCAyKSkuYWRkKEd1bkNvbnRyb2xzKS53aXRoSW5zdGFuY2UobmV3IEd1bkNvbnRyb2xzKEtFWV9aKSkuYWRkKENvbGxpc2lvbikud2l0aEluc3RhbmNlKG5ldyBDb2xsaXNpb24oOSkpLmFkZChEaXNwbGF5KS53aXRoSW5zdGFuY2UobmV3IERpc3BsYXkobmV3IFNwYWNlc2hpcFZpZXcoKSkpO1xuICAgIGRlYXRoVmlldyA9IG5ldyBTcGFjZXNoaXBEZWF0aFZpZXcoKTtcbiAgICBmc20uY3JlYXRlU3RhdGUoJ2Rlc3Ryb3llZCcpLmFkZChEZWF0aFRocm9lcykud2l0aEluc3RhbmNlKG5ldyBEZWF0aFRocm9lcyg1KSkuYWRkKERpc3BsYXkpLndpdGhJbnN0YW5jZShuZXcgRGlzcGxheShkZWF0aFZpZXcpKS5hZGQoQW5pbWF0aW9uKS53aXRoSW5zdGFuY2UobmV3IEFuaW1hdGlvbihkZWF0aFZpZXcpKTtcbiAgICBzcGFjZXNoaXAuYWRkKG5ldyBTcGFjZXNoaXAoZnNtKSkuYWRkKG5ldyBQb3NpdGlvbigzMDAsIDIyNSwgMCkpLmFkZChuZXcgQXVkaW8oKSk7XG4gICAgYm9keS5TZXRVc2VyRGF0YSh7XG4gICAgICB0eXBlOiAnc3BhY2VzaGlwJyxcbiAgICAgIGVudGl0eTogc3BhY2VzaGlwXG4gICAgfSk7XG4gICAgZnNtLmNoYW5nZVN0YXRlKCdwbGF5aW5nJyk7XG4gICAgdGhpcy5lbmdpbmUuYWRkRW50aXR5KHNwYWNlc2hpcCk7XG4gICAgcmV0dXJuIHNwYWNlc2hpcDtcbiAgfTtcblxuXG4gIC8qXG4gICAqIENyZWF0ZSBhIEJ1bGxldFxuICAgKi9cblxuICBFbnRpdHlDcmVhdG9yLnByb3RvdHlwZS5jcmVhdGVVc2VyQnVsbGV0ID0gZnVuY3Rpb24oZ3VuLCBwYXJlbnRQb3NpdGlvbikge1xuICAgIHZhciBib2R5LCBib2R5RGVmLCBidWxsZXQsIGNvcywgZml4RGVmLCBzaW4sIHgsIHk7XG4gICAgY29zID0gTWF0aC5jb3MocGFyZW50UG9zaXRpb24ucm90YXRpb24pO1xuICAgIHNpbiA9IE1hdGguc2luKHBhcmVudFBvc2l0aW9uLnJvdGF0aW9uKTtcbiAgICB4ID0gY29zICogZ3VuLm9mZnNldEZyb21QYXJlbnQueCAtIHNpbiAqIGd1bi5vZmZzZXRGcm9tUGFyZW50LnkgKyBwYXJlbnRQb3NpdGlvbi5wb3NpdGlvbi54O1xuICAgIHkgPSBzaW4gKiBndW4ub2Zmc2V0RnJvbVBhcmVudC54ICsgY29zICogZ3VuLm9mZnNldEZyb21QYXJlbnQueSArIHBhcmVudFBvc2l0aW9uLnBvc2l0aW9uLnk7XG5cbiAgICAvKlxuICAgICAqIE1vZGVsIHRoZSBwaHlzaWNzIHVzaW5nIEJveDJEXG4gICAgICovXG4gICAgYm9keURlZiA9IG5ldyBiMkJvZHlEZWYoKTtcbiAgICBib2R5RGVmLnR5cGUgPSBiMkJvZHkuYjJfZHluYW1pY0JvZHk7XG4gICAgYm9keURlZi5maXhlZFJvdGF0aW9uID0gdHJ1ZTtcbiAgICBib2R5RGVmLnBvc2l0aW9uLnggPSB4O1xuICAgIGJvZHlEZWYucG9zaXRpb24ueSA9IHk7XG4gICAgYm9keURlZi5saW5lYXJWZWxvY2l0eS5TZXQoY29zICogMTUwLCBzaW4gKiAxNTApO1xuICAgIGJvZHlEZWYuYW5ndWxhclZlbG9jaXR5ID0gMDtcbiAgICBmaXhEZWYgPSBuZXcgYjJGaXh0dXJlRGVmKCk7XG4gICAgZml4RGVmLmRlbnNpdHkgPSAxLjA7XG4gICAgZml4RGVmLmZyaWN0aW9uID0gMC4wO1xuICAgIGZpeERlZi5yZXN0aXR1dGlvbiA9IDAuMjtcbiAgICBmaXhEZWYuc2hhcGUgPSBuZXcgYjJDaXJjbGVTaGFwZSgwKTtcbiAgICBib2R5ID0gdGhpcy53b3JsZC5DcmVhdGVCb2R5KGJvZHlEZWYpO1xuICAgIGJvZHkuQ3JlYXRlRml4dHVyZShmaXhEZWYpO1xuICAgIGJ1bGxldCA9IG5ldyBFbnRpdHkoKS5hZGQobmV3IEJ1bGxldChndW4uYnVsbGV0TGlmZXRpbWUpKS5hZGQobmV3IFBvc2l0aW9uKHgsIHksIDApKS5hZGQobmV3IENvbGxpc2lvbigwKSkuYWRkKG5ldyBQaHlzaWNzKGJvZHkpKS5hZGQobmV3IERpc3BsYXkobmV3IEJ1bGxldFZpZXcoKSkpO1xuICAgIGJvZHkuU2V0VXNlckRhdGEoe1xuICAgICAgdHlwZTogJ2J1bGxldCcsXG4gICAgICBlbnRpdHk6IGJ1bGxldFxuICAgIH0pO1xuICAgIHRoaXMuZW5naW5lLmFkZEVudGl0eShidWxsZXQpO1xuICAgIHJldHVybiBidWxsZXQ7XG4gIH07XG5cbiAgcmV0dXJuIEVudGl0eUNyZWF0b3I7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWVudGl0eV9jcmVhdG9yLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzdGVyb2lkcztcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vaW5kZXgnKTtcblxuYXN0ZXJvaWRzLkdhbWVDb25maWcgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIEdhbWVDb25maWcoKSB7fVxuXG4gIEdhbWVDb25maWcucHJvdG90eXBlLndpZHRoID0gMDtcblxuICBHYW1lQ29uZmlnLnByb3RvdHlwZS5oZWlnaHQgPSAwO1xuXG4gIHJldHVybiBHYW1lQ29uZmlnO1xuXG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1nYW1lX2NvbmZpZy5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc3Rlcm9pZHM7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uL2luZGV4Jyk7XG5cbmFzdGVyb2lkcy5NYWluID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBNYWluKCkge1xuICAgIHZhciBjYW52YXM7XG4gICAgY2FudmFzID0gdGhpcy5jYW52YXMoJyM2QTVBQ0QnKTtcbiAgICBhc3Rlcm9pZHMgPSBuZXcgYXN0ZXJvaWRzLkFzdGVyb2lkcyhjYW52YXMuZ2V0Q29udGV4dCgnMmQnKSwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgICBhc3Rlcm9pZHMuc3RhcnQoKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBNYWluLnByb3RvdHlwZS5jYW52YXMgPSBmdW5jdGlvbihiYWNrZ3JvdW5kQ29sb3IpIHtcbiAgICB2YXIgY2FudmFzO1xuICAgIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobmF2aWdhdG9yLmlzQ29jb29uSlMgPyAnc2NyZWVuY2FudmFzJyA6ICdjYW52YXMnKTtcbiAgICBjYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCAqIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuICAgIGNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQgKiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcbiAgICBjYW52YXMuc3R5bGUud2lkdGggPSAnMTAwJSc7XG4gICAgY2FudmFzLnN0eWxlLmhlaWdodCA9ICcxMDAlJztcbiAgICBjYW52YXMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gYmFja2dyb3VuZENvbG9yO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY2FudmFzKTtcbiAgICByZXR1cm4gY2FudmFzO1xuICB9O1xuXG4gIHJldHVybiBNYWluO1xuXG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1tYWluLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzaCwgYXN0ZXJvaWRzLFxuICBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgX19leHRlbmRzID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChfX2hhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH07XG5cbmFzaCA9IHJlcXVpcmUoJ2FzaC5jb2ZmZWUnKTtcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vaW5kZXgnKTtcblxuYXN0ZXJvaWRzLm5vZGVzLkFuaW1hdGlvbk5vZGUgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gIF9fZXh0ZW5kcyhBbmltYXRpb25Ob2RlLCBfc3VwZXIpO1xuXG4gIGZ1bmN0aW9uIEFuaW1hdGlvbk5vZGUoKSB7XG4gICAgcmV0dXJuIEFuaW1hdGlvbk5vZGUuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBBbmltYXRpb25Ob2RlLmNvbXBvbmVudHMgPSB7XG4gICAgYW5pbWF0aW9uOiBhc3Rlcm9pZHMuY29tcG9uZW50cy5BbmltYXRpb25cbiAgfTtcblxuICBBbmltYXRpb25Ob2RlLnByb3RvdHlwZS5hbmltYXRpb24gPSBudWxsO1xuXG4gIHJldHVybiBBbmltYXRpb25Ob2RlO1xuXG59KShhc2guY29yZS5Ob2RlKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YW5pbWF0aW9uX25vZGUuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXNoLCBhc3Rlcm9pZHMsXG4gIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICBfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfTtcblxuYXNoID0gcmVxdWlyZSgnYXNoLmNvZmZlZScpO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi9pbmRleCcpO1xuXG5hc3Rlcm9pZHMubm9kZXMuQXN0ZXJvaWRDb2xsaXNpb25Ob2RlID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICBfX2V4dGVuZHMoQXN0ZXJvaWRDb2xsaXNpb25Ob2RlLCBfc3VwZXIpO1xuXG4gIGZ1bmN0aW9uIEFzdGVyb2lkQ29sbGlzaW9uTm9kZSgpIHtcbiAgICByZXR1cm4gQXN0ZXJvaWRDb2xsaXNpb25Ob2RlLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgQXN0ZXJvaWRDb2xsaXNpb25Ob2RlLmNvbXBvbmVudHMgPSB7XG4gICAgYXN0ZXJvaWQ6IGFzdGVyb2lkcy5jb21wb25lbnRzLkFzdGVyb2lkLFxuICAgIHBvc2l0aW9uOiBhc3Rlcm9pZHMuY29tcG9uZW50cy5Qb3NpdGlvbixcbiAgICBjb2xsaXNpb246IGFzdGVyb2lkcy5jb21wb25lbnRzLkNvbGxpc2lvbixcbiAgICBhdWRpbzogYXN0ZXJvaWRzLmNvbXBvbmVudHMuQXVkaW8sXG4gICAgcGh5c2ljczogYXN0ZXJvaWRzLmNvbXBvbmVudHMuUGh5c2ljc1xuICB9O1xuXG4gIEFzdGVyb2lkQ29sbGlzaW9uTm9kZS5wcm90b3R5cGUuYXN0ZXJvaWQgPSBudWxsO1xuXG4gIEFzdGVyb2lkQ29sbGlzaW9uTm9kZS5wcm90b3R5cGUucG9zaXRpb24gPSBudWxsO1xuXG4gIEFzdGVyb2lkQ29sbGlzaW9uTm9kZS5wcm90b3R5cGUuY29sbGlzaW9uID0gbnVsbDtcblxuICBBc3Rlcm9pZENvbGxpc2lvbk5vZGUucHJvdG90eXBlLmF1ZGlvID0gbnVsbDtcblxuICBBc3Rlcm9pZENvbGxpc2lvbk5vZGUucHJvdG90eXBlLnBoeXNpY3MgPSBudWxsO1xuXG4gIHJldHVybiBBc3Rlcm9pZENvbGxpc2lvbk5vZGU7XG5cbn0pKGFzaC5jb3JlLk5vZGUpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hc3Rlcm9pZF9jb2xsaXNpb25fbm9kZS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc2gsIGFzdGVyb2lkcyxcbiAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9O1xuXG5hc2ggPSByZXF1aXJlKCdhc2guY29mZmVlJyk7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uL2luZGV4Jyk7XG5cbmFzdGVyb2lkcy5ub2Rlcy5BdWRpb05vZGUgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gIF9fZXh0ZW5kcyhBdWRpb05vZGUsIF9zdXBlcik7XG5cbiAgZnVuY3Rpb24gQXVkaW9Ob2RlKCkge1xuICAgIHJldHVybiBBdWRpb05vZGUuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBBdWRpb05vZGUuY29tcG9uZW50cyA9IHtcbiAgICBhdWRpbzogYXN0ZXJvaWRzLmNvbXBvbmVudHMuQXVkaW9cbiAgfTtcblxuICBBdWRpb05vZGUucHJvdG90eXBlLmF1ZGlvID0gbnVsbDtcblxuICByZXR1cm4gQXVkaW9Ob2RlO1xuXG59KShhc2guY29yZS5Ob2RlKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXVkaW9fbm9kZS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc2gsIGFzdGVyb2lkcyxcbiAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9O1xuXG5hc2ggPSByZXF1aXJlKCdhc2guY29mZmVlJyk7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uL2luZGV4Jyk7XG5cbmFzdGVyb2lkcy5ub2Rlcy5CdWxsZXRBZ2VOb2RlID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICBfX2V4dGVuZHMoQnVsbGV0QWdlTm9kZSwgX3N1cGVyKTtcblxuICBmdW5jdGlvbiBCdWxsZXRBZ2VOb2RlKCkge1xuICAgIHJldHVybiBCdWxsZXRBZ2VOb2RlLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgQnVsbGV0QWdlTm9kZS5jb21wb25lbnRzID0ge1xuICAgIGJ1bGxldDogYXN0ZXJvaWRzLmNvbXBvbmVudHMuQnVsbGV0LFxuICAgIHBoeXNpY3M6IGFzdGVyb2lkcy5jb21wb25lbnRzLlBoeXNpY3NcbiAgfTtcblxuICBCdWxsZXRBZ2VOb2RlLnByb3RvdHlwZS5idWxsZXQgPSBudWxsO1xuXG4gIEJ1bGxldEFnZU5vZGUucHJvdG90eXBlLnBoeXNpY3MgPSBudWxsO1xuXG4gIHJldHVybiBCdWxsZXRBZ2VOb2RlO1xuXG59KShhc2guY29yZS5Ob2RlKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YnVsbGV0X2FnZV9ub2RlLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzaCwgYXN0ZXJvaWRzLFxuICBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgX19leHRlbmRzID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChfX2hhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH07XG5cbmFzaCA9IHJlcXVpcmUoJ2FzaC5jb2ZmZWUnKTtcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vaW5kZXgnKTtcblxuYXN0ZXJvaWRzLm5vZGVzLkJ1bGxldENvbGxpc2lvbk5vZGUgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gIF9fZXh0ZW5kcyhCdWxsZXRDb2xsaXNpb25Ob2RlLCBfc3VwZXIpO1xuXG4gIGZ1bmN0aW9uIEJ1bGxldENvbGxpc2lvbk5vZGUoKSB7XG4gICAgcmV0dXJuIEJ1bGxldENvbGxpc2lvbk5vZGUuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBCdWxsZXRDb2xsaXNpb25Ob2RlLmNvbXBvbmVudHMgPSB7XG4gICAgYnVsbGV0OiBhc3Rlcm9pZHMuY29tcG9uZW50cy5CdWxsZXQsXG4gICAgcG9zaXRpb246IGFzdGVyb2lkcy5jb21wb25lbnRzLlBvc2l0aW9uLFxuICAgIGNvbGxpc2lvbjogYXN0ZXJvaWRzLmNvbXBvbmVudHMuQ29sbGlzaW9uLFxuICAgIHBoeXNpY3M6IGFzdGVyb2lkcy5jb21wb25lbnRzLlBoeXNpY3NcbiAgfTtcblxuICBCdWxsZXRDb2xsaXNpb25Ob2RlLnByb3RvdHlwZS5idWxsZXQgPSBudWxsO1xuXG4gIEJ1bGxldENvbGxpc2lvbk5vZGUucHJvdG90eXBlLnBvc2l0aW9uID0gbnVsbDtcblxuICBCdWxsZXRDb2xsaXNpb25Ob2RlLnByb3RvdHlwZS5jb2xsaXNpb24gPSBudWxsO1xuXG4gIEJ1bGxldENvbGxpc2lvbk5vZGUucHJvdG90eXBlLnBoeXNpY3MgPSBudWxsO1xuXG4gIHJldHVybiBCdWxsZXRDb2xsaXNpb25Ob2RlO1xuXG59KShhc2guY29yZS5Ob2RlKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YnVsbGV0X2NvbGxpc2lvbl9ub2RlLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzaCwgYXN0ZXJvaWRzLFxuICBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgX19leHRlbmRzID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChfX2hhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH07XG5cbmFzaCA9IHJlcXVpcmUoJ2FzaC5jb2ZmZWUnKTtcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vaW5kZXgnKTtcblxuYXN0ZXJvaWRzLm5vZGVzLkRlYXRoVGhyb2VzTm9kZSA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgX19leHRlbmRzKERlYXRoVGhyb2VzTm9kZSwgX3N1cGVyKTtcblxuICBmdW5jdGlvbiBEZWF0aFRocm9lc05vZGUoKSB7XG4gICAgcmV0dXJuIERlYXRoVGhyb2VzTm9kZS5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIERlYXRoVGhyb2VzTm9kZS5jb21wb25lbnRzID0ge1xuICAgIGRlYWQ6IGFzdGVyb2lkcy5jb21wb25lbnRzLkRlYXRoVGhyb2VzXG4gIH07XG5cbiAgRGVhdGhUaHJvZXNOb2RlLnByb3RvdHlwZS5kZWFkID0gbnVsbDtcblxuICByZXR1cm4gRGVhdGhUaHJvZXNOb2RlO1xuXG59KShhc2guY29yZS5Ob2RlKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGVhdGhfdGhyb2VzX25vZGUuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXNoLCBhc3Rlcm9pZHMsXG4gIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICBfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfTtcblxuYXNoID0gcmVxdWlyZSgnYXNoLmNvZmZlZScpO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi9pbmRleCcpO1xuXG5hc3Rlcm9pZHMubm9kZXMuR2FtZU5vZGUgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gIF9fZXh0ZW5kcyhHYW1lTm9kZSwgX3N1cGVyKTtcblxuICBmdW5jdGlvbiBHYW1lTm9kZSgpIHtcbiAgICByZXR1cm4gR2FtZU5vZGUuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBHYW1lTm9kZS5jb21wb25lbnRzID0ge1xuICAgIHN0YXRlOiBhc3Rlcm9pZHMuY29tcG9uZW50cy5HYW1lU3RhdGVcbiAgfTtcblxuICBHYW1lTm9kZS5wcm90b3R5cGUuc3RhdGUgPSBudWxsO1xuXG4gIHJldHVybiBHYW1lTm9kZTtcblxufSkoYXNoLmNvcmUuTm9kZSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWdhbWVfbm9kZS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc2gsIGFzdGVyb2lkcyxcbiAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9O1xuXG5hc2ggPSByZXF1aXJlKCdhc2guY29mZmVlJyk7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uL2luZGV4Jyk7XG5cbmFzdGVyb2lkcy5ub2Rlcy5HdW5Db250cm9sTm9kZSA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgX19leHRlbmRzKEd1bkNvbnRyb2xOb2RlLCBfc3VwZXIpO1xuXG4gIGZ1bmN0aW9uIEd1bkNvbnRyb2xOb2RlKCkge1xuICAgIHJldHVybiBHdW5Db250cm9sTm9kZS5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIEd1bkNvbnRyb2xOb2RlLmNvbXBvbmVudHMgPSB7XG4gICAgYXVkaW86IGFzdGVyb2lkcy5jb21wb25lbnRzLkF1ZGlvLFxuICAgIGNvbnRyb2w6IGFzdGVyb2lkcy5jb21wb25lbnRzLkd1bkNvbnRyb2xzLFxuICAgIGd1bjogYXN0ZXJvaWRzLmNvbXBvbmVudHMuR3VuLFxuICAgIHBvc2l0aW9uOiBhc3Rlcm9pZHMuY29tcG9uZW50cy5Qb3NpdGlvblxuICB9O1xuXG4gIEd1bkNvbnRyb2xOb2RlLnByb3RvdHlwZS5jb250cm9sID0gbnVsbDtcblxuICBHdW5Db250cm9sTm9kZS5wcm90b3R5cGUuZ3VuID0gbnVsbDtcblxuICBHdW5Db250cm9sTm9kZS5wcm90b3R5cGUucG9zaXRpb24gPSBudWxsO1xuXG4gIEd1bkNvbnRyb2xOb2RlLnByb3RvdHlwZS5hdWRpbyA9IG51bGw7XG5cbiAgcmV0dXJuIEd1bkNvbnRyb2xOb2RlO1xuXG59KShhc2guY29yZS5Ob2RlKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Z3VuX2NvbnRyb2xfbm9kZS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc2gsIGFzdGVyb2lkcyxcbiAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9O1xuXG5hc2ggPSByZXF1aXJlKCdhc2guY29mZmVlJyk7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uL2luZGV4Jyk7XG5cbmFzdGVyb2lkcy5ub2Rlcy5IdWROb2RlID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICBfX2V4dGVuZHMoSHVkTm9kZSwgX3N1cGVyKTtcblxuICBmdW5jdGlvbiBIdWROb2RlKCkge1xuICAgIHJldHVybiBIdWROb2RlLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgSHVkTm9kZS5jb21wb25lbnRzID0ge1xuICAgIHN0YXRlOiBhc3Rlcm9pZHMuY29tcG9uZW50cy5HYW1lU3RhdGUsXG4gICAgaHVkOiBhc3Rlcm9pZHMuY29tcG9uZW50cy5IdWRcbiAgfTtcblxuICBIdWROb2RlLnByb3RvdHlwZS5zdGF0ZSA9IG51bGw7XG5cbiAgSHVkTm9kZS5wcm90b3R5cGUuaHVkID0gbnVsbDtcblxuICByZXR1cm4gSHVkTm9kZTtcblxufSkoYXNoLmNvcmUuTm9kZSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWh1ZF9ub2RlLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzaCwgYXN0ZXJvaWRzLFxuICBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgX19leHRlbmRzID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChfX2hhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH07XG5cbmFzaCA9IHJlcXVpcmUoJ2FzaC5jb2ZmZWUnKTtcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vaW5kZXgnKTtcblxuYXN0ZXJvaWRzLm5vZGVzLk1vdmVtZW50Tm9kZSA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgX19leHRlbmRzKE1vdmVtZW50Tm9kZSwgX3N1cGVyKTtcblxuICBmdW5jdGlvbiBNb3ZlbWVudE5vZGUoKSB7XG4gICAgcmV0dXJuIE1vdmVtZW50Tm9kZS5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIE1vdmVtZW50Tm9kZS5jb21wb25lbnRzID0ge1xuICAgIHBvc2l0aW9uOiBhc3Rlcm9pZHMuY29tcG9uZW50cy5Qb3NpdGlvbixcbiAgICBtb3Rpb246IGFzdGVyb2lkcy5jb21wb25lbnRzLk1vdGlvblxuICB9O1xuXG4gIE1vdmVtZW50Tm9kZS5wcm90b3R5cGUucG9zaXRpb24gPSBudWxsO1xuXG4gIE1vdmVtZW50Tm9kZS5wcm90b3R5cGUubW90aW9uID0gbnVsbDtcblxuICByZXR1cm4gTW92ZW1lbnROb2RlO1xuXG59KShhc2guY29yZS5Ob2RlKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bW92ZW1lbnRfbm9kZS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc2gsIGFzdGVyb2lkcyxcbiAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9O1xuXG5hc2ggPSByZXF1aXJlKCdhc2guY29mZmVlJyk7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uL2luZGV4Jyk7XG5cbmFzdGVyb2lkcy5ub2Rlcy5QaHlzaWNzQ29udHJvbE5vZGUgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gIF9fZXh0ZW5kcyhQaHlzaWNzQ29udHJvbE5vZGUsIF9zdXBlcik7XG5cbiAgZnVuY3Rpb24gUGh5c2ljc0NvbnRyb2xOb2RlKCkge1xuICAgIHJldHVybiBQaHlzaWNzQ29udHJvbE5vZGUuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBQaHlzaWNzQ29udHJvbE5vZGUuY29tcG9uZW50cyA9IHtcbiAgICBjb250cm9sOiBhc3Rlcm9pZHMuY29tcG9uZW50cy5Nb3Rpb25Db250cm9scyxcbiAgICBwaHlzaWNzOiBhc3Rlcm9pZHMuY29tcG9uZW50cy5QaHlzaWNzXG4gIH07XG5cbiAgUGh5c2ljc0NvbnRyb2xOb2RlLnByb3RvdHlwZS5jb250cm9sID0gbnVsbDtcblxuICBQaHlzaWNzQ29udHJvbE5vZGUucHJvdG90eXBlLnBoeXNpY3MgPSBudWxsO1xuXG4gIHJldHVybiBQaHlzaWNzQ29udHJvbE5vZGU7XG5cbn0pKGFzaC5jb3JlLk5vZGUpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1waHlzaWNzX2NvbnRyb2xfbm9kZS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc2gsIGFzdGVyb2lkcyxcbiAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9O1xuXG5hc2ggPSByZXF1aXJlKCdhc2guY29mZmVlJyk7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uL2luZGV4Jyk7XG5cbmFzdGVyb2lkcy5ub2Rlcy5QaHlzaWNzTm9kZSA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgX19leHRlbmRzKFBoeXNpY3NOb2RlLCBfc3VwZXIpO1xuXG4gIGZ1bmN0aW9uIFBoeXNpY3NOb2RlKCkge1xuICAgIHJldHVybiBQaHlzaWNzTm9kZS5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFBoeXNpY3NOb2RlLmNvbXBvbmVudHMgPSB7XG4gICAgcG9zaXRpb246IGFzdGVyb2lkcy5jb21wb25lbnRzLlBvc2l0aW9uLFxuICAgIHBoeXNpY3M6IGFzdGVyb2lkcy5jb21wb25lbnRzLlBoeXNpY3NcbiAgfTtcblxuICBQaHlzaWNzTm9kZS5wcm90b3R5cGUucG9zaXRpb24gPSBudWxsO1xuXG4gIFBoeXNpY3NOb2RlLnByb3RvdHlwZS5waHlzaWNzID0gbnVsbDtcblxuICByZXR1cm4gUGh5c2ljc05vZGU7XG5cbn0pKGFzaC5jb3JlLk5vZGUpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1waHlzaWNzX25vZGUuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXNoLCBhc3Rlcm9pZHMsXG4gIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICBfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfTtcblxuYXNoID0gcmVxdWlyZSgnYXNoLmNvZmZlZScpO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi9pbmRleCcpO1xuXG5hc3Rlcm9pZHMubm9kZXMuUmVuZGVyTm9kZSA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgX19leHRlbmRzKFJlbmRlck5vZGUsIF9zdXBlcik7XG5cbiAgZnVuY3Rpb24gUmVuZGVyTm9kZSgpIHtcbiAgICByZXR1cm4gUmVuZGVyTm9kZS5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFJlbmRlck5vZGUuY29tcG9uZW50cyA9IHtcbiAgICBwb3NpdGlvbjogYXN0ZXJvaWRzLmNvbXBvbmVudHMuUG9zaXRpb24sXG4gICAgZGlzcGxheTogYXN0ZXJvaWRzLmNvbXBvbmVudHMuRGlzcGxheVxuICB9O1xuXG4gIFJlbmRlck5vZGUucHJvdG90eXBlLnBvc2l0aW9uID0gbnVsbDtcblxuICBSZW5kZXJOb2RlLnByb3RvdHlwZS5kaXNwbGF5ID0gbnVsbDtcblxuICByZXR1cm4gUmVuZGVyTm9kZTtcblxufSkoYXNoLmNvcmUuTm9kZSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXJlbmRlcl9ub2RlLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzaCwgYXN0ZXJvaWRzLFxuICBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgX19leHRlbmRzID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChfX2hhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH07XG5cbmFzaCA9IHJlcXVpcmUoJ2FzaC5jb2ZmZWUnKTtcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vaW5kZXgnKTtcblxuYXN0ZXJvaWRzLm5vZGVzLlNwYWNlc2hpcENvbGxpc2lvbk5vZGUgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gIF9fZXh0ZW5kcyhTcGFjZXNoaXBDb2xsaXNpb25Ob2RlLCBfc3VwZXIpO1xuXG4gIGZ1bmN0aW9uIFNwYWNlc2hpcENvbGxpc2lvbk5vZGUoKSB7XG4gICAgcmV0dXJuIFNwYWNlc2hpcENvbGxpc2lvbk5vZGUuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBTcGFjZXNoaXBDb2xsaXNpb25Ob2RlLmNvbXBvbmVudHMgPSB7XG4gICAgc3BhY2VzaGlwOiBhc3Rlcm9pZHMuY29tcG9uZW50cy5TcGFjZXNoaXAsXG4gICAgcG9zaXRpb246IGFzdGVyb2lkcy5jb21wb25lbnRzLlBvc2l0aW9uLFxuICAgIGNvbGxpc2lvbjogYXN0ZXJvaWRzLmNvbXBvbmVudHMuQ29sbGlzaW9uLFxuICAgIGF1ZGlvOiBhc3Rlcm9pZHMuY29tcG9uZW50cy5BdWRpbyxcbiAgICBwaHlzaWNzOiBhc3Rlcm9pZHMuY29tcG9uZW50cy5QaHlzaWNzXG4gIH07XG5cbiAgU3BhY2VzaGlwQ29sbGlzaW9uTm9kZS5wcm90b3R5cGUuc3BhY2VzaGlwID0gbnVsbDtcblxuICBTcGFjZXNoaXBDb2xsaXNpb25Ob2RlLnByb3RvdHlwZS5wb3NpdGlvbiA9IG51bGw7XG5cbiAgU3BhY2VzaGlwQ29sbGlzaW9uTm9kZS5wcm90b3R5cGUuY29sbGlzaW9uID0gbnVsbDtcblxuICBTcGFjZXNoaXBDb2xsaXNpb25Ob2RlLnByb3RvdHlwZS5hdWRpbyA9IG51bGw7XG5cbiAgU3BhY2VzaGlwQ29sbGlzaW9uTm9kZS5wcm90b3R5cGUucGh5c2ljcyA9IG51bGw7XG5cbiAgcmV0dXJuIFNwYWNlc2hpcENvbGxpc2lvbk5vZGU7XG5cbn0pKGFzaC5jb3JlLk5vZGUpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zcGFjZXNoaXBfY29sbGlzaW9uX25vZGUuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXNoLCBhc3Rlcm9pZHMsXG4gIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICBfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfTtcblxuYXNoID0gcmVxdWlyZSgnYXNoLmNvZmZlZScpO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi9pbmRleCcpO1xuXG5hc3Rlcm9pZHMubm9kZXMuU3BhY2VzaGlwTm9kZSA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgX19leHRlbmRzKFNwYWNlc2hpcE5vZGUsIF9zdXBlcik7XG5cbiAgZnVuY3Rpb24gU3BhY2VzaGlwTm9kZSgpIHtcbiAgICByZXR1cm4gU3BhY2VzaGlwTm9kZS5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFNwYWNlc2hpcE5vZGUuY29tcG9uZW50cyA9IHtcbiAgICBzcGFjZXNoaXA6IGFzdGVyb2lkcy5jb21wb25lbnRzLlNwYWNlc2hpcCxcbiAgICBwb3NpdGlvbjogYXN0ZXJvaWRzLmNvbXBvbmVudHMuUG9zaXRpb25cbiAgfTtcblxuICBTcGFjZXNoaXBOb2RlLnByb3RvdHlwZS5zcGFjZXNoaXAgPSAwO1xuXG4gIFNwYWNlc2hpcE5vZGUucHJvdG90eXBlLnBvc2l0aW9uID0gMDtcblxuICByZXR1cm4gU3BhY2VzaGlwTm9kZTtcblxufSkoYXNoLmNvcmUuTm9kZSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNwYWNlc2hpcF9ub2RlLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzaCwgYXN0ZXJvaWRzLFxuICBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgX19leHRlbmRzID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChfX2hhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH07XG5cbmFzaCA9IHJlcXVpcmUoJ2FzaC5jb2ZmZWUnKTtcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vaW5kZXgnKTtcblxuYXN0ZXJvaWRzLm5vZGVzLldhaXRGb3JTdGFydE5vZGUgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gIF9fZXh0ZW5kcyhXYWl0Rm9yU3RhcnROb2RlLCBfc3VwZXIpO1xuXG4gIGZ1bmN0aW9uIFdhaXRGb3JTdGFydE5vZGUoKSB7XG4gICAgcmV0dXJuIFdhaXRGb3JTdGFydE5vZGUuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBXYWl0Rm9yU3RhcnROb2RlLmNvbXBvbmVudHMgPSB7XG4gICAgd2FpdDogYXN0ZXJvaWRzLmNvbXBvbmVudHMuV2FpdEZvclN0YXJ0XG4gIH07XG5cbiAgV2FpdEZvclN0YXJ0Tm9kZS5wcm90b3R5cGUud2FpdCA9IG51bGw7XG5cbiAgcmV0dXJuIFdhaXRGb3JTdGFydE5vZGU7XG5cbn0pKGFzaC5jb3JlLk5vZGUpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD13YWl0X2Zvcl9zdGFydF9ub2RlLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIERvdCwgUG9pbnQsIGFzdGVyb2lkcyxcbiAgX19iaW5kID0gZnVuY3Rpb24oZm4sIG1lKXsgcmV0dXJuIGZ1bmN0aW9uKCl7IHJldHVybiBmbi5hcHBseShtZSwgYXJndW1lbnRzKTsgfTsgfTtcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vaW5kZXgnKTtcblxuUG9pbnQgPSBhc3Rlcm9pZHMudWkuUG9pbnQ7XG5cbmFzdGVyb2lkcy5zcHJpdGVzLkFzdGVyb2lkRGVhdGhWaWV3ID0gKGZ1bmN0aW9uKCkge1xuICBBc3Rlcm9pZERlYXRoVmlldy5wcm90b3R5cGUueCA9IDA7XG5cbiAgQXN0ZXJvaWREZWF0aFZpZXcucHJvdG90eXBlLnkgPSAwO1xuXG4gIEFzdGVyb2lkRGVhdGhWaWV3LnByb3RvdHlwZS5yb3RhdGlvbiA9IDA7XG5cbiAgQXN0ZXJvaWREZWF0aFZpZXcucHJvdG90eXBlLnJhZGl1cyA9IDA7XG5cbiAgQXN0ZXJvaWREZWF0aFZpZXcucHJvdG90eXBlLnBvaW50cyA9IG51bGw7XG5cbiAgQXN0ZXJvaWREZWF0aFZpZXcucHJvdG90eXBlLmZpcnN0ID0gdHJ1ZTtcblxuICBBc3Rlcm9pZERlYXRoVmlldy5wcm90b3R5cGUuZG90cyA9IG51bGw7XG5cbiAgZnVuY3Rpb24gQXN0ZXJvaWREZWF0aFZpZXcocmFkaXVzKSB7XG4gICAgdGhpcy5yYWRpdXMgPSByYWRpdXM7XG4gICAgdGhpcy5kcmF3ID0gX19iaW5kKHRoaXMuZHJhdywgdGhpcyk7XG4gICAgdGhpcy5kb3RzID0gW107XG4gIH1cblxuICBBc3Rlcm9pZERlYXRoVmlldy5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKGN0eCkge1xuICAgIHZhciBkb3QsIF9pLCBfbGVuLCBfcmVmLCBfcmVzdWx0cztcbiAgICBfcmVmID0gdGhpcy5kb3RzO1xuICAgIF9yZXN1bHRzID0gW107XG4gICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICBkb3QgPSBfcmVmW19pXTtcbiAgICAgIF9yZXN1bHRzLnB1c2goZG90LmRyYXcoY3R4LCB0aGlzLngsIHRoaXMueSkpO1xuICAgIH1cbiAgICByZXR1cm4gX3Jlc3VsdHM7XG4gIH07XG5cbiAgQXN0ZXJvaWREZWF0aFZpZXcucHJvdG90eXBlLmFuaW1hdGUgPSBmdW5jdGlvbih0aW1lKSB7XG4gICAgdmFyIGRvdCwgaSwgX2ksIF9qLCBfbGVuLCBfcmVmLCBfcmVzdWx0cztcbiAgICBpZiAodGhpcy5maXJzdCkge1xuICAgICAgdGhpcy5maXJzdCA9IGZhbHNlO1xuICAgICAgZm9yIChpID0gX2kgPSAwOyBfaSA8IDg7IGkgPSArK19pKSB7XG4gICAgICAgIGRvdCA9IG5ldyBEb3QodGhpcy5yYWRpdXMpO1xuICAgICAgICB0aGlzLmRvdHMucHVzaChkb3QpO1xuICAgICAgfVxuICAgIH1cbiAgICBfcmVmID0gdGhpcy5kb3RzO1xuICAgIF9yZXN1bHRzID0gW107XG4gICAgZm9yIChfaiA9IDAsIF9sZW4gPSBfcmVmLmxlbmd0aDsgX2ogPCBfbGVuOyBfaisrKSB7XG4gICAgICBkb3QgPSBfcmVmW19qXTtcbiAgICAgIGRvdC54ICs9IGRvdC52ZWxvY2l0eS54ICogdGltZTtcbiAgICAgIF9yZXN1bHRzLnB1c2goZG90LnkgKz0gZG90LnZlbG9jaXR5LnkgKiB0aW1lKTtcbiAgICB9XG4gICAgcmV0dXJuIF9yZXN1bHRzO1xuICB9O1xuXG4gIHJldHVybiBBc3Rlcm9pZERlYXRoVmlldztcblxufSkoKTtcblxuRG90ID0gKGZ1bmN0aW9uKCkge1xuICBEb3QucHJvdG90eXBlLnZlbG9jaXR5ID0gbnVsbDtcblxuICBEb3QucHJvdG90eXBlLnggPSAwO1xuXG4gIERvdC5wcm90b3R5cGUueSA9IDA7XG5cbiAgZnVuY3Rpb24gRG90KG1heERpc3RhbmNlKSB7XG4gICAgdmFyIGFuZ2xlLCBkaXN0YW5jZSwgc3BlZWQ7XG4gICAgYW5nbGUgPSBNYXRoLnJhbmRvbSgpICogMiAqIE1hdGguUEk7XG4gICAgZGlzdGFuY2UgPSBNYXRoLnJhbmRvbSgpICogbWF4RGlzdGFuY2U7XG4gICAgdGhpcy54ID0gTWF0aC5jb3MoYW5nbGUpICogZGlzdGFuY2U7XG4gICAgdGhpcy55ID0gTWF0aC5zaW4oYW5nbGUpICogZGlzdGFuY2U7XG4gICAgc3BlZWQgPSBNYXRoLnJhbmRvbSgpICogMTAgKyAxMDtcbiAgICB0aGlzLnZlbG9jaXR5ID0gbmV3IFBvaW50KE1hdGguY29zKGFuZ2xlKSAqIHNwZWVkLCBNYXRoLnNpbihhbmdsZSkgKiBzcGVlZCk7XG4gIH1cblxuICBEb3QucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbihjdHgsIHgsIHkpIHtcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHgudHJhbnNsYXRlKHgsIHkpO1xuICAgIGN0eC5yb3RhdGUodGhpcy5yb3RhdGlvbik7XG4gICAgY3R4LmZpbGxTdHlsZSA9IFwiI0ZGRkZGRlwiO1xuICAgIGN0eC5hcmModGhpcy54LCB0aGlzLnksIDIsIDAsIE1hdGguUEkgKiAyLCBmYWxzZSk7XG4gICAgY3R4LmZpbGwoKTtcbiAgICBjdHgucmVzdG9yZSgpO1xuICB9O1xuXG4gIHJldHVybiBEb3Q7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFzdGVyb2lkX2RlYXRoX3ZpZXcuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXN0ZXJvaWRzLFxuICBfX2JpbmQgPSBmdW5jdGlvbihmbiwgbWUpeyByZXR1cm4gZnVuY3Rpb24oKXsgcmV0dXJuIGZuLmFwcGx5KG1lLCBhcmd1bWVudHMpOyB9OyB9O1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi9pbmRleCcpO1xuXG5hc3Rlcm9pZHMuc3ByaXRlcy5Bc3Rlcm9pZFZpZXcgPSAoZnVuY3Rpb24oKSB7XG4gIEFzdGVyb2lkVmlldy5wcm90b3R5cGUueCA9IDA7XG5cbiAgQXN0ZXJvaWRWaWV3LnByb3RvdHlwZS55ID0gMDtcblxuICBBc3Rlcm9pZFZpZXcucHJvdG90eXBlLnJvdGF0aW9uID0gMDtcblxuICBBc3Rlcm9pZFZpZXcucHJvdG90eXBlLnJhZGl1cyA9IDA7XG5cbiAgQXN0ZXJvaWRWaWV3LnByb3RvdHlwZS5wb2ludHMgPSBudWxsO1xuXG4gIGZ1bmN0aW9uIEFzdGVyb2lkVmlldyhyYWRpdXMpIHtcbiAgICB2YXIgYW5nbGUsIGxlbmd0aCwgcG9zWCwgcG9zWTtcbiAgICB0aGlzLnJhZGl1cyA9IHJhZGl1cztcbiAgICB0aGlzLmRyYXcgPSBfX2JpbmQodGhpcy5kcmF3LCB0aGlzKTtcbiAgICB0aGlzLndpZHRoID0gdGhpcy5yYWRpdXM7XG4gICAgdGhpcy5oZWlnaHQgPSB0aGlzLnJhZGl1cztcbiAgICB0aGlzLnBvaW50cyA9IFtdO1xuICAgIGFuZ2xlID0gMDtcbiAgICB3aGlsZSAoYW5nbGUgPCBNYXRoLlBJICogMikge1xuICAgICAgbGVuZ3RoID0gKDAuNzUgKyBNYXRoLnJhbmRvbSgpICogMC4yNSkgKiB0aGlzLnJhZGl1cztcbiAgICAgIHBvc1ggPSBNYXRoLmNvcyhhbmdsZSkgKiBsZW5ndGg7XG4gICAgICBwb3NZID0gTWF0aC5zaW4oYW5nbGUpICogbGVuZ3RoO1xuICAgICAgdGhpcy5wb2ludHMucHVzaCh7XG4gICAgICAgIHg6IHBvc1gsXG4gICAgICAgIHk6IHBvc1lcbiAgICAgIH0pO1xuICAgICAgYW5nbGUgKz0gTWF0aC5yYW5kb20oKSAqIDAuNTtcbiAgICB9XG4gIH1cblxuICBBc3Rlcm9pZFZpZXcucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbihjdHgpIHtcbiAgICB2YXIgaTtcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHgudHJhbnNsYXRlKHRoaXMueCwgdGhpcy55KTtcbiAgICBjdHgucm90YXRlKHRoaXMucm90YXRpb24pO1xuICAgIGN0eC5maWxsU3R5bGUgPSBcIiNGRkZGRkZcIjtcbiAgICBjdHgubW92ZVRvKHRoaXMucmFkaXVzLCAwKTtcbiAgICBpID0gMDtcbiAgICB3aGlsZSAoaSA8IHRoaXMucG9pbnRzLmxlbmd0aCkge1xuICAgICAgY3R4LmxpbmVUbyh0aGlzLnBvaW50c1tpXS54LCB0aGlzLnBvaW50c1tpXS55KTtcbiAgICAgICsraTtcbiAgICB9XG4gICAgY3R4LmxpbmVUbyh0aGlzLnJhZGl1cywgMCk7XG4gICAgY3R4LmZpbGwoKTtcbiAgICBjdHgucmVzdG9yZSgpO1xuICB9O1xuXG4gIHJldHVybiBBc3Rlcm9pZFZpZXc7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFzdGVyb2lkX3ZpZXcuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXN0ZXJvaWRzLFxuICBfX2JpbmQgPSBmdW5jdGlvbihmbiwgbWUpeyByZXR1cm4gZnVuY3Rpb24oKXsgcmV0dXJuIGZuLmFwcGx5KG1lLCBhcmd1bWVudHMpOyB9OyB9O1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi9pbmRleCcpO1xuXG5hc3Rlcm9pZHMuc3ByaXRlcy5CdWxsZXRWaWV3ID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBCdWxsZXRWaWV3KCkge1xuICAgIHRoaXMuZHJhdyA9IF9fYmluZCh0aGlzLmRyYXcsIHRoaXMpO1xuICB9XG5cbiAgQnVsbGV0Vmlldy5wcm90b3R5cGUueCA9IDA7XG5cbiAgQnVsbGV0Vmlldy5wcm90b3R5cGUueSA9IDA7XG5cbiAgQnVsbGV0Vmlldy5wcm90b3R5cGUucm90YXRpb24gPSAwO1xuXG4gIEJ1bGxldFZpZXcucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbihjdHgpIHtcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHgucm90YXRlKHRoaXMucm90YXRpb24pO1xuICAgIGN0eC5maWxsU3R5bGUgPSBcIiNGRkZGRkZcIjtcbiAgICBjdHguYXJjKHRoaXMueCwgdGhpcy55LCAyLCAwLCBNYXRoLlBJICogMiwgZmFsc2UpO1xuICAgIGN0eC5maWxsKCk7XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfTtcblxuICByZXR1cm4gQnVsbGV0VmlldztcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YnVsbGV0X3ZpZXcuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXN0ZXJvaWRzLFxuICBfX2JpbmQgPSBmdW5jdGlvbihmbiwgbWUpeyByZXR1cm4gZnVuY3Rpb24oKXsgcmV0dXJuIGZuLmFwcGx5KG1lLCBhcmd1bWVudHMpOyB9OyB9O1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi9pbmRleCcpO1xuXG5hc3Rlcm9pZHMuc3ByaXRlcy5IdWRWaWV3ID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBIdWRWaWV3KCkge1xuICAgIHRoaXMuZHJhdyA9IF9fYmluZCh0aGlzLmRyYXcsIHRoaXMpO1xuICAgIHRoaXMuc2V0U2NvcmUgPSBfX2JpbmQodGhpcy5zZXRTY29yZSwgdGhpcyk7XG4gICAgdGhpcy5zZXRMaXZlcyA9IF9fYmluZCh0aGlzLnNldExpdmVzLCB0aGlzKTtcbiAgfVxuXG4gIEh1ZFZpZXcucHJvdG90eXBlLnggPSAwO1xuXG4gIEh1ZFZpZXcucHJvdG90eXBlLnkgPSAwO1xuXG4gIEh1ZFZpZXcucHJvdG90eXBlLnJvdGF0aW9uID0gMDtcblxuICBIdWRWaWV3LnByb3RvdHlwZS5zY29yZSA9IDA7XG5cbiAgSHVkVmlldy5wcm90b3R5cGUubGl2ZXMgPSAzO1xuXG4gIEh1ZFZpZXcucHJvdG90eXBlLnNldExpdmVzID0gZnVuY3Rpb24obGl2ZXMpIHtcbiAgICB0aGlzLmxpdmVzID0gbGl2ZXM7XG4gIH07XG5cbiAgSHVkVmlldy5wcm90b3R5cGUuc2V0U2NvcmUgPSBmdW5jdGlvbihzY29yZSkge1xuICAgIHRoaXMuc2NvcmUgPSBzY29yZTtcbiAgfTtcblxuICBIdWRWaWV3LnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oY3R4KSB7XG4gICAgdmFyIGwsIHMsIHgsIHk7XG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4LmZvbnQgPSAnYm9sZCAxOHB4IG9wZW5keXNsZXhpYyc7XG4gICAgY3R4LmZpbGxTdHlsZSA9ICcjMDBGRkZGJztcbiAgICBjdHgudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgcyA9IFwiTElWRVM6IFwiICsgdGhpcy5saXZlcztcbiAgICBsID0gY3R4Lm1lYXN1cmVUZXh0KHMpO1xuICAgIHggPSBsLndpZHRoO1xuICAgIHkgPSAyMDtcbiAgICBjdHguZmlsbFRleHQocywgeCwgeSk7XG4gICAgY3R4LmZpbGwoKTtcbiAgICBjdHgucmVzdG9yZSgpO1xuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5mb250ID0gJ2JvbGQgMThweCBvcGVuZHlzbGV4aWN0bWw1IHNwcml0ZSc7XG4gICAgY3R4LmZpbGxTdHlsZSA9ICcjMDBGRkZGJztcbiAgICBjdHgudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgcyA9IFwiU0NPUkU6IFwiICsgdGhpcy5zY29yZTtcbiAgICBsID0gY3R4Lm1lYXN1cmVUZXh0KHMpO1xuICAgIHggPSAod2luZG93LndpbmRvdy5pbm5lcldpZHRoICogd2luZG93LmRldmljZVBpeGVsUmF0aW8pIC0gbC53aWR0aDtcbiAgICB5ID0gMjA7XG4gICAgY3R4LmZpbGxUZXh0KHMsIHgsIHkpO1xuICAgIGN0eC5maWxsKCk7XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfTtcblxuICByZXR1cm4gSHVkVmlldztcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aHVkX3ZpZXcuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgUG9pbnQsIGFzdGVyb2lkcyxcbiAgX19iaW5kID0gZnVuY3Rpb24oZm4sIG1lKXsgcmV0dXJuIGZ1bmN0aW9uKCl7IHJldHVybiBmbi5hcHBseShtZSwgYXJndW1lbnRzKTsgfTsgfTtcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vaW5kZXgnKTtcblxuUG9pbnQgPSBhc3Rlcm9pZHMudWkuUG9pbnQ7XG5cbmFzdGVyb2lkcy5zcHJpdGVzLlNwYWNlc2hpcERlYXRoVmlldyA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gU3BhY2VzaGlwRGVhdGhWaWV3KCkge1xuICAgIHRoaXMuZHJhdyA9IF9fYmluZCh0aGlzLmRyYXcsIHRoaXMpO1xuICB9XG5cbiAgU3BhY2VzaGlwRGVhdGhWaWV3LnByb3RvdHlwZS54ID0gMDtcblxuICBTcGFjZXNoaXBEZWF0aFZpZXcucHJvdG90eXBlLnkgPSAwO1xuXG4gIFNwYWNlc2hpcERlYXRoVmlldy5wcm90b3R5cGUucm90YXRpb24gPSAwO1xuXG4gIFNwYWNlc2hpcERlYXRoVmlldy5wcm90b3R5cGUudmVsMSA9IG51bGw7XG5cbiAgU3BhY2VzaGlwRGVhdGhWaWV3LnByb3RvdHlwZS52ZWwyID0gbnVsbDtcblxuICBTcGFjZXNoaXBEZWF0aFZpZXcucHJvdG90eXBlLnJvdDEgPSBudWxsO1xuXG4gIFNwYWNlc2hpcERlYXRoVmlldy5wcm90b3R5cGUucm90MiA9IG51bGw7XG5cbiAgU3BhY2VzaGlwRGVhdGhWaWV3LnByb3RvdHlwZS54MSA9IDA7XG5cbiAgU3BhY2VzaGlwRGVhdGhWaWV3LnByb3RvdHlwZS55MiA9IDA7XG5cbiAgU3BhY2VzaGlwRGVhdGhWaWV3LnByb3RvdHlwZS55MSA9IDA7XG5cbiAgU3BhY2VzaGlwRGVhdGhWaWV3LnByb3RvdHlwZS55MiA9IDA7XG5cbiAgU3BhY2VzaGlwRGVhdGhWaWV3LnByb3RvdHlwZS5maXJzdCA9IHRydWU7XG5cbiAgU3BhY2VzaGlwRGVhdGhWaWV3LnByb3RvdHlwZS5hbmltYXRlID0gZnVuY3Rpb24odGltZSkge1xuICAgIGlmICh0aGlzLmZpcnN0KSB7XG4gICAgICB0aGlzLmZpcnN0ID0gZmFsc2U7XG4gICAgICB0aGlzLnZlbDEgPSBuZXcgUG9pbnQoTWF0aC5yYW5kb20oKSAqIDEwIC0gNSwgTWF0aC5yYW5kb20oKSAqIDEwICsgMTApO1xuICAgICAgdGhpcy52ZWwyID0gbmV3IFBvaW50KE1hdGgucmFuZG9tKCkgKiAxMCAtIDUsIC0oTWF0aC5yYW5kb20oKSAqIDEwICsgMTApKTtcbiAgICAgIHRoaXMucm90MSA9IE1hdGgucmFuZG9tKCkgKiAzMDAgLSAxNTA7XG4gICAgICB0aGlzLnJvdDIgPSBNYXRoLnJhbmRvbSgpICogMzAwIC0gMTUwO1xuICAgICAgdGhpcy54MSA9IHRoaXMueDIgPSB0aGlzLng7XG4gICAgICB0aGlzLnkxID0gdGhpcy55MiA9IHRoaXMueTtcbiAgICAgIHRoaXMucjEgPSB0aGlzLnIyID0gdGhpcy5yb3RhdGlvbjtcbiAgICB9XG4gICAgdGhpcy54MSArPSB0aGlzLnZlbDEueCAqIHRpbWU7XG4gICAgdGhpcy55MSArPSB0aGlzLnZlbDEueSAqIHRpbWU7XG4gICAgdGhpcy5yMSArPSB0aGlzLnJvdDEgKiB0aW1lO1xuICAgIHRoaXMueDIgKz0gdGhpcy52ZWwyLnggKiB0aW1lO1xuICAgIHRoaXMueTIgKz0gdGhpcy52ZWwyLnkgKiB0aW1lO1xuICAgIHRoaXMucjIgKz0gdGhpcy5yb3QyICogdGltZTtcbiAgfTtcblxuICBTcGFjZXNoaXBEZWF0aFZpZXcucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbihjdHgpIHtcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHgudHJhbnNsYXRlKHRoaXMueCArIHRoaXMueDEsIHRoaXMueSArIHRoaXMueTEpO1xuICAgIGN0eC5yb3RhdGUodGhpcy5yMSk7XG4gICAgY3R4LmZpbGxTdHlsZSA9IFwiI0ZGRkZGRlwiO1xuICAgIGN0eC5tb3ZlVG8oMTAsIDApO1xuICAgIGN0eC5saW5lVG8oLTcsIDcpO1xuICAgIGN0eC5saW5lVG8oLTQsIDApO1xuICAgIGN0eC5saW5lVG8oMTAsIDApO1xuICAgIGN0eC5maWxsKCk7XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHgudHJhbnNsYXRlKHRoaXMueCArIHRoaXMueDIsIHRoaXMueSArIHRoaXMueTIpO1xuICAgIGN0eC5yb3RhdGUodGhpcy5yMik7XG4gICAgY3R4LmZpbGxTdHlsZSA9IFwiI0ZGRkZGRlwiO1xuICAgIGN0eC5tb3ZlVG8oMTAsIDApO1xuICAgIGN0eC5saW5lVG8oLTcsIDcpO1xuICAgIGN0eC5saW5lVG8oLTQsIDApO1xuICAgIGN0eC5saW5lVG8oMTAsIDApO1xuICAgIGN0eC5maWxsKCk7XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfTtcblxuICByZXR1cm4gU3BhY2VzaGlwRGVhdGhWaWV3O1xuXG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zcGFjZXNoaXBfZGVhdGhfdmlldy5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc3Rlcm9pZHMsXG4gIF9fYmluZCA9IGZ1bmN0aW9uKGZuLCBtZSl7IHJldHVybiBmdW5jdGlvbigpeyByZXR1cm4gZm4uYXBwbHkobWUsIGFyZ3VtZW50cyk7IH07IH07XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uL2luZGV4Jyk7XG5cbmFzdGVyb2lkcy5zcHJpdGVzLlNwYWNlc2hpcFZpZXcgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIFNwYWNlc2hpcFZpZXcoKSB7XG4gICAgdGhpcy5kcmF3ID0gX19iaW5kKHRoaXMuZHJhdywgdGhpcyk7XG4gIH1cblxuICBTcGFjZXNoaXBWaWV3LnByb3RvdHlwZS54ID0gMDtcblxuICBTcGFjZXNoaXBWaWV3LnByb3RvdHlwZS55ID0gMDtcblxuICBTcGFjZXNoaXBWaWV3LnByb3RvdHlwZS5yb3RhdGlvbiA9IDA7XG5cbiAgU3BhY2VzaGlwVmlldy5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKGN0eCkge1xuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC50cmFuc2xhdGUodGhpcy54LCB0aGlzLnkpO1xuICAgIGN0eC5yb3RhdGUodGhpcy5yb3RhdGlvbik7XG4gICAgY3R4LmZpbGxTdHlsZSA9IFwiI0ZGRkZGRlwiO1xuICAgIGN0eC5tb3ZlVG8oMTAsIDApO1xuICAgIGN0eC5saW5lVG8oLTcsIDcpO1xuICAgIGN0eC5saW5lVG8oLTQsIDApO1xuICAgIGN0eC5saW5lVG8oLTcsIC03KTtcbiAgICBjdHgubGluZVRvKDEwLCAwKTtcbiAgICBjdHguZmlsbCgpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH07XG5cbiAgcmV0dXJuIFNwYWNlc2hpcFZpZXc7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNwYWNlc2hpcF92aWV3LmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIFNpZ25hbDAsIGFzaCwgYXN0ZXJvaWRzLFxuICBfX2JpbmQgPSBmdW5jdGlvbihmbiwgbWUpeyByZXR1cm4gZnVuY3Rpb24oKXsgcmV0dXJuIGZuLmFwcGx5KG1lLCBhcmd1bWVudHMpOyB9OyB9O1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi9pbmRleCcpO1xuXG5hc2ggPSByZXF1aXJlKCdhc2guY29mZmVlJyk7XG5cblNpZ25hbDAgPSBhc2guc2lnbmFscy5TaWduYWwwO1xuXG5hc3Rlcm9pZHMuc3ByaXRlcy5XYWl0Rm9yU3RhcnRWaWV3ID0gKGZ1bmN0aW9uKCkge1xuICBXYWl0Rm9yU3RhcnRWaWV3LnByb3RvdHlwZS54ID0gMDtcblxuICBXYWl0Rm9yU3RhcnRWaWV3LnByb3RvdHlwZS55ID0gMDtcblxuICBXYWl0Rm9yU3RhcnRWaWV3LnByb3RvdHlwZS5yb3RhdGlvbiA9IDA7XG5cbiAgV2FpdEZvclN0YXJ0Vmlldy5wcm90b3R5cGUuZmlyc3QgPSB0cnVlO1xuXG4gIFdhaXRGb3JTdGFydFZpZXcucHJvdG90eXBlLmNsaWNrID0gbnVsbDtcblxuICBmdW5jdGlvbiBXYWl0Rm9yU3RhcnRWaWV3KCkge1xuICAgIHRoaXMuZHJhdyA9IF9fYmluZCh0aGlzLmRyYXcsIHRoaXMpO1xuICAgIHRoaXMuY2xpY2sgPSBuZXcgU2lnbmFsMCgpO1xuICB9XG5cbiAgV2FpdEZvclN0YXJ0Vmlldy5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKGN0eCkge1xuICAgIHZhciBsLCBzLCB4LCB5O1xuICAgIGlmICh0aGlzLmZpcnN0KSB7XG4gICAgICB0aGlzLmZpcnN0ID0gZmFsc2U7XG4gICAgICBjdHguY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgIHJldHVybiBfdGhpcy5jbGljay5kaXNwYXRjaCgpO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpO1xuICAgIH1cbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHguZm9udCA9ICdib2xkIDQwcHggb3BlbmR5c2xleGljJztcbiAgICBjdHguZmlsbFN0eWxlID0gJyNGRkZGRkYnO1xuICAgIHMgPSAnQVNURVJPSURTJztcbiAgICBsID0gY3R4Lm1lYXN1cmVUZXh0KHMpO1xuICAgIHggPSBNYXRoLmZsb29yKCgod2luZG93LmlubmVyV2lkdGggKiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbykgLSBsLndpZHRoKSAvIDIpO1xuICAgIHkgPSAxNzU7XG4gICAgY3R4LmZpbGxUZXh0KHMsIHgsIHkpO1xuICAgIGN0eC5maWxsKCk7XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHguZm9udCA9ICdib2xkIDE4cHggb3BlbmR5c2xleGljJztcbiAgICBjdHguZmlsbFN0eWxlID0gJyNGRkZGRkYnO1xuICAgIHMgPSAnQ0xJQ0sgVE8gU1RBUlQnO1xuICAgIGwgPSBjdHgubWVhc3VyZVRleHQocyk7XG4gICAgeCA9IE1hdGguZmxvb3IoKCh3aW5kb3cuaW5uZXJXaWR0aCAqIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKSAtIGwud2lkdGgpIC8gMik7XG4gICAgeSA9IDIyNTtcbiAgICBjdHguZmlsbFRleHQocywgeCwgeSk7XG4gICAgY3R4LmZpbGwoKTtcbiAgICBjdHgucmVzdG9yZSgpO1xuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5mb250ID0gJ2JvbGQgMTRweCBvcGVuZHlzbGV4aWMnO1xuICAgIGN0eC5maWxsU3R5bGUgPSAnI0ZGRkZGRic7XG4gICAgcyA9ICdaIHRvIEZpcmUgIH4gIEFycm93IEtleXMgdG8gTW92ZSc7XG4gICAgbCA9IGN0eC5tZWFzdXJlVGV4dChzKTtcbiAgICB4ID0gMTA7XG4gICAgeSA9IHdpbmRvdy5pbm5lckhlaWdodCAqIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIC0gMjA7XG4gICAgY3R4LmZpbGxUZXh0KHMsIHgsIHkpO1xuICAgIGN0eC5maWxsKCk7XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfTtcblxuICByZXR1cm4gV2FpdEZvclN0YXJ0VmlldztcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9d2FpdF9mb3Jfc3RhcnRfdmlldy5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBBbmltYXRpb25Ob2RlLCBhc2gsIGFzdGVyb2lkcyxcbiAgX19iaW5kID0gZnVuY3Rpb24oZm4sIG1lKXsgcmV0dXJuIGZ1bmN0aW9uKCl7IHJldHVybiBmbi5hcHBseShtZSwgYXJndW1lbnRzKTsgfTsgfSxcbiAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9O1xuXG5hc2ggPSByZXF1aXJlKCdhc2guY29mZmVlJyk7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uL2luZGV4Jyk7XG5cbkFuaW1hdGlvbk5vZGUgPSBhc3Rlcm9pZHMubm9kZXMuQW5pbWF0aW9uTm9kZTtcblxuYXN0ZXJvaWRzLnN5c3RlbXMuQW5pbWF0aW9uU3lzdGVtID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICBfX2V4dGVuZHMoQW5pbWF0aW9uU3lzdGVtLCBfc3VwZXIpO1xuXG4gIGZ1bmN0aW9uIEFuaW1hdGlvblN5c3RlbSgpIHtcbiAgICB0aGlzLnVwZGF0ZU5vZGUgPSBfX2JpbmQodGhpcy51cGRhdGVOb2RlLCB0aGlzKTtcbiAgICBBbmltYXRpb25TeXN0ZW0uX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgQW5pbWF0aW9uTm9kZSwgdGhpcy51cGRhdGVOb2RlKTtcbiAgfVxuXG4gIEFuaW1hdGlvblN5c3RlbS5wcm90b3R5cGUudXBkYXRlTm9kZSA9IGZ1bmN0aW9uKG5vZGUsIHRpbWUpIHtcbiAgICBub2RlLmFuaW1hdGlvbi5hbmltYXRpb24uYW5pbWF0ZSh0aW1lKTtcbiAgfTtcblxuICByZXR1cm4gQW5pbWF0aW9uU3lzdGVtO1xuXG59KShhc2gudG9vbHMuTGlzdEl0ZXJhdGluZ1N5c3RlbSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFuaW1hdGlvbl9zeXN0ZW0uanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgQXVkaW9Ob2RlLCBhc2gsIGFzdGVyb2lkcyxcbiAgX19iaW5kID0gZnVuY3Rpb24oZm4sIG1lKXsgcmV0dXJuIGZ1bmN0aW9uKCl7IHJldHVybiBmbi5hcHBseShtZSwgYXJndW1lbnRzKTsgfTsgfSxcbiAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9O1xuXG5hc2ggPSByZXF1aXJlKCdhc2guY29mZmVlJyk7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uL2luZGV4Jyk7XG5cbkF1ZGlvTm9kZSA9IGFzdGVyb2lkcy5ub2Rlcy5BdWRpb05vZGU7XG5cbmFzdGVyb2lkcy5zeXN0ZW1zLkF1ZGlvU3lzdGVtID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICBfX2V4dGVuZHMoQXVkaW9TeXN0ZW0sIF9zdXBlcik7XG5cbiAgZnVuY3Rpb24gQXVkaW9TeXN0ZW0oKSB7XG4gICAgdGhpcy51cGRhdGVOb2RlID0gX19iaW5kKHRoaXMudXBkYXRlTm9kZSwgdGhpcyk7XG4gICAgQXVkaW9TeXN0ZW0uX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgQXVkaW9Ob2RlLCB0aGlzLnVwZGF0ZU5vZGUpO1xuICB9XG5cbiAgQXVkaW9TeXN0ZW0ucHJvdG90eXBlLnVwZGF0ZU5vZGUgPSBmdW5jdGlvbihub2RlLCB0aW1lKSB7XG4gICAgdmFyIGVhY2gsIHNvdW5kLCB0eXBlLCBfcmVmO1xuICAgIF9yZWYgPSBub2RlLmF1ZGlvLnRvUGxheTtcbiAgICBmb3IgKGVhY2ggaW4gX3JlZikge1xuICAgICAgdHlwZSA9IF9yZWZbZWFjaF07XG4gICAgICBzb3VuZCA9IG5ldyB0eXBlKCk7XG4gICAgICBzb3VuZC5wbGF5KDAsIDEpO1xuICAgIH1cbiAgICBub2RlLmF1ZGlvLnRvUGxheS5sZW5ndGggPSAwO1xuICB9O1xuXG4gIHJldHVybiBBdWRpb1N5c3RlbTtcblxufSkoYXNoLnRvb2xzLkxpc3RJdGVyYXRpbmdTeXN0ZW0pO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hdWRpb19zeXN0ZW0uanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgQnVsbGV0QWdlTm9kZSwgUGh5c2ljc1N5c3RlbSwgYXNoLCBhc3Rlcm9pZHMsXG4gIF9fYmluZCA9IGZ1bmN0aW9uKGZuLCBtZSl7IHJldHVybiBmdW5jdGlvbigpeyByZXR1cm4gZm4uYXBwbHkobWUsIGFyZ3VtZW50cyk7IH07IH0sXG4gIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICBfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfTtcblxuYXNoID0gcmVxdWlyZSgnYXNoLmNvZmZlZScpO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi9pbmRleCcpO1xuXG5CdWxsZXRBZ2VOb2RlID0gYXN0ZXJvaWRzLm5vZGVzLkJ1bGxldEFnZU5vZGU7XG5cblBoeXNpY3NTeXN0ZW0gPSBhc3Rlcm9pZHMuc3lzdGVtcy5QaHlzaWNzU3lzdGVtO1xuXG5hc3Rlcm9pZHMuc3lzdGVtcy5CdWxsZXRBZ2VTeXN0ZW0gPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gIF9fZXh0ZW5kcyhCdWxsZXRBZ2VTeXN0ZW0sIF9zdXBlcik7XG5cbiAgQnVsbGV0QWdlU3lzdGVtLnByb3RvdHlwZS5jcmVhdG9yID0gbnVsbDtcblxuICBmdW5jdGlvbiBCdWxsZXRBZ2VTeXN0ZW0oY3JlYXRvcikge1xuICAgIHRoaXMuY3JlYXRvciA9IGNyZWF0b3I7XG4gICAgdGhpcy51cGRhdGVOb2RlID0gX19iaW5kKHRoaXMudXBkYXRlTm9kZSwgdGhpcyk7XG4gICAgQnVsbGV0QWdlU3lzdGVtLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIEJ1bGxldEFnZU5vZGUsIHRoaXMudXBkYXRlTm9kZSk7XG4gIH1cblxuICBCdWxsZXRBZ2VTeXN0ZW0ucHJvdG90eXBlLnVwZGF0ZU5vZGUgPSBmdW5jdGlvbihub2RlLCB0aW1lKSB7XG4gICAgdmFyIGJ1bGxldDtcbiAgICBidWxsZXQgPSBub2RlLmJ1bGxldDtcbiAgICBidWxsZXQubGlmZVJlbWFpbmluZyAtPSB0aW1lO1xuICAgIGlmIChidWxsZXQubGlmZVJlbWFpbmluZyA8PSAwKSB7XG4gICAgICBQaHlzaWNzU3lzdGVtLmRlYWRQb29sLnB1c2gobm9kZS5waHlzaWNzLmJvZHkpO1xuICAgICAgdGhpcy5jcmVhdG9yLmRlc3Ryb3lFbnRpdHkobm9kZS5lbnRpdHkpO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gQnVsbGV0QWdlU3lzdGVtO1xuXG59KShhc2gudG9vbHMuTGlzdEl0ZXJhdGluZ1N5c3RlbSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWJ1bGxldF9hZ2Vfc3lzdGVtLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIEFzdGVyb2lkLCBDb2xsaXNpb24sIERlYXRoVGhyb2VzLCBHYW1lTm9kZSwgUGh5c2ljcywgUGh5c2ljc1N5c3RlbSwgUG9pbnQsIFBvc2l0aW9uLCBTcGFjZXNoaXAsIFN5c3RlbSwgYXNoLCBhc3Rlcm9pZHMsIGIyQ29udGFjdExpc3RlbmVyLFxuICBfX2JpbmQgPSBmdW5jdGlvbihmbiwgbWUpeyByZXR1cm4gZnVuY3Rpb24oKXsgcmV0dXJuIGZuLmFwcGx5KG1lLCBhcmd1bWVudHMpOyB9OyB9LFxuICBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgX19leHRlbmRzID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChfX2hhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH07XG5cbmFzaCA9IHJlcXVpcmUoJ2FzaC5jb2ZmZWUnKTtcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vaW5kZXgnKTtcblxuR2FtZU5vZGUgPSBhc3Rlcm9pZHMubm9kZXMuR2FtZU5vZGU7XG5cblBoeXNpY3NTeXN0ZW0gPSBhc3Rlcm9pZHMuc3lzdGVtcy5QaHlzaWNzU3lzdGVtO1xuXG5Bc3Rlcm9pZCA9IGFzdGVyb2lkcy5jb21wb25lbnRzLkFzdGVyb2lkO1xuXG5TcGFjZXNoaXAgPSBhc3Rlcm9pZHMuY29tcG9uZW50cy5TcGFjZXNoaXA7XG5cbkRlYXRoVGhyb2VzID0gYXN0ZXJvaWRzLmNvbXBvbmVudHMuRGVhdGhUaHJvZXM7XG5cblBoeXNpY3MgPSBhc3Rlcm9pZHMuY29tcG9uZW50cy5QaHlzaWNzO1xuXG5Db2xsaXNpb24gPSBhc3Rlcm9pZHMuY29tcG9uZW50cy5Db2xsaXNpb247XG5cblBvc2l0aW9uID0gYXN0ZXJvaWRzLmNvbXBvbmVudHMuUG9zaXRpb247XG5cblBvaW50ID0gYXN0ZXJvaWRzLnVpLlBvaW50O1xuXG5TeXN0ZW0gPSBhc2guY29yZS5TeXN0ZW07XG5cbmIyQ29udGFjdExpc3RlbmVyID0gQm94MkQuRHluYW1pY3MuYjJDb250YWN0TGlzdGVuZXI7XG5cbmFzdGVyb2lkcy5zeXN0ZW1zLkNvbGxpc2lvblN5c3RlbSA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgX19leHRlbmRzKENvbGxpc2lvblN5c3RlbSwgX3N1cGVyKTtcblxuICBDb2xsaXNpb25TeXN0ZW0ucHJvdG90eXBlLndvcmxkID0gbnVsbDtcblxuICBDb2xsaXNpb25TeXN0ZW0ucHJvdG90eXBlLmNyZWF0b3IgPSBudWxsO1xuXG4gIENvbGxpc2lvblN5c3RlbS5wcm90b3R5cGUuZ2FtZXMgPSBudWxsO1xuXG4gIENvbGxpc2lvblN5c3RlbS5wcm90b3R5cGUucXVlID0gbnVsbDtcblxuICBmdW5jdGlvbiBDb2xsaXNpb25TeXN0ZW0od29ybGQsIGNyZWF0b3IpIHtcbiAgICB0aGlzLndvcmxkID0gd29ybGQ7XG4gICAgdGhpcy5jcmVhdG9yID0gY3JlYXRvcjtcbiAgICB0aGlzLlBvc3RTb2x2ZSA9IF9fYmluZCh0aGlzLlBvc3RTb2x2ZSwgdGhpcyk7XG4gICAgdGhpcy5QcmVTb2x2ZSA9IF9fYmluZCh0aGlzLlByZVNvbHZlLCB0aGlzKTtcbiAgICB0aGlzLkVuZENvbnRhY3QgPSBfX2JpbmQodGhpcy5FbmRDb250YWN0LCB0aGlzKTtcbiAgICB0aGlzLkJlZ2luQ29udGFjdCA9IF9fYmluZCh0aGlzLkJlZ2luQ29udGFjdCwgdGhpcyk7XG4gICAgdGhpcy5Bc3Rlcm9pZEhpdFNoaXAgPSBfX2JpbmQodGhpcy5Bc3Rlcm9pZEhpdFNoaXAsIHRoaXMpO1xuICAgIHRoaXMuQnVsbGV0SGl0QXN0ZXJvaWQgPSBfX2JpbmQodGhpcy5CdWxsZXRIaXRBc3Rlcm9pZCwgdGhpcyk7XG4gICAgdGhpcy51cGRhdGUgPSBfX2JpbmQodGhpcy51cGRhdGUsIHRoaXMpO1xuICAgIHRoaXMucXVlID0gW107XG4gICAgdGhpcy53b3JsZC5TZXRDb250YWN0TGlzdGVuZXIodGhpcyk7XG4gIH1cblxuICBDb2xsaXNpb25TeXN0ZW0ucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKHRpbWUpIHtcbiAgICB2YXIgY29udGFjdDtcbiAgICB3aGlsZSAodGhpcy5xdWUubGVuZ3RoKSB7XG4gICAgICBjb250YWN0ID0gdGhpcy5xdWUucG9wKCk7XG4gICAgICBzd2l0Y2ggKGNvbnRhY3QudHlwZSkge1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgdGhpcy5CdWxsZXRIaXRBc3Rlcm9pZChjb250YWN0LmEsIGNvbnRhY3QuYik7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICB0aGlzLkFzdGVyb2lkSGl0U2hpcChjb250YWN0LmEsIGNvbnRhY3QuYik7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIENvbGxpc2lvblN5c3RlbS5wcm90b3R5cGUuYWRkVG9FbmdpbmUgPSBmdW5jdGlvbihlbmdpbmUpIHtcbiAgICB0aGlzLmdhbWVzID0gZW5naW5lLmdldE5vZGVMaXN0KEdhbWVOb2RlKTtcbiAgfTtcblxuICBDb2xsaXNpb25TeXN0ZW0ucHJvdG90eXBlLnJlbW92ZUZyb21FbmdpbmUgPSBmdW5jdGlvbihlbmdpbmUpIHtcbiAgICB0aGlzLmdhbWVzID0gbnVsbDtcbiAgfTtcblxuXG4gIC8qXG4gICAqIHBsYXllciBoaXQgYXN0ZXJvaWRcbiAgICovXG5cbiAgQ29sbGlzaW9uU3lzdGVtLnByb3RvdHlwZS5CdWxsZXRIaXRBc3Rlcm9pZCA9IGZ1bmN0aW9uKGJ1bGxldCwgYXN0ZXJvaWQpIHtcbiAgICB2YXIgYm9keSwgcG9zaXRpb24sIHJhZGl1cztcbiAgICBpZiAoKGJ1bGxldC5nZXQoUGh5c2ljcykgIT0gbnVsbCkpIHtcbiAgICAgIHRoaXMuY3JlYXRvci5kZXN0cm95RW50aXR5KGJ1bGxldCk7XG4gICAgICBQaHlzaWNzU3lzdGVtLmRlYWRQb29sLnB1c2goYnVsbGV0LmdldChQaHlzaWNzKS5ib2R5KTtcbiAgICB9XG4gICAgaWYgKChhc3Rlcm9pZC5nZXQoUGh5c2ljcykgIT0gbnVsbCkpIHtcbiAgICAgIHJhZGl1cyA9IGFzdGVyb2lkLmdldChDb2xsaXNpb24pLnJhZGl1cztcbiAgICAgIHBvc2l0aW9uID0gYXN0ZXJvaWQuZ2V0KFBvc2l0aW9uKS5wb3NpdGlvbjtcbiAgICAgIGlmIChyYWRpdXMgPiAxMCkge1xuICAgICAgICB0aGlzLmNyZWF0b3IuY3JlYXRlQXN0ZXJvaWQocmFkaXVzIC0gMTAsIHBvc2l0aW9uLnggKyBNYXRoLnJhbmRvbSgpICogMTAgLSA1LCBwb3NpdGlvbi55ICsgTWF0aC5yYW5kb20oKSAqIDEwIC0gNSk7XG4gICAgICAgIHRoaXMuY3JlYXRvci5jcmVhdGVBc3Rlcm9pZChyYWRpdXMgLSAxMCwgcG9zaXRpb24ueCArIE1hdGgucmFuZG9tKCkgKiAxMCAtIDUsIHBvc2l0aW9uLnkgKyBNYXRoLnJhbmRvbSgpICogMTAgLSA1KTtcbiAgICAgIH1cbiAgICAgIGJvZHkgPSBhc3Rlcm9pZC5nZXQoUGh5c2ljcykuYm9keTtcbiAgICAgIGFzdGVyb2lkLmdldChBc3Rlcm9pZCkuZnNtLmNoYW5nZVN0YXRlKCdkZXN0cm95ZWQnKTtcbiAgICAgIGFzdGVyb2lkLmdldChEZWF0aFRocm9lcykuYm9keSA9IGJvZHk7XG4gICAgICBpZiAodGhpcy5nYW1lcy5oZWFkKSB7XG4gICAgICAgIHRoaXMuZ2FtZXMuaGVhZC5zdGF0ZS5oaXRzKys7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG5cbiAgLypcbiAgICogYXN0ZXJvaWQgaGl0IHNwYWNlc2hpcFxuICAgKi9cblxuICBDb2xsaXNpb25TeXN0ZW0ucHJvdG90eXBlLkFzdGVyb2lkSGl0U2hpcCA9IGZ1bmN0aW9uKGFzdGVyb2lkLCBzcGFjZXNoaXApIHtcbiAgICB2YXIgYm9keTtcbiAgICBpZiAoKHNwYWNlc2hpcC5nZXQoUGh5c2ljcykgIT0gbnVsbCkpIHtcbiAgICAgIGJvZHkgPSBzcGFjZXNoaXAuZ2V0KFBoeXNpY3MpLmJvZHk7XG4gICAgICBzcGFjZXNoaXAuZ2V0KFNwYWNlc2hpcCkuZnNtLmNoYW5nZVN0YXRlKCdkZXN0cm95ZWQnKTtcbiAgICAgIHNwYWNlc2hpcC5nZXQoRGVhdGhUaHJvZXMpLmJvZHkgPSBib2R5O1xuICAgICAgaWYgKHRoaXMuZ2FtZXMuaGVhZCkge1xuICAgICAgICB0aGlzLmdhbWVzLmhlYWQuc3RhdGUubGl2ZXMtLTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cblxuICAvKlxuICAgKiBiMkNvbnRhY3RMaXN0ZW5lciBJbnRlcmZhY2VcbiAgICovXG5cbiAgQ29sbGlzaW9uU3lzdGVtLnByb3RvdHlwZS5CZWdpbkNvbnRhY3QgPSBmdW5jdGlvbihjb250YWN0KSB7XG4gICAgdmFyIGEsIGI7XG4gICAgYSA9IGNvbnRhY3QuR2V0Rml4dHVyZUEoKS5HZXRCb2R5KCkuR2V0VXNlckRhdGEoKTtcbiAgICBiID0gY29udGFjdC5HZXRGaXh0dXJlQigpLkdldEJvZHkoKS5HZXRVc2VyRGF0YSgpO1xuICAgIHN3aXRjaCAoYS50eXBlKSB7XG4gICAgICBjYXNlICdhc3Rlcm9pZCc6XG4gICAgICAgIHN3aXRjaCAoYi50eXBlKSB7XG4gICAgICAgICAgY2FzZSAnYXN0ZXJvaWQnOlxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIGNhc2UgJ2J1bGxldCc6XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5xdWUucHVzaCh7XG4gICAgICAgICAgICAgIHR5cGU6IDEsXG4gICAgICAgICAgICAgIGE6IGIuZW50aXR5LFxuICAgICAgICAgICAgICBiOiBhLmVudGl0eVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgY2FzZSAnc3BhY2VzaGlwJzpcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnF1ZS5wdXNoKHtcbiAgICAgICAgICAgICAgdHlwZTogMixcbiAgICAgICAgICAgICAgYTogYS5lbnRpdHksXG4gICAgICAgICAgICAgIGI6IGIuZW50aXR5XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2J1bGxldCc6XG4gICAgICAgIHN3aXRjaCAoYi50eXBlKSB7XG4gICAgICAgICAgY2FzZSAnYXN0ZXJvaWQnOlxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucXVlLnB1c2goe1xuICAgICAgICAgICAgICB0eXBlOiAxLFxuICAgICAgICAgICAgICBhOiBhLmVudGl0eSxcbiAgICAgICAgICAgICAgYjogYi5lbnRpdHlcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIGNhc2UgJ2J1bGxldCc6XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgY2FzZSAnc3BhY2VzaGlwJzpcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3NwYWNlc2hpcCc6XG4gICAgICAgIHN3aXRjaCAoYi50eXBlKSB7XG4gICAgICAgICAgY2FzZSAnYXN0ZXJvaWQnOlxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucXVlLnB1c2goe1xuICAgICAgICAgICAgICB0eXBlOiAyLFxuICAgICAgICAgICAgICBhOiBiLmVudGl0eSxcbiAgICAgICAgICAgICAgYjogYS5lbnRpdHlcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIGNhc2UgJ2J1bGxldCc6XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgY2FzZSAnc3BhY2VzaGlwJzpcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qXG4gICAgICogdHlwZTpcbiAgICAgKiAxIC0gYnVsbGV0IGhpdHMgYXN0ZXJvaWRcbiAgICAgKiAyIC0gYXN0ZXJvaWQgaGl0cyBzcGFjZXNoaXBcbiAgICAgKi9cbiAgfTtcblxuICBDb2xsaXNpb25TeXN0ZW0ucHJvdG90eXBlLkVuZENvbnRhY3QgPSBmdW5jdGlvbihjb250YWN0KSB7fTtcblxuICBDb2xsaXNpb25TeXN0ZW0ucHJvdG90eXBlLlByZVNvbHZlID0gZnVuY3Rpb24oY29udGFjdCwgb2xkTWFuaWZvbGQpIHt9O1xuXG4gIENvbGxpc2lvblN5c3RlbS5wcm90b3R5cGUuUG9zdFNvbHZlID0gZnVuY3Rpb24oY29udGFjdCwgaW1wdWxzZSkge307XG5cbiAgcmV0dXJuIENvbGxpc2lvblN5c3RlbTtcblxufSkoU3lzdGVtKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29sbGlzaW9uX3N5c3RlbS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBEZWF0aFRocm9lc05vZGUsIFBoeXNpY3NTeXN0ZW0sIGFzaCwgYXN0ZXJvaWRzLFxuICBfX2JpbmQgPSBmdW5jdGlvbihmbiwgbWUpeyByZXR1cm4gZnVuY3Rpb24oKXsgcmV0dXJuIGZuLmFwcGx5KG1lLCBhcmd1bWVudHMpOyB9OyB9LFxuICBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgX19leHRlbmRzID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChfX2hhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH07XG5cbmFzaCA9IHJlcXVpcmUoJ2FzaC5jb2ZmZWUnKTtcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vaW5kZXgnKTtcblxuRGVhdGhUaHJvZXNOb2RlID0gYXN0ZXJvaWRzLm5vZGVzLkRlYXRoVGhyb2VzTm9kZTtcblxuUGh5c2ljc1N5c3RlbSA9IGFzdGVyb2lkcy5zeXN0ZW1zLlBoeXNpY3NTeXN0ZW07XG5cbmFzdGVyb2lkcy5zeXN0ZW1zLkRlYXRoVGhyb2VzU3lzdGVtID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICBfX2V4dGVuZHMoRGVhdGhUaHJvZXNTeXN0ZW0sIF9zdXBlcik7XG5cbiAgRGVhdGhUaHJvZXNTeXN0ZW0ucHJvdG90eXBlLmNyZWF0b3IgPSBudWxsO1xuXG4gIGZ1bmN0aW9uIERlYXRoVGhyb2VzU3lzdGVtKGNyZWF0b3IpIHtcbiAgICB0aGlzLmNyZWF0b3IgPSBjcmVhdG9yO1xuICAgIHRoaXMudXBkYXRlTm9kZSA9IF9fYmluZCh0aGlzLnVwZGF0ZU5vZGUsIHRoaXMpO1xuICAgIERlYXRoVGhyb2VzU3lzdGVtLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIERlYXRoVGhyb2VzTm9kZSwgdGhpcy51cGRhdGVOb2RlKTtcbiAgfVxuXG4gIERlYXRoVGhyb2VzU3lzdGVtLnByb3RvdHlwZS51cGRhdGVOb2RlID0gZnVuY3Rpb24obm9kZSwgdGltZSkge1xuICAgIHZhciBkZWFkO1xuICAgIGRlYWQgPSBub2RlLmRlYWQ7XG4gICAgZGVhZC5jb3VudGRvd24gLT0gdGltZTtcbiAgICBpZiAoZGVhZC5jb3VudGRvd24gPD0gMCkge1xuICAgICAgdGhpcy5jcmVhdG9yLmRlc3Ryb3lFbnRpdHkobm9kZS5lbnRpdHkpO1xuICAgICAgUGh5c2ljc1N5c3RlbS5kZWFkUG9vbC5wdXNoKGRlYWQuYm9keSk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBEZWF0aFRocm9lc1N5c3RlbTtcblxufSkoYXNoLnRvb2xzLkxpc3RJdGVyYXRpbmdTeXN0ZW0pO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kZWF0aF90aHJvZXNfc3lzdGVtLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIEFzdGVyb2lkQ29sbGlzaW9uTm9kZSwgQnVsbGV0Q29sbGlzaW9uTm9kZSwgR2FtZU5vZGUsIFBvaW50LCBTcGFjZXNoaXBOb2RlLCBhc2gsIGFzdGVyb2lkcyxcbiAgX19iaW5kID0gZnVuY3Rpb24oZm4sIG1lKXsgcmV0dXJuIGZ1bmN0aW9uKCl7IHJldHVybiBmbi5hcHBseShtZSwgYXJndW1lbnRzKTsgfTsgfSxcbiAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9O1xuXG5hc2ggPSByZXF1aXJlKCdhc2guY29mZmVlJyk7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uL2luZGV4Jyk7XG5cbkdhbWVOb2RlID0gYXN0ZXJvaWRzLm5vZGVzLkdhbWVOb2RlO1xuXG5TcGFjZXNoaXBOb2RlID0gYXN0ZXJvaWRzLm5vZGVzLlNwYWNlc2hpcE5vZGU7XG5cbkFzdGVyb2lkQ29sbGlzaW9uTm9kZSA9IGFzdGVyb2lkcy5ub2Rlcy5Bc3Rlcm9pZENvbGxpc2lvbk5vZGU7XG5cbkJ1bGxldENvbGxpc2lvbk5vZGUgPSBhc3Rlcm9pZHMubm9kZXMuQnVsbGV0Q29sbGlzaW9uTm9kZTtcblxuUG9pbnQgPSBhc3Rlcm9pZHMudWkuUG9pbnQ7XG5cbmFzdGVyb2lkcy5zeXN0ZW1zLkdhbWVNYW5hZ2VyID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICBfX2V4dGVuZHMoR2FtZU1hbmFnZXIsIF9zdXBlcik7XG5cbiAgR2FtZU1hbmFnZXIucHJvdG90eXBlLmNvbmZpZyA9IG51bGw7XG5cbiAgR2FtZU1hbmFnZXIucHJvdG90eXBlLmNyZWF0b3IgPSBudWxsO1xuXG4gIEdhbWVNYW5hZ2VyLnByb3RvdHlwZS5nYW1lTm9kZXMgPSBudWxsO1xuXG4gIEdhbWVNYW5hZ2VyLnByb3RvdHlwZS5zcGFjZXNoaXBzID0gbnVsbDtcblxuICBHYW1lTWFuYWdlci5wcm90b3R5cGUuYXN0ZXJvaWRzID0gbnVsbDtcblxuICBHYW1lTWFuYWdlci5wcm90b3R5cGUuYnVsbGV0cyA9IG51bGw7XG5cbiAgZnVuY3Rpb24gR2FtZU1hbmFnZXIoY3JlYXRvciwgY29uZmlnKSB7XG4gICAgdGhpcy5jcmVhdG9yID0gY3JlYXRvcjtcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICB0aGlzLnVwZGF0ZSA9IF9fYmluZCh0aGlzLnVwZGF0ZSwgdGhpcyk7XG4gIH1cblxuICBHYW1lTWFuYWdlci5wcm90b3R5cGUuYWRkVG9FbmdpbmUgPSBmdW5jdGlvbihlbmdpbmUpIHtcbiAgICB0aGlzLmdhbWVOb2RlcyA9IGVuZ2luZS5nZXROb2RlTGlzdChHYW1lTm9kZSk7XG4gICAgdGhpcy5zcGFjZXNoaXBzID0gZW5naW5lLmdldE5vZGVMaXN0KFNwYWNlc2hpcE5vZGUpO1xuICAgIHRoaXMuYXN0ZXJvaWRzID0gZW5naW5lLmdldE5vZGVMaXN0KEFzdGVyb2lkQ29sbGlzaW9uTm9kZSk7XG4gICAgdGhpcy5idWxsZXRzID0gZW5naW5lLmdldE5vZGVMaXN0KEJ1bGxldENvbGxpc2lvbk5vZGUpO1xuICB9O1xuXG4gIEdhbWVNYW5hZ2VyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbih0aW1lKSB7XG4gICAgdmFyIGFzdGVyb2lkLCBhc3Rlcm9pZENvdW50LCBjbGVhclRvQWRkU3BhY2VzaGlwLCBpLCBuZXdTcGFjZXNoaXBQb3NpdGlvbiwgbm9kZSwgcG9zaXRpb24sIHNwYWNlc2hpcDtcbiAgICBub2RlID0gdGhpcy5nYW1lTm9kZXMuaGVhZDtcbiAgICBpZiAobm9kZSAmJiBub2RlLnN0YXRlLnBsYXlpbmcpIHtcbiAgICAgIGlmICh0aGlzLnNwYWNlc2hpcHMuZW1wdHkpIHtcbiAgICAgICAgaWYgKG5vZGUuc3RhdGUubGl2ZXMgPiAwKSB7XG4gICAgICAgICAgbmV3U3BhY2VzaGlwUG9zaXRpb24gPSBuZXcgUG9pbnQodGhpcy5jb25maWcud2lkdGggKiAwLjUsIHRoaXMuY29uZmlnLmhlaWdodCAqIDAuNSk7XG4gICAgICAgICAgY2xlYXJUb0FkZFNwYWNlc2hpcCA9IHRydWU7XG4gICAgICAgICAgYXN0ZXJvaWQgPSB0aGlzLmFzdGVyb2lkcy5oZWFkO1xuICAgICAgICAgIHdoaWxlIChhc3Rlcm9pZCkge1xuICAgICAgICAgICAgaWYgKFBvaW50LmRpc3RhbmNlKGFzdGVyb2lkLnBvc2l0aW9uLnBvc2l0aW9uLCBuZXdTcGFjZXNoaXBQb3NpdGlvbikgPD0gYXN0ZXJvaWQuY29sbGlzaW9uLnJhZGl1cyArIDUwKSB7XG4gICAgICAgICAgICAgIGNsZWFyVG9BZGRTcGFjZXNoaXAgPSBmYWxzZTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhc3Rlcm9pZCA9IGFzdGVyb2lkLm5leHQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChjbGVhclRvQWRkU3BhY2VzaGlwKSB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0b3IuY3JlYXRlU3BhY2VzaGlwKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5vZGUuc3RhdGUucGxheWluZyA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMuY3JlYXRvci5jcmVhdGVXYWl0Rm9yQ2xpY2soKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuYXN0ZXJvaWRzLmVtcHR5ICYmIHRoaXMuYnVsbGV0cy5lbXB0eSAmJiAhdGhpcy5zcGFjZXNoaXBzLmVtcHR5KSB7XG4gICAgICAgIHNwYWNlc2hpcCA9IHRoaXMuc3BhY2VzaGlwcy5oZWFkO1xuICAgICAgICBub2RlLnN0YXRlLmxldmVsKys7XG4gICAgICAgIGFzdGVyb2lkQ291bnQgPSAyICsgbm9kZS5zdGF0ZS5sZXZlbDtcbiAgICAgICAgaSA9IDA7XG4gICAgICAgIHdoaWxlIChpIDwgYXN0ZXJvaWRDb3VudCkge1xuICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICBwb3NpdGlvbiA9IG5ldyBQb2ludChNYXRoLnJhbmRvbSgpICogdGhpcy5jb25maWcud2lkdGgsIE1hdGgucmFuZG9tKCkgKiB0aGlzLmNvbmZpZy5oZWlnaHQpO1xuICAgICAgICAgICAgaWYgKCEoUG9pbnQuZGlzdGFuY2UocG9zaXRpb24sIHNwYWNlc2hpcC5wb3NpdGlvbi5wb3NpdGlvbikgPD0gODApKSB7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmNyZWF0b3IuY3JlYXRlQXN0ZXJvaWQoMzAsIHBvc2l0aW9uLngsIHBvc2l0aW9uLnkpO1xuICAgICAgICAgICsraTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBHYW1lTWFuYWdlci5wcm90b3R5cGUucmVtb3ZlRnJvbUVuZ2luZSA9IGZ1bmN0aW9uKGVuZ2luZSkge1xuICAgIHRoaXMuZ2FtZU5vZGVzID0gbnVsbDtcbiAgICB0aGlzLnNwYWNlc2hpcHMgPSBudWxsO1xuICAgIHRoaXMuYXN0ZXJvaWRzID0gbnVsbDtcbiAgICB0aGlzLmJ1bGxldHMgPSBudWxsO1xuICB9O1xuXG4gIHJldHVybiBHYW1lTWFuYWdlcjtcblxufSkoYXNoLmNvcmUuU3lzdGVtKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Z2FtZV9tYW5hZ2VyLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIEd1bkNvbnRyb2xOb2RlLCBhc2gsIGFzdGVyb2lkcyxcbiAgX19iaW5kID0gZnVuY3Rpb24oZm4sIG1lKXsgcmV0dXJuIGZ1bmN0aW9uKCl7IHJldHVybiBmbi5hcHBseShtZSwgYXJndW1lbnRzKTsgfTsgfSxcbiAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9O1xuXG5hc2ggPSByZXF1aXJlKCdhc2guY29mZmVlJyk7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uL2luZGV4Jyk7XG5cbkd1bkNvbnRyb2xOb2RlID0gYXN0ZXJvaWRzLm5vZGVzLkd1bkNvbnRyb2xOb2RlO1xuXG5hc3Rlcm9pZHMuc3lzdGVtcy5HdW5Db250cm9sU3lzdGVtID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICBfX2V4dGVuZHMoR3VuQ29udHJvbFN5c3RlbSwgX3N1cGVyKTtcblxuICBHdW5Db250cm9sU3lzdGVtLnByb3RvdHlwZS5rZXlQb2xsID0gbnVsbDtcblxuICBHdW5Db250cm9sU3lzdGVtLnByb3RvdHlwZS5jcmVhdG9yID0gbnVsbDtcblxuICBmdW5jdGlvbiBHdW5Db250cm9sU3lzdGVtKGtleVBvbGwsIGNyZWF0b3IpIHtcbiAgICB0aGlzLmtleVBvbGwgPSBrZXlQb2xsO1xuICAgIHRoaXMuY3JlYXRvciA9IGNyZWF0b3I7XG4gICAgdGhpcy51cGRhdGVOb2RlID0gX19iaW5kKHRoaXMudXBkYXRlTm9kZSwgdGhpcyk7XG4gICAgR3VuQ29udHJvbFN5c3RlbS5fX3N1cGVyX18uY29uc3RydWN0b3IuY2FsbCh0aGlzLCBHdW5Db250cm9sTm9kZSwgdGhpcy51cGRhdGVOb2RlKTtcbiAgfVxuXG4gIEd1bkNvbnRyb2xTeXN0ZW0ucHJvdG90eXBlLnVwZGF0ZU5vZGUgPSBmdW5jdGlvbihub2RlLCB0aW1lKSB7XG4gICAgdmFyIGNvbnRyb2wsIGd1biwgcG9zaXRpb247XG4gICAgY29udHJvbCA9IG5vZGUuY29udHJvbDtcbiAgICBwb3NpdGlvbiA9IG5vZGUucG9zaXRpb247XG4gICAgZ3VuID0gbm9kZS5ndW47XG4gICAgZ3VuLnNob290aW5nID0gdGhpcy5rZXlQb2xsLmlzRG93bihjb250cm9sLnRyaWdnZXIpO1xuICAgIGd1bi50aW1lU2luY2VMYXN0U2hvdCArPSB0aW1lO1xuICAgIGlmIChndW4uc2hvb3RpbmcgJiYgZ3VuLnRpbWVTaW5jZUxhc3RTaG90ID49IGd1bi5taW5pbXVtU2hvdEludGVydmFsKSB7XG4gICAgICB0aGlzLmNyZWF0b3IuY3JlYXRlVXNlckJ1bGxldChndW4sIHBvc2l0aW9uKTtcbiAgICAgIGd1bi50aW1lU2luY2VMYXN0U2hvdCA9IDA7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBHdW5Db250cm9sU3lzdGVtO1xuXG59KShhc2gudG9vbHMuTGlzdEl0ZXJhdGluZ1N5c3RlbSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWd1bl9jb250cm9sX3N5c3RlbS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBIdWROb2RlLCBhc2gsIGFzdGVyb2lkcyxcbiAgX19iaW5kID0gZnVuY3Rpb24oZm4sIG1lKXsgcmV0dXJuIGZ1bmN0aW9uKCl7IHJldHVybiBmbi5hcHBseShtZSwgYXJndW1lbnRzKTsgfTsgfSxcbiAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9O1xuXG5hc2ggPSByZXF1aXJlKCdhc2guY29mZmVlJyk7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uL2luZGV4Jyk7XG5cbkh1ZE5vZGUgPSBhc3Rlcm9pZHMubm9kZXMuSHVkTm9kZTtcblxuYXN0ZXJvaWRzLnN5c3RlbXMuSHVkU3lzdGVtID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICBfX2V4dGVuZHMoSHVkU3lzdGVtLCBfc3VwZXIpO1xuXG4gIGZ1bmN0aW9uIEh1ZFN5c3RlbSgpIHtcbiAgICB0aGlzLnVwZGF0ZU5vZGUgPSBfX2JpbmQodGhpcy51cGRhdGVOb2RlLCB0aGlzKTtcbiAgICBIdWRTeXN0ZW0uX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgSHVkTm9kZSwgdGhpcy51cGRhdGVOb2RlKTtcbiAgfVxuXG4gIEh1ZFN5c3RlbS5wcm90b3R5cGUudXBkYXRlTm9kZSA9IGZ1bmN0aW9uKG5vZGUsIHRpbWUpIHtcbiAgICBub2RlLmh1ZC52aWV3LnNldExpdmVzKG5vZGUuc3RhdGUubGl2ZXMpO1xuICAgIG5vZGUuaHVkLnZpZXcuc2V0U2NvcmUobm9kZS5zdGF0ZS5oaXRzKTtcbiAgfTtcblxuICByZXR1cm4gSHVkU3lzdGVtO1xuXG59KShhc2gudG9vbHMuTGlzdEl0ZXJhdGluZ1N5c3RlbSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWh1ZF9zeXN0ZW0uanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgTW92ZW1lbnROb2RlLCBhc2gsIGFzdGVyb2lkcyxcbiAgX19iaW5kID0gZnVuY3Rpb24oZm4sIG1lKXsgcmV0dXJuIGZ1bmN0aW9uKCl7IHJldHVybiBmbi5hcHBseShtZSwgYXJndW1lbnRzKTsgfTsgfSxcbiAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9O1xuXG5hc2ggPSByZXF1aXJlKCdhc2guY29mZmVlJyk7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uL2luZGV4Jyk7XG5cbk1vdmVtZW50Tm9kZSA9IGFzdGVyb2lkcy5ub2Rlcy5Nb3ZlbWVudE5vZGU7XG5cbmFzdGVyb2lkcy5zeXN0ZW1zLk1vdmVtZW50U3lzdGVtID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICBfX2V4dGVuZHMoTW92ZW1lbnRTeXN0ZW0sIF9zdXBlcik7XG5cbiAgTW92ZW1lbnRTeXN0ZW0ucHJvdG90eXBlLmNvbmZpZyA9IG51bGw7XG5cbiAgZnVuY3Rpb24gTW92ZW1lbnRTeXN0ZW0oY29uZmlnKSB7XG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgdGhpcy51cGRhdGVOb2RlID0gX19iaW5kKHRoaXMudXBkYXRlTm9kZSwgdGhpcyk7XG4gICAgTW92ZW1lbnRTeXN0ZW0uX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgTW92ZW1lbnROb2RlLCB0aGlzLnVwZGF0ZU5vZGUpO1xuICB9XG5cbiAgTW92ZW1lbnRTeXN0ZW0ucHJvdG90eXBlLnVwZGF0ZU5vZGUgPSBmdW5jdGlvbihub2RlLCB0aW1lKSB7XG4gICAgdmFyIG1vdGlvbiwgcG9zaXRpb24sIHhEYW1wLCB5RGFtcDtcbiAgICBwb3NpdGlvbiA9IG5vZGUucG9zaXRpb247XG4gICAgbW90aW9uID0gbm9kZS5tb3Rpb247XG4gICAgcG9zaXRpb24ucG9zaXRpb24ueCArPSBtb3Rpb24udmVsb2NpdHkueCAqIHRpbWU7XG4gICAgcG9zaXRpb24ucG9zaXRpb24ueSArPSBtb3Rpb24udmVsb2NpdHkueSAqIHRpbWU7XG4gICAgaWYgKHBvc2l0aW9uLnBvc2l0aW9uLnggPCAwKSB7XG4gICAgICBwb3NpdGlvbi5wb3NpdGlvbi54ICs9IHRoaXMuY29uZmlnLndpZHRoO1xuICAgIH1cbiAgICBpZiAocG9zaXRpb24ucG9zaXRpb24ueCA+IHRoaXMuY29uZmlnLndpZHRoKSB7XG4gICAgICBwb3NpdGlvbi5wb3NpdGlvbi54IC09IHRoaXMuY29uZmlnLndpZHRoO1xuICAgIH1cbiAgICBpZiAocG9zaXRpb24ucG9zaXRpb24ueSA8IDApIHtcbiAgICAgIHBvc2l0aW9uLnBvc2l0aW9uLnkgKz0gdGhpcy5jb25maWcuaGVpZ2h0O1xuICAgIH1cbiAgICBpZiAocG9zaXRpb24ucG9zaXRpb24ueSA+IHRoaXMuY29uZmlnLmhlaWdodCkge1xuICAgICAgcG9zaXRpb24ucG9zaXRpb24ueSAtPSB0aGlzLmNvbmZpZy5oZWlnaHQ7XG4gICAgfVxuICAgIHBvc2l0aW9uLnJvdGF0aW9uICs9IG1vdGlvbi5hbmd1bGFyVmVsb2NpdHkgKiB0aW1lO1xuICAgIGlmIChtb3Rpb24uZGFtcGluZyA+IDApIHtcbiAgICAgIHhEYW1wID0gTWF0aC5hYnMoTWF0aC5jb3MocG9zaXRpb24ucm90YXRpb24pICogbW90aW9uLmRhbXBpbmcgKiB0aW1lKTtcbiAgICAgIHlEYW1wID0gTWF0aC5hYnMoTWF0aC5zaW4ocG9zaXRpb24ucm90YXRpb24pICogbW90aW9uLmRhbXBpbmcgKiB0aW1lKTtcbiAgICAgIGlmIChtb3Rpb24udmVsb2NpdHkueCA+IHhEYW1wKSB7XG4gICAgICAgIG1vdGlvbi52ZWxvY2l0eS54IC09IHhEYW1wO1xuICAgICAgfSBlbHNlIGlmIChtb3Rpb24udmVsb2NpdHkueCA8IC14RGFtcCkge1xuICAgICAgICBtb3Rpb24udmVsb2NpdHkueCArPSB4RGFtcDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1vdGlvbi52ZWxvY2l0eS54ID0gMDtcbiAgICAgIH1cbiAgICAgIGlmIChtb3Rpb24udmVsb2NpdHkueSA+IHlEYW1wKSB7XG4gICAgICAgIG1vdGlvbi52ZWxvY2l0eS55IC09IHlEYW1wO1xuICAgICAgfSBlbHNlIGlmIChtb3Rpb24udmVsb2NpdHkueSA8IC15RGFtcCkge1xuICAgICAgICBtb3Rpb24udmVsb2NpdHkueSArPSB5RGFtcDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1vdGlvbi52ZWxvY2l0eS55ID0gMDtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIE1vdmVtZW50U3lzdGVtO1xuXG59KShhc2gudG9vbHMuTGlzdEl0ZXJhdGluZ1N5c3RlbSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1vdmVtZW50X3N5c3RlbS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBQaHlzaWNzQ29udHJvbE5vZGUsIGFzaCwgYXN0ZXJvaWRzLCBiMlZlYzIsXG4gIF9fYmluZCA9IGZ1bmN0aW9uKGZuLCBtZSl7IHJldHVybiBmdW5jdGlvbigpeyByZXR1cm4gZm4uYXBwbHkobWUsIGFyZ3VtZW50cyk7IH07IH0sXG4gIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICBfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfTtcblxuYXNoID0gcmVxdWlyZSgnYXNoLmNvZmZlZScpO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi9pbmRleCcpO1xuXG5QaHlzaWNzQ29udHJvbE5vZGUgPSBhc3Rlcm9pZHMubm9kZXMuUGh5c2ljc0NvbnRyb2xOb2RlO1xuXG5iMlZlYzIgPSBCb3gyRC5Db21tb24uTWF0aC5iMlZlYzI7XG5cbmFzdGVyb2lkcy5zeXN0ZW1zLlBoeXNpY3NDb250cm9sU3lzdGVtID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICBfX2V4dGVuZHMoUGh5c2ljc0NvbnRyb2xTeXN0ZW0sIF9zdXBlcik7XG5cbiAgUGh5c2ljc0NvbnRyb2xTeXN0ZW0ucHJvdG90eXBlLmtleVBvbGwgPSBudWxsO1xuXG4gIGZ1bmN0aW9uIFBoeXNpY3NDb250cm9sU3lzdGVtKGtleVBvbGwpIHtcbiAgICB0aGlzLmtleVBvbGwgPSBrZXlQb2xsO1xuICAgIHRoaXMudXBkYXRlTm9kZSA9IF9fYmluZCh0aGlzLnVwZGF0ZU5vZGUsIHRoaXMpO1xuICAgIFBoeXNpY3NDb250cm9sU3lzdGVtLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIFBoeXNpY3NDb250cm9sTm9kZSwgdGhpcy51cGRhdGVOb2RlKTtcbiAgfVxuXG4gIFBoeXNpY3NDb250cm9sU3lzdGVtLnByb3RvdHlwZS51cGRhdGVOb2RlID0gZnVuY3Rpb24obm9kZSwgdGltZSkge1xuICAgIHZhciBib2R5LCBjb250cm9sLCByb3RhdGlvbiwgeCwgeSwgX3JlZjtcbiAgICBjb250cm9sID0gbm9kZS5jb250cm9sO1xuICAgIGJvZHkgPSBub2RlLnBoeXNpY3MuYm9keTtcbiAgICByb3RhdGlvbiA9IGJvZHkuR2V0QW5ndWxhclZlbG9jaXR5KCk7XG4gICAgaWYgKHRoaXMua2V5UG9sbC5pc0Rvd24oY29udHJvbC5sZWZ0KSAmJiByb3RhdGlvbiA8IDEwKSB7XG4gICAgICBib2R5LkFwcGx5VG9ycXVlKHJvdGF0aW9uIC8gMTAwMCAtIGNvbnRyb2wucm90YXRpb25SYXRlIC8gTWF0aC5QSSAqIHRpbWUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5rZXlQb2xsLmlzRG93bihjb250cm9sLnJpZ2h0KSAmJiByb3RhdGlvbiA8IDEwKSB7XG4gICAgICBib2R5LkFwcGx5VG9ycXVlKHJvdGF0aW9uIC8gMTAwMCArIGNvbnRyb2wucm90YXRpb25SYXRlIC8gTWF0aC5QSSAqIHRpbWUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5rZXlQb2xsLmlzRG93bihjb250cm9sLmFjY2VsZXJhdGUpKSB7XG4gICAgICBfcmVmID0gYm9keS5HZXRMaW5lYXJWZWxvY2l0eSgpLCB4ID0gX3JlZi54LCB5ID0gX3JlZi55O1xuICAgICAgeCArPSBNYXRoLmNvcyhyb3RhdGlvbikgKiBjb250cm9sLmFjY2VsZXJhdGlvblJhdGUgKiB0aW1lO1xuICAgICAgeSArPSBNYXRoLnNpbihyb3RhdGlvbikgKiBjb250cm9sLmFjY2VsZXJhdGlvblJhdGUgKiB0aW1lO1xuICAgICAgYm9keS5BcHBseUZvcmNlKG5ldyBiMlZlYzIoeCwgeSksIGJvZHkuR2V0V29ybGRDZW50ZXIoKSk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBQaHlzaWNzQ29udHJvbFN5c3RlbTtcblxufSkoYXNoLnRvb2xzLkxpc3RJdGVyYXRpbmdTeXN0ZW0pO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1waHlzaWNzX2NvbnRyb2xfc3lzdGVtLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIFBoeXNpY3NOb2RlLCBhc2gsIGFzdGVyb2lkcywgYjJCb2R5LCBiMlZlYzIsXG4gIF9fYmluZCA9IGZ1bmN0aW9uKGZuLCBtZSl7IHJldHVybiBmdW5jdGlvbigpeyByZXR1cm4gZm4uYXBwbHkobWUsIGFyZ3VtZW50cyk7IH07IH0sXG4gIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICBfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfTtcblxuYXNoID0gcmVxdWlyZSgnYXNoLmNvZmZlZScpO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi9pbmRleCcpO1xuXG5QaHlzaWNzTm9kZSA9IGFzdGVyb2lkcy5ub2Rlcy5QaHlzaWNzTm9kZTtcblxuYjJCb2R5ID0gQm94MkQuRHluYW1pY3MuYjJCb2R5O1xuXG5iMlZlYzIgPSBCb3gyRC5Db21tb24uTWF0aC5iMlZlYzI7XG5cbmFzdGVyb2lkcy5zeXN0ZW1zLlBoeXNpY3NTeXN0ZW0gPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gIF9fZXh0ZW5kcyhQaHlzaWNzU3lzdGVtLCBfc3VwZXIpO1xuXG4gIFBoeXNpY3NTeXN0ZW0ucHJvdG90eXBlLmNvbmZpZyA9IG51bGw7XG5cbiAgUGh5c2ljc1N5c3RlbS5wcm90b3R5cGUud29ybGQgPSBudWxsO1xuXG4gIFBoeXNpY3NTeXN0ZW0ucHJvdG90eXBlLmNyZWF0b3IgPSBudWxsO1xuXG4gIFBoeXNpY3NTeXN0ZW0ucHJvdG90eXBlLm5vZGVzID0gbnVsbDtcblxuICBQaHlzaWNzU3lzdGVtLmRlYWRQb29sID0gW107XG5cbiAgZnVuY3Rpb24gUGh5c2ljc1N5c3RlbShjb25maWcsIHdvcmxkKSB7XG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgdGhpcy53b3JsZCA9IHdvcmxkO1xuICAgIHRoaXMudXBkYXRlTm9kZSA9IF9fYmluZCh0aGlzLnVwZGF0ZU5vZGUsIHRoaXMpO1xuICAgIHRoaXMudXBkYXRlID0gX19iaW5kKHRoaXMudXBkYXRlLCB0aGlzKTtcbiAgfVxuXG4gIFBoeXNpY3NTeXN0ZW0ucHJvdG90eXBlLmFkZFRvRW5naW5lID0gZnVuY3Rpb24oZW5naW5lKSB7XG4gICAgdGhpcy5ub2RlcyA9IGVuZ2luZS5nZXROb2RlTGlzdChQaHlzaWNzTm9kZSk7XG4gIH07XG5cbiAgUGh5c2ljc1N5c3RlbS5wcm90b3R5cGUucmVtb3ZlRnJvbUVuZ2luZSA9IGZ1bmN0aW9uKGVuZ2luZSkge1xuICAgIHRoaXMubm9kZXMgPSBudWxsO1xuICB9O1xuXG4gIFBoeXNpY3NTeXN0ZW0ucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKHRpbWUpIHtcbiAgICB2YXIgYm9keSwgbm9kZSwgdWQ7XG4gICAgdGhpcy53b3JsZC5TdGVwKHRpbWUsIDEwLCAxMCk7XG4gICAgdGhpcy53b3JsZC5DbGVhckZvcmNlcygpO1xuICAgIG5vZGUgPSB0aGlzLm5vZGVzLmhlYWQ7XG4gICAgd2hpbGUgKG5vZGUpIHtcbiAgICAgIHRoaXMudXBkYXRlTm9kZShub2RlLCB0aW1lKTtcbiAgICAgIG5vZGUgPSBub2RlLm5leHQ7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBDbGVhbiB1cCB0aGUgZGVhZCBib2RpZXNcbiAgICAgKi9cbiAgICB3aGlsZSAoKGJvZHkgPSBQaHlzaWNzU3lzdGVtLmRlYWRQb29sLnBvcCgpKSkge1xuICAgICAgdWQgPSBib2R5LkdldFVzZXJEYXRhKCk7XG4gICAgICBpZiAodWQuZW50aXR5ICE9IG51bGwpIHtcbiAgICAgICAgZGVsZXRlIHVkLmVudGl0eTtcbiAgICAgIH1cbiAgICAgIGJvZHkuU2V0VXNlckRhdGEodWQpO1xuICAgICAgdGhpcy53b3JsZC5EZXN0cm95Qm9keShib2R5KTtcbiAgICB9XG4gIH07XG5cblxuICAvKlxuICAgKiBQcm9jZXNzIHRoZSBwaHlzaWNzIGZvciB0aGlzIG5vZGVcbiAgICovXG5cbiAgUGh5c2ljc1N5c3RlbS5wcm90b3R5cGUudXBkYXRlTm9kZSA9IGZ1bmN0aW9uKG5vZGUsIHRpbWUpIHtcbiAgICB2YXIgYm9keSwgcGh5c2ljcywgcG9zaXRpb24sIHgsIHgxLCB5LCB5MSwgX3JlZjtcbiAgICBwb3NpdGlvbiA9IG5vZGUucG9zaXRpb247XG4gICAgcGh5c2ljcyA9IG5vZGUucGh5c2ljcztcbiAgICBib2R5ID0gcGh5c2ljcy5ib2R5O1xuXG4gICAgLypcbiAgICAgKiBVcGRhdGUgdGhlIHBvc2l0aW9uIGNvbXBvbmVudCBmcm9tIEJveDJEIG1vZGVsXG4gICAgICogQXN0ZXJvaWRzIHVzZXMgd3JhcGFyb3VuZCBzcGFjZSBjb29yZGluYXRlc1xuICAgICAqL1xuICAgIF9yZWYgPSBib2R5LkdldFBvc2l0aW9uKCksIHggPSBfcmVmLngsIHkgPSBfcmVmLnk7XG4gICAgeDEgPSB4ID4gdGhpcy5jb25maWcud2lkdGggPyAwIDogeCA8IDAgPyB0aGlzLmNvbmZpZy53aWR0aCA6IHg7XG4gICAgeTEgPSB5ID4gdGhpcy5jb25maWcuaGVpZ2h0ID8gMCA6IHkgPCAwID8gdGhpcy5jb25maWcuaGVpZ2h0IDogeTtcbiAgICBpZiAoeDEgIT09IHggfHwgeTEgIT09IHkpIHtcbiAgICAgIGJvZHkuU2V0UG9zaXRpb24obmV3IGIyVmVjMih4MSwgeTEpKTtcbiAgICB9XG4gICAgcG9zaXRpb24ucG9zaXRpb24ueCA9IHgxO1xuICAgIHBvc2l0aW9uLnBvc2l0aW9uLnkgPSB5MTtcbiAgICBwb3NpdGlvbi5yb3RhdGlvbiA9IGJvZHkuR2V0QW5ndWxhclZlbG9jaXR5KCk7XG4gIH07XG5cbiAgcmV0dXJuIFBoeXNpY3NTeXN0ZW07XG5cbn0pKGFzaC5jb3JlLlN5c3RlbSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBoeXNpY3Nfc3lzdGVtLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIFJlbmRlck5vZGUsIGFzaCwgYXN0ZXJvaWRzLFxuICBfX2JpbmQgPSBmdW5jdGlvbihmbiwgbWUpeyByZXR1cm4gZnVuY3Rpb24oKXsgcmV0dXJuIGZuLmFwcGx5KG1lLCBhcmd1bWVudHMpOyB9OyB9LFxuICBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgX19leHRlbmRzID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChfX2hhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH07XG5cbmFzaCA9IHJlcXVpcmUoJ2FzaC5jb2ZmZWUnKTtcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vaW5kZXgnKTtcblxuUmVuZGVyTm9kZSA9IGFzdGVyb2lkcy5ub2Rlcy5SZW5kZXJOb2RlO1xuXG5hc3Rlcm9pZHMuc3lzdGVtcy5SZW5kZXJTeXN0ZW0gPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gIF9fZXh0ZW5kcyhSZW5kZXJTeXN0ZW0sIF9zdXBlcik7XG5cbiAgUmVuZGVyU3lzdGVtLnByb3RvdHlwZS5ncmFwaGljID0gbnVsbDtcblxuICBSZW5kZXJTeXN0ZW0ucHJvdG90eXBlLm5vZGVzID0gbnVsbDtcblxuICBmdW5jdGlvbiBSZW5kZXJTeXN0ZW0oY3R4KSB7XG4gICAgdGhpcy5jdHggPSBjdHg7XG4gICAgdGhpcy51cGRhdGUgPSBfX2JpbmQodGhpcy51cGRhdGUsIHRoaXMpO1xuICB9XG5cbiAgUmVuZGVyU3lzdGVtLnByb3RvdHlwZS5hZGRUb0VuZ2luZSA9IGZ1bmN0aW9uKGVuZ2luZSkge1xuICAgIHZhciBub2RlO1xuICAgIHRoaXMubm9kZXMgPSBlbmdpbmUuZ2V0Tm9kZUxpc3QoUmVuZGVyTm9kZSk7XG4gICAgbm9kZSA9IHRoaXMubm9kZXMuaGVhZDtcbiAgICB3aGlsZSAobm9kZSkge1xuICAgICAgdGhpcy5hZGRUb0Rpc3BsYXkobm9kZSk7XG4gICAgICBub2RlID0gbm9kZS5uZXh0O1xuICAgIH1cbiAgfTtcblxuICBSZW5kZXJTeXN0ZW0ucHJvdG90eXBlLmFkZFRvRGlzcGxheSA9IGZ1bmN0aW9uKG5vZGUpIHt9O1xuXG4gIFJlbmRlclN5c3RlbS5wcm90b3R5cGUucmVtb3ZlRnJvbURpc3BsYXkgPSBmdW5jdGlvbihub2RlKSB7fTtcblxuICBSZW5kZXJTeXN0ZW0ucHJvdG90eXBlLnJlbW92ZUZyb21FbmdpbmUgPSBmdW5jdGlvbihlbmdpbmUpIHtcbiAgICB0aGlzLm5vZGVzID0gbnVsbDtcbiAgfTtcblxuICBSZW5kZXJTeXN0ZW0ucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKHRpbWUpIHtcbiAgICB2YXIgZGlzcGxheSwgZ3JhcGhpYywgbm9kZSwgcG9zaXRpb247XG4gICAgdGhpcy5jdHguc2F2ZSgpO1xuICAgIHRoaXMuY3R4LnRyYW5zbGF0ZSgwLCAwKTtcbiAgICB0aGlzLmN0eC5yb3RhdGUoMCk7XG4gICAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMuY3R4LmNhbnZhcy53aWR0aCwgdGhpcy5jdHguY2FudmFzLmhlaWdodCk7XG4gICAgbm9kZSA9IHRoaXMubm9kZXMuaGVhZDtcbiAgICB3aGlsZSAobm9kZSkge1xuICAgICAgZGlzcGxheSA9IG5vZGUuZGlzcGxheTtcbiAgICAgIGdyYXBoaWMgPSBkaXNwbGF5LmdyYXBoaWM7XG4gICAgICBwb3NpdGlvbiA9IG5vZGUucG9zaXRpb247XG4gICAgICBncmFwaGljLnggPSBwb3NpdGlvbi5wb3NpdGlvbi54O1xuICAgICAgZ3JhcGhpYy55ID0gcG9zaXRpb24ucG9zaXRpb24ueTtcbiAgICAgIGdyYXBoaWMucm90YXRpb24gPSBwb3NpdGlvbi5yb3RhdGlvbjtcbiAgICAgIGdyYXBoaWMuZHJhdyh0aGlzLmN0eCk7XG4gICAgICBub2RlID0gbm9kZS5uZXh0O1xuICAgIH1cbiAgICB0aGlzLmN0eC5yZXN0b3JlKCk7XG4gIH07XG5cbiAgcmV0dXJuIFJlbmRlclN5c3RlbTtcblxufSkoYXNoLmNvcmUuU3lzdGVtKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cmVuZGVyX3N5c3RlbS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc3Rlcm9pZHM7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uL2luZGV4Jyk7XG5cbmFzdGVyb2lkcy5zeXN0ZW1zLlN5c3RlbVByaW9yaXRpZXMgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIFN5c3RlbVByaW9yaXRpZXMoKSB7fVxuXG4gIFN5c3RlbVByaW9yaXRpZXMucHJlVXBkYXRlID0gMTtcblxuICBTeXN0ZW1Qcmlvcml0aWVzLnVwZGF0ZSA9IDI7XG5cbiAgU3lzdGVtUHJpb3JpdGllcy5tb3ZlID0gMztcblxuICBTeXN0ZW1Qcmlvcml0aWVzLnJlc29sdmVDb2xsaXNpb25zID0gNDtcblxuICBTeXN0ZW1Qcmlvcml0aWVzLnN0YXRlTWFjaGluZXMgPSA1O1xuXG4gIFN5c3RlbVByaW9yaXRpZXMuYW5pbWF0ZSA9IDY7XG5cbiAgU3lzdGVtUHJpb3JpdGllcy5yZW5kZXIgPSA3O1xuXG4gIHJldHVybiBTeXN0ZW1Qcmlvcml0aWVzO1xuXG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zeXN0ZW1fcHJpb3JpdGllcy5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBBc3Rlcm9pZENvbGxpc2lvbk5vZGUsIEdhbWVOb2RlLCBXYWl0Rm9yU3RhcnROb2RlLCBhc2gsIGFzdGVyb2lkcyxcbiAgX19iaW5kID0gZnVuY3Rpb24oZm4sIG1lKXsgcmV0dXJuIGZ1bmN0aW9uKCl7IHJldHVybiBmbi5hcHBseShtZSwgYXJndW1lbnRzKTsgfTsgfSxcbiAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9O1xuXG5hc2ggPSByZXF1aXJlKCdhc2guY29mZmVlJyk7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uL2luZGV4Jyk7XG5cbldhaXRGb3JTdGFydE5vZGUgPSBhc3Rlcm9pZHMubm9kZXMuV2FpdEZvclN0YXJ0Tm9kZTtcblxuQXN0ZXJvaWRDb2xsaXNpb25Ob2RlID0gYXN0ZXJvaWRzLm5vZGVzLkFzdGVyb2lkQ29sbGlzaW9uTm9kZTtcblxuR2FtZU5vZGUgPSBhc3Rlcm9pZHMubm9kZXMuR2FtZU5vZGU7XG5cbmFzdGVyb2lkcy5zeXN0ZW1zLldhaXRGb3JTdGFydFN5c3RlbSA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgX19leHRlbmRzKFdhaXRGb3JTdGFydFN5c3RlbSwgX3N1cGVyKTtcblxuICBXYWl0Rm9yU3RhcnRTeXN0ZW0ucHJvdG90eXBlLmVuZ2luZSA9IG51bGw7XG5cbiAgV2FpdEZvclN0YXJ0U3lzdGVtLnByb3RvdHlwZS5jcmVhdG9yID0gbnVsbDtcblxuICBXYWl0Rm9yU3RhcnRTeXN0ZW0ucHJvdG90eXBlLmdhbWVOb2RlcyA9IG51bGw7XG5cbiAgV2FpdEZvclN0YXJ0U3lzdGVtLnByb3RvdHlwZS53YWl0Tm9kZXMgPSBudWxsO1xuXG4gIFdhaXRGb3JTdGFydFN5c3RlbS5wcm90b3R5cGUuYXN0ZXJvaWRzID0gbnVsbDtcblxuICBmdW5jdGlvbiBXYWl0Rm9yU3RhcnRTeXN0ZW0oY3JlYXRvcikge1xuICAgIHRoaXMuY3JlYXRvciA9IGNyZWF0b3I7XG4gICAgdGhpcy51cGRhdGUgPSBfX2JpbmQodGhpcy51cGRhdGUsIHRoaXMpO1xuICB9XG5cbiAgV2FpdEZvclN0YXJ0U3lzdGVtLnByb3RvdHlwZS5hZGRUb0VuZ2luZSA9IGZ1bmN0aW9uKGVuZ2luZSkge1xuICAgIHRoaXMuZW5naW5lID0gZW5naW5lO1xuICAgIHRoaXMud2FpdE5vZGVzID0gZW5naW5lLmdldE5vZGVMaXN0KFdhaXRGb3JTdGFydE5vZGUpO1xuICAgIHRoaXMuZ2FtZU5vZGVzID0gZW5naW5lLmdldE5vZGVMaXN0KEdhbWVOb2RlKTtcbiAgICB0aGlzLmFzdGVyb2lkcyA9IGVuZ2luZS5nZXROb2RlTGlzdChBc3Rlcm9pZENvbGxpc2lvbk5vZGUpO1xuICB9O1xuXG4gIFdhaXRGb3JTdGFydFN5c3RlbS5wcm90b3R5cGUucmVtb3ZlRnJvbUVuZ2luZSA9IGZ1bmN0aW9uKGVuZ2luZSkge1xuICAgIHRoaXMud2FpdE5vZGVzID0gbnVsbDtcbiAgICB0aGlzLmdhbWVOb2RlcyA9IG51bGw7XG4gIH07XG5cbiAgV2FpdEZvclN0YXJ0U3lzdGVtLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbih0aW1lKSB7XG4gICAgdmFyIGFzdGVyb2lkLCBnYW1lLCBub2RlO1xuICAgIG5vZGUgPSB0aGlzLndhaXROb2Rlcy5oZWFkO1xuICAgIGdhbWUgPSB0aGlzLmdhbWVOb2Rlcy5oZWFkO1xuICAgIGlmIChub2RlICYmIG5vZGUud2FpdC5zdGFydEdhbWUgJiYgZ2FtZSkge1xuICAgICAgYXN0ZXJvaWQgPSB0aGlzLmFzdGVyb2lkcy5oZWFkO1xuICAgICAgd2hpbGUgKGFzdGVyb2lkKSB7XG4gICAgICAgIHRoaXMuY3JlYXRvci5kZXN0cm95RW50aXR5KGFzdGVyb2lkLmVudGl0eSk7XG4gICAgICAgIGFzdGVyb2lkID0gYXN0ZXJvaWQubmV4dDtcbiAgICAgIH1cbiAgICAgIGdhbWUuc3RhdGUuc2V0Rm9yU3RhcnQoKTtcbiAgICAgIG5vZGUud2FpdC5zdGFydEdhbWUgPSBmYWxzZTtcbiAgICAgIHRoaXMuZW5naW5lLnJlbW92ZUVudGl0eShub2RlLmVudGl0eSk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBXYWl0Rm9yU3RhcnRTeXN0ZW07XG5cbn0pKGFzaC5jb3JlLlN5c3RlbSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXdhaXRfZm9yX3N0YXJ0X3N5c3RlbS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc3Rlcm9pZHMsXG4gIF9fYmluZCA9IGZ1bmN0aW9uKGZuLCBtZSl7IHJldHVybiBmdW5jdGlvbigpeyByZXR1cm4gZm4uYXBwbHkobWUsIGFyZ3VtZW50cyk7IH07IH07XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uL2luZGV4Jyk7XG5cbmFzdGVyb2lkcy51aS5LZXlQb2xsID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgZGlzcGxheU9iaiwgc3RhdGVzO1xuXG4gIHN0YXRlcyA9IG51bGw7XG5cbiAgZGlzcGxheU9iaiA9IG51bGw7XG5cbiAgZnVuY3Rpb24gS2V5UG9sbChkaXNwbGF5T2JqKSB7XG4gICAgdGhpcy5kaXNwbGF5T2JqID0gZGlzcGxheU9iajtcbiAgICB0aGlzLmlzVXAgPSBfX2JpbmQodGhpcy5pc1VwLCB0aGlzKTtcbiAgICB0aGlzLmlzRG93biA9IF9fYmluZCh0aGlzLmlzRG93biwgdGhpcyk7XG4gICAgdGhpcy5rZXlVcExpc3RlbmVyID0gX19iaW5kKHRoaXMua2V5VXBMaXN0ZW5lciwgdGhpcyk7XG4gICAgdGhpcy5rZXlEb3duTGlzdGVuZXIgPSBfX2JpbmQodGhpcy5rZXlEb3duTGlzdGVuZXIsIHRoaXMpO1xuICAgIHRoaXMuc3RhdGVzID0ge307XG4gICAgdGhpcy5kaXNwbGF5T2JqLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIHRoaXMua2V5RG93bkxpc3RlbmVyKTtcbiAgICB0aGlzLmRpc3BsYXlPYmouYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIHRoaXMua2V5VXBMaXN0ZW5lcik7XG4gIH1cblxuICBLZXlQb2xsLnByb3RvdHlwZS5rZXlEb3duTGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCkge1xuICAgIHRoaXMuc3RhdGVzW2V2ZW50LmtleUNvZGVdID0gdHJ1ZTtcbiAgfTtcblxuICBLZXlQb2xsLnByb3RvdHlwZS5rZXlVcExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBpZiAodGhpcy5zdGF0ZXNbZXZlbnQua2V5Q29kZV0pIHtcbiAgICAgIHRoaXMuc3RhdGVzW2V2ZW50LmtleUNvZGVdID0gZmFsc2U7XG4gICAgfVxuICB9O1xuXG4gIEtleVBvbGwucHJvdG90eXBlLmlzRG93biA9IGZ1bmN0aW9uKGtleUNvZGUpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZXNba2V5Q29kZV07XG4gIH07XG5cbiAgS2V5UG9sbC5wcm90b3R5cGUuaXNVcCA9IGZ1bmN0aW9uKGtleUNvZGUpIHtcbiAgICByZXR1cm4gIXRoaXMuc3RhdGVzW2tleUNvZGVdO1xuICB9O1xuXG4gIHJldHVybiBLZXlQb2xsO1xuXG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1rZXlfcG9sbC5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc3Rlcm9pZHM7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uL2luZGV4Jyk7XG5cbmFzdGVyb2lkcy51aS5Qb2ludCA9IChmdW5jdGlvbigpIHtcbiAgUG9pbnQucHJvdG90eXBlLnggPSAwO1xuXG4gIFBvaW50LnByb3RvdHlwZS55ID0gMDtcblxuICBmdW5jdGlvbiBQb2ludCh4LCB5KSB7XG4gICAgdGhpcy54ID0geCAhPSBudWxsID8geCA6IDA7XG4gICAgdGhpcy55ID0geSAhPSBudWxsID8geSA6IDA7XG4gIH1cblxuICBQb2ludC5kaXN0YW5jZSA9IGZ1bmN0aW9uKHBvaW50MSwgcG9pbnQyKSB7XG4gICAgdmFyIGR4LCBkeTtcbiAgICBkeCA9IHBvaW50MS54IC0gcG9pbnQyLng7XG4gICAgZHkgPSBwb2ludDEueSAtIHBvaW50Mi55O1xuICAgIHJldHVybiBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xuICB9O1xuXG4gIFBvaW50LnByb3RvdHlwZS5kaXN0YW5jZVNxdWFyZWRUbyA9IGZ1bmN0aW9uKHRhcmdldFBvaW50KSB7XG4gICAgdmFyIGR4LCBkeTtcbiAgICBkeCA9IHRoaXMueCAtIHRhcmdldFBvaW50Lng7XG4gICAgZHkgPSB0aGlzLnkgLSB0YXJnZXRQb2ludC55O1xuICAgIHJldHVybiBkeCAqIGR4ICsgZHkgKiBkeTtcbiAgfTtcblxuICBQb2ludC5wcm90b3R5cGUuZGlzdGFuY2VUbyA9IGZ1bmN0aW9uKHRhcmdldFBvaW50KSB7XG4gICAgdmFyIGR4LCBkeTtcbiAgICBkeCA9IHRoaXMueCAtIHRhcmdldFBvaW50Lng7XG4gICAgZHkgPSB0aGlzLnkgLSB0YXJnZXRQb2ludC55O1xuICAgIHJldHVybiBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xuICB9O1xuXG4gIHJldHVybiBQb2ludDtcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cG9pbnQuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXN0ZXJvaWRzO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFzdGVyb2lkcyA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gYXN0ZXJvaWRzKCkge31cblxuICByZXR1cm4gYXN0ZXJvaWRzO1xuXG59KSgpO1xuXG5hc3Rlcm9pZHMudWkgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIHVpKCkge31cblxuICByZXR1cm4gdWk7XG5cbn0pKCk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL3VpL3BvaW50Jyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL3VpL2tleV9wb2xsJyk7XG5cbmFzdGVyb2lkcy5zcHJpdGVzID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBzcHJpdGVzKCkge31cblxuICByZXR1cm4gc3ByaXRlcztcblxufSkoKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvc3ByaXRlcy9hc3Rlcm9pZF92aWV3Jyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL3Nwcml0ZXMvYXN0ZXJvaWRfZGVhdGhfdmlldycpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9zcHJpdGVzL2J1bGxldF92aWV3Jyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL3Nwcml0ZXMvaHVkX3ZpZXcnKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvc3ByaXRlcy9zcGFjZXNoaXBfZGVhdGhfdmlldycpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9zcHJpdGVzL3NwYWNlc2hpcF92aWV3Jyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL3Nwcml0ZXMvd2FpdF9mb3Jfc3RhcnRfdmlldycpO1xuXG5hc3Rlcm9pZHMuY29tcG9uZW50cyA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gY29tcG9uZW50cygpIHt9XG5cbiAgcmV0dXJuIGNvbXBvbmVudHM7XG5cbn0pKCk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL2NvbXBvbmVudHMvYW5pbWF0aW9uJyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL2NvbXBvbmVudHMvYXN0ZXJvaWQnKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvY29tcG9uZW50cy9hdWRpbycpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9jb21wb25lbnRzL2J1bGxldCcpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9jb21wb25lbnRzL2NvbGxpc2lvbicpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9jb21wb25lbnRzL2RlYXRoX3Rocm9lcycpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9jb21wb25lbnRzL2Rpc3BsYXknKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvY29tcG9uZW50cy9nYW1lX3N0YXRlJyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL2NvbXBvbmVudHMvZ3VuJyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL2NvbXBvbmVudHMvZ3VuX2NvbnRyb2xzJyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL2NvbXBvbmVudHMvaHVkJyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL2NvbXBvbmVudHMvbW90aW9uX2NvbnRyb2xzJyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL2NvbXBvbmVudHMvcGh5c2ljcycpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9jb21wb25lbnRzL3Bvc2l0aW9uJyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL2NvbXBvbmVudHMvc3BhY2VzaGlwJyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL2NvbXBvbmVudHMvd2FpdF9mb3Jfc3RhcnQnKTtcblxuYXN0ZXJvaWRzLm5vZGVzID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBub2RlcygpIHt9XG5cbiAgcmV0dXJuIG5vZGVzO1xuXG59KSgpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9ub2Rlcy9hbmltYXRpb25fbm9kZScpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9ub2Rlcy9hc3Rlcm9pZF9jb2xsaXNpb25fbm9kZScpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9ub2Rlcy9hdWRpb19ub2RlJyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL25vZGVzL2J1bGxldF9hZ2Vfbm9kZScpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9ub2Rlcy9idWxsZXRfY29sbGlzaW9uX25vZGUnKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvbm9kZXMvZGVhdGhfdGhyb2VzX25vZGUnKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvbm9kZXMvZ2FtZV9ub2RlJyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL25vZGVzL2d1bl9jb250cm9sX25vZGUnKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvbm9kZXMvaHVkX25vZGUnKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvbm9kZXMvbW92ZW1lbnRfbm9kZScpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9ub2Rlcy9waHlzaWNzX2NvbnRyb2xfbm9kZScpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9ub2Rlcy9waHlzaWNzX25vZGUnKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvbm9kZXMvcmVuZGVyX25vZGUnKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvbm9kZXMvc3BhY2VzaGlwX2NvbGxpc2lvbl9ub2RlJyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL25vZGVzL3NwYWNlc2hpcF9ub2RlJyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL25vZGVzL3dhaXRfZm9yX3N0YXJ0X25vZGUnKTtcblxuYXN0ZXJvaWRzLnN5c3RlbXMgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIHN5c3RlbXMoKSB7fVxuXG4gIHJldHVybiBzeXN0ZW1zO1xuXG59KSgpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9zeXN0ZW1zL3BoeXNpY3Nfc3lzdGVtJyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL3N5c3RlbXMvYW5pbWF0aW9uX3N5c3RlbScpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9zeXN0ZW1zL2F1ZGlvX3N5c3RlbScpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9zeXN0ZW1zL2J1bGxldF9hZ2Vfc3lzdGVtJyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL3N5c3RlbXMvY29sbGlzaW9uX3N5c3RlbScpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9zeXN0ZW1zL2RlYXRoX3Rocm9lc19zeXN0ZW0nKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvc3lzdGVtcy9nYW1lX21hbmFnZXInKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvc3lzdGVtcy9ndW5fY29udHJvbF9zeXN0ZW0nKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvc3lzdGVtcy9odWRfc3lzdGVtJyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL3N5c3RlbXMvbW92ZW1lbnRfc3lzdGVtJyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL3N5c3RlbXMvcGh5c2ljc19jb250cm9sX3N5c3RlbScpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9zeXN0ZW1zL3JlbmRlcl9zeXN0ZW0nKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvc3lzdGVtcy9zeXN0ZW1fcHJpb3JpdGllcycpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9zeXN0ZW1zL3dhaXRfZm9yX3N0YXJ0X3N5c3RlbScpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9lbnRpdHlfY3JlYXRvcicpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9nYW1lX2NvbmZpZycpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9hc3Rlcm9pZHMnKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvbWFpbicpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXBcbiJdfQ==
