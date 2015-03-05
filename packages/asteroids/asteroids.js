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
      id: ++this.asteroidId,
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
      id: ++this.spaceshipId,
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
      id: ++this.bulletId,
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

  CollisionSystem.prototype.creator = null;

  CollisionSystem.prototype.games = null;

  CollisionSystem.prototype.spaceships = null;

  CollisionSystem.prototype.asteroids = null;

  CollisionSystem.prototype.bullets = null;

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

  CollisionSystem.prototype.BulletHitAsteroid = function(bullet, asteroid) {
    var body, position, radius;
    if ((asteroid.get(Collision) != null)) {
      this.creator.destroyEntity(bullet);
      PhysicsSystem.deadPool.push(bullet.get(Physics).body);
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
    if (this.keyPoll.isDown(control.left)) {
      body.ApplyTorque(rotation / 1000 - control.rotationRate / Math.PI * time);
    }
    if (this.keyPoll.isDown(control.right)) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYXNoLmNvZmZlZS9kaXN0L2xpYi9hc2gvY29yZS9jb21wb25lbnRfbWF0Y2hpbmdfZmFtaWx5LmpzIiwibm9kZV9tb2R1bGVzL2FzaC5jb2ZmZWUvZGlzdC9saWIvYXNoL2NvcmUvZW5naW5lLmpzIiwibm9kZV9tb2R1bGVzL2FzaC5jb2ZmZWUvZGlzdC9saWIvYXNoL2NvcmUvZW50aXR5LmpzIiwibm9kZV9tb2R1bGVzL2FzaC5jb2ZmZWUvZGlzdC9saWIvYXNoL2NvcmUvZW50aXR5X2xpc3QuanMiLCJub2RlX21vZHVsZXMvYXNoLmNvZmZlZS9kaXN0L2xpYi9hc2gvY29yZS9mYW1pbHkuanMiLCJub2RlX21vZHVsZXMvYXNoLmNvZmZlZS9kaXN0L2xpYi9hc2gvY29yZS9ub2RlLmpzIiwibm9kZV9tb2R1bGVzL2FzaC5jb2ZmZWUvZGlzdC9saWIvYXNoL2NvcmUvbm9kZV9saXN0LmpzIiwibm9kZV9tb2R1bGVzL2FzaC5jb2ZmZWUvZGlzdC9saWIvYXNoL2NvcmUvbm9kZV9wb29sLmpzIiwibm9kZV9tb2R1bGVzL2FzaC5jb2ZmZWUvZGlzdC9saWIvYXNoL2NvcmUvc3lzdGVtLmpzIiwibm9kZV9tb2R1bGVzL2FzaC5jb2ZmZWUvZGlzdC9saWIvYXNoL2NvcmUvc3lzdGVtX2xpc3QuanMiLCJub2RlX21vZHVsZXMvYXNoLmNvZmZlZS9kaXN0L2xpYi9hc2gvZnNtL2NvbXBvbmVudF9pbnN0YW5jZV9wcm92aWRlci5qcyIsIm5vZGVfbW9kdWxlcy9hc2guY29mZmVlL2Rpc3QvbGliL2FzaC9mc20vY29tcG9uZW50X3NpbmdsZXRvbl9wcm92aWRlci5qcyIsIm5vZGVfbW9kdWxlcy9hc2guY29mZmVlL2Rpc3QvbGliL2FzaC9mc20vY29tcG9uZW50X3R5cGVfcHJvdmlkZXIuanMiLCJub2RlX21vZHVsZXMvYXNoLmNvZmZlZS9kaXN0L2xpYi9hc2gvZnNtL2R5bmFtaWNfY29tcG9uZW50X3Byb3ZpZGVyLmpzIiwibm9kZV9tb2R1bGVzL2FzaC5jb2ZmZWUvZGlzdC9saWIvYXNoL2ZzbS9keW5hbWljX3N5c3RlbV9wcm92aWRlci5qcyIsIm5vZGVfbW9kdWxlcy9hc2guY29mZmVlL2Rpc3QvbGliL2FzaC9mc20vZW5naW5lX3N0YXRlLmpzIiwibm9kZV9tb2R1bGVzL2FzaC5jb2ZmZWUvZGlzdC9saWIvYXNoL2ZzbS9lbmdpbmVfc3RhdGVfbWFjaGluZS5qcyIsIm5vZGVfbW9kdWxlcy9hc2guY29mZmVlL2Rpc3QvbGliL2FzaC9mc20vZW50aXR5X3N0YXRlLmpzIiwibm9kZV9tb2R1bGVzL2FzaC5jb2ZmZWUvZGlzdC9saWIvYXNoL2ZzbS9lbnRpdHlfc3RhdGVfbWFjaGluZS5qcyIsIm5vZGVfbW9kdWxlcy9hc2guY29mZmVlL2Rpc3QvbGliL2FzaC9mc20vc3RhdGVfY29tcG9uZW50X21hcHBpbmcuanMiLCJub2RlX21vZHVsZXMvYXNoLmNvZmZlZS9kaXN0L2xpYi9hc2gvZnNtL3N0YXRlX3N5c3RlbV9tYXBwaW5nLmpzIiwibm9kZV9tb2R1bGVzL2FzaC5jb2ZmZWUvZGlzdC9saWIvYXNoL2ZzbS9zeXN0ZW1faW5zdGFuY2VfcHJvdmlkZXIuanMiLCJub2RlX21vZHVsZXMvYXNoLmNvZmZlZS9kaXN0L2xpYi9hc2gvZnNtL3N5c3RlbV9zaW5nbGV0b25fcHJvdmlkZXIuanMiLCJub2RlX21vZHVsZXMvYXNoLmNvZmZlZS9kaXN0L2xpYi9hc2gvc2lnbmFscy9saXN0ZW5lcl9ub2RlLmpzIiwibm9kZV9tb2R1bGVzL2FzaC5jb2ZmZWUvZGlzdC9saWIvYXNoL3NpZ25hbHMvbGlzdGVuZXJfbm9kZV9wb29sLmpzIiwibm9kZV9tb2R1bGVzL2FzaC5jb2ZmZWUvZGlzdC9saWIvYXNoL3NpZ25hbHMvc2lnbmFsMC5qcyIsIm5vZGVfbW9kdWxlcy9hc2guY29mZmVlL2Rpc3QvbGliL2FzaC9zaWduYWxzL3NpZ25hbDEuanMiLCJub2RlX21vZHVsZXMvYXNoLmNvZmZlZS9kaXN0L2xpYi9hc2gvc2lnbmFscy9zaWduYWwyLmpzIiwibm9kZV9tb2R1bGVzL2FzaC5jb2ZmZWUvZGlzdC9saWIvYXNoL3NpZ25hbHMvc2lnbmFsMy5qcyIsIm5vZGVfbW9kdWxlcy9hc2guY29mZmVlL2Rpc3QvbGliL2FzaC9zaWduYWxzL3NpZ25hbF9iYXNlLmpzIiwibm9kZV9tb2R1bGVzL2FzaC5jb2ZmZWUvZGlzdC9saWIvYXNoL3RpY2svZnJhbWVfdGlja19wcm92aWRlci5qcyIsIm5vZGVfbW9kdWxlcy9hc2guY29mZmVlL2Rpc3QvbGliL2FzaC90b29scy9jb21wb25lbnRfcG9vbC5qcyIsIm5vZGVfbW9kdWxlcy9hc2guY29mZmVlL2Rpc3QvbGliL2FzaC90b29scy9saXN0X2l0ZXJhdGluZ19zeXN0ZW0uanMiLCJub2RlX21vZHVsZXMvYXNoLmNvZmZlZS9kaXN0L2xpYi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hc2guY29mZmVlL2luZGV4LmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvYXN0ZXJvaWRzLmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvY29tcG9uZW50cy9hbmltYXRpb24uanMiLCJ0bXAvbGliL2FzdGVyb2lkcy9jb21wb25lbnRzL2FzdGVyb2lkLmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvY29tcG9uZW50cy9hdWRpby5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL2NvbXBvbmVudHMvYnVsbGV0LmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvY29tcG9uZW50cy9jb2xsaXNpb24uanMiLCJ0bXAvbGliL2FzdGVyb2lkcy9jb21wb25lbnRzL2RlYXRoX3Rocm9lcy5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL2NvbXBvbmVudHMvZGlzcGxheS5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL2NvbXBvbmVudHMvZ2FtZV9zdGF0ZS5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL2NvbXBvbmVudHMvZ3VuLmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvY29tcG9uZW50cy9ndW5fY29udHJvbHMuanMiLCJ0bXAvbGliL2FzdGVyb2lkcy9jb21wb25lbnRzL2h1ZC5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL2NvbXBvbmVudHMvbW90aW9uX2NvbnRyb2xzLmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvY29tcG9uZW50cy9waHlzaWNzLmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvY29tcG9uZW50cy9wb3NpdGlvbi5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL2NvbXBvbmVudHMvc3BhY2VzaGlwLmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvY29tcG9uZW50cy93YWl0X2Zvcl9zdGFydC5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL2VudGl0eV9jcmVhdG9yLmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvZ2FtZV9jb25maWcuanMiLCJ0bXAvbGliL2FzdGVyb2lkcy9tYWluLmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvbm9kZXMvYW5pbWF0aW9uX25vZGUuanMiLCJ0bXAvbGliL2FzdGVyb2lkcy9ub2Rlcy9hc3Rlcm9pZF9jb2xsaXNpb25fbm9kZS5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL25vZGVzL2F1ZGlvX25vZGUuanMiLCJ0bXAvbGliL2FzdGVyb2lkcy9ub2Rlcy9idWxsZXRfYWdlX25vZGUuanMiLCJ0bXAvbGliL2FzdGVyb2lkcy9ub2Rlcy9idWxsZXRfY29sbGlzaW9uX25vZGUuanMiLCJ0bXAvbGliL2FzdGVyb2lkcy9ub2Rlcy9kZWF0aF90aHJvZXNfbm9kZS5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL25vZGVzL2dhbWVfbm9kZS5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL25vZGVzL2d1bl9jb250cm9sX25vZGUuanMiLCJ0bXAvbGliL2FzdGVyb2lkcy9ub2Rlcy9odWRfbm9kZS5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL25vZGVzL21vdmVtZW50X25vZGUuanMiLCJ0bXAvbGliL2FzdGVyb2lkcy9ub2Rlcy9waHlzaWNzX2NvbnRyb2xfbm9kZS5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL25vZGVzL3BoeXNpY3Nfbm9kZS5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL25vZGVzL3JlbmRlcl9ub2RlLmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvbm9kZXMvc3BhY2VzaGlwX2NvbGxpc2lvbl9ub2RlLmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvbm9kZXMvc3BhY2VzaGlwX25vZGUuanMiLCJ0bXAvbGliL2FzdGVyb2lkcy9ub2Rlcy93YWl0X2Zvcl9zdGFydF9ub2RlLmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvc3ByaXRlcy9hc3Rlcm9pZF9kZWF0aF92aWV3LmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvc3ByaXRlcy9hc3Rlcm9pZF92aWV3LmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvc3ByaXRlcy9idWxsZXRfdmlldy5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL3Nwcml0ZXMvaHVkX3ZpZXcuanMiLCJ0bXAvbGliL2FzdGVyb2lkcy9zcHJpdGVzL3NwYWNlc2hpcF9kZWF0aF92aWV3LmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvc3ByaXRlcy9zcGFjZXNoaXBfdmlldy5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL3Nwcml0ZXMvd2FpdF9mb3Jfc3RhcnRfdmlldy5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL3N5c3RlbXMvYW5pbWF0aW9uX3N5c3RlbS5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL3N5c3RlbXMvYXVkaW9fc3lzdGVtLmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvc3lzdGVtcy9idWxsZXRfYWdlX3N5c3RlbS5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL3N5c3RlbXMvY29sbGlzaW9uX3N5c3RlbS5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL3N5c3RlbXMvZGVhdGhfdGhyb2VzX3N5c3RlbS5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL3N5c3RlbXMvZ2FtZV9tYW5hZ2VyLmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvc3lzdGVtcy9ndW5fY29udHJvbF9zeXN0ZW0uanMiLCJ0bXAvbGliL2FzdGVyb2lkcy9zeXN0ZW1zL2h1ZF9zeXN0ZW0uanMiLCJ0bXAvbGliL2FzdGVyb2lkcy9zeXN0ZW1zL21vdmVtZW50X3N5c3RlbS5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL3N5c3RlbXMvcGh5c2ljc19jb250cm9sX3N5c3RlbS5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL3N5c3RlbXMvcGh5c2ljc19zeXN0ZW0uanMiLCJ0bXAvbGliL2FzdGVyb2lkcy9zeXN0ZW1zL3JlbmRlcl9zeXN0ZW0uanMiLCJ0bXAvbGliL2FzdGVyb2lkcy9zeXN0ZW1zL3N5c3RlbV9wcmlvcml0aWVzLmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvc3lzdGVtcy93YWl0X2Zvcl9zdGFydF9zeXN0ZW0uanMiLCJ0bXAvbGliL2FzdGVyb2lkcy91aS9rZXlfcG9sbC5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL3VpL3BvaW50LmpzIiwidG1wL2xpYi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6VkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbFRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFKQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcbnZhciBEaWN0aW9uYXJ5LCBOb2RlTGlzdCwgTm9kZVBvb2wsIGFzaCxcbiAgX19iaW5kID0gZnVuY3Rpb24oZm4sIG1lKXsgcmV0dXJuIGZ1bmN0aW9uKCl7IHJldHVybiBmbi5hcHBseShtZSwgYXJndW1lbnRzKTsgfTsgfTtcblxuYXNoID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cbk5vZGVMaXN0ID0gYXNoLmNvcmUuTm9kZUxpc3Q7XG5cbk5vZGVQb29sID0gYXNoLmNvcmUuTm9kZVBvb2w7XG5cbkRpY3Rpb25hcnkgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIERpY3Rpb25hcnkoKSB7fVxuXG4gIHJldHVybiBEaWN0aW9uYXJ5O1xuXG59KSgpO1xuXG5cbi8qXG4gKiBUaGUgZGVmYXVsdCBjbGFzcyBmb3IgbWFuYWdpbmcgYSBOb2RlTGlzdC4gVGhpcyBjbGFzcyBjcmVhdGVzIHRoZSBOb2RlTGlzdCBhbmQgYWRkcyBhbmQgcmVtb3Zlc1xuICogbm9kZXMgdG8vZnJvbSB0aGUgbGlzdCBhcyB0aGUgZW50aXRpZXMgYW5kIHRoZSBjb21wb25lbnRzIGluIHRoZSBlbmdpbmUgY2hhbmdlLlxuICpcbiAqIEl0IHVzZXMgdGhlIGJhc2ljIGVudGl0eSBtYXRjaGluZyBwYXR0ZXJuIG9mIGFuIGVudGl0eSBzeXN0ZW0gLSBlbnRpdGllcyBhcmUgYWRkZWQgdG8gdGhlIGxpc3QgaWZcbiAqIHRoZXkgY29udGFpbiBjb21wb25lbnRzIG1hdGNoaW5nIGFsbCB0aGUgcHVibGljIHByb3BlcnRpZXMgb2YgdGhlIG5vZGUgY2xhc3MuXG4gKi9cblxuYXNoLmNvcmUuQ29tcG9uZW50TWF0Y2hpbmdGYW1pbHkgPSAoZnVuY3Rpb24oKSB7XG4gIENvbXBvbmVudE1hdGNoaW5nRmFtaWx5LnByb3RvdHlwZS5ub2RlcyA9IG51bGw7XG5cbiAgQ29tcG9uZW50TWF0Y2hpbmdGYW1pbHkucHJvdG90eXBlLmVudGl0aWVzID0gbnVsbDtcblxuICBDb21wb25lbnRNYXRjaGluZ0ZhbWlseS5wcm90b3R5cGUubm9kZUNsYXNzID0gbnVsbDtcblxuICBDb21wb25lbnRNYXRjaGluZ0ZhbWlseS5wcm90b3R5cGUuY29tcG9uZW50cyA9IG51bGw7XG5cbiAgQ29tcG9uZW50TWF0Y2hpbmdGYW1pbHkucHJvdG90eXBlLm5vZGVQb29sID0gbnVsbDtcblxuICBDb21wb25lbnRNYXRjaGluZ0ZhbWlseS5wcm90b3R5cGUuZW5naW5lID0gbnVsbDtcblxuXG4gIC8qXG4gICAqIFRoZSBjb25zdHJ1Y3Rvci4gQ3JlYXRlcyBhIENvbXBvbmVudE1hdGNoaW5nRmFtaWx5IHRvIHByb3ZpZGUgYSBOb2RlTGlzdCBmb3IgdGhlXG4gICAqIGdpdmVuIG5vZGUgY2xhc3MuXG4gICAqXG4gICAqIEBwYXJhbSBub2RlQ2xhc3MgVGhlIHR5cGUgb2Ygbm9kZSB0byBjcmVhdGUgYW5kIG1hbmFnZSBhIE5vZGVMaXN0IGZvci5cbiAgICogQHBhcmFtIGVuZ2luZSBUaGUgZW5naW5lIHRoYXQgdGhpcyBmYW1pbHkgaXMgbWFuYWdpbmcgdGVoIE5vZGVMaXN0IGZvci5cbiAgICovXG5cbiAgZnVuY3Rpb24gQ29tcG9uZW50TWF0Y2hpbmdGYW1pbHkobm9kZUNsYXNzLCBlbmdpbmUpIHtcbiAgICB0aGlzLm5vZGVDbGFzcyA9IG5vZGVDbGFzcztcbiAgICB0aGlzLmVuZ2luZSA9IGVuZ2luZTtcbiAgICB0aGlzLnJlbGVhc2VOb2RlUG9vbENhY2hlID0gX19iaW5kKHRoaXMucmVsZWFzZU5vZGVQb29sQ2FjaGUsIHRoaXMpO1xuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cblxuICAvKlxuICAgKiBJbml0aWFsaXNlcyB0aGUgY2xhc3MuIENyZWF0ZXMgdGhlIG5vZGVsaXN0IGFuZCBvdGhlciB0b29scy4gQW5hbHlzZXMgdGhlIG5vZGUgdG8gZGV0ZXJtaW5lXG4gICAqIHdoYXQgY29tcG9uZW50IHR5cGVzIHRoZSBub2RlIHJlcXVpcmVzLlxuICAgKi9cblxuICBDb21wb25lbnRNYXRjaGluZ0ZhbWlseS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBuYW1lLCB0eXBlLCBfcmVmO1xuICAgIHRoaXMubm9kZXMgPSBuZXcgTm9kZUxpc3QoKTtcbiAgICB0aGlzLmVudGl0aWVzID0gbmV3IERpY3Rpb25hcnkoKTtcbiAgICB0aGlzLmNvbXBvbmVudHMgPSBuZXcgRGljdGlvbmFyeSgpO1xuICAgIHRoaXMubm9kZVBvb2wgPSBuZXcgTm9kZVBvb2wodGhpcy5ub2RlQ2xhc3MsIHRoaXMubm9kZUNsYXNzLmNvbXBvbmVudHMpO1xuICAgIF9yZWYgPSB0aGlzLm5vZGVDbGFzcy5jb21wb25lbnRzO1xuICAgIGZvciAobmFtZSBpbiBfcmVmKSB7XG4gICAgICB0eXBlID0gX3JlZltuYW1lXTtcbiAgICAgIHRoaXMuY29tcG9uZW50c1t0eXBlLm5hbWVdID0gdHlwZTtcbiAgICB9XG4gIH07XG5cblxuICAvKlxuICAgKiBUaGUgbm9kZWxpc3QgbWFuYWdlZCBieSB0aGlzIGZhbWlseS4gVGhpcyBpcyBhIHJlZmVyZW5jZSB0aGF0IHJlbWFpbnMgdmFsaWQgYWx3YXlzXG4gICAqIHNpbmNlIGl0IGlzIHJldGFpbmVkIGFuZCByZXVzZWQgYnkgU3lzdGVtcyB0aGF0IHVzZSB0aGUgbGlzdC4gaS5lLiB3ZSBuZXZlciByZWNyZWF0ZSB0aGUgbGlzdCxcbiAgICogd2UgYWx3YXlzIG1vZGlmeSBpdCBpbiBwbGFjZS5cbiAgICovXG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoQ29tcG9uZW50TWF0Y2hpbmdGYW1pbHkucHJvdG90eXBlLCB7XG4gICAgbm9kZUxpc3Q6IHtcbiAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5vZGVzO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cblxuICAvKlxuICAgKiBDYWxsZWQgYnkgdGhlIGVuZ2luZSB3aGVuIGFuIGVudGl0eSBoYXMgYmVlbiBhZGRlZCB0byBpdC4gV2UgY2hlY2sgaWYgdGhlIGVudGl0eSBzaG91bGQgYmUgaW5cbiAgICogdGhpcyBmYW1pbHkncyBOb2RlTGlzdCBhbmQgYWRkIGl0IGlmIGFwcHJvcHJpYXRlLlxuICAgKi9cblxuICBDb21wb25lbnRNYXRjaGluZ0ZhbWlseS5wcm90b3R5cGUubmV3RW50aXR5ID0gZnVuY3Rpb24oZW50aXR5KSB7XG4gICAgdGhpcy5hZGRJZk1hdGNoKGVudGl0eSk7XG4gIH07XG5cblxuICAvKlxuICAgKiBDYWxsZWQgYnkgdGhlIGVuZ2luZSB3aGVuIGEgY29tcG9uZW50IGhhcyBiZWVuIGFkZGVkIHRvIGFuIGVudGl0eS4gV2UgY2hlY2sgaWYgdGhlIGVudGl0eSBpcyBub3QgaW5cbiAgICogdGhpcyBmYW1pbHkncyBOb2RlTGlzdCBhbmQgc2hvdWxkIGJlLCBhbmQgYWRkIGl0IGlmIGFwcHJvcHJpYXRlLlxuICAgKi9cblxuICBDb21wb25lbnRNYXRjaGluZ0ZhbWlseS5wcm90b3R5cGUuY29tcG9uZW50QWRkZWRUb0VudGl0eSA9IGZ1bmN0aW9uKGVudGl0eSwgY29tcG9uZW50Q2xhc3MpIHtcbiAgICB0aGlzLmFkZElmTWF0Y2goZW50aXR5KTtcbiAgfTtcblxuXG4gIC8qXG4gICAqIENhbGxlZCBieSB0aGUgZW5naW5lIHdoZW4gYSBjb21wb25lbnQgaGFzIGJlZW4gcmVtb3ZlZCBmcm9tIGFuIGVudGl0eS4gV2UgY2hlY2sgaWYgdGhlIHJlbW92ZWQgY29tcG9uZW50XG4gICAqIGlzIHJlcXVpcmVkIGJ5IHRoaXMgZmFtaWx5J3MgTm9kZUxpc3QgYW5kIGlmIHNvLCB3ZSBjaGVjayBpZiB0aGUgZW50aXR5IGlzIGluIHRoaXMgdGhpcyBOb2RlTGlzdCBhbmRcbiAgICogcmVtb3ZlIGl0IGlmIHNvLlxuICAgKi9cblxuICBDb21wb25lbnRNYXRjaGluZ0ZhbWlseS5wcm90b3R5cGUuY29tcG9uZW50UmVtb3ZlZEZyb21FbnRpdHkgPSBmdW5jdGlvbihlbnRpdHksIGNvbXBvbmVudENsYXNzKSB7XG4gICAgdmFyIG5hbWU7XG4gICAgbmFtZSA9IGNvbXBvbmVudENsYXNzLm5hbWUgIT0gbnVsbCA/IGNvbXBvbmVudENsYXNzLm5hbWUgOiBjb21wb25lbnRDbGFzcztcbiAgICBpZiAobmFtZSBpbiB0aGlzLmNvbXBvbmVudHMpIHtcbiAgICAgIHRoaXMucmVtb3ZlSWZNYXRjaChlbnRpdHkpO1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gICAqIENhbGxlZCBieSB0aGUgZW5naW5lIHdoZW4gYW4gZW50aXR5IGhhcyBiZWVuIHJtb3ZlZCBmcm9tIGl0LiBXZSBjaGVjayBpZiB0aGUgZW50aXR5IGlzIGluXG4gICAqIHRoaXMgZmFtaWx5J3MgTm9kZUxpc3QgYW5kIHJlbW92ZSBpdCBpZiBzby5cbiAgICovXG5cbiAgQ29tcG9uZW50TWF0Y2hpbmdGYW1pbHkucHJvdG90eXBlLnJlbW92ZUVudGl0eSA9IGZ1bmN0aW9uKGVudGl0eSkge1xuICAgIHRoaXMucmVtb3ZlSWZNYXRjaChlbnRpdHkpO1xuICB9O1xuXG5cbiAgLypcbiAgICogSWYgdGhlIGVudGl0eSBpcyBub3QgaW4gdGhpcyBmYW1pbHkncyBOb2RlTGlzdCwgdGVzdHMgdGhlIGNvbXBvbmVudHMgb2YgdGhlIGVudGl0eSB0byBzZWVcbiAgICogaWYgaXQgc2hvdWxkIGJlIGluIHRoaXMgTm9kZUxpc3QgYW5kIGFkZHMgaXQgaWYgc28uXG4gICAqL1xuXG4gIENvbXBvbmVudE1hdGNoaW5nRmFtaWx5LnByb3RvdHlwZS5hZGRJZk1hdGNoID0gZnVuY3Rpb24oZW50aXR5KSB7XG4gICAgdmFyIGNvbXBvbmVudENsYXNzLCBuYW1lLCBub2RlLCBfcmVmLCBfcmVmMTtcbiAgICBpZiAodGhpcy5lbnRpdGllc1tlbnRpdHkubmFtZV0gPT0gbnVsbCkge1xuICAgICAgX3JlZiA9IHRoaXMubm9kZUNsYXNzLmNvbXBvbmVudHM7XG4gICAgICBmb3IgKG5hbWUgaW4gX3JlZikge1xuICAgICAgICBjb21wb25lbnRDbGFzcyA9IF9yZWZbbmFtZV07XG4gICAgICAgIGlmICghZW50aXR5Lmhhcyhjb21wb25lbnRDbGFzcykpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIG5vZGUgPSB0aGlzLm5vZGVQb29sLmdldCgpO1xuICAgICAgbm9kZS5lbnRpdHkgPSBlbnRpdHk7XG4gICAgICBfcmVmMSA9IHRoaXMubm9kZUNsYXNzLmNvbXBvbmVudHM7XG4gICAgICBmb3IgKG5hbWUgaW4gX3JlZjEpIHtcbiAgICAgICAgY29tcG9uZW50Q2xhc3MgPSBfcmVmMVtuYW1lXTtcbiAgICAgICAgbm9kZVtuYW1lXSA9IGVudGl0eS5nZXQoY29tcG9uZW50Q2xhc3MpO1xuICAgICAgfVxuICAgICAgdGhpcy5lbnRpdGllc1tlbnRpdHkubmFtZV0gPSBub2RlO1xuICAgICAgdGhpcy5ub2Rlcy5hZGQobm9kZSk7XG4gICAgfVxuICB9O1xuXG5cbiAgLypcbiAgICogUmVtb3ZlcyB0aGUgZW50aXR5IGlmIGl0IGlzIGluIHRoaXMgZmFtaWx5J3MgTm9kZUxpc3QuXG4gICAqL1xuXG4gIENvbXBvbmVudE1hdGNoaW5nRmFtaWx5LnByb3RvdHlwZS5yZW1vdmVJZk1hdGNoID0gZnVuY3Rpb24oZW50aXR5KSB7XG4gICAgdmFyIG5vZGU7XG4gICAgaWYgKGVudGl0eS5uYW1lIGluIHRoaXMuZW50aXRpZXMpIHtcbiAgICAgIG5vZGUgPSB0aGlzLmVudGl0aWVzW2VudGl0eS5uYW1lXTtcbiAgICAgIGRlbGV0ZSB0aGlzLmVudGl0aWVzW2VudGl0eS5uYW1lXTtcbiAgICAgIHRoaXMubm9kZXMucmVtb3ZlKG5vZGUpO1xuICAgICAgaWYgKHRoaXMuZW5naW5lLnVwZGF0aW5nKSB7XG4gICAgICAgIHRoaXMubm9kZVBvb2wuY2FjaGUobm9kZSk7XG4gICAgICAgIHRoaXMuZW5naW5lLnVwZGF0ZUNvbXBsZXRlLmFkZCh0aGlzLnJlbGVhc2VOb2RlUG9vbENhY2hlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubm9kZVBvb2wuZGlzcG9zZShub2RlKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cblxuICAvKlxuICAgKiBSZWxlYXNlcyB0aGUgbm9kZXMgdGhhdCB3ZXJlIGFkZGVkIHRvIHRoZSBub2RlIHBvb2wgZHVyaW5nIHRoaXMgZW5naW5lIHVwZGF0ZSwgc28gdGhleSBjYW5cbiAgICogYmUgcmV1c2VkLlxuICAgKi9cblxuICBDb21wb25lbnRNYXRjaGluZ0ZhbWlseS5wcm90b3R5cGUucmVsZWFzZU5vZGVQb29sQ2FjaGUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmVuZ2luZS51cGRhdGVDb21wbGV0ZS5yZW1vdmUodGhpcy5yZWxlYXNlTm9kZVBvb2xDYWNoZSk7XG4gICAgdGhpcy5ub2RlUG9vbC5yZWxlYXNlQ2FjaGUoKTtcbiAgfTtcblxuXG4gIC8qXG4gICAqIFJlbW92ZXMgYWxsIG5vZGVzIGZyb20gdGhlIE5vZGVMaXN0LlxuICAgKi9cblxuICBDb21wb25lbnRNYXRjaGluZ0ZhbWlseS5wcm90b3R5cGUuY2xlYW5VcCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBub2RlO1xuICAgIG5vZGUgPSB0aGlzLm5vZGVzLmhlYWQ7XG4gICAgd2hpbGUgKG5vZGUpIHtcbiAgICAgIHRoaXMuZW50aXRpZXMucmVtb3ZlKG5vZGUuZW50aXR5KTtcbiAgICAgIG5vZGUgPSBub2RlLm5leHQ7XG4gICAgfVxuICAgIHRoaXMubm9kZXMucmVtb3ZlQWxsKCk7XG4gIH07XG5cbiAgcmV0dXJuIENvbXBvbmVudE1hdGNoaW5nRmFtaWx5O1xuXG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb21wb25lbnRfbWF0Y2hpbmdfZmFtaWx5LmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIENvbXBvbmVudE1hdGNoaW5nRmFtaWx5LCBEaWN0aW9uYXJ5LCBFbnRpdHlMaXN0LCBTaWduYWwwLCBTeXN0ZW1MaXN0LCBhc2gsXG4gIF9fYmluZCA9IGZ1bmN0aW9uKGZuLCBtZSl7IHJldHVybiBmdW5jdGlvbigpeyByZXR1cm4gZm4uYXBwbHkobWUsIGFyZ3VtZW50cyk7IH07IH07XG5cbmFzaCA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5Db21wb25lbnRNYXRjaGluZ0ZhbWlseSA9IGFzaC5jb3JlLkNvbXBvbmVudE1hdGNoaW5nRmFtaWx5O1xuXG5FbnRpdHlMaXN0ID0gYXNoLmNvcmUuRW50aXR5TGlzdDtcblxuU2lnbmFsMCA9IGFzaC5zaWduYWxzLlNpZ25hbDA7XG5cblN5c3RlbUxpc3QgPSBhc2guY29yZS5TeXN0ZW1MaXN0O1xuXG5EaWN0aW9uYXJ5ID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBEaWN0aW9uYXJ5KCkge31cblxuICByZXR1cm4gRGljdGlvbmFyeTtcblxufSkoKTtcblxuXG4vKlxuICogVGhlIEVuZ2luZSBjbGFzcyBpcyB0aGUgY2VudHJhbCBwb2ludCBmb3IgY3JlYXRpbmcgYW5kIG1hbmFnaW5nIHlvdXIgZ2FtZSBzdGF0ZS4gQWRkXG4gKiBlbnRpdGllcyBhbmQgc3lzdGVtcyB0byB0aGUgZW5naW5lLCBhbmQgZmV0Y2ggZmFtaWxpZXMgb2Ygbm9kZXMgZnJvbSB0aGUgZW5naW5lLlxuICovXG5cbmFzaC5jb3JlLkVuZ2luZSA9IChmdW5jdGlvbigpIHtcbiAgRW5naW5lLnByb3RvdHlwZS5lbnRpdHlOYW1lcyA9IG51bGw7XG5cbiAgRW5naW5lLnByb3RvdHlwZS5lbnRpdHlMaXN0ID0gbnVsbDtcblxuICBFbmdpbmUucHJvdG90eXBlLnN5c3RlbUxpc3QgPSBudWxsO1xuXG4gIEVuZ2luZS5wcm90b3R5cGUuZmFtaWxpZXMgPSBudWxsO1xuXG5cbiAgLypcbiAgICogSW5kaWNhdGVzIGlmIHRoZSBlbmdpbmUgaXMgY3VycmVudGx5IGluIGl0cyB1cGRhdGUgbG9vcC5cbiAgICovXG5cbiAgRW5naW5lLnByb3RvdHlwZS51cGRhdGluZyA9IGZhbHNlO1xuXG5cbiAgLypcbiAgICogRGlzcGF0Y2hlZCB3aGVuIHRoZSB1cGRhdGUgbG9vcCBlbmRzLiBJZiB5b3Ugd2FudCB0byBhZGQgYW5kIHJlbW92ZSBzeXN0ZW1zIGZyb20gdGhlXG4gICAqIGVuZ2luZSBpdCBpcyB1c3VhbGx5IGJlc3Qgbm90IHRvIGRvIHNvIGR1cmluZyB0aGUgdXBkYXRlIGxvb3AuIFRvIGF2b2lkIHRoaXMgeW91IGNhblxuICAgKiBsaXN0ZW4gZm9yIHRoaXMgc2lnbmFsIGFuZCBtYWtlIHRoZSBjaGFuZ2Ugd2hlbiB0aGUgc2lnbmFsIGlzIGRpc3BhdGNoZWQuXG4gICAqL1xuXG4gIEVuZ2luZS5wcm90b3R5cGUudXBkYXRlQ29tcGxldGUgPSBudWxsO1xuXG5cbiAgLypcbiAgICogVGhlIGNsYXNzIHVzZWQgdG8gbWFuYWdlIG5vZGUgbGlzdHMuIEluIG1vc3QgY2FzZXMgdGhlIGRlZmF1bHQgY2xhc3MgaXMgc3VmZmljaWVudFxuICAgKiBidXQgaXQgaXMgZXhwb3NlZCBoZXJlIHNvIGFkdmFuY2VkIGRldmVsb3BlcnMgY2FuIGNob29zZSB0byBjcmVhdGUgYW5kIHVzZSBhXG4gICAqIGRpZmZlcmVudCBpbXBsZW1lbnRhdGlvbi5cbiAgICpcbiAgICogVGhlIGNsYXNzIG11c3QgaW1wbGVtZW50IHRoZSBJRmFtaWx5IGludGVyZmFjZS5cbiAgICovXG5cbiAgRW5naW5lLnByb3RvdHlwZS5mYW1pbHlDbGFzcyA9IENvbXBvbmVudE1hdGNoaW5nRmFtaWx5O1xuXG4gIGZ1bmN0aW9uIEVuZ2luZSgpIHtcbiAgICB0aGlzLnVwZGF0ZSA9IF9fYmluZCh0aGlzLnVwZGF0ZSwgdGhpcyk7XG4gICAgdGhpcy5jb21wb25lbnRSZW1vdmVkID0gX19iaW5kKHRoaXMuY29tcG9uZW50UmVtb3ZlZCwgdGhpcyk7XG4gICAgdGhpcy5jb21wb25lbnRBZGRlZCA9IF9fYmluZCh0aGlzLmNvbXBvbmVudEFkZGVkLCB0aGlzKTtcbiAgICB0aGlzLmVudGl0eU5hbWVDaGFuZ2VkID0gX19iaW5kKHRoaXMuZW50aXR5TmFtZUNoYW5nZWQsIHRoaXMpO1xuICAgIHRoaXMuZW50aXR5TGlzdCA9IG5ldyBFbnRpdHlMaXN0KCk7XG4gICAgdGhpcy5lbnRpdHlOYW1lcyA9IG5ldyBEaWN0aW9uYXJ5KCk7XG4gICAgdGhpcy5zeXN0ZW1MaXN0ID0gbmV3IFN5c3RlbUxpc3QoKTtcbiAgICB0aGlzLmZhbWlsaWVzID0gbmV3IERpY3Rpb25hcnkoKTtcbiAgICB0aGlzLnVwZGF0ZUNvbXBsZXRlID0gbmV3IFNpZ25hbDAoKTtcbiAgfVxuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKEVuZ2luZS5wcm90b3R5cGUsIHtcblxuICAgIC8qXG4gICAgICogUmV0dXJucyBhIHZlY3RvciBjb250YWluaW5nIGFsbCB0aGUgZW50aXRpZXMgaW4gdGhlIGVuZ2luZS5cbiAgICAgKi9cbiAgICBlbnRpdGllczoge1xuICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGVudGl0aWVzLCBlbnRpdHk7XG4gICAgICAgIGVudGl0aWVzID0gW107XG4gICAgICAgIGVudGl0eSA9IHRoaXMuZW50aXR5TGlzdC5oZWFkO1xuICAgICAgICB3aGlsZSAoZW50aXR5KSB7XG4gICAgICAgICAgdGhpcy5lbnRpdGllcy5wdXNoKGVudGl0eSk7XG4gICAgICAgICAgZW50aXR5ID0gZW50aXR5Lm5leHQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVudGl0aWVzO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIFJldHVybnMgYSB2ZWN0b3IgY29udGFpbmluZyBhbGwgdGhlIHN5c3RlbXMgaW4gdGhlIGVuZ2luZS5cbiAgICAgKi9cbiAgICBzeXN0ZW1zOiB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc3lzdGVtLCBzeXN0ZW1zO1xuICAgICAgICBzeXN0ZW1zID0gW107XG4gICAgICAgIHN5c3RlbSA9IHRoaXMuc3lzdGVtTGlzdC5oZWFkO1xuICAgICAgICB3aGlsZSAoc3lzdGVtKSB7XG4gICAgICAgICAgc3lzdGVtcy5wdXNoKHN5c3RlbSk7XG4gICAgICAgICAgc3lzdGVtID0gc3lzdGVtLm5leHQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN5c3RlbXM7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuXG4gIC8qXG4gICAqIEFkZCBhbiBlbnRpdHkgdG8gdGhlIGVuZ2luZS5cbiAgICpcbiAgICogQHBhcmFtIGVudGl0eSBUaGUgZW50aXR5IHRvIGFkZC5cbiAgICovXG5cbiAgRW5naW5lLnByb3RvdHlwZS5hZGRFbnRpdHkgPSBmdW5jdGlvbihlbnRpdHkpIHtcbiAgICB2YXIgZWFjaCwgZmFtaWx5LCBfcmVmO1xuICAgIGlmICh0aGlzLmVudGl0eU5hbWVzW2VudGl0eS5uYW1lXSkge1xuICAgICAgdGhyb3cgXCJUaGUgZW50aXR5IG5hbWUgXCIgKyBlbnRpdHkubmFtZSArIFwiIGlzIGFscmVhZHkgaW4gdXNlIGJ5IGFub3RoZXIgZW50aXR5LlwiO1xuICAgIH1cbiAgICB0aGlzLmVudGl0eUxpc3QuYWRkKGVudGl0eSk7XG4gICAgdGhpcy5lbnRpdHlOYW1lc1tlbnRpdHkubmFtZV0gPSBlbnRpdHk7XG4gICAgZW50aXR5LmNvbXBvbmVudEFkZGVkLmFkZCh0aGlzLmNvbXBvbmVudEFkZGVkKTtcbiAgICBlbnRpdHkuY29tcG9uZW50UmVtb3ZlZC5hZGQodGhpcy5jb21wb25lbnRSZW1vdmVkKTtcbiAgICBlbnRpdHkubmFtZUNoYW5nZWQuYWRkKHRoaXMuZW50aXR5TmFtZUNoYW5nZWQpO1xuICAgIF9yZWYgPSB0aGlzLmZhbWlsaWVzO1xuICAgIGZvciAoZWFjaCBpbiBfcmVmKSB7XG4gICAgICBmYW1pbHkgPSBfcmVmW2VhY2hdO1xuICAgICAgZmFtaWx5Lm5ld0VudGl0eShlbnRpdHkpO1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gICAqIFJlbW92ZSBhbiBlbnRpdHkgZnJvbSB0aGUgZW5naW5lLlxuICAgKlxuICAgKiBAcGFyYW0gZW50aXR5IFRoZSBlbnRpdHkgdG8gcmVtb3ZlLlxuICAgKi9cblxuICBFbmdpbmUucHJvdG90eXBlLnJlbW92ZUVudGl0eSA9IGZ1bmN0aW9uKGVudGl0eSkge1xuICAgIHZhciBlYWNoLCBmYW1pbHksIF9yZWY7XG4gICAgZW50aXR5LmNvbXBvbmVudEFkZGVkLnJlbW92ZSh0aGlzLmNvbXBvbmVudEFkZGVkKTtcbiAgICBlbnRpdHkuY29tcG9uZW50UmVtb3ZlZC5yZW1vdmUodGhpcy5jb21wb25lbnRSZW1vdmVkKTtcbiAgICBlbnRpdHkubmFtZUNoYW5nZWQucmVtb3ZlKHRoaXMuZW50aXR5TmFtZUNoYW5nZWQpO1xuICAgIF9yZWYgPSB0aGlzLmZhbWlsaWVzO1xuICAgIGZvciAoZWFjaCBpbiBfcmVmKSB7XG4gICAgICBmYW1pbHkgPSBfcmVmW2VhY2hdO1xuICAgICAgZmFtaWx5LnJlbW92ZUVudGl0eShlbnRpdHkpO1xuICAgIH1cbiAgICBkZWxldGUgdGhpcy5lbnRpdHlOYW1lc1tlbnRpdHkubmFtZV07XG4gICAgdGhpcy5lbnRpdHlMaXN0LnJlbW92ZShlbnRpdHkpO1xuICB9O1xuXG4gIEVuZ2luZS5wcm90b3R5cGUuZW50aXR5TmFtZUNoYW5nZWQgPSBmdW5jdGlvbihlbnRpdHksIG9sZE5hbWUpIHtcbiAgICBpZiAodGhpcy5lbnRpdHlOYW1lc1tvbGROYW1lXSA9PT0gZW50aXR5KSB7XG4gICAgICBkZWxldGUgdGhpcy5lbnRpdHlOYW1lc1tvbGROYW1lXTtcbiAgICAgIHRoaXMuZW50aXR5TmFtZXNbZW50aXR5Lm5hbWVdID0gZW50aXR5O1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gICAqIEdldCBhbiBlbnRpdHkgYmFzZWQgbiBpdHMgbmFtZS5cbiAgICpcbiAgICogQHBhcmFtIG5hbWUgVGhlIG5hbWUgb2YgdGhlIGVudGl0eVxuICAgKiBAcmV0dXJuIFRoZSBlbnRpdHksIG9yIG51bGwgaWYgbm8gZW50aXR5IHdpdGggdGhhdCBuYW1lIGV4aXN0cyBvbiB0aGUgZW5naW5lXG4gICAqL1xuXG4gIEVuZ2luZS5wcm90b3R5cGUuZ2V0RW50aXR5QnlOYW1lID0gZnVuY3Rpb24obmFtZSkge1xuICAgIHJldHVybiB0aGlzLmVudGl0eU5hbWVzW25hbWVdO1xuICB9O1xuXG5cbiAgLypcbiAgICogUmVtb3ZlIGFsbCBlbnRpdGllcyBmcm9tIHRoZSBlbmdpbmUuXG4gICAqL1xuXG4gIEVuZ2luZS5wcm90b3R5cGUucmVtb3ZlQWxsRW50aXRpZXMgPSBmdW5jdGlvbigpIHtcbiAgICB3aGlsZSAodGhpcy5lbnRpdHlMaXN0LmhlYWQgIT09IG51bGwpIHtcbiAgICAgIHRoaXMucmVtb3ZlRW50aXR5KHRoaXMuZW50aXR5TGlzdC5oZWFkKTtcbiAgICB9XG4gIH07XG5cblxuICAvKlxuICAgQHByaXZhdGVcbiAgICovXG5cbiAgRW5naW5lLnByb3RvdHlwZS5jb21wb25lbnRBZGRlZCA9IGZ1bmN0aW9uKGVudGl0eSwgY29tcG9uZW50Q2xhc3MpIHtcbiAgICB2YXIgZWFjaCwgZmFtaWx5LCBfcmVmO1xuICAgIF9yZWYgPSB0aGlzLmZhbWlsaWVzO1xuICAgIGZvciAoZWFjaCBpbiBfcmVmKSB7XG4gICAgICBmYW1pbHkgPSBfcmVmW2VhY2hdO1xuICAgICAgZmFtaWx5LmNvbXBvbmVudEFkZGVkVG9FbnRpdHkoZW50aXR5LCBjb21wb25lbnRDbGFzcyk7XG4gICAgfVxuICB9O1xuXG5cbiAgLypcbiAgIEBwcml2YXRlXG4gICAqL1xuXG4gIEVuZ2luZS5wcm90b3R5cGUuY29tcG9uZW50UmVtb3ZlZCA9IGZ1bmN0aW9uKGVudGl0eSwgY29tcG9uZW50Q2xhc3MpIHtcbiAgICB2YXIgZWFjaCwgZmFtaWx5LCBfcmVmO1xuICAgIF9yZWYgPSB0aGlzLmZhbWlsaWVzO1xuICAgIGZvciAoZWFjaCBpbiBfcmVmKSB7XG4gICAgICBmYW1pbHkgPSBfcmVmW2VhY2hdO1xuICAgICAgZmFtaWx5LmNvbXBvbmVudFJlbW92ZWRGcm9tRW50aXR5KGVudGl0eSwgY29tcG9uZW50Q2xhc3MpO1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gICAqIEdldCBhIGNvbGxlY3Rpb24gb2Ygbm9kZXMgZnJvbSB0aGUgZW5naW5lLCBiYXNlZCBvbiB0aGUgdHlwZSBvZiB0aGUgbm9kZSByZXF1aXJlZC5cbiAgICpcbiAgICogPHA+VGhlIGVuZ2luZSB3aWxsIGNyZWF0ZSB0aGUgYXBwcm9wcmlhdGUgTm9kZUxpc3QgaWYgaXQgZG9lc24ndCBhbHJlYWR5IGV4aXN0IGFuZFxuICAgKiB3aWxsIGtlZXAgaXRzIGNvbnRlbnRzIHVwIHRvIGRhdGUgYXMgZW50aXRpZXMgYXJlIGFkZGVkIHRvIGFuZCByZW1vdmVkIGZyb20gdGhlXG4gICAqIGVuZ2luZS48L3A+XG4gICAqXG4gICAqIDxwPklmIGEgTm9kZUxpc3QgaXMgbm8gbG9uZ2VyIHJlcXVpcmVkLCByZWxlYXNlIGl0IHdpdGggdGhlIHJlbGVhc2VOb2RlTGlzdCBtZXRob2QuPC9wPlxuICAgKlxuICAgKiBAcGFyYW0gbm9kZUNsYXNzIFRoZSB0eXBlIG9mIG5vZGUgcmVxdWlyZWQuXG4gICAqIEByZXR1cm4gQSBsaW5rZWQgbGlzdCBvZiBhbGwgbm9kZXMgb2YgdGhpcyB0eXBlIGZyb20gYWxsIGVudGl0aWVzIGluIHRoZSBlbmdpbmUuXG4gICAqL1xuXG4gIEVuZ2luZS5wcm90b3R5cGUuZ2V0Tm9kZUxpc3QgPSBmdW5jdGlvbihub2RlQ2xhc3MpIHtcbiAgICB2YXIgZW50aXR5LCBmYW1pbHk7XG4gICAgaWYgKG5vZGVDbGFzcy5uYW1lIGluIHRoaXMuZmFtaWxpZXMpIHtcbiAgICAgIHJldHVybiB0aGlzLmZhbWlsaWVzW25vZGVDbGFzcy5uYW1lXS5ub2RlTGlzdDtcbiAgICB9XG4gICAgZmFtaWx5ID0gbmV3IHRoaXMuZmFtaWx5Q2xhc3Mobm9kZUNsYXNzLCB0aGlzKTtcbiAgICB0aGlzLmZhbWlsaWVzW25vZGVDbGFzcy5uYW1lXSA9IGZhbWlseTtcbiAgICBlbnRpdHkgPSB0aGlzLmVudGl0eUxpc3QuaGVhZDtcbiAgICB3aGlsZSAoZW50aXR5KSB7XG4gICAgICBmYW1pbHkubmV3RW50aXR5KGVudGl0eSk7XG4gICAgICBlbnRpdHkgPSBlbnRpdHkubmV4dDtcbiAgICB9XG4gICAgcmV0dXJuIGZhbWlseS5ub2RlTGlzdDtcbiAgfTtcblxuXG4gIC8qXG4gICAqIElmIGEgTm9kZUxpc3QgaXMgbm8gbG9uZ2VyIHJlcXVpcmVkLCB0aGlzIG1ldGhvZCB3aWxsIHN0b3AgdGhlIGVuZ2luZSB1cGRhdGluZ1xuICAgKiB0aGUgbGlzdCBhbmQgd2lsbCByZWxlYXNlIGFsbCByZWZlcmVuY2VzIHRvIHRoZSBsaXN0IHdpdGhpbiB0aGUgZnJhbWV3b3JrXG4gICAqIGNsYXNzZXMsIGVuYWJsaW5nIGl0IHRvIGJlIGdhcmJhZ2UgY29sbGVjdGVkLlxuICAgKlxuICAgKiA8cD5JdCBpcyBub3QgZXNzZW50aWFsIHRvIHJlbGVhc2UgYSBsaXN0LCBidXQgcmVsZWFzaW5nIGl0IHdpbGwgZnJlZVxuICAgKiB1cCBtZW1vcnkgYW5kIHByb2Nlc3NvciByZXNvdXJjZXMuPC9wPlxuICAgKlxuICAgKiBAcGFyYW0gbm9kZUNsYXNzIFRoZSB0eXBlIG9mIHRoZSBub2RlIGNsYXNzIGlmIHRoZSBsaXN0IHRvIGJlIHJlbGVhc2VkLlxuICAgKi9cblxuICBFbmdpbmUucHJvdG90eXBlLnJlbGVhc2VOb2RlTGlzdCA9IGZ1bmN0aW9uKG5vZGVDbGFzcykge1xuICAgIGlmIChub2RlQ2xhc3MubmFtZSBpbiB0aGlzLmZhbWlsaWVzKSB7XG4gICAgICB0aGlzLmZhbWlsaWVzW25vZGVDbGFzcy5uYW1lXS5jbGVhblVwKCk7XG4gICAgICBkZWxldGUgdGhpcy5mYW1pbGllc1tub2RlQ2xhc3MubmFtZV07XG4gICAgfVxuICB9O1xuXG5cbiAgLypcbiAgICogQWRkIGEgc3lzdGVtIHRvIHRoZSBlbmdpbmUsIGFuZCBzZXQgaXRzIHByaW9yaXR5IGZvciB0aGUgb3JkZXIgaW4gd2hpY2ggdGhlXG4gICAqIHN5c3RlbXMgYXJlIHVwZGF0ZWQgYnkgdGhlIGVuZ2luZSB1cGRhdGUgbG9vcC5cbiAgICpcbiAgICogPHA+VGhlIHByaW9yaXR5IGRpY3RhdGVzIHRoZSBvcmRlciBpbiB3aGljaCB0aGUgc3lzdGVtcyBhcmUgdXBkYXRlZCBieSB0aGUgZW5naW5lIHVwZGF0ZVxuICAgKiBsb29wLiBMb3dlciBudW1iZXJzIGZvciBwcmlvcml0eSBhcmUgdXBkYXRlZCBmaXJzdC4gaS5lLiBhIHByaW9yaXR5IG9mIDEgaXNcbiAgICogdXBkYXRlZCBiZWZvcmUgYSBwcmlvcml0eSBvZiAyLjwvcD5cbiAgICpcbiAgICogQHBhcmFtIHN5c3RlbSBUaGUgc3lzdGVtIHRvIGFkZCB0byB0aGUgZW5naW5lLlxuICAgKiBAcGFyYW0gcHJpb3JpdHkgVGhlIHByaW9yaXR5IGZvciB1cGRhdGluZyB0aGUgc3lzdGVtcyBkdXJpbmcgdGhlIGVuZ2luZSBsb29wLiBBXG4gICAqIGxvd2VyIG51bWJlciBtZWFucyB0aGUgc3lzdGVtIGlzIHVwZGF0ZWQgc29vbmVyLlxuICAgKi9cblxuICBFbmdpbmUucHJvdG90eXBlLmFkZFN5c3RlbSA9IGZ1bmN0aW9uKHN5c3RlbSwgcHJpb3JpdHkpIHtcbiAgICBzeXN0ZW0ucHJpb3JpdHkgPSBwcmlvcml0eTtcbiAgICBzeXN0ZW0uYWRkVG9FbmdpbmUodGhpcyk7XG4gICAgdGhpcy5zeXN0ZW1MaXN0LmFkZChzeXN0ZW0pO1xuICB9O1xuXG5cbiAgLypcbiAgICogR2V0IHRoZSBzeXN0ZW0gaW5zdGFuY2Ugb2YgYSBwYXJ0aWN1bGFyIHR5cGUgZnJvbSB3aXRoaW4gdGhlIGVuZ2luZS5cbiAgICpcbiAgICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgb2Ygc3lzdGVtXG4gICAqIEByZXR1cm4gVGhlIGluc3RhbmNlIG9mIHRoZSBzeXN0ZW0gdHlwZSB0aGF0IGlzIGluIHRoZSBlbmdpbmUsIG9yXG4gICAqIG51bGwgaWYgbm8gc3lzdGVtcyBvZiB0aGlzIHR5cGUgYXJlIGluIHRoZSBlbmdpbmUuXG4gICAqL1xuXG4gIEVuZ2luZS5wcm90b3R5cGUuZ2V0U3lzdGVtID0gZnVuY3Rpb24odHlwZSkge1xuICAgIHJldHVybiBzeXN0ZW1MaXN0LmdldCh0eXBlKTtcbiAgfTtcblxuXG4gIC8qXG4gICAqIFJlbW92ZSBhIHN5c3RlbSBmcm9tIHRoZSBlbmdpbmUuXG4gICAqXG4gICAqIEBwYXJhbSBzeXN0ZW0gVGhlIHN5c3RlbSB0byByZW1vdmUgZnJvbSB0aGUgZW5naW5lLlxuICAgKi9cblxuICBFbmdpbmUucHJvdG90eXBlLnJlbW92ZVN5c3RlbSA9IGZ1bmN0aW9uKHN5c3RlbSkge1xuICAgIHRoaXMuc3lzdGVtTGlzdC5yZW1vdmUoc3lzdGVtKTtcbiAgICBzeXN0ZW0ucmVtb3ZlRnJvbUVuZ2luZSh0aGlzKTtcbiAgfTtcblxuXG4gIC8qXG4gICAqIFJlbW92ZSBhbGwgc3lzdGVtcyBmcm9tIHRoZSBlbmdpbmUuXG4gICAqL1xuXG4gIEVuZ2luZS5wcm90b3R5cGUucmVtb3ZlQWxsU3lzdGVtcyA9IGZ1bmN0aW9uKCkge1xuICAgIHdoaWxlICh0aGlzLnN5c3RlbUxpc3QuaGVhZCAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5yZW1vdmVTeXN0ZW0odGhpcy5zeXN0ZW1MaXN0LmhlYWQpO1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gICAqIFVwZGF0ZSB0aGUgZW5naW5lLiBUaGlzIGNhdXNlcyB0aGUgZW5naW5lIHVwZGF0ZSBsb29wIHRvIHJ1biwgY2FsbGluZyB1cGRhdGUgb24gYWxsIHRoZVxuICAgKiBzeXN0ZW1zIGluIHRoZSBlbmdpbmUuXG4gICAqXG4gICAqIDxwPlRoZSBwYWNrYWdlIGFzaC50aWNrIGNvbnRhaW5zIGNsYXNzZXMgdGhhdCBjYW4gYmUgdXNlZCB0byBwcm92aWRlXG4gICAqIGEgc3RlYWR5IG9yIHZhcmlhYmxlIHRpY2sgdGhhdCBjYWxscyB0aGlzIHVwZGF0ZSBtZXRob2QuPC9wPlxuICAgKlxuICAgKiBAdGltZSBUaGUgZHVyYXRpb24sIGluIHNlY29uZHMsIG9mIHRoaXMgdXBkYXRlIHN0ZXAuXG4gICAqL1xuXG4gIEVuZ2luZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24odGltZSkge1xuICAgIHZhciBzeXN0ZW07XG4gICAgdGhpcy51cGRhdGluZyA9IHRydWU7XG4gICAgc3lzdGVtID0gdGhpcy5zeXN0ZW1MaXN0LmhlYWQ7XG4gICAgd2hpbGUgKHN5c3RlbSkge1xuICAgICAgc3lzdGVtLnVwZGF0ZSh0aW1lKTtcbiAgICAgIHN5c3RlbSA9IHN5c3RlbS5uZXh0O1xuICAgIH1cbiAgICB0aGlzLnVwZGF0aW5nID0gZmFsc2U7XG4gICAgdGhpcy51cGRhdGVDb21wbGV0ZS5kaXNwYXRjaCgpO1xuICB9O1xuXG4gIHJldHVybiBFbmdpbmU7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWVuZ2luZS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBEaWN0aW9uYXJ5LCBTaWduYWwyLCBhc2g7XG5cbmFzaCA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5TaWduYWwyID0gYXNoLnNpZ25hbHMuU2lnbmFsMjtcblxuRGljdGlvbmFyeSA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gRGljdGlvbmFyeSgpIHt9XG5cbiAgcmV0dXJuIERpY3Rpb25hcnk7XG5cbn0pKCk7XG5cblxuLypcbiAqIEFuIGVudGl0eSBpcyBjb21wb3NlZCBmcm9tIGNvbXBvbmVudHMuIEFzIHN1Y2gsIGl0IGlzIGVzc2VudGlhbGx5IGEgY29sbGVjdGlvbiBvYmplY3QgZm9yIGNvbXBvbmVudHMuXG4gKiBTb21ldGltZXMsIHRoZSBlbnRpdGllcyBpbiBhIGdhbWUgd2lsbCBtaXJyb3IgdGhlIGFjdHVhbCBjaGFyYWN0ZXJzIGFuZCBvYmplY3RzIGluIHRoZSBnYW1lLCBidXQgdGhpc1xuICogaXMgbm90IG5lY2Vzc2FyeS5cbiAqXG4gKiA8cD5Db21wb25lbnRzIGFyZSBzaW1wbGUgdmFsdWUgb2JqZWN0cyB0aGF0IGNvbnRhaW4gZGF0YSByZWxldmFudCB0byB0aGUgZW50aXR5LiBFbnRpdGllc1xuICogd2l0aCBzaW1pbGFyIGZ1bmN0aW9uYWxpdHkgd2lsbCBoYXZlIGluc3RhbmNlcyBvZiB0aGUgc2FtZSBjb21wb25lbnRzLiBTbyB3ZSBtaWdodCBoYXZlXG4gKiBhIHBvc2l0aW9uIGNvbXBvbmVudDwvcD5cbiAqXG4gKiA8cD48Y29kZT5jbGFzcyBQb3NpdGlvbkNvbXBvbmVudFxuICoge1xuICogICBwdWJsaWMgdmFyIHg6RmxvYXQ7XG4gKiAgIHB1YmxpYyB2YXIgeTpGbG9hdDtcbiAqIH08L2NvZGU+PC9wPlxuICpcbiAqIDxwPkFsbCBlbnRpdGllcyB0aGF0IGhhdmUgYSBwb3NpdGlvbiBpbiB0aGUgZ2FtZSB3b3JsZCwgd2lsbCBoYXZlIGFuIGluc3RhbmNlIG9mIHRoZVxuICogcG9zaXRpb24gY29tcG9uZW50LiBTeXN0ZW1zIG9wZXJhdGUgb24gZW50aXRpZXMgYmFzZWQgb24gdGhlIGNvbXBvbmVudHMgdGhleSBoYXZlLjwvcD5cbiAqL1xuXG5hc2guY29yZS5FbnRpdHkgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBuYW1lQ291bnQ7XG5cbiAgbmFtZUNvdW50ID0gMDtcblxuXG4gIC8qXG4gICAqIE9wdGlvbmFsLCBnaXZlIHRoZSBlbnRpdHkgYSBuYW1lLiBUaGlzIGNhbiBoZWxwIHdpdGggZGVidWdnaW5nIGFuZCB3aXRoIHNlcmlhbGlzaW5nIHRoZSBlbnRpdHkuXG4gICAqL1xuXG4gIEVudGl0eS5wcm90b3R5cGUuX25hbWUgPSAnJztcblxuXG4gIC8qXG4gICAqIFRoaXMgc2lnbmFsIGlzIGRpc3BhdGNoZWQgd2hlbiBhIGNvbXBvbmVudCBpcyBhZGRlZCB0byB0aGUgZW50aXR5LlxuICAgKi9cblxuICBFbnRpdHkucHJvdG90eXBlLmNvbXBvbmVudEFkZGVkID0gbnVsbDtcblxuXG4gIC8qXG4gICAqIFRoaXMgc2lnbmFsIGlzIGRpc3BhdGNoZWQgd2hlbiBhIGNvbXBvbmVudCBpcyByZW1vdmVkIGZyb20gdGhlIGVudGl0eS5cbiAgICovXG5cbiAgRW50aXR5LnByb3RvdHlwZS5jb21wb25lbnRSZW1vdmVkID0gbnVsbDtcblxuXG4gIC8qXG4gICAqIERpc3BhdGNoZWQgd2hlbiB0aGUgbmFtZSBvZiB0aGUgZW50aXR5IGNoYW5nZXMuIFVzZWQgaW50ZXJuYWxseSBieSB0aGUgZW5naW5lIHRvIHRyYWNrIGVudGl0aWVzIGJhc2VkIG9uIHRoZWlyIG5hbWVzLlxuICAgKi9cblxuICBFbnRpdHkucHJvdG90eXBlLm5hbWVDaGFuZ2VkID0gbnVsbDtcblxuICBFbnRpdHkucHJvdG90eXBlLnByZXZpb3VzID0gbnVsbDtcblxuICBFbnRpdHkucHJvdG90eXBlLm5leHQgPSBudWxsO1xuXG4gIEVudGl0eS5wcm90b3R5cGUuY29tcG9uZW50cyA9IG51bGw7XG5cbiAgZnVuY3Rpb24gRW50aXR5KG5hbWUpIHtcbiAgICBpZiAobmFtZSA9PSBudWxsKSB7XG4gICAgICBuYW1lID0gJyc7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcblxuICAgICAgLypcbiAgICAgICAqIEFsbCBlbnRpdGllcyBoYXZlIGEgbmFtZS4gSWYgbm8gbmFtZSBpcyBzZXQsIGEgZGVmYXVsdCBuYW1lIGlzIHVzZWQuIE5hbWVzIGFyZSB1c2VkIHRvXG4gICAgICAgKiBmZXRjaCBzcGVjaWZpYyBlbnRpdGllcyBmcm9tIHRoZSBlbmdpbmUsIGFuZCBjYW4gYWxzbyBoZWxwIHRvIGlkZW50aWZ5IGFuIGVudGl0eSB3aGVuIGRlYnVnZ2luZy5cbiAgICAgICAqL1xuICAgICAgbmFtZToge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLl9uYW1lO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgdmFyIHByZXZpb3VzO1xuICAgICAgICAgIGlmICh0aGlzLl9uYW1lICE9PSB2YWx1ZSkge1xuICAgICAgICAgICAgcHJldmlvdXMgPSB0aGlzLl9uYW1lO1xuICAgICAgICAgICAgdGhpcy5fbmFtZSA9IHZhbHVlO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubmFtZUNoYW5nZWQuZGlzcGF0Y2godGhpcywgcHJldmlvdXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuY29tcG9uZW50QWRkZWQgPSBuZXcgU2lnbmFsMigpO1xuICAgIHRoaXMuY29tcG9uZW50UmVtb3ZlZCA9IG5ldyBTaWduYWwyKCk7XG4gICAgdGhpcy5uYW1lQ2hhbmdlZCA9IG5ldyBTaWduYWwyKCk7XG4gICAgdGhpcy5jb21wb25lbnRzID0gbmV3IERpY3Rpb25hcnkoKTtcbiAgICBpZiAobmFtZSAhPT0gJycpIHtcbiAgICAgIHRoaXMuX25hbWUgPSBuYW1lO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9uYW1lID0gXCJfZW50aXR5XCIgKyAoKytuYW1lQ291bnQpO1xuICAgIH1cbiAgfVxuXG5cbiAgLypcbiAgICogQWRkIGEgY29tcG9uZW50IHRvIHRoZSBlbnRpdHkuXG4gICAqXG4gICAqIEBwYXJhbSBjb21wb25lbnQgVGhlIGNvbXBvbmVudCBvYmplY3QgdG8gYWRkLlxuICAgKiBAcGFyYW0gY29tcG9uZW50Q2xhc3MgVGhlIGNsYXNzIG9mIHRoZSBjb21wb25lbnQuIFRoaXMgaXMgb25seSBuZWNlc3NhcnkgaWYgdGhlIGNvbXBvbmVudFxuICAgKiBleHRlbmRzIGFub3RoZXIgY29tcG9uZW50IGNsYXNzIGFuZCB5b3Ugd2FudCB0aGUgZnJhbWV3b3JrIHRvIHRyZWF0IHRoZSBjb21wb25lbnQgYXMgb2ZcbiAgICogdGhlIGJhc2UgY2xhc3MgdHlwZS4gSWYgbm90IHNldCwgdGhlIGNsYXNzIHR5cGUgaXMgZGV0ZXJtaW5lZCBkaXJlY3RseSBmcm9tIHRoZSBjb21wb25lbnQuXG4gICAqXG4gICAqIEByZXR1cm4gQSByZWZlcmVuY2UgdG8gdGhlIGVudGl0eS4gVGhpcyBlbmFibGVzIHRoZSBjaGFpbmluZyBvZiBjYWxscyB0byBhZGQsIHRvIG1ha2VcbiAgICogY3JlYXRpbmcgYW5kIGNvbmZpZ3VyaW5nIGVudGl0aWVzIGNsZWFuZXIuIGUuZy5cbiAgICpcbiAgICogPGNvZGU+dmFyIGVudGl0eTpFbnRpdHkgPSBuZXcgRW50aXR5KClcbiAgICogICAgIC5hZGQobmV3IFBvc2l0aW9uKDEwMCwgMjAwKVxuICAgKiAgICAgLmFkZChuZXcgRGlzcGxheShuZXcgUGxheWVyQ2xpcCgpKTs8L2NvZGU+XG4gICAqL1xuXG4gIEVudGl0eS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24oY29tcG9uZW50LCBjb21wb25lbnRDbGFzcykge1xuICAgIGlmIChjb21wb25lbnRDbGFzcyA9PSBudWxsKSB7XG4gICAgICBjb21wb25lbnRDbGFzcyA9IGNvbXBvbmVudC5jb25zdHJ1Y3RvcjtcbiAgICB9XG4gICAgaWYgKGNvbXBvbmVudENsYXNzLm5hbWUgaW4gdGhpcy5jb21wb25lbnRzKSB7XG4gICAgICB0aGlzLnJlbW92ZShjb21wb25lbnRDbGFzcyk7XG4gICAgfVxuICAgIHRoaXMuY29tcG9uZW50c1tjb21wb25lbnRDbGFzcy5uYW1lXSA9IGNvbXBvbmVudDtcbiAgICB0aGlzLmNvbXBvbmVudEFkZGVkLmRpc3BhdGNoKHRoaXMsIGNvbXBvbmVudENsYXNzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuXG4gIC8qXG4gICAqIFJlbW92ZSBhIGNvbXBvbmVudCBmcm9tIHRoZSBlbnRpdHkuXG4gICAqXG4gICAqIEBwYXJhbSBjb21wb25lbnRDbGFzcyBUaGUgY2xhc3Mgb2YgdGhlIGNvbXBvbmVudCB0byBiZSByZW1vdmVkLlxuICAgKiBAcmV0dXJuIHRoZSBjb21wb25lbnQsIG9yIG51bGwgaWYgdGhlIGNvbXBvbmVudCBkb2Vzbid0IGV4aXN0IGluIHRoZSBlbnRpdHlcbiAgICovXG5cbiAgRW50aXR5LnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbihjb21wb25lbnRDbGFzcykge1xuICAgIHZhciBjb21wb25lbnQsIG5hbWU7XG4gICAgbmFtZSA9IGNvbXBvbmVudENsYXNzLm5hbWUgIT0gbnVsbCA/IGNvbXBvbmVudENsYXNzLm5hbWUgOiBjb21wb25lbnRDbGFzcztcbiAgICBjb21wb25lbnQgPSB0aGlzLmNvbXBvbmVudHNbbmFtZV07XG4gICAgaWYgKGNvbXBvbmVudCkge1xuICAgICAgZGVsZXRlIHRoaXMuY29tcG9uZW50c1tuYW1lXTtcbiAgICAgIHRoaXMuY29tcG9uZW50UmVtb3ZlZC5kaXNwYXRjaCh0aGlzLCBuYW1lKTtcbiAgICAgIHJldHVybiBjb21wb25lbnQ7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9O1xuXG5cbiAgLypcbiAgICogR2V0IGEgY29tcG9uZW50IGZyb20gdGhlIGVudGl0eS5cbiAgICpcbiAgICogQHBhcmFtIGNvbXBvbmVudENsYXNzIFRoZSBjbGFzcyBvZiB0aGUgY29tcG9uZW50IHJlcXVlc3RlZC5cbiAgICogQHJldHVybiBUaGUgY29tcG9uZW50LCBvciBudWxsIGlmIG5vbmUgd2FzIGZvdW5kLlxuICAgKi9cblxuICBFbnRpdHkucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGNvbXBvbmVudENsYXNzKSB7XG4gICAgcmV0dXJuIHRoaXMuY29tcG9uZW50c1tjb21wb25lbnRDbGFzcy5uYW1lXTtcbiAgfTtcblxuXG4gIC8qXG4gICAqIEdldCBhbGwgY29tcG9uZW50cyBmcm9tIHRoZSBlbnRpdHkuXG4gICAqXG4gICAqIEByZXR1cm4gQW4gYXJyYXkgY29udGFpbmluZyBhbGwgdGhlIGNvbXBvbmVudHMgdGhhdCBhcmUgb24gdGhlIGVudGl0eS5cbiAgICovXG5cbiAgRW50aXR5LnByb3RvdHlwZS5nZXRBbGwgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgY29tcG9uZW50LCBjb21wb25lbnRBcnJheSwgX2ksIF9sZW4sIF9yZWY7XG4gICAgY29tcG9uZW50QXJyYXkgPSBbXTtcbiAgICBfcmVmID0gdGhpcy5jb21wb25lbnRzO1xuICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZi5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgY29tcG9uZW50ID0gX3JlZltfaV07XG4gICAgICBjb21wb25lbnRBcnJheS5wdXNoKGNvbXBvbmVudCk7XG4gICAgfVxuICAgIHJldHVybiBjb21wb25lbnRBcnJheTtcbiAgfTtcblxuXG4gIC8qXG4gICAqIERvZXMgdGhlIGVudGl0eSBoYXZlIGEgY29tcG9uZW50IG9mIGEgcGFydGljdWxhciB0eXBlLlxuICAgKlxuICAgKiBAcGFyYW0gY29tcG9uZW50Q2xhc3MgVGhlIGNsYXNzIG9mIHRoZSBjb21wb25lbnQgc291Z2h0LlxuICAgKiBAcmV0dXJuIHRydWUgaWYgdGhlIGVudGl0eSBoYXMgYSBjb21wb25lbnQgb2YgdGhlIHR5cGUsIGZhbHNlIGlmIG5vdC5cbiAgICovXG5cbiAgRW50aXR5LnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbihjb21wb25lbnRDbGFzcykge1xuICAgIHJldHVybiBjb21wb25lbnRDbGFzcy5uYW1lIGluIHRoaXMuY29tcG9uZW50cztcbiAgfTtcblxuICByZXR1cm4gRW50aXR5O1xuXG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1lbnRpdHkuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXNoO1xuXG5hc2ggPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuXG4vKlxuICogQW4gaW50ZXJuYWwgY2xhc3MgZm9yIGEgbGlua2VkIGxpc3Qgb2YgZW50aXRpZXMuIFVzZWQgaW5zaWRlIHRoZSBmcmFtZXdvcmsgZm9yXG4gKiBtYW5hZ2luZyB0aGUgZW50aXRpZXMuXG4gKi9cblxuYXNoLmNvcmUuRW50aXR5TGlzdCA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gRW50aXR5TGlzdCgpIHt9XG5cbiAgRW50aXR5TGlzdC5wcm90b3R5cGUuaGVhZCA9IG51bGw7XG5cbiAgRW50aXR5TGlzdC5wcm90b3R5cGUudGFpbCA9IG51bGw7XG5cbiAgRW50aXR5TGlzdC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24oZW50aXR5KSB7XG4gICAgaWYgKCF0aGlzLmhlYWQpIHtcbiAgICAgIHRoaXMuaGVhZCA9IHRoaXMudGFpbCA9IGVudGl0eTtcbiAgICAgIGVudGl0eS5uZXh0ID0gZW50aXR5LnByZXZpb3VzID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50YWlsLm5leHQgPSBlbnRpdHk7XG4gICAgICBlbnRpdHkucHJldmlvdXMgPSB0aGlzLnRhaWw7XG4gICAgICBlbnRpdHkubmV4dCA9IG51bGw7XG4gICAgICB0aGlzLnRhaWwgPSBlbnRpdHk7XG4gICAgfVxuICB9O1xuXG4gIEVudGl0eUxpc3QucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uKGVudGl0eSkge1xuICAgIGlmICh0aGlzLmhlYWQgPT09IGVudGl0eSkge1xuICAgICAgdGhpcy5oZWFkID0gdGhpcy5oZWFkLm5leHQ7XG4gICAgfVxuICAgIGlmICh0aGlzLnRhaWwgPT09IGVudGl0eSkge1xuICAgICAgdGhpcy50YWlsID0gdGhpcy50YWlsLnByZXZpb3VzO1xuICAgIH1cbiAgICBpZiAoZW50aXR5LnByZXZpb3VzKSB7XG4gICAgICBlbnRpdHkucHJldmlvdXMubmV4dCA9IGVudGl0eS5uZXh0O1xuICAgIH1cbiAgICBpZiAoZW50aXR5Lm5leHQpIHtcbiAgICAgIGVudGl0eS5uZXh0LnByZXZpb3VzID0gZW50aXR5LnByZXZpb3VzO1xuICAgIH1cbiAgfTtcblxuICBFbnRpdHlMaXN0LnByb3RvdHlwZS5yZW1vdmVBbGwgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZW50aXR5O1xuICAgIHdoaWxlICh0aGlzLmhlYWQpIHtcbiAgICAgIGVudGl0eSA9IHRoaXMuaGVhZDtcbiAgICAgIHRoaXMuaGVhZCA9IHRoaXMuaGVhZC5uZXh0O1xuICAgICAgZW50aXR5LnByZXZpb3VzID0gbnVsbDtcbiAgICAgIGVudGl0eS5uZXh0ID0gbnVsbDtcbiAgICB9XG4gICAgdGhpcy50YWlsID0gbnVsbDtcbiAgfTtcblxuICByZXR1cm4gRW50aXR5TGlzdDtcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZW50aXR5X2xpc3QuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXNoO1xuXG5hc2ggPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuXG4vKlxuICogVGhlIGludGVyZmFjZSBmb3IgY2xhc3NlcyB0aGF0IGFyZSB1c2VkIHRvIG1hbmFnZSBOb2RlTGlzdHMgKHNldCBhcyB0aGUgZmFtaWx5Q2xhc3MgcHJvcGVydHlcbiAqIGluIHRoZSBFbmdpbmUgb2JqZWN0KS4gTW9zdCBkZXZlbG9wZXJzIGRvbid0IG5lZWQgdG8gdXNlIHRoaXMgc2luY2UgdGhlIGRlZmF1bHQgaW1wbGVtZW50YXRpb25cbiAqIGlzIHVzZWQgYnkgZGVmYXVsdCBhbmQgc3VpdHMgbW9zdCBuZWVkcy5cbiAqL1xuXG5hc2guY29yZS5GYW1pbHkgPSAoZnVuY3Rpb24oKSB7XG4gIEZhbWlseS5wcm90b3R5cGUubm9kZXMgPSBudWxsO1xuXG5cbiAgLypcbiAgICogUmV0dXJucyB0aGUgTm9kZUxpc3QgbWFuYWdlZCBieSB0aGlzIGNsYXNzLiBUaGlzIHNob3VsZCBiZSBhIHJlZmVyZW5jZSB0aGF0IHJlbWFpbnMgdmFsaWQgYWx3YXlzXG4gICAqIHNpbmNlIGl0IGlzIHJldGFpbmVkIGFuZCByZXVzZWQgYnkgU3lzdGVtcyB0aGF0IHVzZSB0aGUgbGlzdC4gaS5lLiBuZXZlciByZWNyZWF0ZSB0aGUgbGlzdCxcbiAgICogYWx3YXlzIG1vZGlmeSBpdCBpbiBwbGFjZS5cbiAgICovXG5cbiAgZnVuY3Rpb24gRmFtaWx5KCkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcbiAgICAgIG5vZGVMaXN0OiB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMubm9kZXM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG5cbiAgLypcbiAgICogQW4gZW50aXR5IGhhcyBiZWVuIGFkZGVkIHRvIHRoZSBlbmdpbmUuIEl0IG1heSBhbHJlYWR5IGhhdmUgY29tcG9uZW50cyBzbyB0ZXN0IHRoZSBlbnRpdHlcbiAgICogZm9yIGluY2x1c2lvbiBpbiB0aGlzIGZhbWlseSdzIE5vZGVMaXN0LlxuICAgKi9cblxuICBGYW1pbHkucHJvdG90eXBlLm5ld0VudGl0eSA9IGZ1bmN0aW9uKGVudGl0eSkge1xuICAgIHRocm93IG5ldyBFcnJvcignTWV0aG9kIG11c3QgYmUgb3ZlcnJpZGVuJyk7XG4gIH07XG5cblxuICAvKlxuICAgKiBBbiBlbnRpdHkgaGFzIGJlZW4gcmVtb3ZlZCBmcm9tIHRoZSBlbmdpbmUuIElmIGl0J3MgaW4gdGhpcyBmYW1pbHkncyBOb2RlTGlzdCBpdCBzaG91bGQgYmUgcmVtb3ZlZC5cbiAgICovXG5cbiAgRmFtaWx5LnByb3RvdHlwZS5yZW1vdmVFbnRpdHkgPSBmdW5jdGlvbihlbnRpdHkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ01ldGhvZCBtdXN0IGJlIG92ZXJyaWRlbicpO1xuICB9O1xuXG5cbiAgLypcbiAgICogQSBjb21wb25lbnQgaGFzIGJlZW4gYWRkZWQgdG8gYW4gZW50aXR5LiBUZXN0IHdoZXRoZXIgdGhlIGVudGl0eSdzIGluY2x1c2lvbiBpbiB0aGlzIGZhbWlseSdzXG4gICAqIE5vZGVMaXN0IHNob3VsZCBiZSBtb2RpZmllZC5cbiAgICovXG5cbiAgRmFtaWx5LnByb3RvdHlwZS5jb21wb25lbnRBZGRlZFRvRW50aXR5ID0gZnVuY3Rpb24oZW50aXR5LCBjb21wb25lbnRDbGFzcykge1xuICAgIHRocm93IG5ldyBFcnJvcignTWV0aG9kIG11c3QgYmUgb3ZlcnJpZGVuJyk7XG4gIH07XG5cblxuICAvKlxuICAgKiBBIGNvbXBvbmVudCBoYXMgYmVlbiByZW1vdmVkIGZyb20gYW4gZW50aXR5LiBUZXN0IHdoZXRoZXIgdGhlIGVudGl0eSdzIGluY2x1c2lvbiBpbiB0aGlzIGZhbWlseSdzXG4gICAqIE5vZGVMaXN0IHNob3VsZCBiZSBtb2RpZmllZC5cbiAgICovXG5cbiAgRmFtaWx5LnByb3RvdHlwZS5jb21wb25lbnRSZW1vdmVkRnJvbUVudGl0eSA9IGZ1bmN0aW9uKGVudGl0eSwgY29tcG9uZW50Q2xhc3MpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ01ldGhvZCBtdXN0IGJlIG92ZXJyaWRlbicpO1xuICB9O1xuXG5cbiAgLypcbiAgICogVGhlIGZhbWlseSBpcyBhYm91dCB0byBiZSBkaXNjYXJkZWQuIENsZWFuIHVwIGFsbCBwcm9wZXJ0aWVzIGFzIG5lY2Vzc2FyeS4gVXN1YWxseSwgeW91IHdpbGxcbiAgICogd2FudCB0byBlbXB0eSB0aGUgTm9kZUxpc3QgYXQgdGhpcyB0aW1lLlxuICAgKi9cblxuICBGYW1pbHkucHJvdG90eXBlLmNsZWFuVXAgPSBmdW5jdGlvbigpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ01ldGhvZCBtdXN0IGJlIG92ZXJyaWRlbicpO1xuICB9O1xuXG4gIHJldHVybiBGYW1pbHk7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZhbWlseS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc2g7XG5cbmFzaCA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5hc2guY29yZS5Ob2RlID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBOb2RlKCkge31cblxuICBOb2RlLnByb3RvdHlwZS5lbnRpdHkgPSBudWxsO1xuXG4gIE5vZGUucHJvdG90eXBlLnByZXZpb3VzID0gbnVsbDtcblxuICBOb2RlLnByb3RvdHlwZS5uZXh0ID0gbnVsbDtcblxuICByZXR1cm4gTm9kZTtcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bm9kZS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBTaWduYWwxLCBhc2g7XG5cbmFzaCA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5TaWduYWwxID0gYXNoLnNpZ25hbHMuU2lnbmFsMTtcblxuXG4vKlxuICogQSBjb2xsZWN0aW9uIG9mIG5vZGVzLlxuICpcbiAqIDxwPlN5c3RlbXMgd2l0aGluIHRoZSBlbmdpbmUgYWNjZXNzIHRoZSBjb21wb25lbnRzIG9mIGVudGl0aWVzIHZpYSBOb2RlTGlzdHMuIEEgTm9kZUxpc3QgY29udGFpbnNcbiAqIGEgbm9kZSBmb3IgZWFjaCBFbnRpdHkgaW4gdGhlIGVuZ2luZSB0aGF0IGhhcyBhbGwgdGhlIGNvbXBvbmVudHMgcmVxdWlyZWQgYnkgdGhlIG5vZGUuIFRvIGl0ZXJhdGVcbiAqIG92ZXIgYSBOb2RlTGlzdCwgc3RhcnQgZnJvbSB0aGUgaGVhZCBhbmQgc3RlcCB0byB0aGUgbmV4dCBvbiBlYWNoIGxvb3AsIHVudGlsIHRoZSByZXR1cm5lZCB2YWx1ZVxuICogaXMgbnVsbC4gT3IganVzdCB1c2UgZm9yIGluIHN5bnRheC48L3A+XG4gKlxuICogPHA+Zm9yIChub2RlIGluIG5vZGVMaXN0KVxuICoge1xuICogICAvLyBkbyBzdHVmZlxuICogfTwvcD5cbiAqXG4gKiA8cD5JdCBpcyBzYWZlIHRvIHJlbW92ZSBpdGVtcyBmcm9tIGEgbm9kZWxpc3QgZHVyaW5nIHRoZSBsb29wLiBXaGVuIGEgTm9kZSBpcyByZW1vdmVkIGZvcm0gdGhlXG4gKiBOb2RlTGlzdCBpdCdzIHByZXZpb3VzIGFuZCBuZXh0IHByb3BlcnRpZXMgc3RpbGwgcG9pbnQgdG8gdGhlIG5vZGVzIHRoYXQgd2VyZSBiZWZvcmUgYW5kIGFmdGVyXG4gKiBpdCBpbiB0aGUgTm9kZUxpc3QganVzdCBiZWZvcmUgaXQgd2FzIHJlbW92ZWQuPC9wPlxuICovXG5cbmFzaC5jb3JlLk5vZGVMaXN0ID0gKGZ1bmN0aW9uKCkge1xuXG4gIC8qXG4gICAqIFRoZSBmaXJzdCBpdGVtIGluIHRoZSBub2RlIGxpc3QsIG9yIG51bGwgaWYgdGhlIGxpc3QgY29udGFpbnMgbm8gbm9kZXMuXG4gICAqL1xuICBOb2RlTGlzdC5wcm90b3R5cGUuaGVhZCA9IG51bGw7XG5cblxuICAvKlxuICAgKiBUaGUgbGFzdCBpdGVtIGluIHRoZSBub2RlIGxpc3QsIG9yIG51bGwgaWYgdGhlIGxpc3QgY29udGFpbnMgbm8gbm9kZXMuXG4gICAqL1xuXG4gIE5vZGVMaXN0LnByb3RvdHlwZS50YWlsID0gbnVsbDtcblxuXG4gIC8qXG4gICAqIEEgc2lnbmFsIHRoYXQgaXMgZGlzcGF0Y2hlZCB3aGVuZXZlciBhIG5vZGUgaXMgYWRkZWQgdG8gdGhlIG5vZGUgbGlzdC5cbiAgICpcbiAgICogPHA+VGhlIHNpZ25hbCB3aWxsIHBhc3MgYSBzaW5nbGUgcGFyYW1ldGVyIHRvIHRoZSBsaXN0ZW5lcnMgLSB0aGUgbm9kZSB0aGF0IHdhcyBhZGRlZC48L3A+XG4gICAqL1xuXG4gIE5vZGVMaXN0LnByb3RvdHlwZS5ub2RlQWRkZWQgPSBudWxsO1xuXG5cbiAgLypcbiAgICogQSBzaWduYWwgdGhhdCBpcyBkaXNwYXRjaGVkIHdoZW5ldmVyIGEgbm9kZSBpcyByZW1vdmVkIGZyb20gdGhlIG5vZGUgbGlzdC5cbiAgICpcbiAgICogPHA+VGhlIHNpZ25hbCB3aWxsIHBhc3MgYSBzaW5nbGUgcGFyYW1ldGVyIHRvIHRoZSBsaXN0ZW5lcnMgLSB0aGUgbm9kZSB0aGF0IHdhcyByZW1vdmVkLjwvcD5cbiAgICovXG5cbiAgTm9kZUxpc3QucHJvdG90eXBlLm5vZGVSZW1vdmVkID0gbnVsbDtcblxuICBmdW5jdGlvbiBOb2RlTGlzdCgpIHtcbiAgICB0aGlzLm5vZGVBZGRlZCA9IG5ldyBTaWduYWwxKCk7XG4gICAgdGhpcy5ub2RlUmVtb3ZlZCA9IG5ldyBTaWduYWwxKCk7XG4gIH1cblxuICBOb2RlTGlzdC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24obm9kZSkge1xuICAgIGlmICghdGhpcy5oZWFkKSB7XG4gICAgICB0aGlzLmhlYWQgPSB0aGlzLnRhaWwgPSBub2RlO1xuICAgICAgbm9kZS5uZXh0ID0gbm9kZS5wcmV2aW91cyA9IG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudGFpbC5uZXh0ID0gbm9kZTtcbiAgICAgIG5vZGUucHJldmlvdXMgPSB0aGlzLnRhaWw7XG4gICAgICBub2RlLm5leHQgPSBudWxsO1xuICAgICAgdGhpcy50YWlsID0gbm9kZTtcbiAgICB9XG4gICAgdGhpcy5ub2RlQWRkZWQuZGlzcGF0Y2gobm9kZSk7XG4gIH07XG5cbiAgTm9kZUxpc3QucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICBpZiAodGhpcy5oZWFkID09PSBub2RlKSB7XG4gICAgICB0aGlzLmhlYWQgPSB0aGlzLmhlYWQubmV4dDtcbiAgICB9XG4gICAgaWYgKHRoaXMudGFpbCA9PT0gbm9kZSkge1xuICAgICAgdGhpcy50YWlsID0gdGhpcy50YWlsLnByZXZpb3VzO1xuICAgIH1cbiAgICBpZiAobm9kZS5wcmV2aW91cykge1xuICAgICAgbm9kZS5wcmV2aW91cy5uZXh0ID0gbm9kZS5uZXh0O1xuICAgIH1cbiAgICBpZiAobm9kZS5uZXh0KSB7XG4gICAgICBub2RlLm5leHQucHJldmlvdXMgPSBub2RlLnByZXZpb3VzO1xuICAgIH1cbiAgICB0aGlzLm5vZGVSZW1vdmVkLmRpc3BhdGNoKG5vZGUpO1xuICB9O1xuXG4gIE5vZGVMaXN0LnByb3RvdHlwZS5yZW1vdmVBbGwgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbm9kZTtcbiAgICB3aGlsZSAodGhpcy5oZWFkKSB7XG4gICAgICBub2RlID0gdGhpcy5oZWFkO1xuICAgICAgdGhpcy5oZWFkID0gdGhpcy5oZWFkLm5leHQ7XG4gICAgICBub2RlLnByZXZpb3VzID0gbnVsbDtcbiAgICAgIG5vZGUubmV4dCA9IG51bGw7XG4gICAgICB0aGlzLm5vZGVSZW1vdmVkLmRpc3BhdGNoKG5vZGUpO1xuICAgIH1cbiAgICB0aGlzLnRhaWwgPSBudWxsO1xuICB9O1xuXG5cbiAgLypcbiAgICogdHJ1ZSBpZiB0aGUgbGlzdCBpcyBlbXB0eSwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKi9cblxuICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhOb2RlTGlzdC5wcm90b3R5cGUsIHtcbiAgICBlbXB0eToge1xuICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGVhZCA9PT0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG5cbiAgLypcbiAgICogU3dhcHMgdGhlIHBvc2l0aW9ucyBvZiB0d28gbm9kZXMgaW4gdGhlIGxpc3QuIFVzZWZ1bCB3aGVuIHNvcnRpbmcgYSBsaXN0LlxuICAgKi9cblxuICBOb2RlTGlzdC5wcm90b3R5cGUuc3dhcCA9IGZ1bmN0aW9uKG5vZGUxLCBub2RlMikge1xuICAgIHZhciB0ZW1wO1xuICAgIGlmIChub2RlMS5wcmV2aW91cyA9PT0gbm9kZTIpIHtcbiAgICAgIG5vZGUxLnByZXZpb3VzID0gbm9kZTIucHJldmlvdXM7XG4gICAgICBub2RlMi5wcmV2aW91cyA9IG5vZGUxO1xuICAgICAgbm9kZTIubmV4dCA9IG5vZGUxLm5leHQ7XG4gICAgICBub2RlMS5uZXh0ID0gbm9kZTI7XG4gICAgfSBlbHNlIGlmIChub2RlMi5wcmV2aW91cyA9PT0gbm9kZTEpIHtcbiAgICAgIG5vZGUyLnByZXZpb3VzID0gbm9kZTEucHJldmlvdXM7XG4gICAgICBub2RlMS5wcmV2aW91cyA9IG5vZGUyO1xuICAgICAgbm9kZTEubmV4dCA9IG5vZGUyLm5leHQ7XG4gICAgICBub2RlMi5uZXh0ID0gbm9kZTE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRlbXAgPSBub2RlMS5wcmV2aW91cztcbiAgICAgIG5vZGUxLnByZXZpb3VzID0gbm9kZTIucHJldmlvdXM7XG4gICAgICBub2RlMi5wcmV2aW91cyA9IHRlbXA7XG4gICAgICB0ZW1wID0gbm9kZTEubmV4dDtcbiAgICAgIG5vZGUxLm5leHQgPSBub2RlMi5uZXh0O1xuICAgICAgbm9kZTIubmV4dCA9IHRlbXA7XG4gICAgfVxuICAgIGlmICh0aGlzLmhlYWQgPT09IG5vZGUxKSB7XG4gICAgICB0aGlzLmhlYWQgPSBub2RlMjtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaGVhZCA9PT0gbm9kZTIpIHtcbiAgICAgIHRoaXMuaGVhZCA9IG5vZGUxO1xuICAgIH1cbiAgICBpZiAodGhpcy50YWlsID09PSBub2RlMSkge1xuICAgICAgdGhpcy50YWlsID0gbm9kZTI7XG4gICAgfSBlbHNlIGlmICh0aGlzLnRhaWwgPT09IG5vZGUyKSB7XG4gICAgICB0aGlzLnRhaWwgPSBub2RlMTtcbiAgICB9XG4gICAgaWYgKG5vZGUxLnByZXZpb3VzICE9PSBudWxsKSB7XG4gICAgICBub2RlMS5wcmV2aW91cy5uZXh0ID0gbm9kZTE7XG4gICAgfVxuICAgIGlmIChub2RlMi5wcmV2aW91cyAhPT0gbnVsbCkge1xuICAgICAgbm9kZTIucHJldmlvdXMubmV4dCA9IG5vZGUyO1xuICAgIH1cbiAgICBpZiAobm9kZTEubmV4dCAhPT0gbnVsbCkge1xuICAgICAgbm9kZTEubmV4dC5wcmV2aW91cyA9IG5vZGUxO1xuICAgIH1cbiAgICBpZiAobm9kZTIubmV4dCAhPT0gbnVsbCkge1xuICAgICAgbm9kZTIubmV4dC5wcmV2aW91cyA9IG5vZGUyO1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gICAqIFBlcmZvcm1zIGFuIGluc2VydGlvbiBzb3J0IG9uIHRoZSBub2RlIGxpc3QuIEluIGdlbmVyYWwsIGluc2VydGlvbiBzb3J0IGlzIHZlcnkgZWZmaWNpZW50IHdpdGggc2hvcnQgbGlzdHNcbiAgICogYW5kIHdpdGggbGlzdHMgdGhhdCBhcmUgbW9zdGx5IHNvcnRlZCwgYnV0IGlzIGluZWZmaWNpZW50IHdpdGggbGFyZ2UgbGlzdHMgdGhhdCBhcmUgcmFuZG9tbHkgb3JkZXJlZC5cbiAgICpcbiAgICogPHA+VGhlIHNvcnQgZnVuY3Rpb24gdGFrZXMgdHdvIG5vZGVzIGFuZCByZXR1cm5zIGFuIEludC48L3A+XG4gICAqXG4gICAqIDxwPjxjb2RlPmZ1bmN0aW9uIHNvcnRGdW5jdGlvbiggbm9kZTEgOiBNb2NrTm9kZSwgbm9kZTIgOiBNb2NrTm9kZSApIDogSW50PC9jb2RlPjwvcD5cbiAgICpcbiAgICogPHA+SWYgdGhlIHJldHVybmVkIG51bWJlciBpcyBsZXNzIHRoYW4gemVybywgdGhlIGZpcnN0IG5vZGUgc2hvdWxkIGJlIGJlZm9yZSB0aGUgc2Vjb25kLiBJZiBpdCBpcyBncmVhdGVyXG4gICAqIHRoYW4gemVybyB0aGUgc2Vjb25kIG5vZGUgc2hvdWxkIGJlIGJlZm9yZSB0aGUgZmlyc3QuIElmIGl0IGlzIHplcm8gdGhlIG9yZGVyIG9mIHRoZSBub2RlcyBkb2Vzbid0IG1hdHRlclxuICAgKiBhbmQgdGhlIG9yaWdpbmFsIG9yZGVyIHdpbGwgYmUgcmV0YWluZWQuPC9wPlxuICAgKlxuICAgKiA8cD5UaGlzIGluc2VydGlvbiBzb3J0IGltcGxlbWVudGF0aW9uIHJ1bnMgaW4gcGxhY2Ugc28gbm8gb2JqZWN0cyBhcmUgY3JlYXRlZCBkdXJpbmcgdGhlIHNvcnQuPC9wPlxuICAgKi9cblxuICBOb2RlTGlzdC5wcm90b3R5cGUuaW5zZXJ0aW9uU29ydCA9IGZ1bmN0aW9uKHNvcnRGdW5jdGlvbikge1xuICAgIHZhciBub2RlLCBvdGhlciwgcmVtYWlucztcbiAgICBpZiAodGhpcy5oZWFkID09PSB0aGlzLnRhaWwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmVtYWlucyA9IHRoaXMuaGVhZC5uZXh0O1xuICAgIG5vZGUgPSByZW1haW5zO1xuICAgIHdoaWxlIChub2RlICE9PSBudWxsKSB7XG4gICAgICByZW1haW5zID0gbm9kZS5uZXh0O1xuICAgICAgb3RoZXIgPSBub2RlLnByZXZpb3VzO1xuICAgICAgd2hpbGUgKG90aGVyICE9PSBudWxsKSB7XG4gICAgICAgIGlmIChzb3J0RnVuY3Rpb24obm9kZSwgb3RoZXIpID49IDApIHtcbiAgICAgICAgICBpZiAobm9kZSAhPT0gb3RoZXIubmV4dCkge1xuICAgICAgICAgICAgaWYgKHRoaXMudGFpbCA9PT0gbm9kZSkge1xuICAgICAgICAgICAgICB0aGlzLnRhaWwgPSBub2RlLnByZXZpb3VzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbm9kZS5wcmV2aW91cy5uZXh0ID0gbm9kZS5uZXh0O1xuICAgICAgICAgICAgaWYgKG5vZGUubmV4dCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICBub2RlLm5leHQucHJldmlvdXMgPSBub2RlLnByZXZpb3VzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbm9kZS5uZXh0ID0gb3RoZXIubmV4dDtcbiAgICAgICAgICAgIG5vZGUucHJldmlvdXMgPSBvdGhlcjtcbiAgICAgICAgICAgIG5vZGUubmV4dC5wcmV2aW91cyA9IG5vZGU7XG4gICAgICAgICAgICBvdGhlci5uZXh0ID0gbm9kZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgb3RoZXIgPSBvdGhlci5wcmV2aW91cztcbiAgICAgIH1cbiAgICAgIGlmIChvdGhlciA9PT0gbnVsbCkge1xuICAgICAgICBpZiAodGhpcy50YWlsID09PSBub2RlKSB7XG4gICAgICAgICAgdGhpcy50YWlsID0gbm9kZS5wcmV2aW91cztcbiAgICAgICAgfVxuICAgICAgICBub2RlLnByZXZpb3VzLm5leHQgPSBub2RlLm5leHQ7XG4gICAgICAgIGlmIChub2RlLm5leHQgIT09IG51bGwpIHtcbiAgICAgICAgICBub2RlLm5leHQucHJldmlvdXMgPSBub2RlLnByZXZpb3VzO1xuICAgICAgICB9XG4gICAgICAgIG5vZGUubmV4dCA9IHRoaXMuaGVhZDtcbiAgICAgICAgdGhpcy5oZWFkLnByZXZpb3VzID0gbm9kZTtcbiAgICAgICAgbm9kZS5wcmV2aW91cyA9IG51bGw7XG4gICAgICAgIHRoaXMuaGVhZCA9IG5vZGU7XG4gICAgICB9XG4gICAgICBub2RlID0gcmVtYWlucztcbiAgICB9XG4gIH07XG5cblxuICAvKlxuICAgKiBQZXJmb3JtcyBhIG1lcmdlIHNvcnQgb24gdGhlIG5vZGUgbGlzdC4gSW4gZ2VuZXJhbCwgbWVyZ2Ugc29ydCBpcyBtb3JlIGVmZmljaWVudCB0aGFuIGluc2VydGlvbiBzb3J0XG4gICAqIHdpdGggbG9uZyBsaXN0cyB0aGF0IGFyZSB2ZXJ5IHVuc29ydGVkLlxuICAgKlxuICAgKiA8cD5UaGUgc29ydCBmdW5jdGlvbiB0YWtlcyB0d28gbm9kZXMgYW5kIHJldHVybnMgYW4gSW50LjwvcD5cbiAgICpcbiAgICogPHA+PGNvZGU+ZnVuY3Rpb24gc29ydEZ1bmN0aW9uKCBub2RlMSA6IE1vY2tOb2RlLCBub2RlMiA6IE1vY2tOb2RlICkgOiBJbnQ8L2NvZGU+PC9wPlxuICAgKlxuICAgKiA8cD5JZiB0aGUgcmV0dXJuZWQgbnVtYmVyIGlzIGxlc3MgdGhhbiB6ZXJvLCB0aGUgZmlyc3Qgbm9kZSBzaG91bGQgYmUgYmVmb3JlIHRoZSBzZWNvbmQuIElmIGl0IGlzIGdyZWF0ZXJcbiAgICogdGhhbiB6ZXJvIHRoZSBzZWNvbmQgbm9kZSBzaG91bGQgYmUgYmVmb3JlIHRoZSBmaXJzdC4gSWYgaXQgaXMgemVybyB0aGUgb3JkZXIgb2YgdGhlIG5vZGVzIGRvZXNuJ3QgbWF0dGVyLjwvcD5cbiAgICpcbiAgICogPHA+VGhpcyBtZXJnZSBzb3J0IGltcGxlbWVudGF0aW9uIGNyZWF0ZXMgYW5kIHVzZXMgYSBzaW5nbGUgVmVjdG9yIGR1cmluZyB0aGUgc29ydCBvcGVyYXRpb24uPC9wPlxuICAgKi9cblxuICBOb2RlTGlzdC5wcm90b3R5cGUubWVyZ2VTb3J0ID0gZnVuY3Rpb24oc29ydEZ1bmN0aW9uKSB7XG4gICAgdmFyIGVuZCwgbGlzdHMsIG5leHQsIHN0YXJ0O1xuICAgIGlmICh0aGlzLmhlYWQgPT09IHRoaXMudGFpbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsaXN0cyA9IFtdO1xuICAgIHN0YXJ0ID0gdGhpcy5oZWFkO1xuICAgIHdoaWxlIChzdGFydCAhPT0gbnVsbCkge1xuICAgICAgZW5kID0gc3RhcnQ7XG4gICAgICB3aGlsZSAoZW5kLm5leHQgIT09IG51bGwgJiYgc29ydEZ1bmN0aW9uKGVuZCwgZW5kLm5leHQpIDw9IDApIHtcbiAgICAgICAgZW5kID0gZW5kLm5leHQ7XG4gICAgICB9XG4gICAgICBuZXh0ID0gZW5kLm5leHQ7XG4gICAgICBzdGFydC5wcmV2aW91cyA9IGVuZC5uZXh0ID0gbnVsbDtcbiAgICAgIGxpc3RzLnB1c2goc3RhcnQpO1xuICAgICAgc3RhcnQgPSBuZXh0O1xuICAgIH1cbiAgICB3aGlsZSAobGlzdHMubGVuZ3RoID4gMSkge1xuICAgICAgbGlzdHMucHVzaCh0aGlzLm1lcmdlKGxpc3RzLnNoaWZ0KCksIGxpc3RzLnNoaWZ0KCksIHNvcnRGdW5jdGlvbikpO1xuICAgIH1cbiAgICB0aGlzLnRhaWwgPSB0aGlzLmhlYWQgPSBsaXN0c1swXTtcbiAgICB3aGlsZSAodGhpcy50YWlsLm5leHQgIT09IG51bGwpIHtcbiAgICAgIHRoaXMudGFpbCA9IHRoaXMudGFpbC5uZXh0O1xuICAgIH1cbiAgfTtcblxuICBOb2RlTGlzdC5wcm90b3R5cGUubWVyZ2UgPSBmdW5jdGlvbihoZWFkMSwgaGVhZDIsIHNvcnRGdW5jdGlvbikge1xuICAgIHZhciBoZWFkLCBub2RlO1xuICAgIGlmIChzb3J0RnVuY3Rpb24oaGVhZDEsIGhlYWQyKSA8PSAwKSB7XG4gICAgICBoZWFkID0gbm9kZSA9IGhlYWQxO1xuICAgICAgaGVhZDEgPSBoZWFkMS5uZXh0O1xuICAgIH0gZWxzZSB7XG4gICAgICBoZWFkID0gbm9kZSA9IGhlYWQyO1xuICAgICAgaGVhZDIgPSBoZWFkMi5uZXh0O1xuICAgIH1cbiAgICB3aGlsZSAoaGVhZDEgIT09IG51bGwgJiYgaGVhZDIgIT09IG51bGwpIHtcbiAgICAgIGlmIChzb3J0RnVuY3Rpb24oaGVhZDEsIGhlYWQyKSA8PSAwKSB7XG4gICAgICAgIG5vZGUubmV4dCA9IGhlYWQxO1xuICAgICAgICBoZWFkMS5wcmV2aW91cyA9IG5vZGU7XG4gICAgICAgIG5vZGUgPSBoZWFkMTtcbiAgICAgICAgaGVhZDEgPSBoZWFkMS5uZXh0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbm9kZS5uZXh0ID0gaGVhZDI7XG4gICAgICAgIGhlYWQyLnByZXZpb3VzID0gbm9kZTtcbiAgICAgICAgbm9kZSA9IGhlYWQyO1xuICAgICAgICBoZWFkMiA9IGhlYWQyLm5leHQ7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChoZWFkMSAhPT0gbnVsbCkge1xuICAgICAgbm9kZS5uZXh0ID0gaGVhZDE7XG4gICAgICBoZWFkMS5wcmV2aW91cyA9IG5vZGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5vZGUubmV4dCA9IGhlYWQyO1xuICAgICAgaGVhZDIucHJldmlvdXMgPSBub2RlO1xuICAgIH1cbiAgICByZXR1cm4gaGVhZDtcbiAgfTtcblxuICByZXR1cm4gTm9kZUxpc3Q7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW5vZGVfbGlzdC5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc2g7XG5cbmFzaCA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5cbi8qXG4gKiBUaGlzIGludGVybmFsIGNsYXNzIG1haW50YWlucyBhIHBvb2wgb2YgZGVsZXRlZCBub2RlcyBmb3IgcmV1c2UgYnkgdGhlIGZyYW1ld29yay4gVGhpcyByZWR1Y2VzIHRoZSBvdmVyaGVhZFxuICogZnJvbSBvYmplY3QgY3JlYXRpb24gYW5kIGdhcmJhZ2UgY29sbGVjdGlvbi5cbiAqXG4gKiBCZWNhdXNlIG5vZGVzIG1heSBiZSBkZWxldGVkIGZyb20gYSBOb2RlTGlzdCB3aGlsZSBpbiB1c2UsIGJ5IGRlbGV0aW5nIE5vZGVzIGZyb20gYSBOb2RlTGlzdFxuICogd2hpbGUgaXRlcmF0aW5nIHRocm91Z2ggdGhlIE5vZGVMaXN0LCB0aGUgcG9vbCBhbHNvIG1haW50YWlucyBhIGNhY2hlIG9mIG5vZGVzIHRoYXQgYXJlIGFkZGVkIHRvIHRoZSBwb29sXG4gKiBidXQgc2hvdWxkIG5vdCBiZSByZXVzZWQgeWV0LiBUaGV5IGFyZSB0aGVuIHJlbGVhc2VkIGludG8gdGhlIHBvb2wgYnkgY2FsbGluZyB0aGUgcmVsZWFzZUNhY2hlIG1ldGhvZC5cbiAqL1xuXG5hc2guY29yZS5Ob2RlUG9vbCA9IChmdW5jdGlvbigpIHtcbiAgTm9kZVBvb2wucHJvdG90eXBlLnRhaWwgPSBudWxsO1xuXG4gIE5vZGVQb29sLnByb3RvdHlwZS5ub2RlQ2xhc3MgPSBudWxsO1xuXG4gIE5vZGVQb29sLnByb3RvdHlwZS5jYWNoZVRhaWwgPSBudWxsO1xuXG4gIE5vZGVQb29sLnByb3RvdHlwZS5jb21wb25lbnRzID0gbnVsbDtcblxuXG4gIC8qXG4gICAqIENyZWF0ZXMgYSBwb29sIGZvciB0aGUgZ2l2ZW4gbm9kZSBjbGFzcy5cbiAgICovXG5cbiAgZnVuY3Rpb24gTm9kZVBvb2wobm9kZUNsYXNzLCBjb21wb25lbnRzKSB7XG4gICAgdGhpcy5ub2RlQ2xhc3MgPSBub2RlQ2xhc3M7XG4gICAgdGhpcy5jb21wb25lbnRzID0gY29tcG9uZW50cztcbiAgfVxuXG5cbiAgLypcbiAgICogRmV0Y2hlcyBhIG5vZGUgZnJvbSB0aGUgcG9vbC5cbiAgICovXG5cbiAgTm9kZVBvb2wucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBub2RlO1xuICAgIGlmICh0aGlzLnRhaWwpIHtcbiAgICAgIG5vZGUgPSB0aGlzLnRhaWw7XG4gICAgICB0aGlzLnRhaWwgPSB0aGlzLnRhaWwucHJldmlvdXM7XG4gICAgICBub2RlLnByZXZpb3VzID0gbnVsbDtcbiAgICAgIHJldHVybiBub2RlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbmV3IHRoaXMubm9kZUNsYXNzKCk7XG4gICAgfVxuICB9O1xuXG5cbiAgLypcbiAgICogQWRkcyBhIG5vZGUgdG8gdGhlIHBvb2wuXG4gICAqL1xuXG4gIE5vZGVQb29sLnByb3RvdHlwZS5kaXNwb3NlID0gZnVuY3Rpb24obm9kZSkge1xuICAgIHZhciBjb21wb25lbnROYW1lO1xuICAgIGZvciAoY29tcG9uZW50TmFtZSBpbiB0aGlzLmNvbXBvbmVudHMpIHtcbiAgICAgIG5vZGVbY29tcG9uZW50TmFtZV0gPSBudWxsO1xuICAgIH1cbiAgICBub2RlLmVudGl0eSA9IG51bGw7XG4gICAgbm9kZS5uZXh0ID0gbnVsbDtcbiAgICBub2RlLnByZXZpb3VzID0gdGhpcy50YWlsO1xuICAgIHRoaXMudGFpbCA9IG5vZGU7XG4gIH07XG5cblxuICAvKlxuICAgKiBBZGRzIGEgbm9kZSB0byB0aGUgY2FjaGVcbiAgICovXG5cbiAgTm9kZVBvb2wucHJvdG90eXBlLmNhY2hlID0gZnVuY3Rpb24obm9kZSkge1xuICAgIG5vZGUucHJldmlvdXMgPSB0aGlzLmNhY2hlVGFpbDtcbiAgICB0aGlzLmNhY2hlVGFpbCA9IG5vZGU7XG4gIH07XG5cblxuICAvKlxuICAgKiBSZWxlYXNlcyBhbGwgbm9kZXMgZnJvbSB0aGUgY2FjaGUgaW50byB0aGUgcG9vbFxuICAgKi9cblxuICBOb2RlUG9vbC5wcm90b3R5cGUucmVsZWFzZUNhY2hlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG5vZGU7XG4gICAgd2hpbGUgKHRoaXMuY2FjaGVUYWlsKSB7XG4gICAgICBub2RlID0gdGhpcy5jYWNoZVRhaWw7XG4gICAgICB0aGlzLmNhY2hlVGFpbCA9IG5vZGUucHJldmlvdXM7XG4gICAgICB0aGlzLmRpc3Bvc2Uobm9kZSk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBOb2RlUG9vbDtcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bm9kZV9wb29sLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzaCxcbiAgX19iaW5kID0gZnVuY3Rpb24oZm4sIG1lKXsgcmV0dXJuIGZ1bmN0aW9uKCl7IHJldHVybiBmbi5hcHBseShtZSwgYXJndW1lbnRzKTsgfTsgfTtcblxuYXNoID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cblxuLypcbiAqIFRoZSBiYXNlIGNsYXNzIGZvciBhIHN5c3RlbS5cbiAqXG4gKiA8cD5BIHN5c3RlbSBpcyBwYXJ0IG9mIHRoZSBjb3JlIGZ1bmN0aW9uYWxpdHkgb2YgdGhlIGdhbWUuIEFmdGVyIGEgc3lzdGVtIGlzIGFkZGVkIHRvIHRoZSBlbmdpbmUsIGl0c1xuICogdXBkYXRlIG1ldGhvZCB3aWxsIGJlIGNhbGxlZCBvbiBldmVyeSBmcmFtZSBvZiB0aGUgZW5naW5lLiBXaGVuIHRoZSBzeXN0ZW0gaXMgcmVtb3ZlZCBmcm9tIHRoZSBlbmdpbmUsXG4gKiB0aGUgdXBkYXRlIG1ldGhvZCBpcyBubyBsb25nZXIgY2FsbGVkLjwvcD5cbiAqXG4gKiA8cD5UaGUgYWdncmVnYXRlIG9mIGFsbCBzeXN0ZW1zIGluIHRoZSBlbmdpbmUgaXMgdGhlIGZ1bmN0aW9uYWxpdHkgb2YgdGhlIGdhbWUsIHdpdGggdGhlIHVwZGF0ZVxuICogbWV0aG9kcyBvZiB0aG9zZSBzeXN0ZW1zIGNvbGxlY3RpdmVseSBjb25zdGl0dXRpbmcgdGhlIGVuZ2luZSB1cGRhdGUgbG9vcC4gU3lzdGVtcyBnZW5lcmFsbHkgb3BlcmF0ZSBvblxuICogbm9kZSBsaXN0cyAtIGNvbGxlY3Rpb25zIG9mIG5vZGVzLiBFYWNoIG5vZGUgY29udGFpbnMgdGhlIGNvbXBvbmVudHMgZnJvbSBhbiBlbnRpdHkgaW4gdGhlIGVuZ2luZVxuICogdGhhdCBtYXRjaCB0aGUgbm9kZS48L3A+XG4gKi9cblxuYXNoLmNvcmUuU3lzdGVtID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBTeXN0ZW0oKSB7XG4gICAgdGhpcy51cGRhdGUgPSBfX2JpbmQodGhpcy51cGRhdGUsIHRoaXMpO1xuICB9XG5cblxuICAvKlxuICAgICogVXNlZCBpbnRlcm5hbGx5IHRvIG1hbmFnZSB0aGUgbGlzdCBvZiBzeXN0ZW1zIHdpdGhpbiB0aGUgZW5naW5lLiBUaGUgcHJldmlvdXMgc3lzdGVtIGluIHRoZSBsaXN0LlxuICAgKi9cblxuICBTeXN0ZW0ucHJvdG90eXBlLnByZXZpb3VzID0gbnVsbDtcblxuXG4gIC8qXG4gICAqIFVzZWQgaW50ZXJuYWxseSB0byBtYW5hZ2UgdGhlIGxpc3Qgb2Ygc3lzdGVtcyB3aXRoaW4gdGhlIGVuZ2luZS4gVGhlIG5leHQgc3lzdGVtIGluIHRoZSBsaXN0LlxuICAgKi9cblxuICBTeXN0ZW0ucHJvdG90eXBlLm5leHQgPSBudWxsO1xuXG5cbiAgLypcbiAgICogVXNlZCBpbnRlcm5hbGx5IHRvIGhvbGQgdGhlIHByaW9yaXR5IG9mIHRoaXMgc3lzdGVtIHdpdGhpbiB0aGUgc3lzdGVtIGxpc3QuIFRoaXMgaXNcbiAgICogdXNlZCB0byBvcmRlciB0aGUgc3lzdGVtcyBzbyB0aGV5IGFyZSB1cGRhdGVkIGluIHRoZSBjb3JyZWN0IG9yZGVyLlxuICAgKi9cblxuICBTeXN0ZW0ucHJvdG90eXBlLnByaW9yaXR5ID0gMDtcblxuXG4gIC8qXG4gICAqIENhbGxlZCBqdXN0IGFmdGVyIHRoZSBzeXN0ZW0gaXMgYWRkZWQgdG8gdGhlIGVuZ2luZSwgYmVmb3JlIGFueSBjYWxscyB0byB0aGUgdXBkYXRlIG1ldGhvZC5cbiAgICogT3ZlcnJpZGUgdGhpcyBtZXRob2QgdG8gYWRkIHlvdXIgb3duIGZ1bmN0aW9uYWxpdHkuXG4gICAqXG4gICAqIEBwYXJhbSBlbmdpbmUgVGhlIGVuZ2luZSB0aGUgc3lzdGVtIHdhcyBhZGRlZCB0by5cbiAgICovXG5cbiAgU3lzdGVtLnByb3RvdHlwZS5hZGRUb0VuZ2luZSA9IGZ1bmN0aW9uKGVuZ2luZSkge307XG5cblxuICAvKlxuICAgKiBDYWxsZWQganVzdCBhZnRlciB0aGUgc3lzdGVtIGlzIHJlbW92ZWQgZnJvbSB0aGUgZW5naW5lLCBhZnRlciBhbGwgY2FsbHMgdG8gdGhlIHVwZGF0ZSBtZXRob2QuXG4gICAqIE92ZXJyaWRlIHRoaXMgbWV0aG9kIHRvIGFkZCB5b3VyIG93biBmdW5jdGlvbmFsaXR5LlxuICAgKlxuICAgKiBAcGFyYW0gZW5naW5lIFRoZSBlbmdpbmUgdGhlIHN5c3RlbSB3YXMgcmVtb3ZlZCBmcm9tLlxuICAgKi9cblxuICBTeXN0ZW0ucHJvdG90eXBlLnJlbW92ZUZyb21FbmdpbmUgPSBmdW5jdGlvbihlbmdpbmUpIHt9O1xuXG5cbiAgLypcbiAgICogQWZ0ZXIgdGhlIHN5c3RlbSBpcyBhZGRlZCB0byB0aGUgZW5naW5lLCB0aGlzIG1ldGhvZCBpcyBjYWxsZWQgZXZlcnkgZnJhbWUgdW50aWwgdGhlIHN5c3RlbVxuICAgKiBpcyByZW1vdmVkIGZyb20gdGhlIGVuZ2luZS4gT3ZlcnJpZGUgdGhpcyBtZXRob2QgdG8gYWRkIHlvdXIgb3duIGZ1bmN0aW9uYWxpdHkuXG4gICAqXG4gICAqIDxwPklmIHlvdSBuZWVkIHRvIHBlcmZvcm0gYW4gYWN0aW9uIG91dHNpZGUgb2YgdGhlIHVwZGF0ZSBsb29wIChlLmcuIHlvdSBuZWVkIHRvIGNoYW5nZSB0aGVcbiAgICogc3lzdGVtcyBpbiB0aGUgZW5naW5lIGFuZCB5b3UgZG9uJ3Qgd2FudCB0byBkbyBpdCB3aGlsZSB0aGV5J3JlIHVwZGF0aW5nKSBhZGQgYSBsaXN0ZW5lciB0b1xuICAgKiB0aGUgZW5naW5lJ3MgdXBkYXRlQ29tcGxldGUgc2lnbmFsIHRvIGJlIG5vdGlmaWVkIHdoZW4gdGhlIHVwZGF0ZSBsb29wIGNvbXBsZXRlcy48L3A+XG4gICAqXG4gICAqIEBwYXJhbSB0aW1lIFRoZSBkdXJhdGlvbiwgaW4gc2Vjb25kcywgb2YgdGhlIGZyYW1lLlxuICAgKi9cblxuICBTeXN0ZW0ucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKHRpbWUpIHt9O1xuXG4gIHJldHVybiBTeXN0ZW07XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXN5c3RlbS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc2g7XG5cbmFzaCA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5cbi8qXG4gKiBVc2VkIGludGVybmFsbHksIHRoaXMgaXMgYW4gb3JkZXJlZCBsaXN0IG9mIFN5c3RlbXMgZm9yIHVzZSBieSB0aGUgZW5naW5lIHVwZGF0ZSBsb29wLlxuICovXG5cbmFzaC5jb3JlLlN5c3RlbUxpc3QgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIFN5c3RlbUxpc3QoKSB7fVxuXG4gIFN5c3RlbUxpc3QucHJvdG90eXBlLmhlYWQgPSBudWxsO1xuXG4gIFN5c3RlbUxpc3QucHJvdG90eXBlLnRhaWwgPSBudWxsO1xuXG4gIFN5c3RlbUxpc3QucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKHN5c3RlbSkge1xuICAgIHZhciBub2RlO1xuICAgIGlmICghdGhpcy5oZWFkKSB7XG4gICAgICB0aGlzLmhlYWQgPSB0aGlzLnRhaWwgPSBzeXN0ZW07XG4gICAgICBzeXN0ZW0ubmV4dCA9IHN5c3RlbS5wcmV2aW91cyA9IG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5vZGUgPSB0aGlzLnRhaWw7XG4gICAgICB3aGlsZSAobm9kZSkge1xuICAgICAgICBpZiAobm9kZS5wcmlvcml0eSA8PSBzeXN0ZW0ucHJpb3JpdHkpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBub2RlID0gbm9kZS5wcmV2aW91cztcbiAgICAgIH1cbiAgICAgIGlmIChub2RlID09PSB0aGlzLnRhaWwpIHtcbiAgICAgICAgdGhpcy50YWlsLm5leHQgPSBzeXN0ZW07XG4gICAgICAgIHN5c3RlbS5wcmV2aW91cyA9IHRoaXMudGFpbDtcbiAgICAgICAgc3lzdGVtLm5leHQgPSBudWxsO1xuICAgICAgICB0aGlzLnRhaWwgPSBzeXN0ZW07XG4gICAgICB9IGVsc2UgaWYgKCFub2RlKSB7XG4gICAgICAgIHN5c3RlbS5uZXh0ID0gdGhpcy5oZWFkO1xuICAgICAgICBzeXN0ZW0ucHJldmlvdXMgPSBudWxsO1xuICAgICAgICB0aGlzLmhlYWQucHJldmlvdXMgPSBzeXN0ZW07XG4gICAgICAgIHRoaXMuaGVhZCA9IHN5c3RlbTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN5c3RlbS5uZXh0ID0gbm9kZS5uZXh0O1xuICAgICAgICBzeXN0ZW0ucHJldmlvdXMgPSBub2RlO1xuICAgICAgICBub2RlLm5leHQucHJldmlvdXMgPSBzeXN0ZW07XG4gICAgICAgIG5vZGUubmV4dCA9IHN5c3RlbTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgU3lzdGVtTGlzdC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oc3lzdGVtKSB7XG4gICAgaWYgKHRoaXMuaGVhZCA9PT0gc3lzdGVtKSB7XG4gICAgICB0aGlzLmhlYWQgPSB0aGlzLmhlYWQubmV4dDtcbiAgICB9XG4gICAgaWYgKHRoaXMudGFpbCA9PT0gc3lzdGVtKSB7XG4gICAgICB0aGlzLnRhaWwgPSB0aGlzLnRhaWwucHJldmlvdXM7XG4gICAgfVxuICAgIGlmIChzeXN0ZW0ucHJldmlvdXMpIHtcbiAgICAgIHN5c3RlbS5wcmV2aW91cy5uZXh0ID0gc3lzdGVtLm5leHQ7XG4gICAgfVxuICAgIGlmIChzeXN0ZW0ubmV4dCkge1xuICAgICAgc3lzdGVtLm5leHQucHJldmlvdXMgPSBzeXN0ZW0ucHJldmlvdXM7XG4gICAgfVxuICB9O1xuXG4gIFN5c3RlbUxpc3QucHJvdG90eXBlLnJlbW92ZUFsbCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzeXN0ZW07XG4gICAgd2hpbGUgKHRoaXMuaGVhZCkge1xuICAgICAgc3lzdGVtID0gdGhpcy5oZWFkO1xuICAgICAgdGhpcy5oZWFkID0gdGhpcy5oZWFkLm5leHQ7XG4gICAgICBzeXN0ZW0ucHJldmlvdXMgPSBudWxsO1xuICAgICAgc3lzdGVtLm5leHQgPSBudWxsO1xuICAgIH1cbiAgICB0aGlzLnRhaWwgPSBudWxsO1xuICB9O1xuXG4gIFN5c3RlbUxpc3QucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgICB2YXIgc3lzdGVtO1xuICAgIHN5c3RlbSA9IHRoaXMuaGVhZDtcbiAgICB3aGlsZSAoc3lzdGVtKSB7XG4gICAgICBpZiAoc3lzdGVtLmNvbnN0cnVjdG9yID09PSB0eXBlKSB7XG4gICAgICAgIHJldHVybiBzeXN0ZW07XG4gICAgICB9XG4gICAgICBzeXN0ZW0gPSBzeXN0ZW0ubmV4dDtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH07XG5cbiAgcmV0dXJuIFN5c3RlbUxpc3Q7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXN5c3RlbV9saXN0LmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzaDtcblxuYXNoID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cblxuLypcbiAqIFRoaXMgY29tcG9uZW50IHByb3ZpZGVyIGFsd2F5cyByZXR1cm5zIHRoZSBzYW1lIGluc3RhbmNlIG9mIHRoZSBjb21wb25lbnQuIFRoZSBpbnN0YW5jZVxuICogaXMgcGFzc2VkIHRvIHRoZSBwcm92aWRlciBhdCBpbml0aWFsaXNhdGlvbi5cbiAqL1xuXG5hc2guZnNtLkNvbXBvbmVudEluc3RhbmNlUHJvdmlkZXIgPSAoZnVuY3Rpb24oKSB7XG4gIENvbXBvbmVudEluc3RhbmNlUHJvdmlkZXIucHJvdG90eXBlLmluc3RhbmNlID0gbnVsbDtcblxuXG4gIC8qXG4gICAqIENvbnN0cnVjdG9yXG4gICAqXG4gICAqIEBwYXJhbSBpbnN0YW5jZSBUaGUgaW5zdGFuY2UgdG8gcmV0dXJuIHdoZW5ldmVyIGEgY29tcG9uZW50IGlzIHJlcXVlc3RlZC5cbiAgICovXG5cbiAgZnVuY3Rpb24gQ29tcG9uZW50SW5zdGFuY2VQcm92aWRlcihpbnN0YW5jZSkge1xuICAgIHRoaXMuaW5zdGFuY2UgPSBpbnN0YW5jZTtcbiAgfVxuXG5cbiAgLypcbiAgICogVXNlZCB0byByZXF1ZXN0IGEgY29tcG9uZW50IGZyb20gdGhpcyBwcm92aWRlclxuICAgKlxuICAgKiBAcmV0dXJuIFRoZSBpbnN0YW5jZVxuICAgKi9cblxuICBDb21wb25lbnRJbnN0YW5jZVByb3ZpZGVyLnByb3RvdHlwZS5nZXRDb21wb25lbnQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5pbnN0YW5jZTtcbiAgfTtcblxuXG4gIC8qXG4gICAqIFVzZWQgdG8gY29tcGFyZSB0aGlzIHByb3ZpZGVyIHdpdGggb3RoZXJzLiBBbnkgcHJvdmlkZXIgdGhhdCByZXR1cm5zIHRoZSBzYW1lIGNvbXBvbmVudFxuICAgKiBpbnN0YW5jZSB3aWxsIGJlIHJlZ2FyZGVkIGFzIGVxdWl2YWxlbnQuXG4gICAqXG4gICAqIEByZXR1cm4gVGhlIGluc3RhbmNlXG4gICAqL1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKENvbXBvbmVudEluc3RhbmNlUHJvdmlkZXIucHJvdG90eXBlLCB7XG4gICAgaWRlbnRpZmllcjoge1xuICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2U7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gQ29tcG9uZW50SW5zdGFuY2VQcm92aWRlcjtcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29tcG9uZW50X2luc3RhbmNlX3Byb3ZpZGVyLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzaDtcblxuYXNoID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cbmFzaC5mc20uQ29tcG9uZW50U2luZ2xldG9uUHJvdmlkZXIgPSAoZnVuY3Rpb24oKSB7XG4gIENvbXBvbmVudFNpbmdsZXRvblByb3ZpZGVyLnByb3RvdHlwZS5jb21wb25lbnRUeXBlID0gbnVsbDtcblxuICBDb21wb25lbnRTaW5nbGV0b25Qcm92aWRlci5wcm90b3R5cGUuaW5zdGFuY2UgPSBudWxsO1xuXG5cbiAgLypcbiAgICogQ29uc3RydWN0b3JcbiAgICpcbiAgICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgb2YgdGhlIHNpbmdsZSBpbnN0YW5jZVxuICAgKi9cblxuICBmdW5jdGlvbiBDb21wb25lbnRTaW5nbGV0b25Qcm92aWRlcih0eXBlKSB7XG4gICAgdGhpcy5jb21wb25lbnRUeXBlID0gdHlwZTtcblxuICAgIC8qXG4gICAgICogVXNlZCB0byByZXF1ZXN0IGEgY29tcG9uZW50IGZyb20gdGhpcyBwcm92aWRlclxuICAgICAqXG4gICAgICogQHJldHVybiBUaGUgaW5zdGFuY2VcbiAgICAgKi9cbiAgfVxuXG4gIENvbXBvbmVudFNpbmdsZXRvblByb3ZpZGVyLnByb3RvdHlwZS5nZXRDb21wb25lbnQgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5pbnN0YW5jZSA9PSBudWxsKSB7XG4gICAgICB0aGlzLmluc3RhbmNlID0gbmV3IHRoaXMuY29tcG9uZW50VHlwZSgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5pbnN0YW5jZTtcbiAgfTtcblxuXG4gIC8qXG4gICAqIFVzZWQgdG8gY29tcGFyZSB0aGlzIHByb3ZpZGVyIHdpdGggb3RoZXJzLiBBbnkgcHJvdmlkZXIgdGhhdCByZXR1cm5zIHRoZSBzYW1lIGNvbXBvbmVudFxuICAgKiBpbnN0YW5jZSB3aWxsIGJlIHJlZ2FyZGVkIGFzIGVxdWl2YWxlbnQuXG4gICAqXG4gICAqIEByZXR1cm4gVGhlIGluc3RhbmNlXG4gICAqL1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKENvbXBvbmVudFNpbmdsZXRvblByb3ZpZGVyLnByb3RvdHlwZSwge1xuICAgIGlkZW50aWZpZXI6IHtcbiAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldENvbXBvbmVudCgpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIENvbXBvbmVudFNpbmdsZXRvblByb3ZpZGVyO1xuXG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb21wb25lbnRfc2luZ2xldG9uX3Byb3ZpZGVyLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzaDtcblxuYXNoID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cbmFzaC5mc20uQ29tcG9uZW50VHlwZVByb3ZpZGVyID0gKGZ1bmN0aW9uKCkge1xuICBDb21wb25lbnRUeXBlUHJvdmlkZXIucHJvdG90eXBlLmNvbXBvbmVudFR5cGUgPSBudWxsO1xuXG5cbiAgLypcbiAgICogQ29uc3RydWN0b3JcbiAgICpcbiAgICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgb2YgdGhlIHNpbmdsZSBpbnN0YW5jZVxuICAgKi9cblxuICBmdW5jdGlvbiBDb21wb25lbnRUeXBlUHJvdmlkZXIodHlwZSkge1xuICAgIHRoaXMuY29tcG9uZW50VHlwZSA9IHR5cGU7XG4gIH1cblxuXG4gIC8qXG4gICAqIFVzZWQgdG8gcmVxdWVzdCBhIGNvbXBvbmVudCBmcm9tIHRoaXMgcHJvdmlkZXJcbiAgICpcbiAgICogQHJldHVybiBUaGUgaW5zdGFuY2VcbiAgICovXG5cbiAgQ29tcG9uZW50VHlwZVByb3ZpZGVyLnByb3RvdHlwZS5nZXRDb21wb25lbnQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IHRoaXMuY29tcG9uZW50VHlwZSgpO1xuICB9O1xuXG5cbiAgLypcbiAgICogVXNlZCB0byBjb21wYXJlIHRoaXMgcHJvdmlkZXIgd2l0aCBvdGhlcnMuIEFueSBwcm92aWRlciB0aGF0IHJldHVybnMgdGhlIHNhbWUgY29tcG9uZW50XG4gICAqIGluc3RhbmNlIHdpbGwgYmUgcmVnYXJkZWQgYXMgZXF1aXZhbGVudC5cbiAgICpcbiAgICogQHJldHVybiBUaGUgaW5zdGFuY2VcbiAgICovXG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoQ29tcG9uZW50VHlwZVByb3ZpZGVyLnByb3RvdHlwZSwge1xuICAgIGlkZW50aWZpZXI6IHtcbiAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbXBvbmVudFR5cGU7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gQ29tcG9uZW50VHlwZVByb3ZpZGVyO1xuXG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb21wb25lbnRfdHlwZV9wcm92aWRlci5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc2g7XG5cbmFzaCA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5hc2guZnNtLkR5bmFtaWNDb21wb25lbnRQcm92aWRlciA9IChmdW5jdGlvbigpIHtcbiAgRHluYW1pY0NvbXBvbmVudFByb3ZpZGVyLnByb3RvdHlwZS5fY2xvc3VyZSA9IG51bGw7XG5cblxuICAvKlxuICAgKiBDb25zdHJ1Y3RvclxuICAgKlxuICAgKiBAcGFyYW0gY2xvc3VyZSBUaGUgZnVuY3Rpb24gdGhhdCB3aWxsIHJldHVybiB0aGUgY29tcG9uZW50IGluc3RhbmNlIHdoZW4gY2FsbGVkLlxuICAgKi9cblxuICBmdW5jdGlvbiBEeW5hbWljQ29tcG9uZW50UHJvdmlkZXIoY2xvc3VyZSkge1xuICAgIHRoaXMuX2Nsb3N1cmUgPSBjbG9zdXJlO1xuXG4gICAgLypcbiAgICAgKiBVc2VkIHRvIHJlcXVlc3QgYSBjb21wb25lbnQgZnJvbSB0aGlzIHByb3ZpZGVyXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIFRoZSBpbnN0YW5jZVxuICAgICAqL1xuICB9XG5cbiAgRHluYW1pY0NvbXBvbmVudFByb3ZpZGVyLnByb3RvdHlwZS5nZXRDb21wb25lbnQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fY2xvc3VyZTtcbiAgfTtcblxuXG4gIC8qXG4gICAqIFVzZWQgdG8gY29tcGFyZSB0aGlzIHByb3ZpZGVyIHdpdGggb3RoZXJzLiBBbnkgcHJvdmlkZXIgdGhhdCByZXR1cm5zIHRoZSBzYW1lIGNvbXBvbmVudFxuICAgKiBpbnN0YW5jZSB3aWxsIGJlIHJlZ2FyZGVkIGFzIGVxdWl2YWxlbnQuXG4gICAqXG4gICAqIEByZXR1cm4gVGhlIGluc3RhbmNlXG4gICAqL1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKER5bmFtaWNDb21wb25lbnRQcm92aWRlci5wcm90b3R5cGUsIHtcbiAgICBpZGVudGlmaWVyOiB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY2xvc3VyZTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBEeW5hbWljQ29tcG9uZW50UHJvdmlkZXI7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWR5bmFtaWNfY29tcG9uZW50X3Byb3ZpZGVyLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzaDtcblxuYXNoID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cblxuLypcbiAqIFRoaXMgU3lzdGVtIHByb3ZpZGVyIHJldHVybnMgcmVzdWx0cyBvZiBhIG1ldGhvZCBjYWxsLiBUaGUgbWV0aG9kXG4gKiBpcyBwYXNzZWQgdG8gdGhlIHByb3ZpZGVyIGF0IGluaXRpYWxpc2F0aW9uLlxuICovXG5cbmFzaC5mc20uRHluYW1pY1N5c3RlbVByb3ZpZGVyID0gKGZ1bmN0aW9uKCkge1xuICBEeW5hbWljU3lzdGVtUHJvdmlkZXIucHJvdG90eXBlLm1ldGhvZCA9IGZ1bmN0aW9uKCkge307XG5cbiAgRHluYW1pY1N5c3RlbVByb3ZpZGVyLnByb3RvdHlwZS5zeXN0ZW1Qcmlvcml0eSA9IDA7XG5cblxuICAvKlxuICAgKiBDb25zdHJ1Y3RvclxuICAgKlxuICAgKiBAcGFyYW0gbWV0aG9kIFRoZSBtZXRob2QgdGhhdCByZXR1cm5zIHRoZSBTeXN0ZW0gaW5zdGFuY2U7XG4gICAqL1xuXG4gIGZ1bmN0aW9uIER5bmFtaWNTeXN0ZW1Qcm92aWRlcihtZXRob2QpIHtcbiAgICB0aGlzLm1ldGhvZCA9IG1ldGhvZDtcbiAgfVxuXG5cbiAgLypcbiAgICogVXNlZCB0byBjb21wYXJlIHRoaXMgcHJvdmlkZXIgd2l0aCBvdGhlcnMuIEFueSBwcm92aWRlciB0aGF0IHJldHVybnMgdGhlIHNhbWUgY29tcG9uZW50XG4gICAqIGluc3RhbmNlIHdpbGwgYmUgcmVnYXJkZWQgYXMgZXF1aXZhbGVudC5cbiAgICpcbiAgICogQHJldHVybiBUaGUgbWV0aG9kIHVzZWQgdG8gY2FsbCB0aGUgU3lzdGVtIGluc3RhbmNlc1xuICAgKi9cblxuICBEeW5hbWljU3lzdGVtUHJvdmlkZXIucHJvdG90eXBlLmdldFN5c3RlbSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLm1ldGhvZCgpO1xuICB9O1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKER5bmFtaWNTeXN0ZW1Qcm92aWRlci5wcm90b3R5cGUsIHtcblxuICAgIC8qXG4gICAgICogVGhlIHByaW9yaXR5IGF0IHdoaWNoIHRoZSBTeXN0ZW0gc2hvdWxkIGJlIGFkZGVkIHRvIHRoZSBFbmdpbmVcbiAgICAgKi9cbiAgICBpZGVudGlmaWVyOiB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tZXRob2Q7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8qXG4gICAgICogVGhlIHByaW9yaXR5IGF0IHdoaWNoIHRoZSBTeXN0ZW0gc2hvdWxkIGJlIGFkZGVkIHRvIHRoZSBFbmdpbmVcbiAgICAgKi9cbiAgICBwcmlvcml0eToge1xuICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3lzdGVtUHJpb3JpdHk7XG4gICAgICB9LFxuICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zeXN0ZW1Qcmlvcml0eSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIER5bmFtaWNTeXN0ZW1Qcm92aWRlcjtcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZHluYW1pY19zeXN0ZW1fcHJvdmlkZXIuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgRHluYW1pY1N5c3RlbVByb3ZpZGVyLCBTdGF0ZVN5c3RlbU1hcHBpbmcsIFN5c3RlbUluc3RhbmNlUHJvdmlkZXIsIFN5c3RlbVNpbmdsZXRvblByb3ZpZGVyLCBhc2g7XG5cbmFzaCA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5TeXN0ZW1JbnN0YW5jZVByb3ZpZGVyID0gYXNoLmZzbS5TeXN0ZW1JbnN0YW5jZVByb3ZpZGVyO1xuXG5TeXN0ZW1TaW5nbGV0b25Qcm92aWRlciA9IGFzaC5mc20uU3lzdGVtU2luZ2xldG9uUHJvdmlkZXI7XG5cbkR5bmFtaWNTeXN0ZW1Qcm92aWRlciA9IGFzaC5mc20uRHluYW1pY1N5c3RlbVByb3ZpZGVyO1xuXG5TdGF0ZVN5c3RlbU1hcHBpbmcgPSBhc2guZnNtLlN0YXRlU3lzdGVtTWFwcGluZztcblxuXG4vKlxuICogUmVwcmVzZW50cyBhIHN0YXRlIGZvciBhIFN5c3RlbVN0YXRlTWFjaGluZS4gVGhlIHN0YXRlIGNvbnRhaW5zIGFueSBudW1iZXIgb2YgU3lzdGVtUHJvdmlkZXJzIHdoaWNoXG4gKiBhcmUgdXNlZCB0byBhZGQgU3lzdGVtcyB0byB0aGUgRW5naW5lIHdoZW4gdGhpcyBzdGF0ZSBpcyBlbnRlcmVkLlxuICovXG5cbmFzaC5mc20uRW5naW5lU3RhdGUgPSAoZnVuY3Rpb24oKSB7XG4gIEVuZ2luZVN0YXRlLnByb3RvdHlwZS5wcm92aWRlcnMgPSBudWxsO1xuXG4gIGZ1bmN0aW9uIEVuZ2luZVN0YXRlKCkge1xuICAgIHRoaXMucHJvdmlkZXJzID0gW107XG4gIH1cblxuXG4gIC8qXG4gICAqIENyZWF0ZXMgYSBtYXBwaW5nIGZvciB0aGUgU3lzdGVtIHR5cGUgdG8gYSBzcGVjaWZpYyBTeXN0ZW0gaW5zdGFuY2UuIEFcbiAgICogU3lzdGVtSW5zdGFuY2VQcm92aWRlciBpcyB1c2VkIGZvciB0aGUgbWFwcGluZy5cbiAgICpcbiAgICogQHBhcmFtIHN5c3RlbSBUaGUgU3lzdGVtIGluc3RhbmNlIHRvIHVzZSBmb3IgdGhlIG1hcHBpbmdcbiAgICogQHJldHVybiBUaGlzIFN0YXRlU3lzdGVtTWFwcGluZywgc28gbW9yZSBtb2RpZmljYXRpb25zIGNhbiBiZSBhcHBsaWVkXG4gICAqL1xuXG4gIEVuZ2luZVN0YXRlLnByb3RvdHlwZS5hZGRJbnN0YW5jZSA9IGZ1bmN0aW9uKHN5c3RlbSkge1xuICAgIHJldHVybiB0aGlzLmFkZFByb3ZpZGVyKG5ldyBTeXN0ZW1JbnN0YW5jZVByb3ZpZGVyKHN5c3RlbSkpO1xuICB9O1xuXG5cbiAgLypcbiAgICogQ3JlYXRlcyBhIG1hcHBpbmcgZm9yIHRoZSBTeXN0ZW0gdHlwZSB0byBhIHNpbmdsZSBpbnN0YW5jZSBvZiB0aGUgcHJvdmlkZWQgdHlwZS5cbiAgICogVGhlIGluc3RhbmNlIGlzIG5vdCBjcmVhdGVkIHVudGlsIGl0IGlzIGZpcnN0IHJlcXVlc3RlZC4gVGhlIHR5cGUgc2hvdWxkIGJlIHRoZSBzYW1lXG4gICAqIGFzIG9yIGV4dGVuZCB0aGUgdHlwZSBmb3IgdGhpcyBtYXBwaW5nLiBBIFN5c3RlbVNpbmdsZXRvblByb3ZpZGVyIGlzIHVzZWQgZm9yXG4gICAqIHRoZSBtYXBwaW5nLlxuICAgKlxuICAgKiBAcGFyYW0gdHlwZSBUaGUgdHlwZSBvZiB0aGUgc2luZ2xlIGluc3RhbmNlIHRvIGJlIGNyZWF0ZWQuIElmIG9taXR0ZWQsIHRoZSB0eXBlIG9mIHRoZVxuICAgKiBtYXBwaW5nIGlzIHVzZWQuXG4gICAqIEByZXR1cm4gVGhpcyBTdGF0ZVN5c3RlbU1hcHBpbmcsIHNvIG1vcmUgbW9kaWZpY2F0aW9ucyBjYW4gYmUgYXBwbGllZFxuICAgKi9cblxuICBFbmdpbmVTdGF0ZS5wcm90b3R5cGUuYWRkU2luZ2xldG9uID0gZnVuY3Rpb24odHlwZSkge1xuICAgIHJldHVybiB0aGlzLmFkZFByb3ZpZGVyKG5ldyBTeXN0ZW1TaW5nbGV0b25Qcm92aWRlcih0eXBlKSk7XG4gIH07XG5cblxuICAvKlxuICAgKiBDcmVhdGVzIGEgbWFwcGluZyBmb3IgdGhlIFN5c3RlbSB0eXBlIHRvIGEgbWV0aG9kIGNhbGwuXG4gICAqIFRoZSBtZXRob2Qgc2hvdWxkIHJldHVybiBhIFN5c3RlbSBpbnN0YW5jZS4gQSBEeW5hbWljU3lzdGVtUHJvdmlkZXIgaXMgdXNlZCBmb3JcbiAgICogdGhlIG1hcHBpbmcuXG4gICAqXG4gICAqIEBwYXJhbSBtZXRob2QgVGhlIG1ldGhvZCB0byBwcm92aWRlIHRoZSBTeXN0ZW0gaW5zdGFuY2UuXG4gICAqIEByZXR1cm4gVGhpcyBTdGF0ZVN5c3RlbU1hcHBpbmcsIHNvIG1vcmUgbW9kaWZpY2F0aW9ucyBjYW4gYmUgYXBwbGllZC5cbiAgICovXG5cbiAgRW5naW5lU3RhdGUucHJvdG90eXBlLmFkZE1ldGhvZCA9IGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgIHJldHVybiB0aGlzLmFkZFByb3ZpZGVyKG5ldyBEeW5hbWljU3lzdGVtUHJvdmlkZXIobWV0aG9kKSk7XG4gIH07XG5cblxuICAvKlxuICAgKiBBZGRzIGFueSBTeXN0ZW1Qcm92aWRlci5cbiAgICpcbiAgICogQHBhcmFtIHByb3ZpZGVyIFRoZSBjb21wb25lbnQgcHJvdmlkZXIgdG8gdXNlLlxuICAgKiBAcmV0dXJuIFRoaXMgU3RhdGVTeXN0ZW1NYXBwaW5nLCBzbyBtb3JlIG1vZGlmaWNhdGlvbnMgY2FuIGJlIGFwcGxpZWQuXG4gICAqL1xuXG4gIEVuZ2luZVN0YXRlLnByb3RvdHlwZS5hZGRQcm92aWRlciA9IGZ1bmN0aW9uKHByb3ZpZGVyKSB7XG4gICAgdmFyIG1hcHBpbmc7XG4gICAgbWFwcGluZyA9IG5ldyBTdGF0ZVN5c3RlbU1hcHBpbmcodGhpcywgcHJvdmlkZXIpO1xuICAgIHRoaXMucHJvdmlkZXJzLnB1c2gocHJvdmlkZXIpO1xuICAgIHJldHVybiBtYXBwaW5nO1xuICB9O1xuXG4gIHJldHVybiBFbmdpbmVTdGF0ZTtcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZW5naW5lX3N0YXRlLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIERpY3Rpb25hcnksIEVuZ2luZVN0YXRlLCBhc2g7XG5cbmFzaCA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5FbmdpbmVTdGF0ZSA9IGFzaC5mc20uRW5naW5lU3RhdGU7XG5cbkRpY3Rpb25hcnkgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIERpY3Rpb25hcnkoKSB7fVxuXG4gIHJldHVybiBEaWN0aW9uYXJ5O1xuXG59KSgpO1xuXG5cbi8qXG4gKiBUaGlzIGlzIGEgc3RhdGUgbWFjaGluZSBmb3IgdGhlIEVuZ2luZS4gVGhlIHN0YXRlIG1hY2hpbmUgbWFuYWdlcyBhIHNldCBvZiBzdGF0ZXMsXG4gKiBlYWNoIG9mIHdoaWNoIGhhcyBhIHNldCBvZiBTeXN0ZW0gcHJvdmlkZXJzLiBXaGVuIHRoZSBzdGF0ZSBtYWNoaW5lIGNoYW5nZXMgdGhlIHN0YXRlLCBpdCByZW1vdmVzXG4gKiBTeXN0ZW1zIGFzc29jaWF0ZWQgd2l0aCB0aGUgcHJldmlvdXMgc3RhdGUgYW5kIGFkZHMgU3lzdGVtcyBhc3NvY2lhdGVkIHdpdGggdGhlIG5ldyBzdGF0ZS5cbiAqL1xuXG5hc2guZnNtLkVuZ2luZVN0YXRlTWFjaGluZSA9IChmdW5jdGlvbigpIHtcbiAgRW5naW5lU3RhdGVNYWNoaW5lLnByb3RvdHlwZS5lbmdpbmUgPSBudWxsO1xuXG4gIEVuZ2luZVN0YXRlTWFjaGluZS5wcm90b3R5cGUuc3RhdGVzID0gbnVsbDtcblxuICBFbmdpbmVTdGF0ZU1hY2hpbmUucHJvdG90eXBlLmN1cnJlbnRTdGF0ZSA9IG51bGw7XG5cblxuICAvKlxuICAgKiBDb25zdHJ1Y3Rvci4gQ3JlYXRlcyBhbiBTeXN0ZW1TdGF0ZU1hY2hpbmUuXG4gICAqL1xuXG4gIGZ1bmN0aW9uIEVuZ2luZVN0YXRlTWFjaGluZShlbmdpbmUpIHtcbiAgICB0aGlzLmVuZ2luZSA9IGVuZ2luZTtcbiAgICB0aGlzLnN0YXRlcyA9IG5ldyBEaWN0aW9uYXJ5KCk7XG4gIH1cblxuXG4gIC8qXG4gICAqIEFkZCBhIHN0YXRlIHRvIHRoaXMgc3RhdGUgbWFjaGluZS5cbiAgICpcbiAgICogQHBhcmFtIG5hbWUgVGhlIG5hbWUgb2YgdGhpcyBzdGF0ZSAtIHVzZWQgdG8gaWRlbnRpZnkgaXQgbGF0ZXIgaW4gdGhlIGNoYW5nZVN0YXRlIG1ldGhvZCBjYWxsLlxuICAgKiBAcGFyYW0gc3RhdGUgVGhlIHN0YXRlLlxuICAgKiBAcmV0dXJuIFRoaXMgc3RhdGUgbWFjaGluZSwgc28gbWV0aG9kcyBjYW4gYmUgY2hhaW5lZC5cbiAgICovXG5cbiAgRW5naW5lU3RhdGVNYWNoaW5lLnByb3RvdHlwZS5hZGRTdGF0ZSA9IGZ1bmN0aW9uKG5hbWUsIHN0YXRlKSB7XG4gICAgdGhpcy5zdGF0ZXNbbmFtZV0gPSBzdGF0ZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuXG4gIC8qXG4gICAqIENyZWF0ZSBhIG5ldyBzdGF0ZSBpbiB0aGlzIHN0YXRlIG1hY2hpbmUuXG4gICAqXG4gICAqIEBwYXJhbSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBuZXcgc3RhdGUgLSB1c2VkIHRvIGlkZW50aWZ5IGl0IGxhdGVyIGluIHRoZSBjaGFuZ2VTdGF0ZSBtZXRob2QgY2FsbC5cbiAgICogQHJldHVybiBUaGUgbmV3IEVudGl0eVN0YXRlIG9iamVjdCB0aGF0IGlzIHRoZSBzdGF0ZS4gVGhpcyB3aWxsIG5lZWQgdG8gYmUgY29uZmlndXJlZCB3aXRoXG4gICAqIHRoZSBhcHByb3ByaWF0ZSBjb21wb25lbnQgcHJvdmlkZXJzLlxuICAgKi9cblxuICBFbmdpbmVTdGF0ZU1hY2hpbmUucHJvdG90eXBlLmNyZWF0ZVN0YXRlID0gZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBzdGF0ZTtcbiAgICBzdGF0ZSA9IG5ldyBFbmdpbmVTdGF0ZSgpO1xuICAgIHRoaXMuc3RhdGVzW25hbWVdID0gc3RhdGU7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cblxuICAvKlxuICAgKiBDaGFuZ2UgdG8gYSBuZXcgc3RhdGUuIFRoZSBTeXN0ZW1zIGZyb20gdGhlIG9sZCBzdGF0ZSB3aWxsIGJlIHJlbW92ZWQgYW5kIHRoZSBTeXN0ZW1zXG4gICAqIGZvciB0aGUgbmV3IHN0YXRlIHdpbGwgYmUgYWRkZWQuXG4gICAqXG4gICAqIEBwYXJhbSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBzdGF0ZSB0byBjaGFuZ2UgdG8uXG4gICAqL1xuXG4gIEVuZ2luZVN0YXRlTWFjaGluZS5wcm90b3R5cGUuY2hhbmdlU3RhdGUgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIGVhY2gsIGlkLCBuZXdTdGF0ZSwgb3RoZXIsIHByb3ZpZGVyLCB0b0FkZCwgX3JlZiwgX3JlZjE7XG4gICAgbmV3U3RhdGUgPSB0aGlzLnN0YXRlc1tuYW1lXTtcbiAgICBpZiAobmV3U3RhdGUgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRW5naW5lIHN0YXRlIFwiICsgbmFtZSArIFwiIGRvZXNuJ3QgZXhpc3RcIik7XG4gICAgfVxuICAgIGlmIChuZXdTdGF0ZSA9PT0gdGhpcy5jdXJyZW50U3RhdGUpIHtcbiAgICAgIG5ld1N0YXRlID0gbnVsbDtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdG9BZGQgPSBuZXcgRGljdGlvbmFyeSgpO1xuICAgIF9yZWYgPSBuZXdTdGF0ZS5wcm92aWRlcnM7XG4gICAgZm9yIChlYWNoIGluIF9yZWYpIHtcbiAgICAgIHByb3ZpZGVyID0gX3JlZltlYWNoXTtcbiAgICAgIGlkID0gcHJvdmlkZXIuaWRlbnRpZmllcjtcbiAgICAgIHRvQWRkW2lkXSA9IHByb3ZpZGVyO1xuICAgIH1cbiAgICBpZiAoY3VycmVudFN0YXRlKSB7XG4gICAgICBfcmVmMSA9IHRoaXMuY3VycmVudFN0YXRlLnByb3ZpZGVycztcbiAgICAgIGZvciAoZWFjaCBpbiBfcmVmMSkge1xuICAgICAgICBwcm92aWRlciA9IF9yZWYxW2VhY2hdO1xuICAgICAgICBpZCA9IHByb3ZpZGVyLmlkZW50aWZpZXI7XG4gICAgICAgIG90aGVyID0gdG9BZGRbaWRdO1xuICAgICAgICBpZiAob3RoZXIpIHtcbiAgICAgICAgICBkZWxldGUgdG9BZGRbaWRdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZW5naW5lLnJlbW92ZVN5c3RlbShwcm92aWRlci5nZXRTeXN0ZW0oKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yIChlYWNoIGluIHRvQWRkKSB7XG4gICAgICBwcm92aWRlciA9IHRvQWRkW2VhY2hdO1xuICAgICAgdGhpcy5lbmdpbmUuYWRkU3lzdGVtKHByb3ZpZGVyLmdldFN5c3RlbSgpLCBwcm92aWRlci5wcmlvcml0eSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmN1cnJlbnRTdGF0ZSA9IG5ld1N0YXRlO1xuICB9O1xuXG4gIHJldHVybiBFbmdpbmVTdGF0ZU1hY2hpbmU7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWVuZ2luZV9zdGF0ZV9tYWNoaW5lLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIERpY3Rpb25hcnksIFN0YXRlQ29tcG9uZW50TWFwcGluZywgYXNoO1xuXG5hc2ggPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuU3RhdGVDb21wb25lbnRNYXBwaW5nID0gYXNoLmZzbS5TdGF0ZUNvbXBvbmVudE1hcHBpbmc7XG5cbkRpY3Rpb25hcnkgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIERpY3Rpb25hcnkoKSB7fVxuXG4gIHJldHVybiBEaWN0aW9uYXJ5O1xuXG59KSgpO1xuXG5cbi8qXG4gKiBSZXByZXNlbnRzIGEgc3RhdGUgZm9yIGFuIEVudGl0eVN0YXRlTWFjaGluZS4gVGhlIHN0YXRlIGNvbnRhaW5zIGFueSBudW1iZXIgb2YgQ29tcG9uZW50UHJvdmlkZXJzIHdoaWNoXG4gKiBhcmUgdXNlZCB0byBhZGQgY29tcG9uZW50cyB0byB0aGUgZW50aXR5IHdoZW4gdGhpcyBzdGF0ZSBpcyBlbnRlcmVkLlxuICovXG5cbmFzaC5mc20uRW50aXR5U3RhdGUgPSAoZnVuY3Rpb24oKSB7XG4gIEVudGl0eVN0YXRlLnByb3RvdHlwZS5wcm92aWRlcnMgPSBudWxsO1xuXG4gIGZ1bmN0aW9uIEVudGl0eVN0YXRlKCkge1xuICAgIHRoaXMucHJvdmlkZXJzID0gbmV3IERpY3Rpb25hcnkoKTtcbiAgfVxuXG5cbiAgLypcbiAgICogQWRkIGEgbmV3IENvbXBvbmVudE1hcHBpbmcgdG8gdGhpcyBzdGF0ZS4gVGhlIG1hcHBpbmcgaXMgYSB1dGlsaXR5IGNsYXNzIHRoYXQgaXMgdXNlZCB0b1xuICAgKiBtYXAgYSBjb21wb25lbnQgdHlwZSB0byB0aGUgcHJvdmlkZXIgdGhhdCBwcm92aWRlcyB0aGUgY29tcG9uZW50LlxuICAgKlxuICAgKiBAcGFyYW0gdHlwZSBUaGUgdHlwZSBvZiBjb21wb25lbnQgdG8gYmUgbWFwcGVkXG4gICAqIEByZXR1cm4gVGhlIGNvbXBvbmVudCBtYXBwaW5nIHRvIHVzZSB3aGVuIHNldHRpbmcgdGhlIHByb3ZpZGVyIGZvciB0aGUgY29tcG9uZW50XG4gICAqL1xuXG4gIEVudGl0eVN0YXRlLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbih0eXBlKSB7XG4gICAgcmV0dXJuIG5ldyBTdGF0ZUNvbXBvbmVudE1hcHBpbmcodGhpcywgdHlwZS5uYW1lKTtcbiAgfTtcblxuXG4gIC8qXG4gICAqIEdldCB0aGUgQ29tcG9uZW50UHJvdmlkZXIgZm9yIGEgcGFydGljdWxhciBjb21wb25lbnQgdHlwZS5cbiAgICpcbiAgICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgb2YgY29tcG9uZW50IHRvIGdldCB0aGUgcHJvdmlkZXIgZm9yXG4gICAqIEByZXR1cm4gVGhlIENvbXBvbmVudFByb3ZpZGVyXG4gICAqL1xuXG4gIEVudGl0eVN0YXRlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvdmlkZXJzW3R5cGVdO1xuICB9O1xuXG5cbiAgLypcbiAgICogVG8gZGV0ZXJtaW5lIHdoZXRoZXIgdGhpcyBzdGF0ZSBoYXMgYSBwcm92aWRlciBmb3IgYSBzcGVjaWZpYyBjb21wb25lbnQgdHlwZS5cbiAgICpcbiAgICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgb2YgY29tcG9uZW50IHRvIGxvb2sgZm9yIGEgcHJvdmlkZXIgZm9yXG4gICAqIEByZXR1cm4gdHJ1ZSBpZiB0aGVyZSBpcyBhIHByb3ZpZGVyIGZvciB0aGUgZ2l2ZW4gdHlwZSwgZmFsc2Ugb3RoZXJ3aXNlXG4gICAqL1xuXG4gIEVudGl0eVN0YXRlLnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbih0eXBlKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvdmlkZXJzW3R5cGVdICE9PSBudWxsO1xuICB9O1xuXG4gIHJldHVybiBFbnRpdHlTdGF0ZTtcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZW50aXR5X3N0YXRlLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIERpY3Rpb25hcnksIEVudGl0eVN0YXRlLCBhc2g7XG5cbmFzaCA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5FbnRpdHlTdGF0ZSA9IGFzaC5mc20uRW50aXR5U3RhdGU7XG5cbkRpY3Rpb25hcnkgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIERpY3Rpb25hcnkoKSB7fVxuXG4gIHJldHVybiBEaWN0aW9uYXJ5O1xuXG59KSgpO1xuXG5cbi8qXG4gKiBUaGlzIGlzIGEgc3RhdGUgbWFjaGluZSBmb3IgYW4gZW50aXR5LiBUaGUgc3RhdGUgbWFjaGluZSBtYW5hZ2VzIGEgc2V0IG9mIHN0YXRlcyxcbiAqIGVhY2ggb2Ygd2hpY2ggaGFzIGEgc2V0IG9mIGNvbXBvbmVudCBwcm92aWRlcnMuIFdoZW4gdGhlIHN0YXRlIG1hY2hpbmUgY2hhbmdlcyB0aGUgc3RhdGUsIGl0IHJlbW92ZXNcbiAqIGNvbXBvbmVudHMgYXNzb2NpYXRlZCB3aXRoIHRoZSBwcmV2aW91cyBzdGF0ZSBhbmQgYWRkcyBjb21wb25lbnRzIGFzc29jaWF0ZWQgd2l0aCB0aGUgbmV3IHN0YXRlLlxuICovXG5cbmFzaC5mc20uRW50aXR5U3RhdGVNYWNoaW5lID0gKGZ1bmN0aW9uKCkge1xuICBFbnRpdHlTdGF0ZU1hY2hpbmUucHJvdG90eXBlLnN0YXRlcyA9IG51bGw7XG5cblxuICAvKlxuICBcdCAqIFRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBzdGF0ZSBtYWNoaW5lLlxuICAgKi9cblxuICBFbnRpdHlTdGF0ZU1hY2hpbmUucHJvdG90eXBlLmN1cnJlbnRTdGF0ZSA9IG51bGw7XG5cblxuICAvKlxuICAgKiBUaGUgZW50aXR5IHdob3NlIHN0YXRlIG1hY2hpbmUgdGhpcyBpc1xuICAgKi9cblxuICBFbnRpdHlTdGF0ZU1hY2hpbmUucHJvdG90eXBlLmVudGl0eSA9IG51bGw7XG5cblxuICAvKlxuICAgKiBDb25zdHJ1Y3Rvci4gQ3JlYXRlcyBhbiBFbnRpdHlTdGF0ZU1hY2hpbmUuXG4gICAqL1xuXG4gIGZ1bmN0aW9uIEVudGl0eVN0YXRlTWFjaGluZShlbnRpdHkpIHtcbiAgICB0aGlzLmVudGl0eSA9IGVudGl0eTtcbiAgICB0aGlzLnN0YXRlcyA9IG5ldyBEaWN0aW9uYXJ5KCk7XG4gIH1cblxuXG4gIC8qXG4gIFx0XHQgKiBBZGQgYSBzdGF0ZSB0byB0aGlzIHN0YXRlIG1hY2hpbmUuXG4gIFx0XHQgKlxuICBcdFx0ICogQHBhcmFtIG5hbWUgVGhlIG5hbWUgb2YgdGhpcyBzdGF0ZSAtIHVzZWQgdG8gaWRlbnRpZnkgaXQgbGF0ZXIgaW4gdGhlIGNoYW5nZVN0YXRlIG1ldGhvZCBjYWxsLlxuICBcdFx0ICogQHBhcmFtIHN0YXRlIFRoZSBzdGF0ZS5cbiAgXHRcdCAqIEByZXR1cm4gVGhpcyBzdGF0ZSBtYWNoaW5lLCBzbyBtZXRob2RzIGNhbiBiZSBjaGFpbmVkLlxuICAgKi9cblxuICBFbnRpdHlTdGF0ZU1hY2hpbmUucHJvdG90eXBlLmFkZFN0YXRlID0gZnVuY3Rpb24obmFtZSwgc3RhdGUpIHtcbiAgICB0aGlzLnN0YXRlc1tuYW1lXSA9IHN0YXRlO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG5cbiAgLypcbiAgICogQ3JlYXRlIGEgbmV3IHN0YXRlIGluIHRoaXMgc3RhdGUgbWFjaGluZS5cbiAgICpcbiAgICogQHBhcmFtIG5hbWUgVGhlIG5hbWUgb2YgdGhlIG5ldyBzdGF0ZSAtIHVzZWQgdG8gaWRlbnRpZnkgaXQgbGF0ZXIgaW4gdGhlIGNoYW5nZVN0YXRlIG1ldGhvZCBjYWxsLlxuICAgKiBAcmV0dXJuIFRoZSBuZXcgRW50aXR5U3RhdGUgb2JqZWN0IHRoYXQgaXMgdGhlIHN0YXRlLiBUaGlzIHdpbGwgbmVlZCB0byBiZSBjb25maWd1cmVkIHdpdGhcbiAgICogdGhlIGFwcHJvcHJpYXRlIGNvbXBvbmVudCBwcm92aWRlcnMuXG4gICAqL1xuXG4gIEVudGl0eVN0YXRlTWFjaGluZS5wcm90b3R5cGUuY3JlYXRlU3RhdGUgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIHN0YXRlO1xuICAgIHN0YXRlID0gbmV3IEVudGl0eVN0YXRlKCk7XG4gICAgdGhpcy5zdGF0ZXNbbmFtZV0gPSBzdGF0ZTtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH07XG5cblxuICAvKlxuICAgKiBDaGFuZ2UgdG8gYSBuZXcgc3RhdGUuIFRoZSBjb21wb25lbnRzIGZyb20gdGhlIG9sZCBzdGF0ZSB3aWxsIGJlIHJlbW92ZWQgYW5kIHRoZSBjb21wb25lbnRzXG4gICAqIGZvciB0aGUgbmV3IHN0YXRlIHdpbGwgYmUgYWRkZWQuXG4gICAqXG4gICAqIEBwYXJhbSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBzdGF0ZSB0byBjaGFuZ2UgdG8uXG4gICAqL1xuXG4gIEVudGl0eVN0YXRlTWFjaGluZS5wcm90b3R5cGUuY2hhbmdlU3RhdGUgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIG5ld1N0YXRlLCBvdGhlciwgdG9BZGQsIHR5cGU7XG4gICAgbmV3U3RhdGUgPSB0aGlzLnN0YXRlc1tuYW1lXTtcbiAgICBpZiAoIW5ld1N0YXRlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFbnRpdHkgc3RhdGUgXCIgKyBuYW1lICsgXCIgZG9lc24ndCBleGlzdFwiKTtcbiAgICB9XG4gICAgaWYgKG5ld1N0YXRlID09PSB0aGlzLmN1cnJlbnRTdGF0ZSkge1xuICAgICAgbmV3U3RhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5jdXJyZW50U3RhdGUpIHtcbiAgICAgIHRvQWRkID0gbmV3IERpY3Rpb25hcnkoKTtcbiAgICAgIGZvciAodHlwZSBpbiBuZXdTdGF0ZS5wcm92aWRlcnMpIHtcbiAgICAgICAgdG9BZGRbdHlwZV0gPSBuZXdTdGF0ZS5wcm92aWRlcnNbdHlwZV07XG4gICAgICB9XG4gICAgICBmb3IgKHR5cGUgaW4gdGhpcy5jdXJyZW50U3RhdGUucHJvdmlkZXJzKSB7XG4gICAgICAgIG90aGVyID0gdG9BZGRbdHlwZV07XG4gICAgICAgIGlmIChvdGhlciAmJiBvdGhlci5pZGVudGlmaWVyID09PSB0aGlzLmN1cnJlbnRTdGF0ZS5wcm92aWRlcnNbdHlwZV0uaWRlbnRpZmllcikge1xuICAgICAgICAgIGRlbGV0ZSB0b0FkZFt0eXBlXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmVudGl0eS5yZW1vdmUodHlwZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdG9BZGQgPSBuZXdTdGF0ZS5wcm92aWRlcnM7XG4gICAgfVxuICAgIGZvciAodHlwZSBpbiB0b0FkZCkge1xuICAgICAgdGhpcy5lbnRpdHkuYWRkKHRvQWRkW3R5cGVdLmdldENvbXBvbmVudCgpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudFN0YXRlID0gbmV3U3RhdGU7XG4gIH07XG5cbiAgcmV0dXJuIEVudGl0eVN0YXRlTWFjaGluZTtcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZW50aXR5X3N0YXRlX21hY2hpbmUuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgQ29tcG9uZW50SW5zdGFuY2VQcm92aWRlciwgQ29tcG9uZW50U2luZ2xldG9uUHJvdmlkZXIsIENvbXBvbmVudFR5cGVQcm92aWRlciwgRHluYW1pY0NvbXBvbmVudFByb3ZpZGVyLCBhc2g7XG5cbmFzaCA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5Db21wb25lbnRJbnN0YW5jZVByb3ZpZGVyID0gYXNoLmZzbS5Db21wb25lbnRJbnN0YW5jZVByb3ZpZGVyO1xuXG5Db21wb25lbnRUeXBlUHJvdmlkZXIgPSBhc2guZnNtLkNvbXBvbmVudFR5cGVQcm92aWRlcjtcblxuQ29tcG9uZW50U2luZ2xldG9uUHJvdmlkZXIgPSBhc2guZnNtLkNvbXBvbmVudFNpbmdsZXRvblByb3ZpZGVyO1xuXG5EeW5hbWljQ29tcG9uZW50UHJvdmlkZXIgPSBhc2guZnNtLkR5bmFtaWNDb21wb25lbnRQcm92aWRlcjtcblxuXG4vKlxuICogVXNlZCBieSB0aGUgRW50aXR5U3RhdGUgY2xhc3MgdG8gY3JlYXRlIHRoZSBtYXBwaW5ncyBvZiBjb21wb25lbnRzIHRvIHByb3ZpZGVycyB2aWEgYSBmbHVlbnQgaW50ZXJmYWNlLlxuICovXG5cbmFzaC5mc20uU3RhdGVDb21wb25lbnRNYXBwaW5nID0gKGZ1bmN0aW9uKCkge1xuICBTdGF0ZUNvbXBvbmVudE1hcHBpbmcucHJvdG90eXBlLmNvbXBvbmVudFR5cGUgPSBudWxsO1xuXG4gIFN0YXRlQ29tcG9uZW50TWFwcGluZy5wcm90b3R5cGUuY3JlYXRpbmdTdGF0ZSA9IG51bGw7XG5cbiAgU3RhdGVDb21wb25lbnRNYXBwaW5nLnByb3RvdHlwZS5wcm92aWRlciA9IG51bGw7XG5cblxuICAvKlxuICAgKiBVc2VkIGludGVybmFsbHksIHRoZSBjb25zdHJ1Y3RvciBjcmVhdGVzIGEgY29tcG9uZW50IG1hcHBpbmcuIFRoZSBjb25zdHJ1Y3RvclxuICAgKiBjcmVhdGVzIGEgQ29tcG9uZW50VHlwZVByb3ZpZGVyIGFzIHRoZSBkZWZhdWx0IG1hcHBpbmcsIHdoaWNoIHdpbGwgYmUgcmVwbGFjZWRcbiAgICogYnkgbW9yZSBzcGVjaWZpYyBtYXBwaW5ncyBpZiBvdGhlciBtZXRob2RzIGFyZSBjYWxsZWQuXG4gICAqXG4gICAqIEBwYXJhbSBjcmVhdGluZ1N0YXRlIFRoZSBFbnRpdHlTdGF0ZSB0aGF0IHRoZSBtYXBwaW5nIHdpbGwgYmVsb25nIHRvXG4gICAqIEBwYXJhbSB0eXBlIFRoZSBjb21wb25lbnQgdHlwZSBmb3IgdGhlIG1hcHBpbmdcbiAgICovXG5cbiAgZnVuY3Rpb24gU3RhdGVDb21wb25lbnRNYXBwaW5nKGNyZWF0aW5nU3RhdGUsIHR5cGUpIHtcbiAgICB0aGlzLmNyZWF0aW5nU3RhdGUgPSBjcmVhdGluZ1N0YXRlO1xuICAgIHRoaXMuY29tcG9uZW50VHlwZSA9IHR5cGU7XG4gICAgdGhpcy53aXRoVHlwZSh0eXBlKTtcbiAgfVxuXG5cbiAgLypcbiAgICogQ3JlYXRlcyBhIG1hcHBpbmcgZm9yIHRoZSBjb21wb25lbnQgdHlwZSB0byBhIHNwZWNpZmljIGNvbXBvbmVudCBpbnN0YW5jZS4gQVxuICAgKiBDb21wb25lbnRJbnN0YW5jZVByb3ZpZGVyIGlzIHVzZWQgZm9yIHRoZSBtYXBwaW5nLlxuICAgKlxuICAgKiBAcGFyYW0gY29tcG9uZW50IFRoZSBjb21wb25lbnQgaW5zdGFuY2UgdG8gdXNlIGZvciB0aGUgbWFwcGluZ1xuICAgKiBAcmV0dXJuIFRoaXMgQ29tcG9uZW50TWFwcGluZywgc28gbW9yZSBtb2RpZmljYXRpb25zIGNhbiBiZSBhcHBsaWVkXG4gICAqL1xuXG4gIFN0YXRlQ29tcG9uZW50TWFwcGluZy5wcm90b3R5cGUud2l0aEluc3RhbmNlID0gZnVuY3Rpb24oY29tcG9uZW50KSB7XG4gICAgdGhpcy5zZXRQcm92aWRlcihuZXcgQ29tcG9uZW50SW5zdGFuY2VQcm92aWRlcihjb21wb25lbnQpKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuXG4gIC8qXG4gICAqIENyZWF0ZXMgYSBtYXBwaW5nIGZvciB0aGUgY29tcG9uZW50IHR5cGUgdG8gbmV3IGluc3RhbmNlcyBvZiB0aGUgcHJvdmlkZWQgdHlwZS5cbiAgICogVGhlIHR5cGUgc2hvdWxkIGJlIHRoZSBzYW1lIGFzIG9yIGV4dGVuZCB0aGUgdHlwZSBmb3IgdGhpcyBtYXBwaW5nLiBBIENvbXBvbmVudFR5cGVQcm92aWRlclxuICAgKiBpcyB1c2VkIGZvciB0aGUgbWFwcGluZy5cbiAgICpcbiAgICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgb2YgY29tcG9uZW50cyB0byBiZSBjcmVhdGVkIGJ5IHRoaXMgbWFwcGluZ1xuICAgKiBAcmV0dXJuIFRoaXMgQ29tcG9uZW50TWFwcGluZywgc28gbW9yZSBtb2RpZmljYXRpb25zIGNhbiBiZSBhcHBsaWVkXG4gICAqL1xuXG4gIFN0YXRlQ29tcG9uZW50TWFwcGluZy5wcm90b3R5cGUud2l0aFR5cGUgPSBmdW5jdGlvbih0eXBlKSB7XG4gICAgdGhpcy5zZXRQcm92aWRlcihuZXcgQ29tcG9uZW50VHlwZVByb3ZpZGVyKHR5cGUpKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuXG4gIC8qXG4gICAqIENyZWF0ZXMgYSBtYXBwaW5nIGZvciB0aGUgY29tcG9uZW50IHR5cGUgdG8gYSBzaW5nbGUgaW5zdGFuY2Ugb2YgdGhlIHByb3ZpZGVkIHR5cGUuXG4gICAqIFRoZSBpbnN0YW5jZSBpcyBub3QgY3JlYXRlZCB1bnRpbCBpdCBpcyBmaXJzdCByZXF1ZXN0ZWQuIFRoZSB0eXBlIHNob3VsZCBiZSB0aGUgc2FtZVxuICAgKiBhcyBvciBleHRlbmQgdGhlIHR5cGUgZm9yIHRoaXMgbWFwcGluZy4gQSBDb21wb25lbnRTaW5nbGV0b25Qcm92aWRlciBpcyB1c2VkIGZvclxuICAgKiB0aGUgbWFwcGluZy5cbiAgICpcbiAgICogQHBhcmFtIFRoZSB0eXBlIG9mIHRoZSBzaW5nbGUgaW5zdGFuY2UgdG8gYmUgY3JlYXRlZC4gSWYgb21pdHRlZCwgdGhlIHR5cGUgb2YgdGhlXG4gICAqIG1hcHBpbmcgaXMgdXNlZC5cbiAgICogQHJldHVybiBUaGlzIENvbXBvbmVudE1hcHBpbmcsIHNvIG1vcmUgbW9kaWZpY2F0aW9ucyBjYW4gYmUgYXBwbGllZFxuICAgKi9cblxuICBTdGF0ZUNvbXBvbmVudE1hcHBpbmcucHJvdG90eXBlLndpdGhTaW5nbGV0b24gPSBmdW5jdGlvbih0eXBlKSB7XG4gICAgaWYgKHR5cGUgPT0gbnVsbCkge1xuICAgICAgdHlwZSA9IHRoaXMuY29tcG9uZW50VHlwZTtcbiAgICB9XG4gICAgdGhpcy5zZXRQcm92aWRlcihuZXcgQ29tcG9uZW50U2luZ2xldG9uUHJvdmlkZXIodHlwZSkpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG5cbiAgLypcbiAgICogQ3JlYXRlcyBhIG1hcHBpbmcgZm9yIHRoZSBjb21wb25lbnQgdHlwZSB0byBhIG1ldGhvZCBjYWxsLiBBXG4gICAqIER5bmFtaWNDb21wb25lbnRQcm92aWRlciBpcyB1c2VkIGZvciB0aGUgbWFwcGluZy5cbiAgICpcbiAgICogQHBhcmFtIG1ldGhvZCBUaGUgbWV0aG9kIHRvIHJldHVybiB0aGUgY29tcG9uZW50IGluc3RhbmNlXG4gICAqIEByZXR1cm4gVGhpcyBDb21wb25lbnRNYXBwaW5nLCBzbyBtb3JlIG1vZGlmaWNhdGlvbnMgY2FuIGJlIGFwcGxpZWRcbiAgICovXG5cbiAgU3RhdGVDb21wb25lbnRNYXBwaW5nLnByb3RvdHlwZS53aXRoTWV0aG9kID0gZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgdGhpcy5zZXRQcm92aWRlcihuZXcgRHluYW1pY0NvbXBvbmVudFByb3ZpZGVyKG1ldGhvZCkpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG5cbiAgLypcbiAgICogQ3JlYXRlcyBhIG1hcHBpbmcgZm9yIHRoZSBjb21wb25lbnQgdHlwZSB0byBhbnkgQ29tcG9uZW50UHJvdmlkZXIuXG4gICAqXG4gICAqIEBwYXJhbSBwcm92aWRlciBUaGUgY29tcG9uZW50IHByb3ZpZGVyIHRvIHVzZS5cbiAgICogQHJldHVybiBUaGlzIENvbXBvbmVudE1hcHBpbmcsIHNvIG1vcmUgbW9kaWZpY2F0aW9ucyBjYW4gYmUgYXBwbGllZC5cbiAgICovXG5cbiAgU3RhdGVDb21wb25lbnRNYXBwaW5nLnByb3RvdHlwZS53aXRoUHJvdmlkZXIgPSBmdW5jdGlvbihwcm92aWRlcikge1xuICAgIHRoaXMuc2V0UHJvdmlkZXIocHJvdmlkZXIpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG5cbiAgLypcbiAgICogTWFwcyB0aHJvdWdoIHRvIHRoZSBhZGQgbWV0aG9kIG9mIHRoZSBFbnRpdHlTdGF0ZSB0aGF0IHRoaXMgbWFwcGluZyBiZWxvbmdzIHRvXG4gICAqIHNvIHRoYXQgYSBmbHVlbnQgaW50ZXJmYWNlIGNhbiBiZSB1c2VkIHdoZW4gY29uZmlndXJpbmcgZW50aXR5IHN0YXRlcy5cbiAgICpcbiAgICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgb2YgY29tcG9uZW50IHRvIGFkZCBhIG1hcHBpbmcgdG8gdGhlIHN0YXRlIGZvclxuICAgKiBAcmV0dXJuIFRoZSBuZXcgQ29tcG9uZW50TWFwcGluZyBmb3IgdGhhdCB0eXBlXG4gICAqL1xuXG4gIFN0YXRlQ29tcG9uZW50TWFwcGluZy5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24odHlwZSkge1xuICAgIHJldHVybiB0aGlzLmNyZWF0aW5nU3RhdGUuYWRkKHR5cGUpO1xuICB9O1xuXG4gIFN0YXRlQ29tcG9uZW50TWFwcGluZy5wcm90b3R5cGUuc2V0UHJvdmlkZXIgPSBmdW5jdGlvbihwcm92aWRlcikge1xuICAgIHRoaXMucHJvdmlkZXIgPSBwcm92aWRlcjtcbiAgICByZXR1cm4gdGhpcy5jcmVhdGluZ1N0YXRlLnByb3ZpZGVyc1t0aGlzLmNvbXBvbmVudFR5cGVdID0gcHJvdmlkZXI7XG4gIH07XG5cbiAgcmV0dXJuIFN0YXRlQ29tcG9uZW50TWFwcGluZztcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3RhdGVfY29tcG9uZW50X21hcHBpbmcuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXNoO1xuXG5hc2ggPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuXG4vKlxuICogVXNlZCBieSB0aGUgU3lzdGVtU3RhdGUgY2xhc3MgdG8gY3JlYXRlIHRoZSBtYXBwaW5ncyBvZiBTeXN0ZW1zIHRvIHByb3ZpZGVycyB2aWEgYSBmbHVlbnQgaW50ZXJmYWNlLlxuICovXG5cbmFzaC5mc20uU3RhdGVTeXN0ZW1NYXBwaW5nID0gKGZ1bmN0aW9uKCkge1xuICBTdGF0ZVN5c3RlbU1hcHBpbmcucHJvdG90eXBlLmNyZWF0aW5nU3RhdGUgPSBudWxsO1xuXG4gIFN0YXRlU3lzdGVtTWFwcGluZy5wcm90b3R5cGUucHJvdmlkZXIgPSBudWxsO1xuXG5cbiAgLypcbiAgICogVXNlZCBpbnRlcm5hbGx5LCB0aGUgY29uc3RydWN0b3IgY3JlYXRlcyBhIGNvbXBvbmVudCBtYXBwaW5nLiBUaGUgY29uc3RydWN0b3JcbiAgICogY3JlYXRlcyBhIFN5c3RlbVNpbmdsZXRvblByb3ZpZGVyIGFzIHRoZSBkZWZhdWx0IG1hcHBpbmcsIHdoaWNoIHdpbGwgYmUgcmVwbGFjZWRcbiAgICogYnkgbW9yZSBzcGVjaWZpYyBtYXBwaW5ncyBpZiBvdGhlciBtZXRob2RzIGFyZSBjYWxsZWQuXG4gICAqXG4gICAqIEBwYXJhbSBjcmVhdGluZ1N0YXRlIFRoZSBTeXN0ZW1TdGF0ZSB0aGF0IHRoZSBtYXBwaW5nIHdpbGwgYmVsb25nIHRvXG4gICAqIEBwYXJhbSB0eXBlIFRoZSBTeXN0ZW0gdHlwZSBmb3IgdGhlIG1hcHBpbmdcbiAgICovXG5cbiAgZnVuY3Rpb24gU3RhdGVTeXN0ZW1NYXBwaW5nKGNyZWF0aW5nU3RhdGUsIHByb3ZpZGVyKSB7XG4gICAgdGhpcy5jcmVhdGluZ1N0YXRlID0gY3JlYXRpbmdTdGF0ZTtcbiAgICB0aGlzLnByb3ZpZGVyID0gcHJvdmlkZXI7XG4gIH1cblxuXG4gIC8qXG4gICAqIEFwcGxpZXMgdGhlIHByaW9yaXR5IHRvIHRoZSBwcm92aWRlciB0aGF0IHRoZSBTeXN0ZW0gd2lsbCBiZS5cbiAgICpcbiAgICogQHBhcmFtIHByaW9yaXR5IFRoZSBjb21wb25lbnQgcHJvdmlkZXIgdG8gdXNlLlxuICAgKiBAcmV0dXJuIFRoaXMgU3RhdGVTeXN0ZW1NYXBwaW5nLCBzbyBtb3JlIG1vZGlmaWNhdGlvbnMgY2FuIGJlIGFwcGxpZWQuXG4gICAqL1xuXG4gIFN0YXRlU3lzdGVtTWFwcGluZy5wcm90b3R5cGUud2l0aFByaW9yaXR5ID0gZnVuY3Rpb24ocHJpb3JpdHkpIHtcbiAgICB0aGlzLnByb3ZpZGVyLnByaW9yaXR5ID0gcHJpb3JpdHk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cblxuICAvKlxuICAgKiBDcmVhdGVzIGEgbWFwcGluZyBmb3IgdGhlIFN5c3RlbSB0eXBlIHRvIGEgc3BlY2lmaWMgU3lzdGVtIGluc3RhbmNlLiBBXG4gICAqIFN5c3RlbUluc3RhbmNlUHJvdmlkZXIgaXMgdXNlZCBmb3IgdGhlIG1hcHBpbmcuXG4gICAqXG4gICAqIEBwYXJhbSBzeXN0ZW0gVGhlIFN5c3RlbSBpbnN0YW5jZSB0byB1c2UgZm9yIHRoZSBtYXBwaW5nXG4gICAqIEByZXR1cm4gVGhpcyBTdGF0ZVN5c3RlbU1hcHBpbmcsIHNvIG1vcmUgbW9kaWZpY2F0aW9ucyBjYW4gYmUgYXBwbGllZFxuICAgKi9cblxuICBTdGF0ZVN5c3RlbU1hcHBpbmcucHJvdG90eXBlLmFkZEluc3RhbmNlID0gZnVuY3Rpb24oc3lzdGVtKSB7XG4gICAgcmV0dXJuIGNyZWF0aW5nU3RhdGUuYWRkSW5zdGFuY2Uoc3lzdGVtKTtcbiAgfTtcblxuXG4gIC8qXG4gICAqIENyZWF0ZXMgYSBtYXBwaW5nIGZvciB0aGUgU3lzdGVtIHR5cGUgdG8gYSBzaW5nbGUgaW5zdGFuY2Ugb2YgdGhlIHByb3ZpZGVkIHR5cGUuXG4gICAqIFRoZSBpbnN0YW5jZSBpcyBub3QgY3JlYXRlZCB1bnRpbCBpdCBpcyBmaXJzdCByZXF1ZXN0ZWQuIFRoZSB0eXBlIHNob3VsZCBiZSB0aGUgc2FtZVxuICAgKiBhcyBvciBleHRlbmQgdGhlIHR5cGUgZm9yIHRoaXMgbWFwcGluZy4gQSBTeXN0ZW1TaW5nbGV0b25Qcm92aWRlciBpcyB1c2VkIGZvclxuICAgKiB0aGUgbWFwcGluZy5cbiAgICpcbiAgICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgb2YgdGhlIHNpbmdsZSBpbnN0YW5jZSB0byBiZSBjcmVhdGVkLiBJZiBvbWl0dGVkLCB0aGUgdHlwZSBvZiB0aGVcbiAgICogbWFwcGluZyBpcyB1c2VkLlxuICAgKiBAcmV0dXJuIFRoaXMgU3RhdGVTeXN0ZW1NYXBwaW5nLCBzbyBtb3JlIG1vZGlmaWNhdGlvbnMgY2FuIGJlIGFwcGxpZWRcbiAgICovXG5cbiAgU3RhdGVTeXN0ZW1NYXBwaW5nLnByb3RvdHlwZS5hZGRTaW5nbGV0b24gPSBmdW5jdGlvbih0eXBlKSB7XG4gICAgcmV0dXJuIGNyZWF0aW5nU3RhdGUuYWRkU2luZ2xldG9uKHR5cGUpO1xuICB9O1xuXG5cbiAgLypcbiAgICogQ3JlYXRlcyBhIG1hcHBpbmcgZm9yIHRoZSBTeXN0ZW0gdHlwZSB0byBhIG1ldGhvZCBjYWxsLlxuICAgKiBUaGUgbWV0aG9kIHNob3VsZCByZXR1cm4gYSBTeXN0ZW0gaW5zdGFuY2UuIEEgRHluYW1pY1N5c3RlbVByb3ZpZGVyIGlzIHVzZWQgZm9yXG4gICAqIHRoZSBtYXBwaW5nLlxuICAgKlxuICAgKiBAcGFyYW0gbWV0aG9kIFRoZSBtZXRob2QgdG8gcHJvdmlkZSB0aGUgU3lzdGVtIGluc3RhbmNlLlxuICAgKiBAcmV0dXJuIFRoaXMgU3RhdGVTeXN0ZW1NYXBwaW5nLCBzbyBtb3JlIG1vZGlmaWNhdGlvbnMgY2FuIGJlIGFwcGxpZWQuXG4gICAqL1xuXG4gIFN0YXRlU3lzdGVtTWFwcGluZy5wcm90b3R5cGUuYWRkTWV0aG9kID0gZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgcmV0dXJuIGNyZWF0aW5nU3RhdGUuYWRkTWV0aG9kKG1ldGhvZCk7XG4gIH07XG5cblxuICAvKlxuICAgKiBNYXBzIHRocm91Z2ggdG8gdGhlIGFkZFByb3ZpZGVyIG1ldGhvZCBvZiB0aGUgU3lzdGVtU3RhdGUgdGhhdCB0aGlzIG1hcHBpbmcgYmVsb25ncyB0b1xuICAgKiBzbyB0aGF0IGEgZmx1ZW50IGludGVyZmFjZSBjYW4gYmUgdXNlZCB3aGVuIGNvbmZpZ3VyaW5nIGVudGl0eSBzdGF0ZXMuXG4gICAqXG4gICAqIEBwYXJhbSBwcm92aWRlciBUaGUgY29tcG9uZW50IHByb3ZpZGVyIHRvIHVzZS5cbiAgICogQHJldHVybiBUaGlzIFN0YXRlU3lzdGVtTWFwcGluZywgc28gbW9yZSBtb2RpZmljYXRpb25zIGNhbiBiZSBhcHBsaWVkLlxuICAgKi9cblxuICBTdGF0ZVN5c3RlbU1hcHBpbmcucHJvdG90eXBlLmFkZFByb3ZpZGVyID0gZnVuY3Rpb24ocHJvdmlkZXIpIHtcbiAgICByZXR1cm4gY3JlYXRpbmdTdGF0ZS5hZGRQcm92aWRlcihwcm92aWRlcik7XG4gIH07XG5cblxuICAvKlxuICAgKi9cblxuICByZXR1cm4gU3RhdGVTeXN0ZW1NYXBwaW5nO1xuXG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zdGF0ZV9zeXN0ZW1fbWFwcGluZy5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc2g7XG5cbmFzaCA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5cbi8qXG4gKiBUaGlzIFN5c3RlbSBwcm92aWRlciBhbHdheXMgcmV0dXJucyB0aGUgc2FtZSBpbnN0YW5jZSBvZiB0aGUgY29tcG9uZW50LiBUaGUgc3lzdGVtXG4gKiBpcyBwYXNzZWQgdG8gdGhlIHByb3ZpZGVyIGF0IGluaXRpYWxpc2F0aW9uLlxuICovXG5cbmFzaC5mc20uU3lzdGVtSW5zdGFuY2VQcm92aWRlciA9IChmdW5jdGlvbigpIHtcbiAgU3lzdGVtSW5zdGFuY2VQcm92aWRlci5wcm90b3R5cGUuaW5zdGFuY2UgPSBudWxsO1xuXG4gIFN5c3RlbUluc3RhbmNlUHJvdmlkZXIucHJvdG90eXBlLnN5c3RlbVByaW9yaXR5ID0gMDtcblxuXG4gIC8qXG4gICAqIENvbnN0cnVjdG9yXG4gICAqXG4gICAqIEBwYXJhbSBpbnN0YW5jZSBUaGUgaW5zdGFuY2UgdG8gcmV0dXJuIHdoZW5ldmVyIGEgU3lzdGVtIGlzIHJlcXVlc3RlZC5cbiAgICovXG5cbiAgZnVuY3Rpb24gU3lzdGVtSW5zdGFuY2VQcm92aWRlcihpbnN0YW5jZSkge1xuICAgIHRoaXMuaW5zdGFuY2UgPSBpbnN0YW5jZTtcbiAgfVxuXG5cbiAgLypcbiAgICogVXNlZCB0byByZXF1ZXN0IGEgY29tcG9uZW50IGZyb20gdGhpcyBwcm92aWRlclxuICAgKlxuICAgKiBAcmV0dXJuIFRoZSBpbnN0YW5jZSBvZiB0aGUgU3lzdGVtXG4gICAqL1xuXG4gIFN5c3RlbUluc3RhbmNlUHJvdmlkZXIucHJvdG90eXBlLmdldFN5c3RlbSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmluc3RhbmNlO1xuICB9O1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFN5c3RlbUluc3RhbmNlUHJvdmlkZXIucHJvdG90eXBlLCB7XG5cbiAgICAvKlxuICAgICAqIFVzZWQgdG8gY29tcGFyZSB0aGlzIHByb3ZpZGVyIHdpdGggb3RoZXJzLiBBbnkgcHJvdmlkZXIgdGhhdCByZXR1cm5zIHRoZSBzYW1lIGNvbXBvbmVudFxuICAgICAqIGluc3RhbmNlIHdpbGwgYmUgcmVnYXJkZWQgYXMgZXF1aXZhbGVudC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gVGhlIGluc3RhbmNlXG4gICAgICovXG4gICAgaWRlbnRpZmllcjoge1xuICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2U7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8qXG4gICAgICogVGhlIHByaW9yaXR5IGF0IHdoaWNoIHRoZSBTeXN0ZW0gc2hvdWxkIGJlIGFkZGVkIHRvIHRoZSBFbmdpbmVcbiAgICAgKi9cbiAgICBwcmlvcml0eToge1xuICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3lzdGVtUHJpb3JpdHk7XG4gICAgICB9LFxuICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zeXN0ZW1Qcmlvcml0eSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIFN5c3RlbUluc3RhbmNlUHJvdmlkZXI7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXN5c3RlbV9pbnN0YW5jZV9wcm92aWRlci5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc2g7XG5cbmFzaCA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5cbi8qXG4gKiBUaGlzIFN5c3RlbSBwcm92aWRlciBhbHdheXMgcmV0dXJucyB0aGUgc2FtZSBpbnN0YW5jZSBvZiB0aGUgU3lzdGVtLiBUaGUgaW5zdGFuY2VcbiAqIGlzIGNyZWF0ZWQgd2hlbiBmaXJzdCByZXF1aXJlZCBhbmQgaXMgb2YgdGhlIHR5cGUgcGFzc2VkIGluIHRvIHRoZSBjb25zdHJ1Y3Rvci5cbiAqL1xuXG5hc2guZnNtLlN5c3RlbVNpbmdsZXRvblByb3ZpZGVyID0gKGZ1bmN0aW9uKCkge1xuICBTeXN0ZW1TaW5nbGV0b25Qcm92aWRlci5wcm90b3R5cGUuY29tcG9uZW50VHlwZSA9IG51bGw7XG5cbiAgU3lzdGVtU2luZ2xldG9uUHJvdmlkZXIucHJvdG90eXBlLmluc3RhbmNlID0gbnVsbDtcblxuICBTeXN0ZW1TaW5nbGV0b25Qcm92aWRlci5wcm90b3R5cGUuc3lzdGVtUHJpb3JpdHkgPSAwO1xuXG5cbiAgLypcbiAgICogQ29uc3RydWN0b3JcbiAgICpcbiAgICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgb2YgdGhlIHNpbmdsZSBTeXN0ZW0gaW5zdGFuY2VcbiAgICovXG5cbiAgZnVuY3Rpb24gU3lzdGVtU2luZ2xldG9uUHJvdmlkZXIodHlwZSkge1xuICAgIHRoaXMuY29tcG9uZW50VHlwZSA9IHR5cGU7XG4gIH1cblxuXG4gIC8qXG4gICAqIFVzZWQgdG8gcmVxdWVzdCBhIFN5c3RlbSBmcm9tIHRoaXMgcHJvdmlkZXJcbiAgICpcbiAgICogQHJldHVybiBUaGUgc2luZ2xlIGluc3RhbmNlXG4gICAqL1xuXG4gIFN5c3RlbVNpbmdsZXRvblByb3ZpZGVyLnByb3RvdHlwZS5nZXRTeXN0ZW0gPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoIXRoaXMuaW5zdGFuY2UpIHtcbiAgICAgIHRoaXMuaW5zdGFuY2UgPSBuZXcgdGhpcy5jb21wb25lbnRUeXBlKCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmluc3RhbmNlO1xuICB9O1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFN5c3RlbVNpbmdsZXRvblByb3ZpZGVyLnByb3RvdHlwZSwge1xuXG4gICAgLypcbiAgICBcdFx0ICogVXNlZCB0byBjb21wYXJlIHRoaXMgcHJvdmlkZXIgd2l0aCBvdGhlcnMuIEFueSBwcm92aWRlciB0aGF0IHJldHVybnMgdGhlIHNhbWUgc2luZ2xlXG4gICAgXHRcdCAqIGluc3RhbmNlIHdpbGwgYmUgcmVnYXJkZWQgYXMgZXF1aXZhbGVudC5cbiAgICBcdFx0ICpcbiAgICBcdFx0ICogQHJldHVybiBUaGUgc2luZ2xlIGluc3RhbmNlXG4gICAgICovXG4gICAgaWRlbnRpZmllcjoge1xuICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0U3lzdGVtKCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8qXG4gICAgICogVGhlIHByaW9yaXR5IGF0IHdoaWNoIHRoZSBTeXN0ZW0gc2hvdWxkIGJlIGFkZGVkIHRvIHRoZSBFbmdpbmVcbiAgICAgKi9cbiAgICBwcmlvcml0eToge1xuICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3lzdGVtUHJpb3JpdHk7XG4gICAgICB9LFxuICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zeXN0ZW1Qcmlvcml0eSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIFN5c3RlbVNpbmdsZXRvblByb3ZpZGVyO1xuXG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zeXN0ZW1fc2luZ2xldG9uX3Byb3ZpZGVyLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzaDtcblxuYXNoID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cblxuLypcbiAqIEEgbm9kZSBpbiB0aGUgbGlzdCBvZiBsaXN0ZW5lcnMgaW4gYSBzaWduYWwuXG4gKi9cblxuYXNoLnNpZ25hbHMuTGlzdGVuZXJOb2RlID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBMaXN0ZW5lck5vZGUoKSB7fVxuXG4gIExpc3RlbmVyTm9kZS5wcm90b3R5cGUucHJldmlvdXMgPSBudWxsO1xuXG4gIExpc3RlbmVyTm9kZS5wcm90b3R5cGUubmV4dCA9IG51bGw7XG5cbiAgTGlzdGVuZXJOb2RlLnByb3RvdHlwZS5saXN0ZW5lciA9IG51bGw7XG5cbiAgTGlzdGVuZXJOb2RlLnByb3RvdHlwZS5vbmNlID0gZmFsc2U7XG5cbiAgcmV0dXJuIExpc3RlbmVyTm9kZTtcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bGlzdGVuZXJfbm9kZS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBMaXN0ZW5lck5vZGUsIGFzaDtcblxuYXNoID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cbkxpc3RlbmVyTm9kZSA9IGFzaC5zaWduYWxzLkxpc3RlbmVyTm9kZTtcblxuXG4vKlxuICogVGhpcyBpbnRlcm5hbCBjbGFzcyBtYWludGFpbnMgYSBwb29sIG9mIGRlbGV0ZWQgbGlzdGVuZXIgbm9kZXMgZm9yIHJldXNlIGJ5IGZyYW1ld29yay4gVGhpcyByZWR1Y2VzXG4gKiB0aGUgb3ZlcmhlYWQgZnJvbSBvYmplY3QgY3JlYXRpb24gYW5kIGdhcmJhZ2UgY29sbGVjdGlvbi5cbiAqL1xuXG5hc2guc2lnbmFscy5MaXN0ZW5lck5vZGVQb29sID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBMaXN0ZW5lck5vZGVQb29sKCkge31cblxuICBMaXN0ZW5lck5vZGVQb29sLnByb3RvdHlwZS50YWlsID0gbnVsbDtcblxuICBMaXN0ZW5lck5vZGVQb29sLnByb3RvdHlwZS5jYWNoZVRhaWwgPSBudWxsO1xuXG4gIExpc3RlbmVyTm9kZVBvb2wucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBub2RlO1xuICAgIGlmICh0aGlzLnRhaWwgIT09IG51bGwpIHtcbiAgICAgIG5vZGUgPSB0aGlzLnRhaWw7XG4gICAgICB0aGlzLnRhaWwgPSB0aGlzLnRhaWwucHJldmlvdXM7XG4gICAgICBub2RlLnByZXZpb3VzID0gbnVsbDtcbiAgICAgIHJldHVybiBub2RlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbmV3IExpc3RlbmVyTm9kZSgpO1xuICAgIH1cbiAgfTtcblxuICBMaXN0ZW5lck5vZGVQb29sLnByb3RvdHlwZS5kaXNwb3NlID0gZnVuY3Rpb24obm9kZSkge1xuICAgIG5vZGUubGlzdGVuZXIgPSBudWxsO1xuICAgIG5vZGUub25jZSA9IGZhbHNlO1xuICAgIG5vZGUubmV4dCA9IG51bGw7XG4gICAgbm9kZS5wcmV2aW91cyA9IHRoaXMudGFpbDtcbiAgICB0aGlzLnRhaWwgPSBub2RlO1xuICB9O1xuXG4gIExpc3RlbmVyTm9kZVBvb2wucHJvdG90eXBlLmNhY2hlID0gZnVuY3Rpb24obm9kZSkge1xuICAgIG5vZGUubGlzdGVuZXIgPSBudWxsO1xuICAgIG5vZGUucHJldmlvdXMgPSB0aGlzLmNhY2hlVGFpbDtcbiAgICB0aGlzLmNhY2hlVGFpbCA9IG5vZGU7XG4gIH07XG5cbiAgTGlzdGVuZXJOb2RlUG9vbC5wcm90b3R5cGUucmVsZWFzZUNhY2hlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG5vZGU7XG4gICAgd2hpbGUgKHRoaXMuY2FjaGVUYWlsICE9PSBudWxsKSB7XG4gICAgICBub2RlID0gdGhpcy5jYWNoZVRhaWw7XG4gICAgICB0aGlzLmNhY2hlVGFpbCA9IG5vZGUucHJldmlvdXM7XG4gICAgICBub2RlLm5leHQgPSBudWxsO1xuICAgICAgbm9kZS5wcmV2aW91cyA9IHRoaXMudGFpbDtcbiAgICAgIHRoaXMudGFpbCA9IG5vZGU7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBMaXN0ZW5lck5vZGVQb29sO1xuXG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1saXN0ZW5lcl9ub2RlX3Bvb2wuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXNoLFxuICBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgX19leHRlbmRzID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChfX2hhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH07XG5cbmFzaCA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5hc2guc2lnbmFscy5TaWduYWwwID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICBfX2V4dGVuZHMoU2lnbmFsMCwgX3N1cGVyKTtcblxuICBmdW5jdGlvbiBTaWduYWwwKCkge1xuICAgIHJldHVybiBTaWduYWwwLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgU2lnbmFsMC5wcm90b3R5cGUuZGlzcGF0Y2ggPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbm9kZTtcbiAgICB0aGlzLnN0YXJ0RGlzcGF0Y2goKTtcbiAgICBub2RlID0gdGhpcy5oZWFkO1xuICAgIHdoaWxlIChub2RlICE9PSBudWxsKSB7XG4gICAgICBub2RlLmxpc3RlbmVyKCk7XG4gICAgICBpZiAobm9kZS5vbmNlKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlKG5vZGUubGlzdGVuZXIpO1xuICAgICAgfVxuICAgICAgbm9kZSA9IG5vZGUubmV4dDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZW5kRGlzcGF0Y2goKTtcbiAgfTtcblxuICByZXR1cm4gU2lnbmFsMDtcblxufSkoYXNoLnNpZ25hbHMuU2lnbmFsQmFzZSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNpZ25hbDAuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXNoLFxuICBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgX19leHRlbmRzID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChfX2hhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH07XG5cbmFzaCA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5hc2guc2lnbmFscy5TaWduYWwxID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICBfX2V4dGVuZHMoU2lnbmFsMSwgX3N1cGVyKTtcblxuICBmdW5jdGlvbiBTaWduYWwxKCkge1xuICAgIHJldHVybiBTaWduYWwxLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgU2lnbmFsMS5wcm90b3R5cGUuZGlzcGF0Y2ggPSBmdW5jdGlvbigkMSkge1xuICAgIHZhciBub2RlO1xuICAgIHRoaXMuc3RhcnREaXNwYXRjaCgpO1xuICAgIG5vZGUgPSB0aGlzLmhlYWQ7XG4gICAgd2hpbGUgKG5vZGUgIT09IG51bGwpIHtcbiAgICAgIG5vZGUubGlzdGVuZXIoJDEpO1xuICAgICAgaWYgKG5vZGUub25jZSkge1xuICAgICAgICB0aGlzLnJlbW92ZShub2RlLmxpc3RlbmVyKTtcbiAgICAgIH1cbiAgICAgIG5vZGUgPSBub2RlLm5leHQ7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmVuZERpc3BhdGNoKCk7XG4gIH07XG5cbiAgcmV0dXJuIFNpZ25hbDE7XG5cbn0pKGFzaC5zaWduYWxzLlNpZ25hbEJhc2UpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zaWduYWwxLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzaCxcbiAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9O1xuXG5hc2ggPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuYXNoLnNpZ25hbHMuU2lnbmFsMiA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgX19leHRlbmRzKFNpZ25hbDIsIF9zdXBlcik7XG5cbiAgZnVuY3Rpb24gU2lnbmFsMigpIHtcbiAgICByZXR1cm4gU2lnbmFsMi5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFNpZ25hbDIucHJvdG90eXBlLmRpc3BhdGNoID0gZnVuY3Rpb24oJDEsICQyKSB7XG4gICAgdmFyIG5vZGU7XG4gICAgdGhpcy5zdGFydERpc3BhdGNoKCk7XG4gICAgbm9kZSA9IHRoaXMuaGVhZDtcbiAgICB3aGlsZSAobm9kZSkge1xuICAgICAgbm9kZS5saXN0ZW5lcigkMSwgJDIpO1xuICAgICAgaWYgKG5vZGUub25jZSkge1xuICAgICAgICB0aGlzLnJlbW92ZShub2RlLmxpc3RlbmVyKTtcbiAgICAgIH1cbiAgICAgIG5vZGUgPSBub2RlLm5leHQ7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmVuZERpc3BhdGNoKCk7XG4gIH07XG5cbiAgcmV0dXJuIFNpZ25hbDI7XG5cbn0pKGFzaC5zaWduYWxzLlNpZ25hbEJhc2UpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zaWduYWwyLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzaCxcbiAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9O1xuXG5hc2ggPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuYXNoLnNpZ25hbHMuU2lnbmFsMyA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgX19leHRlbmRzKFNpZ25hbDMsIF9zdXBlcik7XG5cbiAgZnVuY3Rpb24gU2lnbmFsMygpIHtcbiAgICByZXR1cm4gU2lnbmFsMy5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFNpZ25hbDMucHJvdG90eXBlLmRpc3BhdGNoID0gZnVuY3Rpb24oJDEsICQyLCAkMykge1xuICAgIHZhciBub2RlO1xuICAgIHRoaXMuc3RhcnREaXNwYXRjaCgpO1xuICAgIG5vZGUgPSB0aGlzLmhlYWQ7XG4gICAgd2hpbGUgKG5vZGUgIT09IG51bGwpIHtcbiAgICAgIG5vZGUubGlzdGVuZXIoJDEsICQyLCAkMyk7XG4gICAgICBpZiAobm9kZS5vbmNlKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlKG5vZGUubGlzdGVuZXIpO1xuICAgICAgfVxuICAgICAgbm9kZSA9IG5vZGUubmV4dDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZW5kRGlzcGF0Y2goKTtcbiAgfTtcblxuICByZXR1cm4gU2lnbmFsMztcblxufSkoYXNoLnNpZ25hbHMuU2lnbmFsQmFzZSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNpZ25hbDMuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgTGlzdGVuZXJOb2RlUG9vbCwgYXNoO1xuXG5hc2ggPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuTGlzdGVuZXJOb2RlUG9vbCA9IGFzaC5zaWduYWxzLkxpc3RlbmVyTm9kZVBvb2w7XG5cbmFzaC5zaWduYWxzLlNpZ25hbEJhc2UgPSAoZnVuY3Rpb24oKSB7XG4gIFNpZ25hbEJhc2UucHJvdG90eXBlLmhlYWQgPSBudWxsO1xuXG4gIFNpZ25hbEJhc2UucHJvdG90eXBlLnRhaWwgPSBudWxsO1xuXG4gIFNpZ25hbEJhc2UucHJvdG90eXBlLm51bUxpc3RlbmVycyA9IDA7XG5cbiAgU2lnbmFsQmFzZS5wcm90b3R5cGUua2V5cyA9IG51bGw7XG5cbiAgU2lnbmFsQmFzZS5wcm90b3R5cGUubm9kZXMgPSBudWxsO1xuXG4gIFNpZ25hbEJhc2UucHJvdG90eXBlLmxpc3RlbmVyTm9kZVBvb2wgPSBudWxsO1xuXG4gIFNpZ25hbEJhc2UucHJvdG90eXBlLnRvQWRkSGVhZCA9IG51bGw7XG5cbiAgU2lnbmFsQmFzZS5wcm90b3R5cGUudG9BZGRUYWlsID0gbnVsbDtcblxuICBTaWduYWxCYXNlLnByb3RvdHlwZS5kaXNwYXRjaGluZyA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIFNpZ25hbEJhc2UoKSB7XG4gICAgdGhpcy5ub2RlcyA9IFtdO1xuICAgIHRoaXMua2V5cyA9IFtdO1xuICAgIHRoaXMubGlzdGVuZXJOb2RlUG9vbCA9IG5ldyBMaXN0ZW5lck5vZGVQb29sKCk7XG4gICAgdGhpcy5udW1MaXN0ZW5lcnMgPSAwO1xuICB9XG5cbiAgU2lnbmFsQmFzZS5wcm90b3R5cGUuc3RhcnREaXNwYXRjaCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZGlzcGF0Y2hpbmcgPSB0cnVlO1xuICB9O1xuXG4gIFNpZ25hbEJhc2UucHJvdG90eXBlLmVuZERpc3BhdGNoID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5kaXNwYXRjaGluZyA9IGZhbHNlO1xuICAgIGlmICh0aGlzLnRvQWRkSGVhZCkge1xuICAgICAgaWYgKCF0aGlzLmhlYWQpIHtcbiAgICAgICAgdGhpcy5oZWFkID0gdGhpcy50b0FkZEhlYWQ7XG4gICAgICAgIHRoaXMudGFpbCA9IHRoaXMudG9BZGRUYWlsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy50YWlsLm5leHQgPSB0aGlzLnRvQWRkSGVhZDtcbiAgICAgICAgdGhpcy50b0FkZEhlYWQucHJldmlvdXMgPSB0aGlzLnRhaWw7XG4gICAgICAgIHRoaXMudGFpbCA9IHRoaXMudG9BZGRUYWlsO1xuICAgICAgfVxuICAgICAgdGhpcy50b0FkZEhlYWQgPSBudWxsO1xuICAgICAgdGhpcy50b0FkZFRhaWwgPSBudWxsO1xuICAgIH1cbiAgICB0aGlzLmxpc3RlbmVyTm9kZVBvb2wucmVsZWFzZUNhY2hlKCk7XG4gIH07XG5cbiAgU2lnbmFsQmFzZS5wcm90b3R5cGUuZ2V0Tm9kZSA9IGZ1bmN0aW9uKGxpc3RlbmVyKSB7XG4gICAgdmFyIG5vZGU7XG4gICAgbm9kZSA9IHRoaXMuaGVhZDtcbiAgICB3aGlsZSAobm9kZSAhPT0gbnVsbCkge1xuICAgICAgaWYgKG5vZGUubGlzdGVuZXIgPT09IGxpc3RlbmVyKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgbm9kZSA9IG5vZGUubmV4dDtcbiAgICB9XG4gICAgaWYgKG5vZGUgPT09IG51bGwpIHtcbiAgICAgIG5vZGUgPSB0aGlzLnRvQWRkSGVhZDtcbiAgICAgIHdoaWxlIChub2RlICE9PSBudWxsKSB7XG4gICAgICAgIGlmIChub2RlLmxpc3RlbmVyID09PSBsaXN0ZW5lcikge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIG5vZGUgPSBub2RlLm5leHQ7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBub2RlO1xuICB9O1xuXG4gIFNpZ25hbEJhc2UucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKGxpc3RlbmVyKSB7XG4gICAgdmFyIG5vZGU7XG4gICAgaWYgKHRoaXMua2V5cy5pbmRleE9mKGxpc3RlbmVyKSAhPT0gLTEpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbm9kZSA9IHRoaXMubGlzdGVuZXJOb2RlUG9vbC5nZXQoKTtcbiAgICBub2RlLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gICAgdGhpcy5ub2Rlcy5wdXNoKG5vZGUpO1xuICAgIHRoaXMua2V5cy5wdXNoKGxpc3RlbmVyKTtcbiAgICB0aGlzLmFkZE5vZGUobm9kZSk7XG4gIH07XG5cbiAgU2lnbmFsQmFzZS5wcm90b3R5cGUuYWRkT25jZSA9IGZ1bmN0aW9uKGxpc3RlbmVyKSB7XG4gICAgdmFyIG5vZGU7XG4gICAgaWYgKHRoaXMua2V5cy5pbmRleE9mKGxpc3RlbmVyKSAhPT0gLTEpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbm9kZSA9IHRoaXMubGlzdGVuZXJOb2RlUG9vbC5nZXQoKTtcbiAgICBub2RlLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gICAgbm9kZS5vbmNlID0gdHJ1ZTtcbiAgICB0aGlzLm5vZGVzLnB1c2gobm9kZSk7XG4gICAgdGhpcy5rZXlzLnB1c2gobGlzdGVuZXIpO1xuICAgIHRoaXMuYWRkTm9kZShub2RlKTtcbiAgfTtcblxuICBTaWduYWxCYXNlLnByb3RvdHlwZS5hZGROb2RlID0gZnVuY3Rpb24obm9kZSkge1xuICAgIGlmICh0aGlzLmRpc3BhdGNoaW5nKSB7XG4gICAgICBpZiAodGhpcy50b0FkZEhlYWQgPT09IG51bGwpIHtcbiAgICAgICAgdGhpcy50b0FkZEhlYWQgPSB0aGlzLnRvQWRkVGFpbCA9IG5vZGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnRvQWRkVGFpbC5uZXh0ID0gbm9kZTtcbiAgICAgICAgbm9kZS5wcmV2aW91cyA9IHRoaXMudG9BZGRUYWlsO1xuICAgICAgICB0aGlzLnRvQWRkVGFpbCA9IG5vZGU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLmhlYWQgPT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5oZWFkID0gdGhpcy50YWlsID0gbm9kZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudGFpbC5uZXh0ID0gbm9kZTtcbiAgICAgICAgbm9kZS5wcmV2aW91cyA9IHRoaXMudGFpbDtcbiAgICAgICAgdGhpcy50YWlsID0gbm9kZTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5udW1MaXN0ZW5lcnMrKztcbiAgfTtcblxuICBTaWduYWxCYXNlLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbihsaXN0ZW5lcikge1xuICAgIHZhciBpbmRleCwgbm9kZTtcbiAgICBpbmRleCA9IHRoaXMua2V5cy5pbmRleE9mKGxpc3RlbmVyKTtcbiAgICBub2RlID0gdGhpcy5ub2Rlc1tpbmRleF07XG4gICAgaWYgKG5vZGUpIHtcbiAgICAgIGlmICh0aGlzLmhlYWQgPT09IG5vZGUpIHtcbiAgICAgICAgdGhpcy5oZWFkID0gdGhpcy5oZWFkLm5leHQ7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy50YWlsID09PSBub2RlKSB7XG4gICAgICAgIHRoaXMudGFpbCA9IHRoaXMudGFpbC5wcmV2aW91cztcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnRvQWRkSGVhZCA9PT0gbm9kZSkge1xuICAgICAgICB0aGlzLnRvQWRkSGVhZCA9IHRoaXMudG9BZGRIZWFkLm5leHQ7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy50b0FkZFRhaWwgPT09IG5vZGUpIHtcbiAgICAgICAgdGhpcy50b0FkZFRhaWwgPSB0aGlzLnRvQWRkVGFpbC5wcmV2aW91cztcbiAgICAgIH1cbiAgICAgIGlmIChub2RlLnByZXZpb3VzKSB7XG4gICAgICAgIG5vZGUucHJldmlvdXMubmV4dCA9IG5vZGUubmV4dDtcbiAgICAgIH1cbiAgICAgIGlmIChub2RlLm5leHQpIHtcbiAgICAgICAgbm9kZS5uZXh0LnByZXZpb3VzID0gbm9kZS5wcmV2aW91cztcbiAgICAgIH1cbiAgICAgIHRoaXMubm9kZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIHRoaXMua2V5cy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgaWYgKHRoaXMuZGlzcGF0Y2hpbmcpIHtcbiAgICAgICAgdGhpcy5saXN0ZW5lck5vZGVQb29sLmNhY2hlKG5vZGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5saXN0ZW5lck5vZGVQb29sLmRpc3Bvc2Uobm9kZSk7XG4gICAgICB9XG4gICAgICB0aGlzLm51bUxpc3RlbmVycy0tO1xuICAgIH1cbiAgfTtcblxuICBTaWduYWxCYXNlLnByb3RvdHlwZS5yZW1vdmVBbGwgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbm9kZTtcbiAgICB3aGlsZSAodGhpcy5oZWFkKSB7XG4gICAgICBub2RlID0gdGhpcy5oZWFkO1xuICAgICAgdGhpcy5oZWFkID0gdGhpcy5oZWFkLm5leHQ7XG4gICAgICB0aGlzLm5vZGVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICB0aGlzLmxpc3RlbmVyTm9kZVBvb2wuZGlzcG9zZShub2RlKTtcbiAgICB9XG4gICAgdGhpcy5ub2RlcyA9IFtdO1xuICAgIHRoaXMua2V5cyA9IFtdO1xuICAgIHRoaXMudGFpbCA9IG51bGw7XG4gICAgdGhpcy50b0FkZEhlYWQgPSBudWxsO1xuICAgIHRoaXMudG9BZGRUYWlsID0gbnVsbDtcbiAgICB0aGlzLm51bUxpc3RlbmVycyA9IDA7XG4gIH07XG5cbiAgcmV0dXJuIFNpZ25hbEJhc2U7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNpZ25hbF9iYXNlLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIFNpZ25hbDEsIGFzaCxcbiAgX19iaW5kID0gZnVuY3Rpb24oZm4sIG1lKXsgcmV0dXJuIGZ1bmN0aW9uKCl7IHJldHVybiBmbi5hcHBseShtZSwgYXJndW1lbnRzKTsgfTsgfSxcbiAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9O1xuXG5hc2ggPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuU2lnbmFsMSA9IGFzaC5zaWduYWxzLlNpZ25hbDE7XG5cblxuLypcbiAqIFVzZXMgdGhlIGVudGVyIGZyYW1lIGV2ZW50IHRvIHByb3ZpZGUgYSBmcmFtZSB0aWNrIHdoZXJlIHRoZSBmcmFtZSBkdXJhdGlvbiBpcyB0aGUgdGltZSBzaW5jZSB0aGUgcHJldmlvdXMgZnJhbWUuXG4gKiBUaGVyZSBpcyBhIG1heGltdW0gZnJhbWUgdGltZSBwYXJhbWV0ZXIgaW4gdGhlIGNvbnN0cnVjdG9yIHRoYXQgY2FuIGJlIHVzZWQgdG8gbGltaXRcbiAqIHRoZSBsb25nZXN0IHBlcmlvZCBhIGZyYW1lIGNhbiBiZS5cbiAqL1xuXG5hc2gudGljay5GcmFtZVRpY2tQcm92aWRlciA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgX19leHRlbmRzKEZyYW1lVGlja1Byb3ZpZGVyLCBfc3VwZXIpO1xuXG4gIEZyYW1lVGlja1Byb3ZpZGVyLnByb3RvdHlwZS5kaXNwbGF5T2JqZWN0ID0gbnVsbDtcblxuICBGcmFtZVRpY2tQcm92aWRlci5wcm90b3R5cGUucHJldmlvdXNUaW1lID0gMDtcblxuICBGcmFtZVRpY2tQcm92aWRlci5wcm90b3R5cGUubWF4aW11bUZyYW1lVGltZSA9IDA7XG5cbiAgRnJhbWVUaWNrUHJvdmlkZXIucHJvdG90eXBlLmlzUGxheWluZyA9IGZhbHNlO1xuXG4gIEZyYW1lVGlja1Byb3ZpZGVyLnByb3RvdHlwZS5yZXF1ZXN0ID0gbnVsbDtcblxuXG4gIC8qXG4gICAqIEFwcGxpZXMgYSB0aW1lIGFkanVzdGVtZW50IGZhY3RvciB0byB0aGUgdGljaywgc28geW91IGNhbiBzbG93IGRvd24gb3Igc3BlZWQgdXAgdGhlIGVudGlyZSBlbmdpbmUuXG4gICAqIFRoZSB1cGRhdGUgdGljayB0aW1lIGlzIG11bHRpcGxpZWQgYnkgdGhpcyB2YWx1ZSwgc28gYSB2YWx1ZSBvZiAxIHdpbGwgcnVuIHRoZSBlbmdpbmUgYXQgdGhlIG5vcm1hbCByYXRlLlxuICAgKi9cblxuICBGcmFtZVRpY2tQcm92aWRlci5wcm90b3R5cGUudGltZUFkanVzdG1lbnQgPSAxO1xuXG4gIGZ1bmN0aW9uIEZyYW1lVGlja1Byb3ZpZGVyKGRpc3BsYXlPYmplY3QsIG1heGltdW1GcmFtZVRpbWUpIHtcbiAgICB0aGlzLmRpc3BsYXlPYmplY3QgPSBkaXNwbGF5T2JqZWN0O1xuICAgIHRoaXMubWF4aW11bUZyYW1lVGltZSA9IG1heGltdW1GcmFtZVRpbWU7XG4gICAgdGhpcy5kaXNwYXRjaFRpY2sgPSBfX2JpbmQodGhpcy5kaXNwYXRjaFRpY2ssIHRoaXMpO1xuICAgIEZyYW1lVGlja1Byb3ZpZGVyLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoRnJhbWVUaWNrUHJvdmlkZXIucHJvdG90eXBlLCB7XG4gICAgcGxheWluZzoge1xuICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNQbGF5aW5nO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgRnJhbWVUaWNrUHJvdmlkZXIucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5yZXF1ZXN0ID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuZGlzcGF0Y2hUaWNrKTtcbiAgICB0aGlzLmlzUGxheWluZyA9IHRydWU7XG4gIH07XG5cbiAgRnJhbWVUaWNrUHJvdmlkZXIucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbigpIHtcbiAgICBjYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5yZXF1ZXN0KTtcbiAgICB0aGlzLmlzUGxheWluZyA9IGZhbHNlO1xuICB9O1xuXG4gIEZyYW1lVGlja1Byb3ZpZGVyLnByb3RvdHlwZS5kaXNwYXRjaFRpY2sgPSBmdW5jdGlvbih0aW1lc3RhbXApIHtcbiAgICB2YXIgZnJhbWVUaW1lLCB0ZW1wO1xuICAgIGlmICh0aW1lc3RhbXAgPT0gbnVsbCkge1xuICAgICAgdGltZXN0YW1wID0gRGF0ZS5ub3coKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuZGlzcGxheU9iamVjdCkge1xuICAgICAgdGhpcy5kaXNwbGF5T2JqZWN0LmJlZ2luKCk7XG4gICAgfVxuICAgIHRlbXAgPSB0aGlzLnByZXZpb3VzVGltZSB8fCB0aW1lc3RhbXA7XG4gICAgdGhpcy5wcmV2aW91c1RpbWUgPSB0aW1lc3RhbXA7XG4gICAgZnJhbWVUaW1lID0gKHRpbWVzdGFtcCAtIHRlbXApICogMC4wMDE7XG4gICAgdGhpcy5kaXNwYXRjaChmcmFtZVRpbWUpO1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmRpc3BhdGNoVGljayk7XG4gICAgaWYgKHRoaXMuZGlzcGxheU9iamVjdCkge1xuICAgICAgdGhpcy5kaXNwbGF5T2JqZWN0LmVuZCgpO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gRnJhbWVUaWNrUHJvdmlkZXI7XG5cbn0pKFNpZ25hbDEpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1mcmFtZV90aWNrX3Byb3ZpZGVyLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIERpY3Rpb25hcnksIGFzaCxcbiAgX19pbmRleE9mID0gW10uaW5kZXhPZiB8fCBmdW5jdGlvbihpdGVtKSB7IGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5sZW5ndGg7IGkgPCBsOyBpKyspIHsgaWYgKGkgaW4gdGhpcyAmJiB0aGlzW2ldID09PSBpdGVtKSByZXR1cm4gaTsgfSByZXR1cm4gLTE7IH07XG5cbmFzaCA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5EaWN0aW9uYXJ5ID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBEaWN0aW9uYXJ5KCkge31cblxuICByZXR1cm4gRGljdGlvbmFyeTtcblxufSkoKTtcblxuXG4vKlxuICogQW4gb2JqZWN0IHBvb2wgZm9yIHJlLXVzaW5nIGNvbXBvbmVudHMuIFRoaXMgaXMgbm90IGludGVncmF0ZWQgaW4gdG8gQXNoIGJ1dCBpcyB1c2VkIGRpZXJlY3RseSBieVxuICogdGhlIGRldmVsb3Blci4gSXQgZXhwZWN0cyBjb21wb25lbnRzIHRvIG5vdCByZXF1aXJlIGFueSBwYXJhbWV0ZXJzIGluIHRoZWlyIGNvbnN0cnVjdG9yLlxuICpcbiAqIDxwPkZldGNoIGFuIG9iamVjdCBmcm9tIHRoZSBwb29sIHdpdGg8L3A+XG4gKlxuICogPHA+Q29tcG9uZW50UG9vbC5nZXQoIENvbXBvbmVudENsYXNzICk7PC9wPlxuICpcbiAqIDxwPklmIHRoZSBwb29sIGNvbnRhaW5zIGFuIG9iamVjdCBvZiB0aGUgcmVxdWlyZWQgdHlwZSwgaXQgd2lsbCBiZSByZXR1cm5lZC4gSWYgaXQgZG9lcyBub3QsIGEgbmV3IG9iamVjdFxuICogd2lsbCBiZSBjcmVhdGVkIGFuZCByZXR1cm5lZC48L3A+XG4gKlxuICogPHA+VGhlIG9iamVjdCByZXR1cm5lZCBtYXkgaGF2ZSBwcm9wZXJ0aWVzIHNldCBvbiBpdCBmcm9tIHRoZSB0aW1lIGl0IHdhcyBwcmV2aW91c2x5IHVzZWQsIHNvIGFsbCBwcm9wZXJ0aWVzXG4gKiBzaG91bGQgYmUgcmVzZXQgaW4gdGhlIG9iamVjdCBvbmNlIGl0IGlzIHJlY2VpdmVkLjwvcD5cbiAqXG4gKiA8cD5BZGQgYW4gb2JqZWN0IHRvIHRoZSBwb29sIHdpdGg8L3A+XG4gKlxuICogPHA+Q29tcG9uZW50UG9vbC5kaXNwb3NlKCBjb21wb25lbnQgKTs8L3A+XG4gKlxuICogPHA+WW91IHdpbGwgdXN1YWxseSB3YW50IHRvIGRvIHRoaXMgd2hlbiByZW1vdmluZyBhIGNvbXBvbmVudCBmcm9tIGFuIGVudGl0eS4gVGhlIHJlbW92ZSBtZXRob2Qgb24gdGhlIGVudGl0eVxuICogcmV0dXJucyB0aGUgY29tcG9uZW50IHRoYXQgd2FzIHJlbW92ZWQsIHNvIHRoaXMgY2FuIGJlIGRvbmUgaW4gb25lIGxpbmUgb2YgY29kZSBsaWtlIHRoaXM8L3A+XG4gKlxuICogPHA+Q29tcG9uZW50UG9vbC5kaXNwb3NlKCBlbnRpdHkucmVtb3ZlKCBjb21wb25lbnQgKSApOzwvcD5cbiAqL1xuXG5hc2gudG9vbHMuQ29tcG9uZW50UG9vbCA9IChmdW5jdGlvbigpIHtcbiAgdmFyIGdldFBvb2wsIHBvb2xzO1xuXG4gIGZ1bmN0aW9uIENvbXBvbmVudFBvb2woKSB7fVxuXG4gIHBvb2xzID0gbmV3IERpY3Rpb25hcnkoKTtcblxuICBnZXRQb29sID0gZnVuY3Rpb24oY29tcG9uZW50Q2xhc3MpIHtcbiAgICB2YXIgX3JlZjtcbiAgICBpZiAoKF9yZWYgPSBjb21wb25lbnRDbGFzcy5uYW1lLCBfX2luZGV4T2YuY2FsbChwb29scywgX3JlZikgPj0gMCkpIHtcbiAgICAgIHJldHVybiBwb29sc1tjb21wb25lbnRDbGFzcy5uYW1lXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHBvb2xzW2NvbXBvbmVudENsYXNzLm5hbWVdID0gW107XG4gICAgfVxuICB9O1xuXG5cbiAgLypcbiAgICogR2V0IGFuIG9iamVjdCBmcm9tIHRoZSBwb29sLlxuICAgKlxuICAgKiBAcGFyYW0gY29tcG9uZW50Q2xhc3MgVGhlIHR5cGUgb2YgY29tcG9uZW50IHdhbnRlZC5cbiAgICogQHJldHVybiBUaGUgY29tcG9uZW50LlxuICAgKi9cblxuICBDb21wb25lbnRQb29sLmdldCA9IGZ1bmN0aW9uKGNvbXBvbmVudENsYXNzKSB7XG4gICAgdmFyIHBvb2w7XG4gICAgcG9vbCA9IGdldFBvb2woY29tcG9uZW50Q2xhc3MpO1xuICAgIGlmIChwb29sLmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiBwb29sLnBvcCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbmV3IGNvbXBvbmVudENsYXNzKCk7XG4gICAgfVxuICB9O1xuXG5cbiAgLypcbiAgICogUmV0dXJuIGFuIG9iamVjdCB0byB0aGUgcG9vbCBmb3IgcmV1c2UuXG4gICAqXG4gICAqIEBwYXJhbSBjb21wb25lbnQgVGhlIGNvbXBvbmVudCB0byByZXR1cm4gdG8gdGhlIHBvb2wuXG4gICAqL1xuXG4gIENvbXBvbmVudFBvb2wuZGlzcG9zZSA9IGZ1bmN0aW9uKGNvbXBvbmVudCkge1xuICAgIHZhciBwb29sLCB0eXBlO1xuICAgIGlmIChjb21wb25lbnQpIHtcbiAgICAgIHR5cGUgPSBjb21wb25lbnQuY29uc3RydWN0b3I7XG4gICAgICBwb29sID0gZ2V0UG9vbCh0eXBlKTtcbiAgICAgIHBvb2wucHVzaChjb21wb25lbnQpO1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gICAqIERpc3Bvc2Ugb2YgYWxsIHBvb2xlZCByZXNvdXJjZXMsIGZyZWVpbmcgdGhlbSBmb3IgZ2FyYmFnZSBjb2xsZWN0aW9uLlxuICAgKi9cblxuICBDb21wb25lbnRQb29sLmVtcHR5ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHBvb2xzID0gbmV3IERpY3Rpb25hcnkoKTtcbiAgfTtcblxuICByZXR1cm4gQ29tcG9uZW50UG9vbDtcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29tcG9uZW50X3Bvb2wuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgRW5naW5lLCBOb2RlLCBOb2RlTGlzdCwgU3lzdGVtLCBhc2gsXG4gIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICBfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfTtcblxuYXNoID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cbkVuZ2luZSA9IGFzaC5jb3JlLkVuZ2luZTtcblxuTm9kZSA9IGFzaC5jb3JlLk5vZGU7XG5cbk5vZGVMaXN0ID0gYXNoLmNvcmUuTm9kZUxpc3Q7XG5cblN5c3RlbSA9IGFzaC5jb3JlLlN5c3RlbTtcblxuXG4vKlxuICogQSB1c2VmdWwgY2xhc3MgZm9yIHN5c3RlbXMgd2hpY2ggc2ltcGx5IGl0ZXJhdGUgb3ZlciBhIHNldCBvZiBub2RlcywgcGVyZm9ybWluZyB0aGUgc2FtZSBhY3Rpb24gb24gZWFjaCBub2RlLiBUaGlzXG4gKiBjbGFzcyByZW1vdmVzIHRoZSBuZWVkIGZvciBhIGxvdCBvZiBib2lsZXJwbGF0ZSBjb2RlIGluIHN1Y2ggc3lzdGVtcy4gRXh0ZW5kIHRoaXMgY2xhc3MgYW5kIHBhc3MgdGhlIG5vZGUgdHlwZSBhbmRcbiAqIGEgbm9kZSB1cGRhdGUgbWV0aG9kIGludG8gdGhlIGNvbnN0cnVjdG9yLiBUaGUgbm9kZSB1cGRhdGUgbWV0aG9kIHdpbGwgYmUgY2FsbGVkIG9uY2UgcGVyIG5vZGUgb24gdGhlIHVwZGF0ZSBjeWNsZVxuICogd2l0aCB0aGUgbm9kZSBpbnN0YW5jZSBhbmQgdGhlIGZyYW1lIHRpbWUgYXMgcGFyYW1ldGVycy4gZS5nLlxuICpcbiAqIDxjb2RlPnBhY2thZ2U7XG4gKiBjbGFzcyBNeVN5c3RlbSBleHRlbmRzIExpc3RJdGVyYXRpbmdTeXN0ZW08TXlOb2RlPlxuICoge1xuICogICAgIHB1YmxpYyBmdW5jdGlvbiBuZXcoKVxuICogICAgIHtcbiAqICAgICAgICAgc3VwZXIoTXlOb2RlLCB1cGRhdGVOb2RlKTtcbiAqICAgICB9XG4gKlxuICogICAgIHByaXZhdGUgZnVuY3Rpb24gdXBkYXRlTm9kZShub2RlOk15Tm9kZSwgdGltZTpGbG9hdCk6Vm9pZFxuICogICAgIHtcbiAqICAgICAgICAgLy8gcHJvY2VzcyB0aGUgbm9kZSBoZXJlXG4gKiAgICAgfVxuICogfVxuICogPC9jb2RlPlxuICovXG5cbmFzaC50b29scy5MaXN0SXRlcmF0aW5nU3lzdGVtID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICBfX2V4dGVuZHMoTGlzdEl0ZXJhdGluZ1N5c3RlbSwgX3N1cGVyKTtcblxuICBMaXN0SXRlcmF0aW5nU3lzdGVtLnByb3RvdHlwZS5ub2RlTGlzdCA9IG51bGw7XG5cbiAgTGlzdEl0ZXJhdGluZ1N5c3RlbS5wcm90b3R5cGUubm9kZUNsYXNzID0gbnVsbDtcblxuICBMaXN0SXRlcmF0aW5nU3lzdGVtLnByb3RvdHlwZS5ub2RlVXBkYXRlRnVuY3Rpb24gPSBudWxsO1xuXG4gIExpc3RJdGVyYXRpbmdTeXN0ZW0ucHJvdG90eXBlLm5vZGVBZGRlZEZ1bmN0aW9uID0gbnVsbDtcblxuICBMaXN0SXRlcmF0aW5nU3lzdGVtLnByb3RvdHlwZS5ub2RlUmVtb3ZlZEZ1bmN0aW9uID0gbnVsbDtcblxuICBmdW5jdGlvbiBMaXN0SXRlcmF0aW5nU3lzdGVtKG5vZGVDbGFzcywgbm9kZVVwZGF0ZUZ1bmN0aW9uLCBub2RlQWRkZWRGdW5jdGlvbiwgbm9kZVJlbW92ZWRGdW5jdGlvbikge1xuICAgIGlmIChub2RlQWRkZWRGdW5jdGlvbiA9PSBudWxsKSB7XG4gICAgICBub2RlQWRkZWRGdW5jdGlvbiA9IG51bGw7XG4gICAgfVxuICAgIGlmIChub2RlUmVtb3ZlZEZ1bmN0aW9uID09IG51bGwpIHtcbiAgICAgIG5vZGVSZW1vdmVkRnVuY3Rpb24gPSBudWxsO1xuICAgIH1cbiAgICB0aGlzLm5vZGVDbGFzcyA9IG5vZGVDbGFzcztcbiAgICB0aGlzLm5vZGVVcGRhdGVGdW5jdGlvbiA9IG5vZGVVcGRhdGVGdW5jdGlvbjtcbiAgICB0aGlzLm5vZGVBZGRlZEZ1bmN0aW9uID0gbm9kZUFkZGVkRnVuY3Rpb247XG4gICAgdGhpcy5ub2RlUmVtb3ZlZEZ1bmN0aW9uID0gbm9kZVJlbW92ZWRGdW5jdGlvbjtcbiAgfVxuXG4gIExpc3RJdGVyYXRpbmdTeXN0ZW0ucHJvdG90eXBlLmFkZFRvRW5naW5lID0gZnVuY3Rpb24oZW5naW5lKSB7XG4gICAgdmFyIG5vZGU7XG4gICAgdGhpcy5ub2RlTGlzdCA9IGVuZ2luZS5nZXROb2RlTGlzdCh0aGlzLm5vZGVDbGFzcyk7XG4gICAgaWYgKHRoaXMubm9kZUFkZGVkRnVuY3Rpb24gIT09IG51bGwpIHtcbiAgICAgIG5vZGUgPSB0aGlzLm5vZGVMaXN0LmhlYWQ7XG4gICAgICB3aGlsZSAobm9kZSkge1xuICAgICAgICB0aGlzLm5vZGVBZGRlZEZ1bmN0aW9uKG5vZGUpO1xuICAgICAgICBub2RlID0gbm9kZS5uZXh0O1xuICAgICAgfVxuICAgICAgdGhpcy5ub2RlTGlzdC5ub2RlQWRkZWQuYWRkKHRoaXMubm9kZUFkZGVkRnVuY3Rpb24pO1xuICAgIH1cbiAgICBpZiAodGhpcy5ub2RlUmVtb3ZlZEZ1bmN0aW9uICE9PSBudWxsKSB7XG4gICAgICB0aGlzLm5vZGVMaXN0Lm5vZGVSZW1vdmVkLmFkZCh0aGlzLm5vZGVSZW1vdmVkRnVuY3Rpb24pO1xuICAgIH1cbiAgfTtcblxuICBMaXN0SXRlcmF0aW5nU3lzdGVtLnByb3RvdHlwZS5yZW1vdmVGcm9tRW5naW5lID0gZnVuY3Rpb24oZW5naW5lKSB7XG4gICAgaWYgKHRoaXMubm9kZUFkZGVkRnVuY3Rpb24gIT09IG51bGwpIHtcbiAgICAgIHRoaXMubm9kZUxpc3Qubm9kZUFkZGVkLnJlbW92ZSh0aGlzLm5vZGVBZGRlZEZ1bmN0aW9uKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubm9kZVJlbW92ZWRGdW5jdGlvbiAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5ub2RlTGlzdC5ub2RlUmVtb3ZlZC5yZW1vdmUodGhpcy5ub2RlUmVtb3ZlZEZ1bmN0aW9uKTtcbiAgICB9XG4gICAgdGhpcy5ub2RlTGlzdCA9IG51bGw7XG4gIH07XG5cbiAgTGlzdEl0ZXJhdGluZ1N5c3RlbS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24odGltZSkge1xuICAgIHZhciBub2RlO1xuICAgIG5vZGUgPSB0aGlzLm5vZGVMaXN0LmhlYWQ7XG4gICAgd2hpbGUgKG5vZGUpIHtcbiAgICAgIHRoaXMubm9kZVVwZGF0ZUZ1bmN0aW9uKG5vZGUsIHRpbWUpO1xuICAgICAgbm9kZSA9IG5vZGUubmV4dDtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIExpc3RJdGVyYXRpbmdTeXN0ZW07XG5cbn0pKFN5c3RlbSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxpc3RfaXRlcmF0aW5nX3N5c3RlbS5qcy5tYXBcbiIsIlxuLypcblxuICAgXyAgICAgICBfXG4gIC9fXFwgIF9fX3wgfF9fXG4gLy9fXFxcXC8gX198ICdfIFxcXG4vICBfICBcXF9fIFxcIHwgfCB8XG5cXF8vIFxcXy9fX18vX3wgfF98XG5cbiAgICAgICAgICAgICAgX18gIF9fXG4gICAgX19fIF9fXyAgLyBffC8gX3wgX19fICBfX19cbiAgIC8gX18vIF8gXFx8IHxffCB8XyAvIF8gXFwvIF8gXFxcbiAgfCAoX3wgKF8pIHwgIF98ICBffCAgX18vICBfXy9cbiAoXylfX19cXF9fXy98X3wgfF98ICBcXF9fX3xcXF9fX3xcblxuXG5Db3B5cmlnaHQgKGMpIDIwMTUgQnJ1Y2UgRGF2aWRzb24gJmx0O2RhcmtvdmVybG9yZG9mZGF0YUBnbWFpbC5jb20mZ3Q7XG5cbkF1dGhvcjogUmljaGFyZCBMb3JkXG5Db3B5cmlnaHQgKGMpIFJpY2hhcmQgTG9yZCAyMDExLTIwMTJcbmh0dHA6Ly93d3cucmljaGFyZGxvcmQubmV0XG5cblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nXG5hIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbidTb2Z0d2FyZScpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbndpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbmRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0b1xucGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvXG50aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlXG5pbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEICdBUyBJUycsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG5FWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbk1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC5cbklOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZXG5DTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULFxuVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEVcblNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICovXG4ndXNlIHN0cmljdCc7XG52YXIgYXNoO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFzaCA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gYXNoKCkge31cblxuICByZXR1cm4gYXNoO1xuXG59KSgpO1xuXG5hc2guc2lnbmFscyA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gc2lnbmFscygpIHt9XG5cbiAgcmV0dXJuIHNpZ25hbHM7XG5cbn0pKCk7XG5cbnJlcXVpcmUoJy4vYXNoL3NpZ25hbHMvbGlzdGVuZXJfbm9kZScpO1xuXG5yZXF1aXJlKCcuL2FzaC9zaWduYWxzL2xpc3RlbmVyX25vZGVfcG9vbCcpO1xuXG5yZXF1aXJlKCcuL2FzaC9zaWduYWxzL3NpZ25hbF9iYXNlJyk7XG5cbnJlcXVpcmUoJy4vYXNoL3NpZ25hbHMvc2lnbmFsMCcpO1xuXG5yZXF1aXJlKCcuL2FzaC9zaWduYWxzL3NpZ25hbDEnKTtcblxucmVxdWlyZSgnLi9hc2gvc2lnbmFscy9zaWduYWwyJyk7XG5cbnJlcXVpcmUoJy4vYXNoL3NpZ25hbHMvc2lnbmFsMycpO1xuXG5hc2guY29yZSA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gY29yZSgpIHt9XG5cbiAgcmV0dXJuIGNvcmU7XG5cbn0pKCk7XG5cbnJlcXVpcmUoJy4vYXNoL2NvcmUvZW50aXR5Jyk7XG5cbnJlcXVpcmUoJy4vYXNoL2NvcmUvZW50aXR5X2xpc3QnKTtcblxucmVxdWlyZSgnLi9hc2gvY29yZS9ub2RlJyk7XG5cbnJlcXVpcmUoJy4vYXNoL2NvcmUvbm9kZV9saXN0Jyk7XG5cbnJlcXVpcmUoJy4vYXNoL2NvcmUvbm9kZV9wb29sJyk7XG5cbnJlcXVpcmUoJy4vYXNoL2NvcmUvc3lzdGVtJyk7XG5cbnJlcXVpcmUoJy4vYXNoL2NvcmUvc3lzdGVtX2xpc3QnKTtcblxucmVxdWlyZSgnLi9hc2gvY29yZS9mYW1pbHknKTtcblxucmVxdWlyZSgnLi9hc2gvY29yZS9jb21wb25lbnRfbWF0Y2hpbmdfZmFtaWx5Jyk7XG5cbnJlcXVpcmUoJy4vYXNoL2NvcmUvZW5naW5lJyk7XG5cbmFzaC5mc20gPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIGZzbSgpIHt9XG5cbiAgcmV0dXJuIGZzbTtcblxufSkoKTtcblxucmVxdWlyZSgnLi9hc2gvZnNtL2NvbXBvbmVudF9pbnN0YW5jZV9wcm92aWRlcicpO1xuXG5yZXF1aXJlKCcuL2FzaC9mc20vY29tcG9uZW50X3NpbmdsZXRvbl9wcm92aWRlcicpO1xuXG5yZXF1aXJlKCcuL2FzaC9mc20vY29tcG9uZW50X3R5cGVfcHJvdmlkZXInKTtcblxucmVxdWlyZSgnLi9hc2gvZnNtL2R5bmFtaWNfY29tcG9uZW50X3Byb3ZpZGVyJyk7XG5cbnJlcXVpcmUoJy4vYXNoL2ZzbS9keW5hbWljX3N5c3RlbV9wcm92aWRlcicpO1xuXG5yZXF1aXJlKCcuL2FzaC9mc20vZW5naW5lX3N0YXRlJyk7XG5cbnJlcXVpcmUoJy4vYXNoL2ZzbS9zdGF0ZV9jb21wb25lbnRfbWFwcGluZycpO1xuXG5yZXF1aXJlKCcuL2FzaC9mc20vZW5naW5lX3N0YXRlX21hY2hpbmUnKTtcblxucmVxdWlyZSgnLi9hc2gvZnNtL2VudGl0eV9zdGF0ZScpO1xuXG5yZXF1aXJlKCcuL2FzaC9mc20vZW50aXR5X3N0YXRlX21hY2hpbmUnKTtcblxucmVxdWlyZSgnLi9hc2gvZnNtL3N0YXRlX3N5c3RlbV9tYXBwaW5nJyk7XG5cbnJlcXVpcmUoJy4vYXNoL2ZzbS9zeXN0ZW1faW5zdGFuY2VfcHJvdmlkZXInKTtcblxucmVxdWlyZSgnLi9hc2gvZnNtL3N5c3RlbV9zaW5nbGV0b25fcHJvdmlkZXInKTtcblxuYXNoLnRpY2sgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIHRpY2soKSB7fVxuXG4gIHJldHVybiB0aWNrO1xuXG59KSgpO1xuXG5yZXF1aXJlKCcuL2FzaC90aWNrL2ZyYW1lX3RpY2tfcHJvdmlkZXInKTtcblxuYXNoLnRvb2xzID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiB0b29scygpIHt9XG5cbiAgcmV0dXJuIHRvb2xzO1xuXG59KSgpO1xuXG5yZXF1aXJlKCcuL2FzaC90b29scy9jb21wb25lbnRfcG9vbCcpO1xuXG5yZXF1aXJlKCcuL2FzaC90b29scy9saXN0X2l0ZXJhdGluZ19zeXN0ZW0nKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZGlzdC9saWInKTsiLCIndXNlIHN0cmljdCc7XG52YXIgQW5pbWF0aW9uU3lzdGVtLCBBdWRpb1N5c3RlbSwgQnVsbGV0QWdlU3lzdGVtLCBDb2xsaXNpb25TeXN0ZW0sIERlYXRoVGhyb2VzU3lzdGVtLCBFbnRpdHlDcmVhdG9yLCBHYW1lQ29uZmlnLCBHYW1lTWFuYWdlciwgR2FtZVN0YXRlLCBHdW5Db250cm9sU3lzdGVtLCBIdWRTeXN0ZW0sIEtleVBvbGwsIE1vdmVtZW50U3lzdGVtLCBQaHlzaWNzQ29udHJvbFN5c3RlbSwgUGh5c2ljc1N5c3RlbSwgUmVuZGVyU3lzdGVtLCBTeXN0ZW1Qcmlvcml0aWVzLCBXYWl0Rm9yU3RhcnRTeXN0ZW0sIGFzaCwgYXN0ZXJvaWRzLCBiMlZlYzIsIGIyV29ybGQ7XG5cbmFzaCA9IHJlcXVpcmUoJ2FzaC5jb2ZmZWUnKTtcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vaW5kZXgnKTtcblxuQW5pbWF0aW9uU3lzdGVtID0gYXN0ZXJvaWRzLnN5c3RlbXMuQW5pbWF0aW9uU3lzdGVtO1xuXG5BdWRpb1N5c3RlbSA9IGFzdGVyb2lkcy5zeXN0ZW1zLkF1ZGlvU3lzdGVtO1xuXG5CdWxsZXRBZ2VTeXN0ZW0gPSBhc3Rlcm9pZHMuc3lzdGVtcy5CdWxsZXRBZ2VTeXN0ZW07XG5cbkNvbGxpc2lvblN5c3RlbSA9IGFzdGVyb2lkcy5zeXN0ZW1zLkNvbGxpc2lvblN5c3RlbTtcblxuRGVhdGhUaHJvZXNTeXN0ZW0gPSBhc3Rlcm9pZHMuc3lzdGVtcy5EZWF0aFRocm9lc1N5c3RlbTtcblxuR2FtZU1hbmFnZXIgPSBhc3Rlcm9pZHMuc3lzdGVtcy5HYW1lTWFuYWdlcjtcblxuR3VuQ29udHJvbFN5c3RlbSA9IGFzdGVyb2lkcy5zeXN0ZW1zLkd1bkNvbnRyb2xTeXN0ZW07XG5cbkh1ZFN5c3RlbSA9IGFzdGVyb2lkcy5zeXN0ZW1zLkh1ZFN5c3RlbTtcblxuTW92ZW1lbnRTeXN0ZW0gPSBhc3Rlcm9pZHMuc3lzdGVtcy5Nb3ZlbWVudFN5c3RlbTtcblxuUmVuZGVyU3lzdGVtID0gYXN0ZXJvaWRzLnN5c3RlbXMuUmVuZGVyU3lzdGVtO1xuXG5TeXN0ZW1Qcmlvcml0aWVzID0gYXN0ZXJvaWRzLnN5c3RlbXMuU3lzdGVtUHJpb3JpdGllcztcblxuV2FpdEZvclN0YXJ0U3lzdGVtID0gYXN0ZXJvaWRzLnN5c3RlbXMuV2FpdEZvclN0YXJ0U3lzdGVtO1xuXG5QaHlzaWNzU3lzdGVtID0gYXN0ZXJvaWRzLnN5c3RlbXMuUGh5c2ljc1N5c3RlbTtcblxuUGh5c2ljc0NvbnRyb2xTeXN0ZW0gPSBhc3Rlcm9pZHMuc3lzdGVtcy5QaHlzaWNzQ29udHJvbFN5c3RlbTtcblxuR2FtZVN0YXRlID0gYXN0ZXJvaWRzLmNvbXBvbmVudHMuR2FtZVN0YXRlO1xuXG5FbnRpdHlDcmVhdG9yID0gYXN0ZXJvaWRzLkVudGl0eUNyZWF0b3I7XG5cbkdhbWVDb25maWcgPSBhc3Rlcm9pZHMuR2FtZUNvbmZpZztcblxuS2V5UG9sbCA9IGFzdGVyb2lkcy51aS5LZXlQb2xsO1xuXG5iMlZlYzIgPSBCb3gyRC5Db21tb24uTWF0aC5iMlZlYzI7XG5cbmIyV29ybGQgPSBCb3gyRC5EeW5hbWljcy5iMldvcmxkO1xuXG5hc3Rlcm9pZHMuQXN0ZXJvaWRzID0gKGZ1bmN0aW9uKCkge1xuICBBc3Rlcm9pZHMucHJvdG90eXBlLmNvbnRhaW5lciA9IG51bGw7XG5cbiAgQXN0ZXJvaWRzLnByb3RvdHlwZS5lbmdpbmUgPSBudWxsO1xuXG4gIEFzdGVyb2lkcy5wcm90b3R5cGUudGlja1Byb3ZpZGVyID0gbnVsbDtcblxuICBBc3Rlcm9pZHMucHJvdG90eXBlLmNyZWF0b3IgPSBudWxsO1xuXG4gIEFzdGVyb2lkcy5wcm90b3R5cGUua2V5UG9sbCA9IG51bGw7XG5cbiAgQXN0ZXJvaWRzLnByb3RvdHlwZS5jb25maWcgPSBudWxsO1xuXG4gIEFzdGVyb2lkcy5wcm90b3R5cGUud29ybGQgPSBudWxsO1xuXG4gIGZ1bmN0aW9uIEFzdGVyb2lkcyhjb250YWluZXIsIHdpZHRoLCBoZWlnaHQpIHtcbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcbiAgICB0aGlzLnByZXBhcmUod2lkdGgsIGhlaWdodCk7XG4gIH1cblxuICBBc3Rlcm9pZHMucHJvdG90eXBlLnByZXBhcmUgPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XG4gICAgdGhpcy53b3JsZCA9IG5ldyBiMldvcmxkKG5ldyBiMlZlYzIoMCwgMCksIHRydWUpO1xuICAgIHRoaXMud29ybGQuU2V0Q29udGludW91c1BoeXNpY3ModHJ1ZSk7XG4gICAgdGhpcy5lbmdpbmUgPSBuZXcgYXNoLmNvcmUuRW5naW5lKCk7XG4gICAgdGhpcy5jcmVhdG9yID0gbmV3IEVudGl0eUNyZWF0b3IodGhpcy5lbmdpbmUsIHRoaXMud29ybGQpO1xuICAgIHRoaXMua2V5UG9sbCA9IG5ldyBLZXlQb2xsKHdpbmRvdyk7XG4gICAgdGhpcy5jb25maWcgPSBuZXcgR2FtZUNvbmZpZygpO1xuICAgIHRoaXMuY29uZmlnLmhlaWdodCA9IGhlaWdodDtcbiAgICB0aGlzLmNvbmZpZy53aWR0aCA9IHdpZHRoO1xuICAgIHRoaXMuZW5naW5lLmFkZFN5c3RlbShuZXcgV2FpdEZvclN0YXJ0U3lzdGVtKHRoaXMuY3JlYXRvciksIFN5c3RlbVByaW9yaXRpZXMucHJlVXBkYXRlKTtcbiAgICB0aGlzLmVuZ2luZS5hZGRTeXN0ZW0obmV3IEdhbWVNYW5hZ2VyKHRoaXMuY3JlYXRvciwgdGhpcy5jb25maWcpLCBTeXN0ZW1Qcmlvcml0aWVzLnByZVVwZGF0ZSk7XG4gICAgdGhpcy5lbmdpbmUuYWRkU3lzdGVtKG5ldyBQaHlzaWNzQ29udHJvbFN5c3RlbSh0aGlzLmtleVBvbGwpLCBTeXN0ZW1Qcmlvcml0aWVzLnVwZGF0ZSk7XG4gICAgdGhpcy5lbmdpbmUuYWRkU3lzdGVtKG5ldyBHdW5Db250cm9sU3lzdGVtKHRoaXMua2V5UG9sbCwgdGhpcy5jcmVhdG9yKSwgU3lzdGVtUHJpb3JpdGllcy51cGRhdGUpO1xuICAgIHRoaXMuZW5naW5lLmFkZFN5c3RlbShuZXcgQnVsbGV0QWdlU3lzdGVtKHRoaXMuY3JlYXRvciksIFN5c3RlbVByaW9yaXRpZXMudXBkYXRlKTtcbiAgICB0aGlzLmVuZ2luZS5hZGRTeXN0ZW0obmV3IERlYXRoVGhyb2VzU3lzdGVtKHRoaXMuY3JlYXRvciksIFN5c3RlbVByaW9yaXRpZXMudXBkYXRlKTtcbiAgICB0aGlzLmVuZ2luZS5hZGRTeXN0ZW0obmV3IFBoeXNpY3NTeXN0ZW0odGhpcy5jb25maWcsIHRoaXMud29ybGQpLCBTeXN0ZW1Qcmlvcml0aWVzLm1vdmUpO1xuICAgIHRoaXMuZW5naW5lLmFkZFN5c3RlbShuZXcgQ29sbGlzaW9uU3lzdGVtKHRoaXMud29ybGQsIHRoaXMuY3JlYXRvciksIFN5c3RlbVByaW9yaXRpZXMucmVzb2x2ZUNvbGxpc2lvbnMpO1xuICAgIHRoaXMuZW5naW5lLmFkZFN5c3RlbShuZXcgQW5pbWF0aW9uU3lzdGVtKCksIFN5c3RlbVByaW9yaXRpZXMuYW5pbWF0ZSk7XG4gICAgdGhpcy5lbmdpbmUuYWRkU3lzdGVtKG5ldyBIdWRTeXN0ZW0oKSwgU3lzdGVtUHJpb3JpdGllcy5hbmltYXRlKTtcbiAgICB0aGlzLmVuZ2luZS5hZGRTeXN0ZW0obmV3IFJlbmRlclN5c3RlbSh0aGlzLmNvbnRhaW5lciksIFN5c3RlbVByaW9yaXRpZXMucmVuZGVyKTtcbiAgICB0aGlzLmVuZ2luZS5hZGRTeXN0ZW0obmV3IEF1ZGlvU3lzdGVtKCksIFN5c3RlbVByaW9yaXRpZXMucmVuZGVyKTtcbiAgICB0aGlzLmNyZWF0b3IuY3JlYXRlV2FpdEZvckNsaWNrKCk7XG4gICAgdGhpcy5jcmVhdG9yLmNyZWF0ZUdhbWUoKTtcbiAgfTtcblxuICBBc3Rlcm9pZHMucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN0YXRzLCB4LCB5O1xuICAgIGlmIChuYXZpZ2F0b3IuaXNDb2Nvb25KUykge1xuICAgICAgc3RhdHMgPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICB4ID0gTWF0aC5mbG9vcih0aGlzLmNvbmZpZy53aWR0aCAvIDIpIC0gNDA7XG4gICAgICB5ID0gMDtcbiAgICAgIHN0YXRzID0gbmV3IFN0YXRzKCk7XG4gICAgICBzdGF0cy5zZXRNb2RlKDApO1xuICAgICAgc3RhdHMuZG9tRWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICAgIHN0YXRzLmRvbUVsZW1lbnQuc3R5bGUubGVmdCA9IFwiXCIgKyB4ICsgXCJweFwiO1xuICAgICAgc3RhdHMuZG9tRWxlbWVudC5zdHlsZS50b3AgPSBcIlwiICsgeSArIFwicHhcIjtcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc3RhdHMuZG9tRWxlbWVudCk7XG4gICAgfVxuICAgIHRoaXMudGlja1Byb3ZpZGVyID0gbmV3IGFzaC50aWNrLkZyYW1lVGlja1Byb3ZpZGVyKHN0YXRzKTtcbiAgICB0aGlzLnRpY2tQcm92aWRlci5hZGQodGhpcy5lbmdpbmUudXBkYXRlKTtcbiAgICB0aGlzLnRpY2tQcm92aWRlci5zdGFydCgpO1xuICB9O1xuXG4gIHJldHVybiBBc3Rlcm9pZHM7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFzdGVyb2lkcy5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc3Rlcm9pZHM7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uL2luZGV4Jyk7XG5cbmFzdGVyb2lkcy5jb21wb25lbnRzLkFuaW1hdGlvbiA9IChmdW5jdGlvbigpIHtcbiAgQW5pbWF0aW9uLnByb3RvdHlwZS5hbmltYXRpb24gPSBudWxsO1xuXG4gIGZ1bmN0aW9uIEFuaW1hdGlvbihhbmltYXRpb24pIHtcbiAgICB0aGlzLmFuaW1hdGlvbiA9IGFuaW1hdGlvbjtcbiAgfVxuXG4gIHJldHVybiBBbmltYXRpb247XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFuaW1hdGlvbi5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc3Rlcm9pZHM7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uL2luZGV4Jyk7XG5cbmFzdGVyb2lkcy5jb21wb25lbnRzLkFzdGVyb2lkID0gKGZ1bmN0aW9uKCkge1xuICBBc3Rlcm9pZC5wcm90b3R5cGUuZnNtID0gbnVsbDtcblxuICBmdW5jdGlvbiBBc3Rlcm9pZChmc20pIHtcbiAgICB0aGlzLmZzbSA9IGZzbTtcbiAgfVxuXG4gIHJldHVybiBBc3Rlcm9pZDtcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXN0ZXJvaWQuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXN0ZXJvaWRzO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi9pbmRleCcpO1xuXG5hc3Rlcm9pZHMuY29tcG9uZW50cy5BdWRpbyA9IChmdW5jdGlvbigpIHtcbiAgQXVkaW8ucHJvdG90eXBlLnRvUGxheSA9IG51bGw7XG5cbiAgZnVuY3Rpb24gQXVkaW8oKSB7XG4gICAgdGhpcy50b1BsYXkgPSBbXTtcbiAgfVxuXG4gIEF1ZGlvLnByb3RvdHlwZS5wbGF5ID0gZnVuY3Rpb24oc291bmQpIHtcbiAgICByZXR1cm4gdGhpcy50b1BsYXkucHVzaChzb3VuZCk7XG4gIH07XG5cbiAgcmV0dXJuIEF1ZGlvO1xuXG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hdWRpby5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc3Rlcm9pZHM7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uL2luZGV4Jyk7XG5cbmFzdGVyb2lkcy5jb21wb25lbnRzLkJ1bGxldCA9IChmdW5jdGlvbigpIHtcbiAgQnVsbGV0LnByb3RvdHlwZS5saWZlUmVtYWluaW5nID0gMDtcblxuICBmdW5jdGlvbiBCdWxsZXQobGlmZVJlbWFpbmluZykge1xuICAgIHRoaXMubGlmZVJlbWFpbmluZyA9IGxpZmVSZW1haW5pbmc7XG4gIH1cblxuICByZXR1cm4gQnVsbGV0O1xuXG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1idWxsZXQuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXN0ZXJvaWRzO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi9pbmRleCcpO1xuXG5hc3Rlcm9pZHMuY29tcG9uZW50cy5Db2xsaXNpb24gPSAoZnVuY3Rpb24oKSB7XG4gIENvbGxpc2lvbi5wcm90b3R5cGUucmFkaXVzID0gMDtcblxuICBmdW5jdGlvbiBDb2xsaXNpb24ocmFkaXVzKSB7XG4gICAgdGhpcy5yYWRpdXMgPSByYWRpdXM7XG4gIH1cblxuICByZXR1cm4gQ29sbGlzaW9uO1xuXG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb2xsaXNpb24uanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXN0ZXJvaWRzO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi9pbmRleCcpO1xuXG5hc3Rlcm9pZHMuY29tcG9uZW50cy5EZWF0aFRocm9lcyA9IChmdW5jdGlvbigpIHtcbiAgRGVhdGhUaHJvZXMucHJvdG90eXBlLmNvdW50ZG93biA9IDA7XG5cbiAgRGVhdGhUaHJvZXMucHJvdG90eXBlLmJvZHkgPSBudWxsO1xuXG4gIGZ1bmN0aW9uIERlYXRoVGhyb2VzKGR1cmF0aW9uKSB7XG4gICAgdGhpcy5jb3VudGRvd24gPSBkdXJhdGlvbjtcbiAgfVxuXG4gIHJldHVybiBEZWF0aFRocm9lcztcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGVhdGhfdGhyb2VzLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzdGVyb2lkcztcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vaW5kZXgnKTtcblxuYXN0ZXJvaWRzLmNvbXBvbmVudHMuRGlzcGxheSA9IChmdW5jdGlvbigpIHtcbiAgRGlzcGxheS5wcm90b3R5cGUuZ3JhcGhpYyA9IDA7XG5cbiAgZnVuY3Rpb24gRGlzcGxheShncmFwaGljKSB7XG4gICAgdGhpcy5ncmFwaGljID0gZ3JhcGhpYztcbiAgfVxuXG4gIHJldHVybiBEaXNwbGF5O1xuXG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kaXNwbGF5LmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzdGVyb2lkcztcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vaW5kZXgnKTtcblxuYXN0ZXJvaWRzLmNvbXBvbmVudHMuR2FtZVN0YXRlID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBHYW1lU3RhdGUoKSB7fVxuXG4gIEdhbWVTdGF0ZS5wcm90b3R5cGUubGl2ZXMgPSAzO1xuXG4gIEdhbWVTdGF0ZS5wcm90b3R5cGUubGV2ZWwgPSAwO1xuXG4gIEdhbWVTdGF0ZS5wcm90b3R5cGUuaGl0cyA9IDA7XG5cbiAgR2FtZVN0YXRlLnByb3RvdHlwZS5wbGF5aW5nID0gZmFsc2U7XG5cbiAgR2FtZVN0YXRlLnByb3RvdHlwZS5zZXRGb3JTdGFydCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubGl2ZXMgPSAzO1xuICAgIHRoaXMubGV2ZWwgPSAwO1xuICAgIHRoaXMuaGl0cyA9IDA7XG4gICAgdGhpcy5wbGF5aW5nID0gdHJ1ZTtcbiAgfTtcblxuICByZXR1cm4gR2FtZVN0YXRlO1xuXG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1nYW1lX3N0YXRlLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIFBvaW50LCBhc3Rlcm9pZHM7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uL2luZGV4Jyk7XG5cblBvaW50ID0gYXN0ZXJvaWRzLnVpLlBvaW50O1xuXG5hc3Rlcm9pZHMuY29tcG9uZW50cy5HdW4gPSAoZnVuY3Rpb24oKSB7XG4gIEd1bi5wcm90b3R5cGUuc2hvb3RpbmcgPSBmYWxzZTtcblxuICBHdW4ucHJvdG90eXBlLm9mZnNldEZyb21QYXJlbnQgPSBudWxsO1xuXG4gIEd1bi5wcm90b3R5cGUudGltZVNpbmNlTGFzdFNob3QgPSAwO1xuXG4gIEd1bi5wcm90b3R5cGUub2Zmc2V0RnJvbVBhcmVudCA9IG51bGw7XG5cbiAgZnVuY3Rpb24gR3VuKG9mZnNldFgsIG9mZnNldFksIG1pbmltdW1TaG90SW50ZXJ2YWwsIGJ1bGxldExpZmV0aW1lKSB7XG4gICAgdGhpcy5taW5pbXVtU2hvdEludGVydmFsID0gbWluaW11bVNob3RJbnRlcnZhbDtcbiAgICB0aGlzLmJ1bGxldExpZmV0aW1lID0gYnVsbGV0TGlmZXRpbWU7XG4gICAgdGhpcy5zaG9vdGluZyA9IGZhbHNlO1xuICAgIHRoaXMub2Zmc2V0RnJvbVBhcmVudCA9IG51bGw7XG4gICAgdGhpcy50aW1lU2luY2VMYXN0U2hvdCA9IDA7XG4gICAgdGhpcy5vZmZzZXRGcm9tUGFyZW50ID0gbmV3IFBvaW50KG9mZnNldFgsIG9mZnNldFkpO1xuICB9XG5cbiAgcmV0dXJuIEd1bjtcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Z3VuLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzdGVyb2lkcztcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vaW5kZXgnKTtcblxuYXN0ZXJvaWRzLmNvbXBvbmVudHMuR3VuQ29udHJvbHMgPSAoZnVuY3Rpb24oKSB7XG4gIEd1bkNvbnRyb2xzLnByb3RvdHlwZS50cmlnZ2VyID0gMDtcblxuICBmdW5jdGlvbiBHdW5Db250cm9scyh0cmlnZ2VyKSB7XG4gICAgdGhpcy50cmlnZ2VyID0gdHJpZ2dlcjtcbiAgfVxuXG4gIHJldHVybiBHdW5Db250cm9scztcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Z3VuX2NvbnRyb2xzLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzdGVyb2lkcztcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vaW5kZXgnKTtcblxuYXN0ZXJvaWRzLmNvbXBvbmVudHMuSHVkID0gKGZ1bmN0aW9uKCkge1xuICBIdWQucHJvdG90eXBlLnZpZXcgPSBudWxsO1xuXG4gIGZ1bmN0aW9uIEh1ZCh2aWV3KSB7XG4gICAgdGhpcy52aWV3ID0gdmlldztcbiAgfVxuXG4gIHJldHVybiBIdWQ7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWh1ZC5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc3Rlcm9pZHM7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uL2luZGV4Jyk7XG5cbmFzdGVyb2lkcy5jb21wb25lbnRzLk1vdGlvbkNvbnRyb2xzID0gKGZ1bmN0aW9uKCkge1xuICBNb3Rpb25Db250cm9scy5wcm90b3R5cGUubGVmdCA9IDA7XG5cbiAgTW90aW9uQ29udHJvbHMucHJvdG90eXBlLnJpZ2h0ID0gMDtcblxuICBNb3Rpb25Db250cm9scy5wcm90b3R5cGUuYWNjZWxlcmF0ZSA9IDA7XG5cbiAgTW90aW9uQ29udHJvbHMucHJvdG90eXBlLmFjY2VsZXJhdGlvblJhdGUgPSAwO1xuXG4gIE1vdGlvbkNvbnRyb2xzLnByb3RvdHlwZS5yb3RhdGlvblJhdGUgPSAwO1xuXG4gIGZ1bmN0aW9uIE1vdGlvbkNvbnRyb2xzKGxlZnQsIHJpZ2h0LCBhY2NlbGVyYXRlLCBhY2NlbGVyYXRpb25SYXRlLCByb3RhdGlvblJhdGUpIHtcbiAgICB0aGlzLmxlZnQgPSBsZWZ0O1xuICAgIHRoaXMucmlnaHQgPSByaWdodDtcbiAgICB0aGlzLmFjY2VsZXJhdGUgPSBhY2NlbGVyYXRlO1xuICAgIHRoaXMuYWNjZWxlcmF0aW9uUmF0ZSA9IGFjY2VsZXJhdGlvblJhdGU7XG4gICAgdGhpcy5yb3RhdGlvblJhdGUgPSByb3RhdGlvblJhdGU7XG4gIH1cblxuICByZXR1cm4gTW90aW9uQ29udHJvbHM7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1vdGlvbl9jb250cm9scy5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc3Rlcm9pZHM7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uL2luZGV4Jyk7XG5cbmFzdGVyb2lkcy5jb21wb25lbnRzLlBoeXNpY3MgPSAoZnVuY3Rpb24oKSB7XG4gIFBoeXNpY3MucHJvdG90eXBlLmJvZHkgPSBudWxsO1xuXG4gIGZ1bmN0aW9uIFBoeXNpY3MoYm9keSkge1xuICAgIHRoaXMuYm9keSA9IGJvZHk7XG4gIH1cblxuICByZXR1cm4gUGh5c2ljcztcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGh5c2ljcy5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBQb2ludCwgYXN0ZXJvaWRzO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi9pbmRleCcpO1xuXG5Qb2ludCA9IGFzdGVyb2lkcy51aS5Qb2ludDtcblxuYXN0ZXJvaWRzLmNvbXBvbmVudHMuUG9zaXRpb24gPSAoZnVuY3Rpb24oKSB7XG4gIFBvc2l0aW9uLnByb3RvdHlwZS5wb3NpdGlvbiA9IG51bGw7XG5cbiAgUG9zaXRpb24ucHJvdG90eXBlLnJvdGF0aW9uID0gMDtcblxuICBmdW5jdGlvbiBQb3NpdGlvbih4LCB5LCByb3RhdGlvbikge1xuICAgIHRoaXMucm90YXRpb24gPSByb3RhdGlvbjtcbiAgICB0aGlzLnBvc2l0aW9uID0gbmV3IFBvaW50KHgsIHkpO1xuICB9XG5cbiAgcmV0dXJuIFBvc2l0aW9uO1xuXG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1wb3NpdGlvbi5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc3Rlcm9pZHM7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uL2luZGV4Jyk7XG5cbmFzdGVyb2lkcy5jb21wb25lbnRzLlNwYWNlc2hpcCA9IChmdW5jdGlvbigpIHtcbiAgU3BhY2VzaGlwLnByb3RvdHlwZS5mc20gPSBudWxsO1xuXG4gIGZ1bmN0aW9uIFNwYWNlc2hpcChmc20pIHtcbiAgICB0aGlzLmZzbSA9IGZzbTtcbiAgfVxuXG4gIHJldHVybiBTcGFjZXNoaXA7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNwYWNlc2hpcC5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc3Rlcm9pZHMsXG4gIF9fYmluZCA9IGZ1bmN0aW9uKGZuLCBtZSl7IHJldHVybiBmdW5jdGlvbigpeyByZXR1cm4gZm4uYXBwbHkobWUsIGFyZ3VtZW50cyk7IH07IH07XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uL2luZGV4Jyk7XG5cbmFzdGVyb2lkcy5jb21wb25lbnRzLldhaXRGb3JTdGFydCA9IChmdW5jdGlvbigpIHtcbiAgV2FpdEZvclN0YXJ0LnByb3RvdHlwZS53YWl0Rm9yU3RhcnQgPSBudWxsO1xuXG4gIFdhaXRGb3JTdGFydC5wcm90b3R5cGUuc3RhcnRHYW1lID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gV2FpdEZvclN0YXJ0KHdhaXRGb3JTdGFydCkge1xuICAgIHRoaXMud2FpdEZvclN0YXJ0ID0gd2FpdEZvclN0YXJ0O1xuICAgIHRoaXMuc2V0U3RhcnRHYW1lID0gX19iaW5kKHRoaXMuc2V0U3RhcnRHYW1lLCB0aGlzKTtcbiAgICB0aGlzLndhaXRGb3JTdGFydC5jbGljay5hZGQodGhpcy5zZXRTdGFydEdhbWUpO1xuICB9XG5cbiAgV2FpdEZvclN0YXJ0LnByb3RvdHlwZS5zZXRTdGFydEdhbWUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnN0YXJ0R2FtZSA9IHRydWU7XG4gIH07XG5cbiAgcmV0dXJuIFdhaXRGb3JTdGFydDtcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9d2FpdF9mb3Jfc3RhcnQuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgQW5pbWF0aW9uLCBBc3Rlcm9pZCwgQXN0ZXJvaWREZWF0aFZpZXcsIEFzdGVyb2lkVmlldywgQXVkaW8sIEJ1bGxldCwgQnVsbGV0VmlldywgQ29sbGlzaW9uLCBEZWF0aFRocm9lcywgRGlzcGxheSwgRW50aXR5LCBFbnRpdHlTdGF0ZU1hY2hpbmUsIEdhbWVTdGF0ZSwgR3VuLCBHdW5Db250cm9scywgSHVkLCBIdWRWaWV3LCBNb3Rpb25Db250cm9scywgUGh5c2ljcywgUG9zaXRpb24sIFNwYWNlc2hpcCwgU3BhY2VzaGlwRGVhdGhWaWV3LCBTcGFjZXNoaXBWaWV3LCBXYWl0Rm9yU3RhcnQsIFdhaXRGb3JTdGFydFZpZXcsIGFzaCwgYXN0ZXJvaWRzLCBiMkJvZHksIGIyQm9keURlZiwgYjJDaXJjbGVTaGFwZSwgYjJGaXh0dXJlRGVmLCBiMlBvbHlnb25TaGFwZSwgYjJWZWMyO1xuXG5hc2ggPSByZXF1aXJlKCdhc2guY29mZmVlJyk7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uL2luZGV4Jyk7XG5cbldhaXRGb3JTdGFydFZpZXcgPSBhc3Rlcm9pZHMuc3ByaXRlcy5XYWl0Rm9yU3RhcnRWaWV3O1xuXG5FbnRpdHkgPSBhc2guY29yZS5FbnRpdHk7XG5cbkVudGl0eVN0YXRlTWFjaGluZSA9IGFzaC5mc20uRW50aXR5U3RhdGVNYWNoaW5lO1xuXG5cbi8qXG4gKiBBc3Rlcm9pZCBHYW1lIENvbXBvbmVudHNcbiAqL1xuXG5BbmltYXRpb24gPSBhc3Rlcm9pZHMuY29tcG9uZW50cy5BbmltYXRpb247XG5cbkFzdGVyb2lkID0gYXN0ZXJvaWRzLmNvbXBvbmVudHMuQXN0ZXJvaWQ7XG5cbkF1ZGlvID0gYXN0ZXJvaWRzLmNvbXBvbmVudHMuQXVkaW87XG5cbkJ1bGxldCA9IGFzdGVyb2lkcy5jb21wb25lbnRzLkJ1bGxldDtcblxuQ29sbGlzaW9uID0gYXN0ZXJvaWRzLmNvbXBvbmVudHMuQ29sbGlzaW9uO1xuXG5EZWF0aFRocm9lcyA9IGFzdGVyb2lkcy5jb21wb25lbnRzLkRlYXRoVGhyb2VzO1xuXG5EaXNwbGF5ID0gYXN0ZXJvaWRzLmNvbXBvbmVudHMuRGlzcGxheTtcblxuR2FtZVN0YXRlID0gYXN0ZXJvaWRzLmNvbXBvbmVudHMuR2FtZVN0YXRlO1xuXG5HdW4gPSBhc3Rlcm9pZHMuY29tcG9uZW50cy5HdW47XG5cbkd1bkNvbnRyb2xzID0gYXN0ZXJvaWRzLmNvbXBvbmVudHMuR3VuQ29udHJvbHM7XG5cbkh1ZCA9IGFzdGVyb2lkcy5jb21wb25lbnRzLkh1ZDtcblxuTW90aW9uQ29udHJvbHMgPSBhc3Rlcm9pZHMuY29tcG9uZW50cy5Nb3Rpb25Db250cm9scztcblxuUGh5c2ljcyA9IGFzdGVyb2lkcy5jb21wb25lbnRzLlBoeXNpY3M7XG5cblBvc2l0aW9uID0gYXN0ZXJvaWRzLmNvbXBvbmVudHMuUG9zaXRpb247XG5cblNwYWNlc2hpcCA9IGFzdGVyb2lkcy5jb21wb25lbnRzLlNwYWNlc2hpcDtcblxuV2FpdEZvclN0YXJ0ID0gYXN0ZXJvaWRzLmNvbXBvbmVudHMuV2FpdEZvclN0YXJ0O1xuXG5cbi8qXG4gKiBEcmF3YWJsZSBDb21wb25lbnRzXG4gKi9cblxuQXN0ZXJvaWREZWF0aFZpZXcgPSBhc3Rlcm9pZHMuc3ByaXRlcy5Bc3Rlcm9pZERlYXRoVmlldztcblxuQXN0ZXJvaWRWaWV3ID0gYXN0ZXJvaWRzLnNwcml0ZXMuQXN0ZXJvaWRWaWV3O1xuXG5CdWxsZXRWaWV3ID0gYXN0ZXJvaWRzLnNwcml0ZXMuQnVsbGV0VmlldztcblxuSHVkVmlldyA9IGFzdGVyb2lkcy5zcHJpdGVzLkh1ZFZpZXc7XG5cblNwYWNlc2hpcERlYXRoVmlldyA9IGFzdGVyb2lkcy5zcHJpdGVzLlNwYWNlc2hpcERlYXRoVmlldztcblxuU3BhY2VzaGlwVmlldyA9IGFzdGVyb2lkcy5zcHJpdGVzLlNwYWNlc2hpcFZpZXc7XG5cblxuLypcbiAqIEJveDJEIGNsYXNzZXNcbiAqL1xuXG5iMkJvZHkgPSBCb3gyRC5EeW5hbWljcy5iMkJvZHk7XG5cbmIyQm9keURlZiA9IEJveDJELkR5bmFtaWNzLmIyQm9keURlZjtcblxuYjJDaXJjbGVTaGFwZSA9IEJveDJELkNvbGxpc2lvbi5TaGFwZXMuYjJDaXJjbGVTaGFwZTtcblxuYjJGaXh0dXJlRGVmID0gQm94MkQuRHluYW1pY3MuYjJGaXh0dXJlRGVmO1xuXG5iMlBvbHlnb25TaGFwZSA9IEJveDJELkNvbGxpc2lvbi5TaGFwZXMuYjJQb2x5Z29uU2hhcGU7XG5cbmIyVmVjMiA9IEJveDJELkNvbW1vbi5NYXRoLmIyVmVjMjtcblxuYXN0ZXJvaWRzLkVudGl0eUNyZWF0b3IgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBLRVlfTEVGVCwgS0VZX1JJR0hULCBLRVlfVVAsIEtFWV9aO1xuXG4gIEtFWV9MRUZUID0gMzc7XG5cbiAgS0VZX1VQID0gMzg7XG5cbiAgS0VZX1JJR0hUID0gMzk7XG5cbiAgS0VZX1ogPSA5MDtcblxuICBFbnRpdHlDcmVhdG9yLnByb3RvdHlwZS5lbmdpbmUgPSBudWxsO1xuXG4gIEVudGl0eUNyZWF0b3IucHJvdG90eXBlLndvcmxkID0gbnVsbDtcblxuICBFbnRpdHlDcmVhdG9yLnByb3RvdHlwZS53YWl0RW50aXR5ID0gbnVsbDtcblxuICBFbnRpdHlDcmVhdG9yLnByb3RvdHlwZS5idWxsZXRJZCA9IDA7XG5cbiAgRW50aXR5Q3JlYXRvci5wcm90b3R5cGUuYXN0ZXJvaWRJZCA9IDA7XG5cbiAgRW50aXR5Q3JlYXRvci5wcm90b3R5cGUuc3BhY2VzaGlwSWQgPSAwO1xuXG4gIGZ1bmN0aW9uIEVudGl0eUNyZWF0b3IoZW5naW5lLCB3b3JsZCkge1xuICAgIHRoaXMuZW5naW5lID0gZW5naW5lO1xuICAgIHRoaXMud29ybGQgPSB3b3JsZDtcbiAgfVxuXG4gIEVudGl0eUNyZWF0b3IucHJvdG90eXBlLmRlc3Ryb3lFbnRpdHkgPSBmdW5jdGlvbihlbnRpdHkpIHtcbiAgICB0aGlzLmVuZ2luZS5yZW1vdmVFbnRpdHkoZW50aXR5KTtcbiAgfTtcblxuXG4gIC8qXG4gICAqIEdhbWUgU3RhdGVcbiAgICovXG5cbiAgRW50aXR5Q3JlYXRvci5wcm90b3R5cGUuY3JlYXRlR2FtZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBnYW1lRW50aXR5LCBodWQ7XG4gICAgaHVkID0gbmV3IEh1ZFZpZXcoKTtcbiAgICBnYW1lRW50aXR5ID0gbmV3IEVudGl0eSgnZ2FtZScpLmFkZChuZXcgR2FtZVN0YXRlKCkpLmFkZChuZXcgSHVkKGh1ZCkpLmFkZChuZXcgRGlzcGxheShodWQpKS5hZGQobmV3IFBvc2l0aW9uKDAsIDAsIDAsIDApKTtcbiAgICB0aGlzLmVuZ2luZS5hZGRFbnRpdHkoZ2FtZUVudGl0eSk7XG4gICAgcmV0dXJuIGdhbWVFbnRpdHk7XG4gIH07XG5cblxuICAvKlxuICAgKiBTdGFydC4uLlxuICAgKi9cblxuICBFbnRpdHlDcmVhdG9yLnByb3RvdHlwZS5jcmVhdGVXYWl0Rm9yQ2xpY2sgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgd2FpdFZpZXc7XG4gICAgaWYgKCF0aGlzLndhaXRFbnRpdHkpIHtcbiAgICAgIHdhaXRWaWV3ID0gbmV3IFdhaXRGb3JTdGFydFZpZXcoKTtcbiAgICAgIHRoaXMud2FpdEVudGl0eSA9IG5ldyBFbnRpdHkoJ3dhaXQnKS5hZGQobmV3IFdhaXRGb3JTdGFydCh3YWl0VmlldykpLmFkZChuZXcgRGlzcGxheSh3YWl0VmlldykpLmFkZChuZXcgUG9zaXRpb24oMCwgMCwgMCwgMCkpO1xuICAgIH1cbiAgICB0aGlzLndhaXRFbnRpdHkuZ2V0KFdhaXRGb3JTdGFydCkuc3RhcnRHYW1lID0gZmFsc2U7XG4gICAgdGhpcy5lbmdpbmUuYWRkRW50aXR5KHRoaXMud2FpdEVudGl0eSk7XG4gICAgcmV0dXJuIHRoaXMud2FpdEVudGl0eTtcbiAgfTtcblxuXG4gIC8qXG4gICAqIENyZWF0ZSBhbiBBc3Rlcm9pZCB3aXRoIEZTTSBBbmltYXRpb25cbiAgICovXG5cbiAgRW50aXR5Q3JlYXRvci5wcm90b3R5cGUuY3JlYXRlQXN0ZXJvaWQgPSBmdW5jdGlvbihyYWRpdXMsIHgsIHkpIHtcblxuICAgIC8qXG4gICAgICogTW9kZWwgdGhlIHBoeXNpY3MgdXNpbmcgQm94MkRcbiAgICAgKi9cbiAgICB2YXIgYXN0ZXJvaWQsIGJvZHksIGJvZHlEZWYsIGRlYXRoVmlldywgZml4RGVmLCBmc207XG4gICAgYm9keURlZiA9IG5ldyBiMkJvZHlEZWYoKTtcbiAgICBib2R5RGVmLnR5cGUgPSBiMkJvZHkuYjJfZHluYW1pY0JvZHk7XG4gICAgYm9keURlZi5maXhlZFJvdGF0aW9uID0gdHJ1ZTtcbiAgICBib2R5RGVmLnBvc2l0aW9uLnggPSB4O1xuICAgIGJvZHlEZWYucG9zaXRpb24ueSA9IHk7XG4gICAgYm9keURlZi5saW5lYXJWZWxvY2l0eS5TZXQoKE1hdGgucmFuZG9tKCkgLSAwLjUpICogNCAqICg1MCAtIHJhZGl1cyksIChNYXRoLnJhbmRvbSgpIC0gMC41KSAqIDQgKiAoNTAgLSByYWRpdXMpKTtcbiAgICBib2R5RGVmLmFuZ3VsYXJWZWxvY2l0eSA9IE1hdGgucmFuZG9tKCkgKiAyIC0gMTtcbiAgICBmaXhEZWYgPSBuZXcgYjJGaXh0dXJlRGVmKCk7XG4gICAgZml4RGVmLmRlbnNpdHkgPSAxLjA7XG4gICAgZml4RGVmLmZyaWN0aW9uID0gMS4wO1xuICAgIGZpeERlZi5yZXN0aXR1dGlvbiA9IDAuMjtcbiAgICBmaXhEZWYuc2hhcGUgPSBuZXcgYjJDaXJjbGVTaGFwZShyYWRpdXMpO1xuICAgIGJvZHkgPSB0aGlzLndvcmxkLkNyZWF0ZUJvZHkoYm9keURlZik7XG4gICAgYm9keS5DcmVhdGVGaXh0dXJlKGZpeERlZik7XG4gICAgYXN0ZXJvaWQgPSBuZXcgRW50aXR5KCk7XG4gICAgZnNtID0gbmV3IEVudGl0eVN0YXRlTWFjaGluZShhc3Rlcm9pZCk7XG4gICAgZnNtLmNyZWF0ZVN0YXRlKCdhbGl2ZScpLmFkZChQaHlzaWNzKS53aXRoSW5zdGFuY2UobmV3IFBoeXNpY3MoYm9keSkpLmFkZChDb2xsaXNpb24pLndpdGhJbnN0YW5jZShuZXcgQ29sbGlzaW9uKHJhZGl1cykpLmFkZChEaXNwbGF5KS53aXRoSW5zdGFuY2UobmV3IERpc3BsYXkobmV3IEFzdGVyb2lkVmlldyhyYWRpdXMpKSk7XG4gICAgZGVhdGhWaWV3ID0gbmV3IEFzdGVyb2lkRGVhdGhWaWV3KHJhZGl1cyk7XG4gICAgZnNtLmNyZWF0ZVN0YXRlKCdkZXN0cm95ZWQnKS5hZGQoRGVhdGhUaHJvZXMpLndpdGhJbnN0YW5jZShuZXcgRGVhdGhUaHJvZXMoMykpLmFkZChEaXNwbGF5KS53aXRoSW5zdGFuY2UobmV3IERpc3BsYXkoZGVhdGhWaWV3KSkuYWRkKEFuaW1hdGlvbikud2l0aEluc3RhbmNlKG5ldyBBbmltYXRpb24oZGVhdGhWaWV3KSk7XG4gICAgYXN0ZXJvaWQuYWRkKG5ldyBBc3Rlcm9pZChmc20pKS5hZGQobmV3IFBvc2l0aW9uKHgsIHksIDApKS5hZGQobmV3IEF1ZGlvKCkpO1xuICAgIGJvZHkuU2V0VXNlckRhdGEoe1xuICAgICAgdHlwZTogJ2FzdGVyb2lkJyxcbiAgICAgIGlkOiArK3RoaXMuYXN0ZXJvaWRJZCxcbiAgICAgIGVudGl0eTogYXN0ZXJvaWRcbiAgICB9KTtcbiAgICBmc20uY2hhbmdlU3RhdGUoJ2FsaXZlJyk7XG4gICAgdGhpcy5lbmdpbmUuYWRkRW50aXR5KGFzdGVyb2lkKTtcbiAgICByZXR1cm4gYXN0ZXJvaWQ7XG4gIH07XG5cblxuICAvKlxuICAgKiBDcmVhdGUgUGxheWVyIFNwYWNlc2hpcCB3aXRoIEZTTSBBbmltYXRpb25cbiAgICovXG5cbiAgRW50aXR5Q3JlYXRvci5wcm90b3R5cGUuY3JlYXRlU3BhY2VzaGlwID0gZnVuY3Rpb24oKSB7XG5cbiAgICAvKlxuICAgICAqIE1vZGVsIHRoZSBwaHlzaWNzIHVzaW5nIEJveDJEXG4gICAgICovXG4gICAgdmFyIGJvZHksIGJvZHlEZWYsIGRlYXRoVmlldywgZml4RGVmLCBmc20sIHNwYWNlc2hpcDtcbiAgICBib2R5RGVmID0gbmV3IGIyQm9keURlZigpO1xuICAgIGJvZHlEZWYudHlwZSA9IGIyQm9keS5iMl9keW5hbWljQm9keTtcbiAgICBib2R5RGVmLmZpeGVkUm90YXRpb24gPSBmYWxzZTtcbiAgICBib2R5RGVmLnBvc2l0aW9uLnggPSAzMDA7XG4gICAgYm9keURlZi5wb3NpdGlvbi55ID0gMjI1O1xuICAgIGJvZHlEZWYubGluZWFyVmVsb2NpdHkuU2V0KDAsIDApO1xuICAgIGJvZHlEZWYuYW5ndWxhclZlbG9jaXR5ID0gMDtcbiAgICBib2R5RGVmLmxpbmVhckRhbXBpbmcgPSAwLjc1O1xuICAgIGZpeERlZiA9IG5ldyBiMkZpeHR1cmVEZWYoKTtcbiAgICBmaXhEZWYuZGVuc2l0eSA9IDEuMDtcbiAgICBmaXhEZWYuZnJpY3Rpb24gPSAxLjA7XG4gICAgZml4RGVmLnJlc3RpdHV0aW9uID0gMC4yO1xuICAgIGZpeERlZi5zaGFwZSA9IG5ldyBiMlBvbHlnb25TaGFwZSgpO1xuICAgIGZpeERlZi5zaGFwZS5TZXRBc0FycmF5KFtuZXcgYjJWZWMyKC40NSwgMCksIG5ldyBiMlZlYzIoLS4yNSwgLjI1KSwgbmV3IGIyVmVjMigtLjI1LCAtLjI1KV0sIDMpO1xuICAgIGJvZHkgPSB0aGlzLndvcmxkLkNyZWF0ZUJvZHkoYm9keURlZik7XG4gICAgYm9keS5DcmVhdGVGaXh0dXJlKGZpeERlZik7XG4gICAgc3BhY2VzaGlwID0gbmV3IEVudGl0eSgpO1xuICAgIGZzbSA9IG5ldyBFbnRpdHlTdGF0ZU1hY2hpbmUoc3BhY2VzaGlwKTtcbiAgICBmc20uY3JlYXRlU3RhdGUoJ3BsYXlpbmcnKS5hZGQoUGh5c2ljcykud2l0aEluc3RhbmNlKG5ldyBQaHlzaWNzKGJvZHkpKS5hZGQoTW90aW9uQ29udHJvbHMpLndpdGhJbnN0YW5jZShuZXcgTW90aW9uQ29udHJvbHMoS0VZX0xFRlQsIEtFWV9SSUdIVCwgS0VZX1VQLCAxMDAsIDMpKS5hZGQoR3VuKS53aXRoSW5zdGFuY2UobmV3IEd1big4LCAwLCAwLjMsIDIpKS5hZGQoR3VuQ29udHJvbHMpLndpdGhJbnN0YW5jZShuZXcgR3VuQ29udHJvbHMoS0VZX1opKS5hZGQoQ29sbGlzaW9uKS53aXRoSW5zdGFuY2UobmV3IENvbGxpc2lvbig5KSkuYWRkKERpc3BsYXkpLndpdGhJbnN0YW5jZShuZXcgRGlzcGxheShuZXcgU3BhY2VzaGlwVmlldygpKSk7XG4gICAgZGVhdGhWaWV3ID0gbmV3IFNwYWNlc2hpcERlYXRoVmlldygpO1xuICAgIGZzbS5jcmVhdGVTdGF0ZSgnZGVzdHJveWVkJykuYWRkKERlYXRoVGhyb2VzKS53aXRoSW5zdGFuY2UobmV3IERlYXRoVGhyb2VzKDUpKS5hZGQoRGlzcGxheSkud2l0aEluc3RhbmNlKG5ldyBEaXNwbGF5KGRlYXRoVmlldykpLmFkZChBbmltYXRpb24pLndpdGhJbnN0YW5jZShuZXcgQW5pbWF0aW9uKGRlYXRoVmlldykpO1xuICAgIHNwYWNlc2hpcC5hZGQobmV3IFNwYWNlc2hpcChmc20pKS5hZGQobmV3IFBvc2l0aW9uKDMwMCwgMjI1LCAwKSkuYWRkKG5ldyBBdWRpbygpKTtcbiAgICBib2R5LlNldFVzZXJEYXRhKHtcbiAgICAgIHR5cGU6ICdzcGFjZXNoaXAnLFxuICAgICAgaWQ6ICsrdGhpcy5zcGFjZXNoaXBJZCxcbiAgICAgIGVudGl0eTogc3BhY2VzaGlwXG4gICAgfSk7XG4gICAgZnNtLmNoYW5nZVN0YXRlKCdwbGF5aW5nJyk7XG4gICAgdGhpcy5lbmdpbmUuYWRkRW50aXR5KHNwYWNlc2hpcCk7XG4gICAgcmV0dXJuIHNwYWNlc2hpcDtcbiAgfTtcblxuXG4gIC8qXG4gICAqIENyZWF0ZSBhIEJ1bGxldFxuICAgKi9cblxuICBFbnRpdHlDcmVhdG9yLnByb3RvdHlwZS5jcmVhdGVVc2VyQnVsbGV0ID0gZnVuY3Rpb24oZ3VuLCBwYXJlbnRQb3NpdGlvbikge1xuICAgIHZhciBib2R5LCBib2R5RGVmLCBidWxsZXQsIGNvcywgZml4RGVmLCBzaW4sIHgsIHk7XG4gICAgY29zID0gTWF0aC5jb3MocGFyZW50UG9zaXRpb24ucm90YXRpb24pO1xuICAgIHNpbiA9IE1hdGguc2luKHBhcmVudFBvc2l0aW9uLnJvdGF0aW9uKTtcbiAgICB4ID0gY29zICogZ3VuLm9mZnNldEZyb21QYXJlbnQueCAtIHNpbiAqIGd1bi5vZmZzZXRGcm9tUGFyZW50LnkgKyBwYXJlbnRQb3NpdGlvbi5wb3NpdGlvbi54O1xuICAgIHkgPSBzaW4gKiBndW4ub2Zmc2V0RnJvbVBhcmVudC54ICsgY29zICogZ3VuLm9mZnNldEZyb21QYXJlbnQueSArIHBhcmVudFBvc2l0aW9uLnBvc2l0aW9uLnk7XG5cbiAgICAvKlxuICAgICAqIE1vZGVsIHRoZSBwaHlzaWNzIHVzaW5nIEJveDJEXG4gICAgICovXG4gICAgYm9keURlZiA9IG5ldyBiMkJvZHlEZWYoKTtcbiAgICBib2R5RGVmLnR5cGUgPSBiMkJvZHkuYjJfZHluYW1pY0JvZHk7XG4gICAgYm9keURlZi5maXhlZFJvdGF0aW9uID0gdHJ1ZTtcbiAgICBib2R5RGVmLnBvc2l0aW9uLnggPSB4O1xuICAgIGJvZHlEZWYucG9zaXRpb24ueSA9IHk7XG4gICAgYm9keURlZi5saW5lYXJWZWxvY2l0eS5TZXQoY29zICogMTUwLCBzaW4gKiAxNTApO1xuICAgIGJvZHlEZWYuYW5ndWxhclZlbG9jaXR5ID0gMDtcbiAgICBmaXhEZWYgPSBuZXcgYjJGaXh0dXJlRGVmKCk7XG4gICAgZml4RGVmLmRlbnNpdHkgPSAxLjA7XG4gICAgZml4RGVmLmZyaWN0aW9uID0gMC4wO1xuICAgIGZpeERlZi5yZXN0aXR1dGlvbiA9IDAuMjtcbiAgICBmaXhEZWYuc2hhcGUgPSBuZXcgYjJDaXJjbGVTaGFwZSgwKTtcbiAgICBib2R5ID0gdGhpcy53b3JsZC5DcmVhdGVCb2R5KGJvZHlEZWYpO1xuICAgIGJvZHkuQ3JlYXRlRml4dHVyZShmaXhEZWYpO1xuICAgIGJ1bGxldCA9IG5ldyBFbnRpdHkoKS5hZGQobmV3IEJ1bGxldChndW4uYnVsbGV0TGlmZXRpbWUpKS5hZGQobmV3IFBvc2l0aW9uKHgsIHksIDApKS5hZGQobmV3IENvbGxpc2lvbigwKSkuYWRkKG5ldyBQaHlzaWNzKGJvZHkpKS5hZGQobmV3IERpc3BsYXkobmV3IEJ1bGxldFZpZXcoKSkpO1xuICAgIGJvZHkuU2V0VXNlckRhdGEoe1xuICAgICAgdHlwZTogJ2J1bGxldCcsXG4gICAgICBpZDogKyt0aGlzLmJ1bGxldElkLFxuICAgICAgZW50aXR5OiBidWxsZXRcbiAgICB9KTtcbiAgICB0aGlzLmVuZ2luZS5hZGRFbnRpdHkoYnVsbGV0KTtcbiAgICByZXR1cm4gYnVsbGV0O1xuICB9O1xuXG4gIHJldHVybiBFbnRpdHlDcmVhdG9yO1xuXG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1lbnRpdHlfY3JlYXRvci5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc3Rlcm9pZHM7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uL2luZGV4Jyk7XG5cbmFzdGVyb2lkcy5HYW1lQ29uZmlnID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBHYW1lQ29uZmlnKCkge31cblxuICBHYW1lQ29uZmlnLnByb3RvdHlwZS53aWR0aCA9IDA7XG5cbiAgR2FtZUNvbmZpZy5wcm90b3R5cGUuaGVpZ2h0ID0gMDtcblxuICByZXR1cm4gR2FtZUNvbmZpZztcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Z2FtZV9jb25maWcuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXN0ZXJvaWRzO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi9pbmRleCcpO1xuXG5hc3Rlcm9pZHMuTWFpbiA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gTWFpbigpIHtcbiAgICB2YXIgY2FudmFzO1xuICAgIGNhbnZhcyA9IHRoaXMuY2FudmFzKCcjNkE1QUNEJyk7XG4gICAgYXN0ZXJvaWRzID0gbmV3IGFzdGVyb2lkcy5Bc3Rlcm9pZHMoY2FudmFzLmdldENvbnRleHQoJzJkJyksIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gICAgYXN0ZXJvaWRzLnN0YXJ0KCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgTWFpbi5wcm90b3R5cGUuY2FudmFzID0gZnVuY3Rpb24oYmFja2dyb3VuZENvbG9yKSB7XG4gICAgdmFyIGNhbnZhcztcbiAgICBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5hdmlnYXRvci5pc0NvY29vbkpTID8gJ3NjcmVlbmNhbnZhcycgOiAnY2FudmFzJyk7XG4gICAgY2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGggKiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcbiAgICBjYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0ICogd2luZG93LmRldmljZVBpeGVsUmF0aW87XG4gICAgY2FudmFzLnN0eWxlLndpZHRoID0gJzEwMCUnO1xuICAgIGNhbnZhcy5zdHlsZS5oZWlnaHQgPSAnMTAwJSc7XG4gICAgY2FudmFzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGJhY2tncm91bmRDb2xvcjtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNhbnZhcyk7XG4gICAgcmV0dXJuIGNhbnZhcztcbiAgfTtcblxuICByZXR1cm4gTWFpbjtcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWFpbi5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc2gsIGFzdGVyb2lkcyxcbiAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9O1xuXG5hc2ggPSByZXF1aXJlKCdhc2guY29mZmVlJyk7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uL2luZGV4Jyk7XG5cbmFzdGVyb2lkcy5ub2Rlcy5BbmltYXRpb25Ob2RlID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICBfX2V4dGVuZHMoQW5pbWF0aW9uTm9kZSwgX3N1cGVyKTtcblxuICBmdW5jdGlvbiBBbmltYXRpb25Ob2RlKCkge1xuICAgIHJldHVybiBBbmltYXRpb25Ob2RlLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgQW5pbWF0aW9uTm9kZS5jb21wb25lbnRzID0ge1xuICAgIGFuaW1hdGlvbjogYXN0ZXJvaWRzLmNvbXBvbmVudHMuQW5pbWF0aW9uXG4gIH07XG5cbiAgQW5pbWF0aW9uTm9kZS5wcm90b3R5cGUuYW5pbWF0aW9uID0gbnVsbDtcblxuICByZXR1cm4gQW5pbWF0aW9uTm9kZTtcblxufSkoYXNoLmNvcmUuTm9kZSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFuaW1hdGlvbl9ub2RlLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzaCwgYXN0ZXJvaWRzLFxuICBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgX19leHRlbmRzID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChfX2hhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH07XG5cbmFzaCA9IHJlcXVpcmUoJ2FzaC5jb2ZmZWUnKTtcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vaW5kZXgnKTtcblxuYXN0ZXJvaWRzLm5vZGVzLkFzdGVyb2lkQ29sbGlzaW9uTm9kZSA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgX19leHRlbmRzKEFzdGVyb2lkQ29sbGlzaW9uTm9kZSwgX3N1cGVyKTtcblxuICBmdW5jdGlvbiBBc3Rlcm9pZENvbGxpc2lvbk5vZGUoKSB7XG4gICAgcmV0dXJuIEFzdGVyb2lkQ29sbGlzaW9uTm9kZS5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIEFzdGVyb2lkQ29sbGlzaW9uTm9kZS5jb21wb25lbnRzID0ge1xuICAgIGFzdGVyb2lkOiBhc3Rlcm9pZHMuY29tcG9uZW50cy5Bc3Rlcm9pZCxcbiAgICBwb3NpdGlvbjogYXN0ZXJvaWRzLmNvbXBvbmVudHMuUG9zaXRpb24sXG4gICAgY29sbGlzaW9uOiBhc3Rlcm9pZHMuY29tcG9uZW50cy5Db2xsaXNpb24sXG4gICAgYXVkaW86IGFzdGVyb2lkcy5jb21wb25lbnRzLkF1ZGlvLFxuICAgIHBoeXNpY3M6IGFzdGVyb2lkcy5jb21wb25lbnRzLlBoeXNpY3NcbiAgfTtcblxuICBBc3Rlcm9pZENvbGxpc2lvbk5vZGUucHJvdG90eXBlLmFzdGVyb2lkID0gbnVsbDtcblxuICBBc3Rlcm9pZENvbGxpc2lvbk5vZGUucHJvdG90eXBlLnBvc2l0aW9uID0gbnVsbDtcblxuICBBc3Rlcm9pZENvbGxpc2lvbk5vZGUucHJvdG90eXBlLmNvbGxpc2lvbiA9IG51bGw7XG5cbiAgQXN0ZXJvaWRDb2xsaXNpb25Ob2RlLnByb3RvdHlwZS5hdWRpbyA9IG51bGw7XG5cbiAgQXN0ZXJvaWRDb2xsaXNpb25Ob2RlLnByb3RvdHlwZS5waHlzaWNzID0gbnVsbDtcblxuICByZXR1cm4gQXN0ZXJvaWRDb2xsaXNpb25Ob2RlO1xuXG59KShhc2guY29yZS5Ob2RlKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXN0ZXJvaWRfY29sbGlzaW9uX25vZGUuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXNoLCBhc3Rlcm9pZHMsXG4gIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICBfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfTtcblxuYXNoID0gcmVxdWlyZSgnYXNoLmNvZmZlZScpO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi9pbmRleCcpO1xuXG5hc3Rlcm9pZHMubm9kZXMuQXVkaW9Ob2RlID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICBfX2V4dGVuZHMoQXVkaW9Ob2RlLCBfc3VwZXIpO1xuXG4gIGZ1bmN0aW9uIEF1ZGlvTm9kZSgpIHtcbiAgICByZXR1cm4gQXVkaW9Ob2RlLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgQXVkaW9Ob2RlLmNvbXBvbmVudHMgPSB7XG4gICAgYXVkaW86IGFzdGVyb2lkcy5jb21wb25lbnRzLkF1ZGlvXG4gIH07XG5cbiAgQXVkaW9Ob2RlLnByb3RvdHlwZS5hdWRpbyA9IG51bGw7XG5cbiAgcmV0dXJuIEF1ZGlvTm9kZTtcblxufSkoYXNoLmNvcmUuTm9kZSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWF1ZGlvX25vZGUuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXNoLCBhc3Rlcm9pZHMsXG4gIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICBfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfTtcblxuYXNoID0gcmVxdWlyZSgnYXNoLmNvZmZlZScpO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi9pbmRleCcpO1xuXG5hc3Rlcm9pZHMubm9kZXMuQnVsbGV0QWdlTm9kZSA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgX19leHRlbmRzKEJ1bGxldEFnZU5vZGUsIF9zdXBlcik7XG5cbiAgZnVuY3Rpb24gQnVsbGV0QWdlTm9kZSgpIHtcbiAgICByZXR1cm4gQnVsbGV0QWdlTm9kZS5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIEJ1bGxldEFnZU5vZGUuY29tcG9uZW50cyA9IHtcbiAgICBidWxsZXQ6IGFzdGVyb2lkcy5jb21wb25lbnRzLkJ1bGxldCxcbiAgICBwaHlzaWNzOiBhc3Rlcm9pZHMuY29tcG9uZW50cy5QaHlzaWNzXG4gIH07XG5cbiAgQnVsbGV0QWdlTm9kZS5wcm90b3R5cGUuYnVsbGV0ID0gbnVsbDtcblxuICBCdWxsZXRBZ2VOb2RlLnByb3RvdHlwZS5waHlzaWNzID0gbnVsbDtcblxuICByZXR1cm4gQnVsbGV0QWdlTm9kZTtcblxufSkoYXNoLmNvcmUuTm9kZSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWJ1bGxldF9hZ2Vfbm9kZS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc2gsIGFzdGVyb2lkcyxcbiAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9O1xuXG5hc2ggPSByZXF1aXJlKCdhc2guY29mZmVlJyk7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uL2luZGV4Jyk7XG5cbmFzdGVyb2lkcy5ub2Rlcy5CdWxsZXRDb2xsaXNpb25Ob2RlID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICBfX2V4dGVuZHMoQnVsbGV0Q29sbGlzaW9uTm9kZSwgX3N1cGVyKTtcblxuICBmdW5jdGlvbiBCdWxsZXRDb2xsaXNpb25Ob2RlKCkge1xuICAgIHJldHVybiBCdWxsZXRDb2xsaXNpb25Ob2RlLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgQnVsbGV0Q29sbGlzaW9uTm9kZS5jb21wb25lbnRzID0ge1xuICAgIGJ1bGxldDogYXN0ZXJvaWRzLmNvbXBvbmVudHMuQnVsbGV0LFxuICAgIHBvc2l0aW9uOiBhc3Rlcm9pZHMuY29tcG9uZW50cy5Qb3NpdGlvbixcbiAgICBjb2xsaXNpb246IGFzdGVyb2lkcy5jb21wb25lbnRzLkNvbGxpc2lvbixcbiAgICBwaHlzaWNzOiBhc3Rlcm9pZHMuY29tcG9uZW50cy5QaHlzaWNzXG4gIH07XG5cbiAgQnVsbGV0Q29sbGlzaW9uTm9kZS5wcm90b3R5cGUuYnVsbGV0ID0gbnVsbDtcblxuICBCdWxsZXRDb2xsaXNpb25Ob2RlLnByb3RvdHlwZS5wb3NpdGlvbiA9IG51bGw7XG5cbiAgQnVsbGV0Q29sbGlzaW9uTm9kZS5wcm90b3R5cGUuY29sbGlzaW9uID0gbnVsbDtcblxuICBCdWxsZXRDb2xsaXNpb25Ob2RlLnByb3RvdHlwZS5waHlzaWNzID0gbnVsbDtcblxuICByZXR1cm4gQnVsbGV0Q29sbGlzaW9uTm9kZTtcblxufSkoYXNoLmNvcmUuTm9kZSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWJ1bGxldF9jb2xsaXNpb25fbm9kZS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc2gsIGFzdGVyb2lkcyxcbiAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9O1xuXG5hc2ggPSByZXF1aXJlKCdhc2guY29mZmVlJyk7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uL2luZGV4Jyk7XG5cbmFzdGVyb2lkcy5ub2Rlcy5EZWF0aFRocm9lc05vZGUgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gIF9fZXh0ZW5kcyhEZWF0aFRocm9lc05vZGUsIF9zdXBlcik7XG5cbiAgZnVuY3Rpb24gRGVhdGhUaHJvZXNOb2RlKCkge1xuICAgIHJldHVybiBEZWF0aFRocm9lc05vZGUuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBEZWF0aFRocm9lc05vZGUuY29tcG9uZW50cyA9IHtcbiAgICBkZWFkOiBhc3Rlcm9pZHMuY29tcG9uZW50cy5EZWF0aFRocm9lc1xuICB9O1xuXG4gIERlYXRoVGhyb2VzTm9kZS5wcm90b3R5cGUuZGVhZCA9IG51bGw7XG5cbiAgcmV0dXJuIERlYXRoVGhyb2VzTm9kZTtcblxufSkoYXNoLmNvcmUuTm9kZSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRlYXRoX3Rocm9lc19ub2RlLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzaCwgYXN0ZXJvaWRzLFxuICBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgX19leHRlbmRzID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChfX2hhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH07XG5cbmFzaCA9IHJlcXVpcmUoJ2FzaC5jb2ZmZWUnKTtcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vaW5kZXgnKTtcblxuYXN0ZXJvaWRzLm5vZGVzLkdhbWVOb2RlID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICBfX2V4dGVuZHMoR2FtZU5vZGUsIF9zdXBlcik7XG5cbiAgZnVuY3Rpb24gR2FtZU5vZGUoKSB7XG4gICAgcmV0dXJuIEdhbWVOb2RlLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgR2FtZU5vZGUuY29tcG9uZW50cyA9IHtcbiAgICBzdGF0ZTogYXN0ZXJvaWRzLmNvbXBvbmVudHMuR2FtZVN0YXRlXG4gIH07XG5cbiAgR2FtZU5vZGUucHJvdG90eXBlLnN0YXRlID0gbnVsbDtcblxuICByZXR1cm4gR2FtZU5vZGU7XG5cbn0pKGFzaC5jb3JlLk5vZGUpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1nYW1lX25vZGUuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXNoLCBhc3Rlcm9pZHMsXG4gIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICBfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfTtcblxuYXNoID0gcmVxdWlyZSgnYXNoLmNvZmZlZScpO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi9pbmRleCcpO1xuXG5hc3Rlcm9pZHMubm9kZXMuR3VuQ29udHJvbE5vZGUgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gIF9fZXh0ZW5kcyhHdW5Db250cm9sTm9kZSwgX3N1cGVyKTtcblxuICBmdW5jdGlvbiBHdW5Db250cm9sTm9kZSgpIHtcbiAgICByZXR1cm4gR3VuQ29udHJvbE5vZGUuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBHdW5Db250cm9sTm9kZS5jb21wb25lbnRzID0ge1xuICAgIGF1ZGlvOiBhc3Rlcm9pZHMuY29tcG9uZW50cy5BdWRpbyxcbiAgICBjb250cm9sOiBhc3Rlcm9pZHMuY29tcG9uZW50cy5HdW5Db250cm9scyxcbiAgICBndW46IGFzdGVyb2lkcy5jb21wb25lbnRzLkd1bixcbiAgICBwb3NpdGlvbjogYXN0ZXJvaWRzLmNvbXBvbmVudHMuUG9zaXRpb25cbiAgfTtcblxuICBHdW5Db250cm9sTm9kZS5wcm90b3R5cGUuY29udHJvbCA9IG51bGw7XG5cbiAgR3VuQ29udHJvbE5vZGUucHJvdG90eXBlLmd1biA9IG51bGw7XG5cbiAgR3VuQ29udHJvbE5vZGUucHJvdG90eXBlLnBvc2l0aW9uID0gbnVsbDtcblxuICBHdW5Db250cm9sTm9kZS5wcm90b3R5cGUuYXVkaW8gPSBudWxsO1xuXG4gIHJldHVybiBHdW5Db250cm9sTm9kZTtcblxufSkoYXNoLmNvcmUuTm9kZSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWd1bl9jb250cm9sX25vZGUuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXNoLCBhc3Rlcm9pZHMsXG4gIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICBfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfTtcblxuYXNoID0gcmVxdWlyZSgnYXNoLmNvZmZlZScpO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi9pbmRleCcpO1xuXG5hc3Rlcm9pZHMubm9kZXMuSHVkTm9kZSA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgX19leHRlbmRzKEh1ZE5vZGUsIF9zdXBlcik7XG5cbiAgZnVuY3Rpb24gSHVkTm9kZSgpIHtcbiAgICByZXR1cm4gSHVkTm9kZS5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIEh1ZE5vZGUuY29tcG9uZW50cyA9IHtcbiAgICBzdGF0ZTogYXN0ZXJvaWRzLmNvbXBvbmVudHMuR2FtZVN0YXRlLFxuICAgIGh1ZDogYXN0ZXJvaWRzLmNvbXBvbmVudHMuSHVkXG4gIH07XG5cbiAgSHVkTm9kZS5wcm90b3R5cGUuc3RhdGUgPSBudWxsO1xuXG4gIEh1ZE5vZGUucHJvdG90eXBlLmh1ZCA9IG51bGw7XG5cbiAgcmV0dXJuIEh1ZE5vZGU7XG5cbn0pKGFzaC5jb3JlLk5vZGUpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1odWRfbm9kZS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc2gsIGFzdGVyb2lkcyxcbiAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9O1xuXG5hc2ggPSByZXF1aXJlKCdhc2guY29mZmVlJyk7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uL2luZGV4Jyk7XG5cbmFzdGVyb2lkcy5ub2Rlcy5Nb3ZlbWVudE5vZGUgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gIF9fZXh0ZW5kcyhNb3ZlbWVudE5vZGUsIF9zdXBlcik7XG5cbiAgZnVuY3Rpb24gTW92ZW1lbnROb2RlKCkge1xuICAgIHJldHVybiBNb3ZlbWVudE5vZGUuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBNb3ZlbWVudE5vZGUuY29tcG9uZW50cyA9IHtcbiAgICBwb3NpdGlvbjogYXN0ZXJvaWRzLmNvbXBvbmVudHMuUG9zaXRpb24sXG4gICAgbW90aW9uOiBhc3Rlcm9pZHMuY29tcG9uZW50cy5Nb3Rpb25cbiAgfTtcblxuICBNb3ZlbWVudE5vZGUucHJvdG90eXBlLnBvc2l0aW9uID0gbnVsbDtcblxuICBNb3ZlbWVudE5vZGUucHJvdG90eXBlLm1vdGlvbiA9IG51bGw7XG5cbiAgcmV0dXJuIE1vdmVtZW50Tm9kZTtcblxufSkoYXNoLmNvcmUuTm9kZSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1vdmVtZW50X25vZGUuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXNoLCBhc3Rlcm9pZHMsXG4gIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICBfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfTtcblxuYXNoID0gcmVxdWlyZSgnYXNoLmNvZmZlZScpO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi9pbmRleCcpO1xuXG5hc3Rlcm9pZHMubm9kZXMuUGh5c2ljc0NvbnRyb2xOb2RlID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICBfX2V4dGVuZHMoUGh5c2ljc0NvbnRyb2xOb2RlLCBfc3VwZXIpO1xuXG4gIGZ1bmN0aW9uIFBoeXNpY3NDb250cm9sTm9kZSgpIHtcbiAgICByZXR1cm4gUGh5c2ljc0NvbnRyb2xOb2RlLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgUGh5c2ljc0NvbnRyb2xOb2RlLmNvbXBvbmVudHMgPSB7XG4gICAgY29udHJvbDogYXN0ZXJvaWRzLmNvbXBvbmVudHMuTW90aW9uQ29udHJvbHMsXG4gICAgcGh5c2ljczogYXN0ZXJvaWRzLmNvbXBvbmVudHMuUGh5c2ljc1xuICB9O1xuXG4gIFBoeXNpY3NDb250cm9sTm9kZS5wcm90b3R5cGUuY29udHJvbCA9IG51bGw7XG5cbiAgUGh5c2ljc0NvbnRyb2xOb2RlLnByb3RvdHlwZS5waHlzaWNzID0gbnVsbDtcblxuICByZXR1cm4gUGh5c2ljc0NvbnRyb2xOb2RlO1xuXG59KShhc2guY29yZS5Ob2RlKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGh5c2ljc19jb250cm9sX25vZGUuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXNoLCBhc3Rlcm9pZHMsXG4gIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICBfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfTtcblxuYXNoID0gcmVxdWlyZSgnYXNoLmNvZmZlZScpO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi9pbmRleCcpO1xuXG5hc3Rlcm9pZHMubm9kZXMuUGh5c2ljc05vZGUgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gIF9fZXh0ZW5kcyhQaHlzaWNzTm9kZSwgX3N1cGVyKTtcblxuICBmdW5jdGlvbiBQaHlzaWNzTm9kZSgpIHtcbiAgICByZXR1cm4gUGh5c2ljc05vZGUuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBQaHlzaWNzTm9kZS5jb21wb25lbnRzID0ge1xuICAgIHBvc2l0aW9uOiBhc3Rlcm9pZHMuY29tcG9uZW50cy5Qb3NpdGlvbixcbiAgICBwaHlzaWNzOiBhc3Rlcm9pZHMuY29tcG9uZW50cy5QaHlzaWNzXG4gIH07XG5cbiAgUGh5c2ljc05vZGUucHJvdG90eXBlLnBvc2l0aW9uID0gbnVsbDtcblxuICBQaHlzaWNzTm9kZS5wcm90b3R5cGUucGh5c2ljcyA9IG51bGw7XG5cbiAgcmV0dXJuIFBoeXNpY3NOb2RlO1xuXG59KShhc2guY29yZS5Ob2RlKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGh5c2ljc19ub2RlLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzaCwgYXN0ZXJvaWRzLFxuICBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgX19leHRlbmRzID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChfX2hhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH07XG5cbmFzaCA9IHJlcXVpcmUoJ2FzaC5jb2ZmZWUnKTtcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vaW5kZXgnKTtcblxuYXN0ZXJvaWRzLm5vZGVzLlJlbmRlck5vZGUgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gIF9fZXh0ZW5kcyhSZW5kZXJOb2RlLCBfc3VwZXIpO1xuXG4gIGZ1bmN0aW9uIFJlbmRlck5vZGUoKSB7XG4gICAgcmV0dXJuIFJlbmRlck5vZGUuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBSZW5kZXJOb2RlLmNvbXBvbmVudHMgPSB7XG4gICAgcG9zaXRpb246IGFzdGVyb2lkcy5jb21wb25lbnRzLlBvc2l0aW9uLFxuICAgIGRpc3BsYXk6IGFzdGVyb2lkcy5jb21wb25lbnRzLkRpc3BsYXlcbiAgfTtcblxuICBSZW5kZXJOb2RlLnByb3RvdHlwZS5wb3NpdGlvbiA9IG51bGw7XG5cbiAgUmVuZGVyTm9kZS5wcm90b3R5cGUuZGlzcGxheSA9IG51bGw7XG5cbiAgcmV0dXJuIFJlbmRlck5vZGU7XG5cbn0pKGFzaC5jb3JlLk5vZGUpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1yZW5kZXJfbm9kZS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc2gsIGFzdGVyb2lkcyxcbiAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9O1xuXG5hc2ggPSByZXF1aXJlKCdhc2guY29mZmVlJyk7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uL2luZGV4Jyk7XG5cbmFzdGVyb2lkcy5ub2Rlcy5TcGFjZXNoaXBDb2xsaXNpb25Ob2RlID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICBfX2V4dGVuZHMoU3BhY2VzaGlwQ29sbGlzaW9uTm9kZSwgX3N1cGVyKTtcblxuICBmdW5jdGlvbiBTcGFjZXNoaXBDb2xsaXNpb25Ob2RlKCkge1xuICAgIHJldHVybiBTcGFjZXNoaXBDb2xsaXNpb25Ob2RlLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgU3BhY2VzaGlwQ29sbGlzaW9uTm9kZS5jb21wb25lbnRzID0ge1xuICAgIHNwYWNlc2hpcDogYXN0ZXJvaWRzLmNvbXBvbmVudHMuU3BhY2VzaGlwLFxuICAgIHBvc2l0aW9uOiBhc3Rlcm9pZHMuY29tcG9uZW50cy5Qb3NpdGlvbixcbiAgICBjb2xsaXNpb246IGFzdGVyb2lkcy5jb21wb25lbnRzLkNvbGxpc2lvbixcbiAgICBhdWRpbzogYXN0ZXJvaWRzLmNvbXBvbmVudHMuQXVkaW8sXG4gICAgcGh5c2ljczogYXN0ZXJvaWRzLmNvbXBvbmVudHMuUGh5c2ljc1xuICB9O1xuXG4gIFNwYWNlc2hpcENvbGxpc2lvbk5vZGUucHJvdG90eXBlLnNwYWNlc2hpcCA9IG51bGw7XG5cbiAgU3BhY2VzaGlwQ29sbGlzaW9uTm9kZS5wcm90b3R5cGUucG9zaXRpb24gPSBudWxsO1xuXG4gIFNwYWNlc2hpcENvbGxpc2lvbk5vZGUucHJvdG90eXBlLmNvbGxpc2lvbiA9IG51bGw7XG5cbiAgU3BhY2VzaGlwQ29sbGlzaW9uTm9kZS5wcm90b3R5cGUuYXVkaW8gPSBudWxsO1xuXG4gIFNwYWNlc2hpcENvbGxpc2lvbk5vZGUucHJvdG90eXBlLnBoeXNpY3MgPSBudWxsO1xuXG4gIHJldHVybiBTcGFjZXNoaXBDb2xsaXNpb25Ob2RlO1xuXG59KShhc2guY29yZS5Ob2RlKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3BhY2VzaGlwX2NvbGxpc2lvbl9ub2RlLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzaCwgYXN0ZXJvaWRzLFxuICBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgX19leHRlbmRzID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChfX2hhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH07XG5cbmFzaCA9IHJlcXVpcmUoJ2FzaC5jb2ZmZWUnKTtcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vaW5kZXgnKTtcblxuYXN0ZXJvaWRzLm5vZGVzLlNwYWNlc2hpcE5vZGUgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gIF9fZXh0ZW5kcyhTcGFjZXNoaXBOb2RlLCBfc3VwZXIpO1xuXG4gIGZ1bmN0aW9uIFNwYWNlc2hpcE5vZGUoKSB7XG4gICAgcmV0dXJuIFNwYWNlc2hpcE5vZGUuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBTcGFjZXNoaXBOb2RlLmNvbXBvbmVudHMgPSB7XG4gICAgc3BhY2VzaGlwOiBhc3Rlcm9pZHMuY29tcG9uZW50cy5TcGFjZXNoaXAsXG4gICAgcG9zaXRpb246IGFzdGVyb2lkcy5jb21wb25lbnRzLlBvc2l0aW9uXG4gIH07XG5cbiAgU3BhY2VzaGlwTm9kZS5wcm90b3R5cGUuc3BhY2VzaGlwID0gMDtcblxuICBTcGFjZXNoaXBOb2RlLnByb3RvdHlwZS5wb3NpdGlvbiA9IDA7XG5cbiAgcmV0dXJuIFNwYWNlc2hpcE5vZGU7XG5cbn0pKGFzaC5jb3JlLk5vZGUpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zcGFjZXNoaXBfbm9kZS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc2gsIGFzdGVyb2lkcyxcbiAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9O1xuXG5hc2ggPSByZXF1aXJlKCdhc2guY29mZmVlJyk7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uL2luZGV4Jyk7XG5cbmFzdGVyb2lkcy5ub2Rlcy5XYWl0Rm9yU3RhcnROb2RlID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICBfX2V4dGVuZHMoV2FpdEZvclN0YXJ0Tm9kZSwgX3N1cGVyKTtcblxuICBmdW5jdGlvbiBXYWl0Rm9yU3RhcnROb2RlKCkge1xuICAgIHJldHVybiBXYWl0Rm9yU3RhcnROb2RlLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgV2FpdEZvclN0YXJ0Tm9kZS5jb21wb25lbnRzID0ge1xuICAgIHdhaXQ6IGFzdGVyb2lkcy5jb21wb25lbnRzLldhaXRGb3JTdGFydFxuICB9O1xuXG4gIFdhaXRGb3JTdGFydE5vZGUucHJvdG90eXBlLndhaXQgPSBudWxsO1xuXG4gIHJldHVybiBXYWl0Rm9yU3RhcnROb2RlO1xuXG59KShhc2guY29yZS5Ob2RlKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9d2FpdF9mb3Jfc3RhcnRfbm9kZS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBEb3QsIFBvaW50LCBhc3Rlcm9pZHMsXG4gIF9fYmluZCA9IGZ1bmN0aW9uKGZuLCBtZSl7IHJldHVybiBmdW5jdGlvbigpeyByZXR1cm4gZm4uYXBwbHkobWUsIGFyZ3VtZW50cyk7IH07IH07XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uL2luZGV4Jyk7XG5cblBvaW50ID0gYXN0ZXJvaWRzLnVpLlBvaW50O1xuXG5hc3Rlcm9pZHMuc3ByaXRlcy5Bc3Rlcm9pZERlYXRoVmlldyA9IChmdW5jdGlvbigpIHtcbiAgQXN0ZXJvaWREZWF0aFZpZXcucHJvdG90eXBlLnggPSAwO1xuXG4gIEFzdGVyb2lkRGVhdGhWaWV3LnByb3RvdHlwZS55ID0gMDtcblxuICBBc3Rlcm9pZERlYXRoVmlldy5wcm90b3R5cGUucm90YXRpb24gPSAwO1xuXG4gIEFzdGVyb2lkRGVhdGhWaWV3LnByb3RvdHlwZS5yYWRpdXMgPSAwO1xuXG4gIEFzdGVyb2lkRGVhdGhWaWV3LnByb3RvdHlwZS5wb2ludHMgPSBudWxsO1xuXG4gIEFzdGVyb2lkRGVhdGhWaWV3LnByb3RvdHlwZS5maXJzdCA9IHRydWU7XG5cbiAgQXN0ZXJvaWREZWF0aFZpZXcucHJvdG90eXBlLmRvdHMgPSBudWxsO1xuXG4gIGZ1bmN0aW9uIEFzdGVyb2lkRGVhdGhWaWV3KHJhZGl1cykge1xuICAgIHRoaXMucmFkaXVzID0gcmFkaXVzO1xuICAgIHRoaXMuZHJhdyA9IF9fYmluZCh0aGlzLmRyYXcsIHRoaXMpO1xuICAgIHRoaXMuZG90cyA9IFtdO1xuICB9XG5cbiAgQXN0ZXJvaWREZWF0aFZpZXcucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbihjdHgpIHtcbiAgICB2YXIgZG90LCBfaSwgX2xlbiwgX3JlZiwgX3Jlc3VsdHM7XG4gICAgX3JlZiA9IHRoaXMuZG90cztcbiAgICBfcmVzdWx0cyA9IFtdO1xuICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZi5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgZG90ID0gX3JlZltfaV07XG4gICAgICBfcmVzdWx0cy5wdXNoKGRvdC5kcmF3KGN0eCwgdGhpcy54LCB0aGlzLnkpKTtcbiAgICB9XG4gICAgcmV0dXJuIF9yZXN1bHRzO1xuICB9O1xuXG4gIEFzdGVyb2lkRGVhdGhWaWV3LnByb3RvdHlwZS5hbmltYXRlID0gZnVuY3Rpb24odGltZSkge1xuICAgIHZhciBkb3QsIGksIF9pLCBfaiwgX2xlbiwgX3JlZiwgX3Jlc3VsdHM7XG4gICAgaWYgKHRoaXMuZmlyc3QpIHtcbiAgICAgIHRoaXMuZmlyc3QgPSBmYWxzZTtcbiAgICAgIGZvciAoaSA9IF9pID0gMDsgX2kgPCA4OyBpID0gKytfaSkge1xuICAgICAgICBkb3QgPSBuZXcgRG90KHRoaXMucmFkaXVzKTtcbiAgICAgICAgdGhpcy5kb3RzLnB1c2goZG90KTtcbiAgICAgIH1cbiAgICB9XG4gICAgX3JlZiA9IHRoaXMuZG90cztcbiAgICBfcmVzdWx0cyA9IFtdO1xuICAgIGZvciAoX2ogPSAwLCBfbGVuID0gX3JlZi5sZW5ndGg7IF9qIDwgX2xlbjsgX2orKykge1xuICAgICAgZG90ID0gX3JlZltfal07XG4gICAgICBkb3QueCArPSBkb3QudmVsb2NpdHkueCAqIHRpbWU7XG4gICAgICBfcmVzdWx0cy5wdXNoKGRvdC55ICs9IGRvdC52ZWxvY2l0eS55ICogdGltZSk7XG4gICAgfVxuICAgIHJldHVybiBfcmVzdWx0cztcbiAgfTtcblxuICByZXR1cm4gQXN0ZXJvaWREZWF0aFZpZXc7XG5cbn0pKCk7XG5cbkRvdCA9IChmdW5jdGlvbigpIHtcbiAgRG90LnByb3RvdHlwZS52ZWxvY2l0eSA9IG51bGw7XG5cbiAgRG90LnByb3RvdHlwZS54ID0gMDtcblxuICBEb3QucHJvdG90eXBlLnkgPSAwO1xuXG4gIGZ1bmN0aW9uIERvdChtYXhEaXN0YW5jZSkge1xuICAgIHZhciBhbmdsZSwgZGlzdGFuY2UsIHNwZWVkO1xuICAgIGFuZ2xlID0gTWF0aC5yYW5kb20oKSAqIDIgKiBNYXRoLlBJO1xuICAgIGRpc3RhbmNlID0gTWF0aC5yYW5kb20oKSAqIG1heERpc3RhbmNlO1xuICAgIHRoaXMueCA9IE1hdGguY29zKGFuZ2xlKSAqIGRpc3RhbmNlO1xuICAgIHRoaXMueSA9IE1hdGguc2luKGFuZ2xlKSAqIGRpc3RhbmNlO1xuICAgIHNwZWVkID0gTWF0aC5yYW5kb20oKSAqIDEwICsgMTA7XG4gICAgdGhpcy52ZWxvY2l0eSA9IG5ldyBQb2ludChNYXRoLmNvcyhhbmdsZSkgKiBzcGVlZCwgTWF0aC5zaW4oYW5nbGUpICogc3BlZWQpO1xuICB9XG5cbiAgRG90LnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oY3R4LCB4LCB5KSB7XG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4LnRyYW5zbGF0ZSh4LCB5KTtcbiAgICBjdHgucm90YXRlKHRoaXMucm90YXRpb24pO1xuICAgIGN0eC5maWxsU3R5bGUgPSBcIiNGRkZGRkZcIjtcbiAgICBjdHguYXJjKHRoaXMueCwgdGhpcy55LCAyLCAwLCBNYXRoLlBJICogMiwgZmFsc2UpO1xuICAgIGN0eC5maWxsKCk7XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfTtcblxuICByZXR1cm4gRG90O1xuXG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hc3Rlcm9pZF9kZWF0aF92aWV3LmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzdGVyb2lkcyxcbiAgX19iaW5kID0gZnVuY3Rpb24oZm4sIG1lKXsgcmV0dXJuIGZ1bmN0aW9uKCl7IHJldHVybiBmbi5hcHBseShtZSwgYXJndW1lbnRzKTsgfTsgfTtcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vaW5kZXgnKTtcblxuYXN0ZXJvaWRzLnNwcml0ZXMuQXN0ZXJvaWRWaWV3ID0gKGZ1bmN0aW9uKCkge1xuICBBc3Rlcm9pZFZpZXcucHJvdG90eXBlLnggPSAwO1xuXG4gIEFzdGVyb2lkVmlldy5wcm90b3R5cGUueSA9IDA7XG5cbiAgQXN0ZXJvaWRWaWV3LnByb3RvdHlwZS5yb3RhdGlvbiA9IDA7XG5cbiAgQXN0ZXJvaWRWaWV3LnByb3RvdHlwZS5yYWRpdXMgPSAwO1xuXG4gIEFzdGVyb2lkVmlldy5wcm90b3R5cGUucG9pbnRzID0gbnVsbDtcblxuICBmdW5jdGlvbiBBc3Rlcm9pZFZpZXcocmFkaXVzKSB7XG4gICAgdmFyIGFuZ2xlLCBsZW5ndGgsIHBvc1gsIHBvc1k7XG4gICAgdGhpcy5yYWRpdXMgPSByYWRpdXM7XG4gICAgdGhpcy5kcmF3ID0gX19iaW5kKHRoaXMuZHJhdywgdGhpcyk7XG4gICAgdGhpcy53aWR0aCA9IHRoaXMucmFkaXVzO1xuICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5yYWRpdXM7XG4gICAgdGhpcy5wb2ludHMgPSBbXTtcbiAgICBhbmdsZSA9IDA7XG4gICAgd2hpbGUgKGFuZ2xlIDwgTWF0aC5QSSAqIDIpIHtcbiAgICAgIGxlbmd0aCA9ICgwLjc1ICsgTWF0aC5yYW5kb20oKSAqIDAuMjUpICogdGhpcy5yYWRpdXM7XG4gICAgICBwb3NYID0gTWF0aC5jb3MoYW5nbGUpICogbGVuZ3RoO1xuICAgICAgcG9zWSA9IE1hdGguc2luKGFuZ2xlKSAqIGxlbmd0aDtcbiAgICAgIHRoaXMucG9pbnRzLnB1c2goe1xuICAgICAgICB4OiBwb3NYLFxuICAgICAgICB5OiBwb3NZXG4gICAgICB9KTtcbiAgICAgIGFuZ2xlICs9IE1hdGgucmFuZG9tKCkgKiAwLjU7XG4gICAgfVxuICB9XG5cbiAgQXN0ZXJvaWRWaWV3LnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oY3R4KSB7XG4gICAgdmFyIGk7XG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4LnRyYW5zbGF0ZSh0aGlzLngsIHRoaXMueSk7XG4gICAgY3R4LnJvdGF0ZSh0aGlzLnJvdGF0aW9uKTtcbiAgICBjdHguZmlsbFN0eWxlID0gXCIjRkZGRkZGXCI7XG4gICAgY3R4Lm1vdmVUbyh0aGlzLnJhZGl1cywgMCk7XG4gICAgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCB0aGlzLnBvaW50cy5sZW5ndGgpIHtcbiAgICAgIGN0eC5saW5lVG8odGhpcy5wb2ludHNbaV0ueCwgdGhpcy5wb2ludHNbaV0ueSk7XG4gICAgICArK2k7XG4gICAgfVxuICAgIGN0eC5saW5lVG8odGhpcy5yYWRpdXMsIDApO1xuICAgIGN0eC5maWxsKCk7XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfTtcblxuICByZXR1cm4gQXN0ZXJvaWRWaWV3O1xuXG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hc3Rlcm9pZF92aWV3LmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzdGVyb2lkcyxcbiAgX19iaW5kID0gZnVuY3Rpb24oZm4sIG1lKXsgcmV0dXJuIGZ1bmN0aW9uKCl7IHJldHVybiBmbi5hcHBseShtZSwgYXJndW1lbnRzKTsgfTsgfTtcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vaW5kZXgnKTtcblxuYXN0ZXJvaWRzLnNwcml0ZXMuQnVsbGV0VmlldyA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gQnVsbGV0VmlldygpIHtcbiAgICB0aGlzLmRyYXcgPSBfX2JpbmQodGhpcy5kcmF3LCB0aGlzKTtcbiAgfVxuXG4gIEJ1bGxldFZpZXcucHJvdG90eXBlLnggPSAwO1xuXG4gIEJ1bGxldFZpZXcucHJvdG90eXBlLnkgPSAwO1xuXG4gIEJ1bGxldFZpZXcucHJvdG90eXBlLnJvdGF0aW9uID0gMDtcblxuICBCdWxsZXRWaWV3LnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oY3R4KSB7XG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4LnJvdGF0ZSh0aGlzLnJvdGF0aW9uKTtcbiAgICBjdHguZmlsbFN0eWxlID0gXCIjRkZGRkZGXCI7XG4gICAgY3R4LmFyYyh0aGlzLngsIHRoaXMueSwgMiwgMCwgTWF0aC5QSSAqIDIsIGZhbHNlKTtcbiAgICBjdHguZmlsbCgpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH07XG5cbiAgcmV0dXJuIEJ1bGxldFZpZXc7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWJ1bGxldF92aWV3LmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzdGVyb2lkcyxcbiAgX19iaW5kID0gZnVuY3Rpb24oZm4sIG1lKXsgcmV0dXJuIGZ1bmN0aW9uKCl7IHJldHVybiBmbi5hcHBseShtZSwgYXJndW1lbnRzKTsgfTsgfTtcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vaW5kZXgnKTtcblxuYXN0ZXJvaWRzLnNwcml0ZXMuSHVkVmlldyA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gSHVkVmlldygpIHtcbiAgICB0aGlzLmRyYXcgPSBfX2JpbmQodGhpcy5kcmF3LCB0aGlzKTtcbiAgICB0aGlzLnNldFNjb3JlID0gX19iaW5kKHRoaXMuc2V0U2NvcmUsIHRoaXMpO1xuICAgIHRoaXMuc2V0TGl2ZXMgPSBfX2JpbmQodGhpcy5zZXRMaXZlcywgdGhpcyk7XG4gIH1cblxuICBIdWRWaWV3LnByb3RvdHlwZS54ID0gMDtcblxuICBIdWRWaWV3LnByb3RvdHlwZS55ID0gMDtcblxuICBIdWRWaWV3LnByb3RvdHlwZS5yb3RhdGlvbiA9IDA7XG5cbiAgSHVkVmlldy5wcm90b3R5cGUuc2NvcmUgPSAwO1xuXG4gIEh1ZFZpZXcucHJvdG90eXBlLmxpdmVzID0gMztcblxuICBIdWRWaWV3LnByb3RvdHlwZS5zZXRMaXZlcyA9IGZ1bmN0aW9uKGxpdmVzKSB7XG4gICAgdGhpcy5saXZlcyA9IGxpdmVzO1xuICB9O1xuXG4gIEh1ZFZpZXcucHJvdG90eXBlLnNldFNjb3JlID0gZnVuY3Rpb24oc2NvcmUpIHtcbiAgICB0aGlzLnNjb3JlID0gc2NvcmU7XG4gIH07XG5cbiAgSHVkVmlldy5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKGN0eCkge1xuICAgIHZhciBsLCBzLCB4LCB5O1xuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5mb250ID0gJ2JvbGQgMThweCBvcGVuZHlzbGV4aWMnO1xuICAgIGN0eC5maWxsU3R5bGUgPSAnIzAwRkZGRic7XG4gICAgY3R4LnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgIHMgPSBcIkxJVkVTOiBcIiArIHRoaXMubGl2ZXM7XG4gICAgbCA9IGN0eC5tZWFzdXJlVGV4dChzKTtcbiAgICB4ID0gbC53aWR0aDtcbiAgICB5ID0gMjA7XG4gICAgY3R4LmZpbGxUZXh0KHMsIHgsIHkpO1xuICAgIGN0eC5maWxsKCk7XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHguZm9udCA9ICdib2xkIDE4cHggb3BlbmR5c2xleGljdG1sNSBzcHJpdGUnO1xuICAgIGN0eC5maWxsU3R5bGUgPSAnIzAwRkZGRic7XG4gICAgY3R4LnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgIHMgPSBcIlNDT1JFOiBcIiArIHRoaXMuc2NvcmU7XG4gICAgbCA9IGN0eC5tZWFzdXJlVGV4dChzKTtcbiAgICB4ID0gKHdpbmRvdy53aW5kb3cuaW5uZXJXaWR0aCAqIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKSAtIGwud2lkdGg7XG4gICAgeSA9IDIwO1xuICAgIGN0eC5maWxsVGV4dChzLCB4LCB5KTtcbiAgICBjdHguZmlsbCgpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH07XG5cbiAgcmV0dXJuIEh1ZFZpZXc7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWh1ZF92aWV3LmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIFBvaW50LCBhc3Rlcm9pZHMsXG4gIF9fYmluZCA9IGZ1bmN0aW9uKGZuLCBtZSl7IHJldHVybiBmdW5jdGlvbigpeyByZXR1cm4gZm4uYXBwbHkobWUsIGFyZ3VtZW50cyk7IH07IH07XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uL2luZGV4Jyk7XG5cblBvaW50ID0gYXN0ZXJvaWRzLnVpLlBvaW50O1xuXG5hc3Rlcm9pZHMuc3ByaXRlcy5TcGFjZXNoaXBEZWF0aFZpZXcgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIFNwYWNlc2hpcERlYXRoVmlldygpIHtcbiAgICB0aGlzLmRyYXcgPSBfX2JpbmQodGhpcy5kcmF3LCB0aGlzKTtcbiAgfVxuXG4gIFNwYWNlc2hpcERlYXRoVmlldy5wcm90b3R5cGUueCA9IDA7XG5cbiAgU3BhY2VzaGlwRGVhdGhWaWV3LnByb3RvdHlwZS55ID0gMDtcblxuICBTcGFjZXNoaXBEZWF0aFZpZXcucHJvdG90eXBlLnJvdGF0aW9uID0gMDtcblxuICBTcGFjZXNoaXBEZWF0aFZpZXcucHJvdG90eXBlLnZlbDEgPSBudWxsO1xuXG4gIFNwYWNlc2hpcERlYXRoVmlldy5wcm90b3R5cGUudmVsMiA9IG51bGw7XG5cbiAgU3BhY2VzaGlwRGVhdGhWaWV3LnByb3RvdHlwZS5yb3QxID0gbnVsbDtcblxuICBTcGFjZXNoaXBEZWF0aFZpZXcucHJvdG90eXBlLnJvdDIgPSBudWxsO1xuXG4gIFNwYWNlc2hpcERlYXRoVmlldy5wcm90b3R5cGUueDEgPSAwO1xuXG4gIFNwYWNlc2hpcERlYXRoVmlldy5wcm90b3R5cGUueTIgPSAwO1xuXG4gIFNwYWNlc2hpcERlYXRoVmlldy5wcm90b3R5cGUueTEgPSAwO1xuXG4gIFNwYWNlc2hpcERlYXRoVmlldy5wcm90b3R5cGUueTIgPSAwO1xuXG4gIFNwYWNlc2hpcERlYXRoVmlldy5wcm90b3R5cGUuZmlyc3QgPSB0cnVlO1xuXG4gIFNwYWNlc2hpcERlYXRoVmlldy5wcm90b3R5cGUuYW5pbWF0ZSA9IGZ1bmN0aW9uKHRpbWUpIHtcbiAgICBpZiAodGhpcy5maXJzdCkge1xuICAgICAgdGhpcy5maXJzdCA9IGZhbHNlO1xuICAgICAgdGhpcy52ZWwxID0gbmV3IFBvaW50KE1hdGgucmFuZG9tKCkgKiAxMCAtIDUsIE1hdGgucmFuZG9tKCkgKiAxMCArIDEwKTtcbiAgICAgIHRoaXMudmVsMiA9IG5ldyBQb2ludChNYXRoLnJhbmRvbSgpICogMTAgLSA1LCAtKE1hdGgucmFuZG9tKCkgKiAxMCArIDEwKSk7XG4gICAgICB0aGlzLnJvdDEgPSBNYXRoLnJhbmRvbSgpICogMzAwIC0gMTUwO1xuICAgICAgdGhpcy5yb3QyID0gTWF0aC5yYW5kb20oKSAqIDMwMCAtIDE1MDtcbiAgICAgIHRoaXMueDEgPSB0aGlzLngyID0gdGhpcy54O1xuICAgICAgdGhpcy55MSA9IHRoaXMueTIgPSB0aGlzLnk7XG4gICAgICB0aGlzLnIxID0gdGhpcy5yMiA9IHRoaXMucm90YXRpb247XG4gICAgfVxuICAgIHRoaXMueDEgKz0gdGhpcy52ZWwxLnggKiB0aW1lO1xuICAgIHRoaXMueTEgKz0gdGhpcy52ZWwxLnkgKiB0aW1lO1xuICAgIHRoaXMucjEgKz0gdGhpcy5yb3QxICogdGltZTtcbiAgICB0aGlzLngyICs9IHRoaXMudmVsMi54ICogdGltZTtcbiAgICB0aGlzLnkyICs9IHRoaXMudmVsMi55ICogdGltZTtcbiAgICB0aGlzLnIyICs9IHRoaXMucm90MiAqIHRpbWU7XG4gIH07XG5cbiAgU3BhY2VzaGlwRGVhdGhWaWV3LnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oY3R4KSB7XG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4LnRyYW5zbGF0ZSh0aGlzLnggKyB0aGlzLngxLCB0aGlzLnkgKyB0aGlzLnkxKTtcbiAgICBjdHgucm90YXRlKHRoaXMucjEpO1xuICAgIGN0eC5maWxsU3R5bGUgPSBcIiNGRkZGRkZcIjtcbiAgICBjdHgubW92ZVRvKDEwLCAwKTtcbiAgICBjdHgubGluZVRvKC03LCA3KTtcbiAgICBjdHgubGluZVRvKC00LCAwKTtcbiAgICBjdHgubGluZVRvKDEwLCAwKTtcbiAgICBjdHguZmlsbCgpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4LnRyYW5zbGF0ZSh0aGlzLnggKyB0aGlzLngyLCB0aGlzLnkgKyB0aGlzLnkyKTtcbiAgICBjdHgucm90YXRlKHRoaXMucjIpO1xuICAgIGN0eC5maWxsU3R5bGUgPSBcIiNGRkZGRkZcIjtcbiAgICBjdHgubW92ZVRvKDEwLCAwKTtcbiAgICBjdHgubGluZVRvKC03LCA3KTtcbiAgICBjdHgubGluZVRvKC00LCAwKTtcbiAgICBjdHgubGluZVRvKDEwLCAwKTtcbiAgICBjdHguZmlsbCgpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH07XG5cbiAgcmV0dXJuIFNwYWNlc2hpcERlYXRoVmlldztcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3BhY2VzaGlwX2RlYXRoX3ZpZXcuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXN0ZXJvaWRzLFxuICBfX2JpbmQgPSBmdW5jdGlvbihmbiwgbWUpeyByZXR1cm4gZnVuY3Rpb24oKXsgcmV0dXJuIGZuLmFwcGx5KG1lLCBhcmd1bWVudHMpOyB9OyB9O1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi9pbmRleCcpO1xuXG5hc3Rlcm9pZHMuc3ByaXRlcy5TcGFjZXNoaXBWaWV3ID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBTcGFjZXNoaXBWaWV3KCkge1xuICAgIHRoaXMuZHJhdyA9IF9fYmluZCh0aGlzLmRyYXcsIHRoaXMpO1xuICB9XG5cbiAgU3BhY2VzaGlwVmlldy5wcm90b3R5cGUueCA9IDA7XG5cbiAgU3BhY2VzaGlwVmlldy5wcm90b3R5cGUueSA9IDA7XG5cbiAgU3BhY2VzaGlwVmlldy5wcm90b3R5cGUucm90YXRpb24gPSAwO1xuXG4gIFNwYWNlc2hpcFZpZXcucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbihjdHgpIHtcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHgudHJhbnNsYXRlKHRoaXMueCwgdGhpcy55KTtcbiAgICBjdHgucm90YXRlKHRoaXMucm90YXRpb24pO1xuICAgIGN0eC5maWxsU3R5bGUgPSBcIiNGRkZGRkZcIjtcbiAgICBjdHgubW92ZVRvKDEwLCAwKTtcbiAgICBjdHgubGluZVRvKC03LCA3KTtcbiAgICBjdHgubGluZVRvKC00LCAwKTtcbiAgICBjdHgubGluZVRvKC03LCAtNyk7XG4gICAgY3R4LmxpbmVUbygxMCwgMCk7XG4gICAgY3R4LmZpbGwoKTtcbiAgICBjdHgucmVzdG9yZSgpO1xuICB9O1xuXG4gIHJldHVybiBTcGFjZXNoaXBWaWV3O1xuXG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zcGFjZXNoaXBfdmlldy5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBTaWduYWwwLCBhc2gsIGFzdGVyb2lkcyxcbiAgX19iaW5kID0gZnVuY3Rpb24oZm4sIG1lKXsgcmV0dXJuIGZ1bmN0aW9uKCl7IHJldHVybiBmbi5hcHBseShtZSwgYXJndW1lbnRzKTsgfTsgfTtcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vaW5kZXgnKTtcblxuYXNoID0gcmVxdWlyZSgnYXNoLmNvZmZlZScpO1xuXG5TaWduYWwwID0gYXNoLnNpZ25hbHMuU2lnbmFsMDtcblxuYXN0ZXJvaWRzLnNwcml0ZXMuV2FpdEZvclN0YXJ0VmlldyA9IChmdW5jdGlvbigpIHtcbiAgV2FpdEZvclN0YXJ0Vmlldy5wcm90b3R5cGUueCA9IDA7XG5cbiAgV2FpdEZvclN0YXJ0Vmlldy5wcm90b3R5cGUueSA9IDA7XG5cbiAgV2FpdEZvclN0YXJ0Vmlldy5wcm90b3R5cGUucm90YXRpb24gPSAwO1xuXG4gIFdhaXRGb3JTdGFydFZpZXcucHJvdG90eXBlLmZpcnN0ID0gdHJ1ZTtcblxuICBXYWl0Rm9yU3RhcnRWaWV3LnByb3RvdHlwZS5jbGljayA9IG51bGw7XG5cbiAgZnVuY3Rpb24gV2FpdEZvclN0YXJ0VmlldygpIHtcbiAgICB0aGlzLmRyYXcgPSBfX2JpbmQodGhpcy5kcmF3LCB0aGlzKTtcbiAgICB0aGlzLmNsaWNrID0gbmV3IFNpZ25hbDAoKTtcbiAgfVxuXG4gIFdhaXRGb3JTdGFydFZpZXcucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbihjdHgpIHtcbiAgICB2YXIgbCwgcywgeCwgeTtcbiAgICBpZiAodGhpcy5maXJzdCkge1xuICAgICAgdGhpcy5maXJzdCA9IGZhbHNlO1xuICAgICAgY3R4LmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXMuY2xpY2suZGlzcGF0Y2goKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKTtcbiAgICB9XG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4LmZvbnQgPSAnYm9sZCA0MHB4IG9wZW5keXNsZXhpYyc7XG4gICAgY3R4LmZpbGxTdHlsZSA9ICcjRkZGRkZGJztcbiAgICBzID0gJ0FTVEVST0lEUyc7XG4gICAgbCA9IGN0eC5tZWFzdXJlVGV4dChzKTtcbiAgICB4ID0gTWF0aC5mbG9vcigoKHdpbmRvdy5pbm5lcldpZHRoICogd2luZG93LmRldmljZVBpeGVsUmF0aW8pIC0gbC53aWR0aCkgLyAyKTtcbiAgICB5ID0gMTc1O1xuICAgIGN0eC5maWxsVGV4dChzLCB4LCB5KTtcbiAgICBjdHguZmlsbCgpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4LmZvbnQgPSAnYm9sZCAxOHB4IG9wZW5keXNsZXhpYyc7XG4gICAgY3R4LmZpbGxTdHlsZSA9ICcjRkZGRkZGJztcbiAgICBzID0gJ0NMSUNLIFRPIFNUQVJUJztcbiAgICBsID0gY3R4Lm1lYXN1cmVUZXh0KHMpO1xuICAgIHggPSBNYXRoLmZsb29yKCgod2luZG93LmlubmVyV2lkdGggKiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbykgLSBsLndpZHRoKSAvIDIpO1xuICAgIHkgPSAyMjU7XG4gICAgY3R4LmZpbGxUZXh0KHMsIHgsIHkpO1xuICAgIGN0eC5maWxsKCk7XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHguZm9udCA9ICdib2xkIDE0cHggb3BlbmR5c2xleGljJztcbiAgICBjdHguZmlsbFN0eWxlID0gJyNGRkZGRkYnO1xuICAgIHMgPSAnWiB0byBGaXJlICB+ICBBcnJvdyBLZXlzIHRvIE1vdmUnO1xuICAgIGwgPSBjdHgubWVhc3VyZVRleHQocyk7XG4gICAgeCA9IDEwO1xuICAgIHkgPSB3aW5kb3cuaW5uZXJIZWlnaHQgKiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyAtIDIwO1xuICAgIGN0eC5maWxsVGV4dChzLCB4LCB5KTtcbiAgICBjdHguZmlsbCgpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH07XG5cbiAgcmV0dXJuIFdhaXRGb3JTdGFydFZpZXc7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXdhaXRfZm9yX3N0YXJ0X3ZpZXcuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgQW5pbWF0aW9uTm9kZSwgYXNoLCBhc3Rlcm9pZHMsXG4gIF9fYmluZCA9IGZ1bmN0aW9uKGZuLCBtZSl7IHJldHVybiBmdW5jdGlvbigpeyByZXR1cm4gZm4uYXBwbHkobWUsIGFyZ3VtZW50cyk7IH07IH0sXG4gIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICBfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfTtcblxuYXNoID0gcmVxdWlyZSgnYXNoLmNvZmZlZScpO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi9pbmRleCcpO1xuXG5BbmltYXRpb25Ob2RlID0gYXN0ZXJvaWRzLm5vZGVzLkFuaW1hdGlvbk5vZGU7XG5cbmFzdGVyb2lkcy5zeXN0ZW1zLkFuaW1hdGlvblN5c3RlbSA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgX19leHRlbmRzKEFuaW1hdGlvblN5c3RlbSwgX3N1cGVyKTtcblxuICBmdW5jdGlvbiBBbmltYXRpb25TeXN0ZW0oKSB7XG4gICAgdGhpcy51cGRhdGVOb2RlID0gX19iaW5kKHRoaXMudXBkYXRlTm9kZSwgdGhpcyk7XG4gICAgQW5pbWF0aW9uU3lzdGVtLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIEFuaW1hdGlvbk5vZGUsIHRoaXMudXBkYXRlTm9kZSk7XG4gIH1cblxuICBBbmltYXRpb25TeXN0ZW0ucHJvdG90eXBlLnVwZGF0ZU5vZGUgPSBmdW5jdGlvbihub2RlLCB0aW1lKSB7XG4gICAgbm9kZS5hbmltYXRpb24uYW5pbWF0aW9uLmFuaW1hdGUodGltZSk7XG4gIH07XG5cbiAgcmV0dXJuIEFuaW1hdGlvblN5c3RlbTtcblxufSkoYXNoLnRvb2xzLkxpc3RJdGVyYXRpbmdTeXN0ZW0pO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hbmltYXRpb25fc3lzdGVtLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIEF1ZGlvTm9kZSwgYXNoLCBhc3Rlcm9pZHMsXG4gIF9fYmluZCA9IGZ1bmN0aW9uKGZuLCBtZSl7IHJldHVybiBmdW5jdGlvbigpeyByZXR1cm4gZm4uYXBwbHkobWUsIGFyZ3VtZW50cyk7IH07IH0sXG4gIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICBfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfTtcblxuYXNoID0gcmVxdWlyZSgnYXNoLmNvZmZlZScpO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi9pbmRleCcpO1xuXG5BdWRpb05vZGUgPSBhc3Rlcm9pZHMubm9kZXMuQXVkaW9Ob2RlO1xuXG5hc3Rlcm9pZHMuc3lzdGVtcy5BdWRpb1N5c3RlbSA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgX19leHRlbmRzKEF1ZGlvU3lzdGVtLCBfc3VwZXIpO1xuXG4gIGZ1bmN0aW9uIEF1ZGlvU3lzdGVtKCkge1xuICAgIHRoaXMudXBkYXRlTm9kZSA9IF9fYmluZCh0aGlzLnVwZGF0ZU5vZGUsIHRoaXMpO1xuICAgIEF1ZGlvU3lzdGVtLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIEF1ZGlvTm9kZSwgdGhpcy51cGRhdGVOb2RlKTtcbiAgfVxuXG4gIEF1ZGlvU3lzdGVtLnByb3RvdHlwZS51cGRhdGVOb2RlID0gZnVuY3Rpb24obm9kZSwgdGltZSkge1xuICAgIHZhciBlYWNoLCBzb3VuZCwgdHlwZSwgX3JlZjtcbiAgICBfcmVmID0gbm9kZS5hdWRpby50b1BsYXk7XG4gICAgZm9yIChlYWNoIGluIF9yZWYpIHtcbiAgICAgIHR5cGUgPSBfcmVmW2VhY2hdO1xuICAgICAgc291bmQgPSBuZXcgdHlwZSgpO1xuICAgICAgc291bmQucGxheSgwLCAxKTtcbiAgICB9XG4gICAgbm9kZS5hdWRpby50b1BsYXkubGVuZ3RoID0gMDtcbiAgfTtcblxuICByZXR1cm4gQXVkaW9TeXN0ZW07XG5cbn0pKGFzaC50b29scy5MaXN0SXRlcmF0aW5nU3lzdGVtKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXVkaW9fc3lzdGVtLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIEJ1bGxldEFnZU5vZGUsIFBoeXNpY3NTeXN0ZW0sIGFzaCwgYXN0ZXJvaWRzLFxuICBfX2JpbmQgPSBmdW5jdGlvbihmbiwgbWUpeyByZXR1cm4gZnVuY3Rpb24oKXsgcmV0dXJuIGZuLmFwcGx5KG1lLCBhcmd1bWVudHMpOyB9OyB9LFxuICBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgX19leHRlbmRzID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChfX2hhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH07XG5cbmFzaCA9IHJlcXVpcmUoJ2FzaC5jb2ZmZWUnKTtcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vaW5kZXgnKTtcblxuQnVsbGV0QWdlTm9kZSA9IGFzdGVyb2lkcy5ub2Rlcy5CdWxsZXRBZ2VOb2RlO1xuXG5QaHlzaWNzU3lzdGVtID0gYXN0ZXJvaWRzLnN5c3RlbXMuUGh5c2ljc1N5c3RlbTtcblxuYXN0ZXJvaWRzLnN5c3RlbXMuQnVsbGV0QWdlU3lzdGVtID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICBfX2V4dGVuZHMoQnVsbGV0QWdlU3lzdGVtLCBfc3VwZXIpO1xuXG4gIEJ1bGxldEFnZVN5c3RlbS5wcm90b3R5cGUuY3JlYXRvciA9IG51bGw7XG5cbiAgZnVuY3Rpb24gQnVsbGV0QWdlU3lzdGVtKGNyZWF0b3IpIHtcbiAgICB0aGlzLmNyZWF0b3IgPSBjcmVhdG9yO1xuICAgIHRoaXMudXBkYXRlTm9kZSA9IF9fYmluZCh0aGlzLnVwZGF0ZU5vZGUsIHRoaXMpO1xuICAgIEJ1bGxldEFnZVN5c3RlbS5fX3N1cGVyX18uY29uc3RydWN0b3IuY2FsbCh0aGlzLCBCdWxsZXRBZ2VOb2RlLCB0aGlzLnVwZGF0ZU5vZGUpO1xuICB9XG5cbiAgQnVsbGV0QWdlU3lzdGVtLnByb3RvdHlwZS51cGRhdGVOb2RlID0gZnVuY3Rpb24obm9kZSwgdGltZSkge1xuICAgIHZhciBidWxsZXQ7XG4gICAgYnVsbGV0ID0gbm9kZS5idWxsZXQ7XG4gICAgYnVsbGV0LmxpZmVSZW1haW5pbmcgLT0gdGltZTtcbiAgICBpZiAoYnVsbGV0LmxpZmVSZW1haW5pbmcgPD0gMCkge1xuICAgICAgUGh5c2ljc1N5c3RlbS5kZWFkUG9vbC5wdXNoKG5vZGUucGh5c2ljcy5ib2R5KTtcbiAgICAgIHRoaXMuY3JlYXRvci5kZXN0cm95RW50aXR5KG5vZGUuZW50aXR5KTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIEJ1bGxldEFnZVN5c3RlbTtcblxufSkoYXNoLnRvb2xzLkxpc3RJdGVyYXRpbmdTeXN0ZW0pO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1idWxsZXRfYWdlX3N5c3RlbS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBBc3Rlcm9pZCwgQ29sbGlzaW9uLCBEZWF0aFRocm9lcywgR2FtZU5vZGUsIFBoeXNpY3MsIFBoeXNpY3NTeXN0ZW0sIFBvaW50LCBQb3NpdGlvbiwgU3BhY2VzaGlwLCBTeXN0ZW0sIGFzaCwgYXN0ZXJvaWRzLCBiMkNvbnRhY3RMaXN0ZW5lcixcbiAgX19iaW5kID0gZnVuY3Rpb24oZm4sIG1lKXsgcmV0dXJuIGZ1bmN0aW9uKCl7IHJldHVybiBmbi5hcHBseShtZSwgYXJndW1lbnRzKTsgfTsgfSxcbiAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9O1xuXG5hc2ggPSByZXF1aXJlKCdhc2guY29mZmVlJyk7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uL2luZGV4Jyk7XG5cbkdhbWVOb2RlID0gYXN0ZXJvaWRzLm5vZGVzLkdhbWVOb2RlO1xuXG5QaHlzaWNzU3lzdGVtID0gYXN0ZXJvaWRzLnN5c3RlbXMuUGh5c2ljc1N5c3RlbTtcblxuQXN0ZXJvaWQgPSBhc3Rlcm9pZHMuY29tcG9uZW50cy5Bc3Rlcm9pZDtcblxuU3BhY2VzaGlwID0gYXN0ZXJvaWRzLmNvbXBvbmVudHMuU3BhY2VzaGlwO1xuXG5EZWF0aFRocm9lcyA9IGFzdGVyb2lkcy5jb21wb25lbnRzLkRlYXRoVGhyb2VzO1xuXG5QaHlzaWNzID0gYXN0ZXJvaWRzLmNvbXBvbmVudHMuUGh5c2ljcztcblxuQ29sbGlzaW9uID0gYXN0ZXJvaWRzLmNvbXBvbmVudHMuQ29sbGlzaW9uO1xuXG5Qb3NpdGlvbiA9IGFzdGVyb2lkcy5jb21wb25lbnRzLlBvc2l0aW9uO1xuXG5Qb2ludCA9IGFzdGVyb2lkcy51aS5Qb2ludDtcblxuU3lzdGVtID0gYXNoLmNvcmUuU3lzdGVtO1xuXG5iMkNvbnRhY3RMaXN0ZW5lciA9IEJveDJELkR5bmFtaWNzLmIyQ29udGFjdExpc3RlbmVyO1xuXG5hc3Rlcm9pZHMuc3lzdGVtcy5Db2xsaXNpb25TeXN0ZW0gPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gIF9fZXh0ZW5kcyhDb2xsaXNpb25TeXN0ZW0sIF9zdXBlcik7XG5cbiAgQ29sbGlzaW9uU3lzdGVtLnByb3RvdHlwZS5jcmVhdG9yID0gbnVsbDtcblxuICBDb2xsaXNpb25TeXN0ZW0ucHJvdG90eXBlLmdhbWVzID0gbnVsbDtcblxuICBDb2xsaXNpb25TeXN0ZW0ucHJvdG90eXBlLnNwYWNlc2hpcHMgPSBudWxsO1xuXG4gIENvbGxpc2lvblN5c3RlbS5wcm90b3R5cGUuYXN0ZXJvaWRzID0gbnVsbDtcblxuICBDb2xsaXNpb25TeXN0ZW0ucHJvdG90eXBlLmJ1bGxldHMgPSBudWxsO1xuXG4gIENvbGxpc2lvblN5c3RlbS5wcm90b3R5cGUucXVlID0gbnVsbDtcblxuICBmdW5jdGlvbiBDb2xsaXNpb25TeXN0ZW0od29ybGQsIGNyZWF0b3IpIHtcbiAgICB0aGlzLndvcmxkID0gd29ybGQ7XG4gICAgdGhpcy5jcmVhdG9yID0gY3JlYXRvcjtcbiAgICB0aGlzLlBvc3RTb2x2ZSA9IF9fYmluZCh0aGlzLlBvc3RTb2x2ZSwgdGhpcyk7XG4gICAgdGhpcy5QcmVTb2x2ZSA9IF9fYmluZCh0aGlzLlByZVNvbHZlLCB0aGlzKTtcbiAgICB0aGlzLkVuZENvbnRhY3QgPSBfX2JpbmQodGhpcy5FbmRDb250YWN0LCB0aGlzKTtcbiAgICB0aGlzLkJlZ2luQ29udGFjdCA9IF9fYmluZCh0aGlzLkJlZ2luQ29udGFjdCwgdGhpcyk7XG4gICAgdGhpcy5Bc3Rlcm9pZEhpdFNoaXAgPSBfX2JpbmQodGhpcy5Bc3Rlcm9pZEhpdFNoaXAsIHRoaXMpO1xuICAgIHRoaXMuQnVsbGV0SGl0QXN0ZXJvaWQgPSBfX2JpbmQodGhpcy5CdWxsZXRIaXRBc3Rlcm9pZCwgdGhpcyk7XG4gICAgdGhpcy51cGRhdGUgPSBfX2JpbmQodGhpcy51cGRhdGUsIHRoaXMpO1xuICAgIHRoaXMucXVlID0gW107XG4gICAgdGhpcy53b3JsZC5TZXRDb250YWN0TGlzdGVuZXIodGhpcyk7XG4gIH1cblxuICBDb2xsaXNpb25TeXN0ZW0ucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKHRpbWUpIHtcbiAgICB2YXIgY29udGFjdDtcbiAgICB3aGlsZSAodGhpcy5xdWUubGVuZ3RoKSB7XG4gICAgICBjb250YWN0ID0gdGhpcy5xdWUucG9wKCk7XG4gICAgICBzd2l0Y2ggKGNvbnRhY3QudHlwZSkge1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgdGhpcy5CdWxsZXRIaXRBc3Rlcm9pZChjb250YWN0LmEsIGNvbnRhY3QuYik7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICB0aGlzLkFzdGVyb2lkSGl0U2hpcChjb250YWN0LmEsIGNvbnRhY3QuYik7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIENvbGxpc2lvblN5c3RlbS5wcm90b3R5cGUuYWRkVG9FbmdpbmUgPSBmdW5jdGlvbihlbmdpbmUpIHtcbiAgICB0aGlzLmdhbWVzID0gZW5naW5lLmdldE5vZGVMaXN0KEdhbWVOb2RlKTtcbiAgfTtcblxuICBDb2xsaXNpb25TeXN0ZW0ucHJvdG90eXBlLnJlbW92ZUZyb21FbmdpbmUgPSBmdW5jdGlvbihlbmdpbmUpIHtcbiAgICB0aGlzLmdhbWVzID0gbnVsbDtcbiAgfTtcblxuICBDb2xsaXNpb25TeXN0ZW0ucHJvdG90eXBlLkJ1bGxldEhpdEFzdGVyb2lkID0gZnVuY3Rpb24oYnVsbGV0LCBhc3Rlcm9pZCkge1xuICAgIHZhciBib2R5LCBwb3NpdGlvbiwgcmFkaXVzO1xuICAgIGlmICgoYXN0ZXJvaWQuZ2V0KENvbGxpc2lvbikgIT0gbnVsbCkpIHtcbiAgICAgIHRoaXMuY3JlYXRvci5kZXN0cm95RW50aXR5KGJ1bGxldCk7XG4gICAgICBQaHlzaWNzU3lzdGVtLmRlYWRQb29sLnB1c2goYnVsbGV0LmdldChQaHlzaWNzKS5ib2R5KTtcbiAgICAgIHJhZGl1cyA9IGFzdGVyb2lkLmdldChDb2xsaXNpb24pLnJhZGl1cztcbiAgICAgIHBvc2l0aW9uID0gYXN0ZXJvaWQuZ2V0KFBvc2l0aW9uKS5wb3NpdGlvbjtcbiAgICAgIGlmIChyYWRpdXMgPiAxMCkge1xuICAgICAgICB0aGlzLmNyZWF0b3IuY3JlYXRlQXN0ZXJvaWQocmFkaXVzIC0gMTAsIHBvc2l0aW9uLnggKyBNYXRoLnJhbmRvbSgpICogMTAgLSA1LCBwb3NpdGlvbi55ICsgTWF0aC5yYW5kb20oKSAqIDEwIC0gNSk7XG4gICAgICAgIHRoaXMuY3JlYXRvci5jcmVhdGVBc3Rlcm9pZChyYWRpdXMgLSAxMCwgcG9zaXRpb24ueCArIE1hdGgucmFuZG9tKCkgKiAxMCAtIDUsIHBvc2l0aW9uLnkgKyBNYXRoLnJhbmRvbSgpICogMTAgLSA1KTtcbiAgICAgIH1cbiAgICAgIGJvZHkgPSBhc3Rlcm9pZC5nZXQoUGh5c2ljcykuYm9keTtcbiAgICAgIGFzdGVyb2lkLmdldChBc3Rlcm9pZCkuZnNtLmNoYW5nZVN0YXRlKCdkZXN0cm95ZWQnKTtcbiAgICAgIGFzdGVyb2lkLmdldChEZWF0aFRocm9lcykuYm9keSA9IGJvZHk7XG4gICAgICBpZiAodGhpcy5nYW1lcy5oZWFkKSB7XG4gICAgICAgIHRoaXMuZ2FtZXMuaGVhZC5zdGF0ZS5oaXRzKys7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIENvbGxpc2lvblN5c3RlbS5wcm90b3R5cGUuQXN0ZXJvaWRIaXRTaGlwID0gZnVuY3Rpb24oYXN0ZXJvaWQsIHNwYWNlc2hpcCkge1xuICAgIHZhciBib2R5O1xuICAgIGlmICgoc3BhY2VzaGlwLmdldChQaHlzaWNzKSAhPSBudWxsKSkge1xuICAgICAgYm9keSA9IHNwYWNlc2hpcC5nZXQoUGh5c2ljcykuYm9keTtcbiAgICAgIHNwYWNlc2hpcC5nZXQoU3BhY2VzaGlwKS5mc20uY2hhbmdlU3RhdGUoJ2Rlc3Ryb3llZCcpO1xuICAgICAgc3BhY2VzaGlwLmdldChEZWF0aFRocm9lcykuYm9keSA9IGJvZHk7XG4gICAgICBpZiAodGhpcy5nYW1lcy5oZWFkKSB7XG4gICAgICAgIHRoaXMuZ2FtZXMuaGVhZC5zdGF0ZS5saXZlcy0tO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gICAqIGIyQ29udGFjdExpc3RlbmVyIEludGVyZmFjZVxuICAgKi9cblxuICBDb2xsaXNpb25TeXN0ZW0ucHJvdG90eXBlLkJlZ2luQ29udGFjdCA9IGZ1bmN0aW9uKGNvbnRhY3QpIHtcbiAgICB2YXIgYSwgYjtcbiAgICBhID0gY29udGFjdC5HZXRGaXh0dXJlQSgpLkdldEJvZHkoKS5HZXRVc2VyRGF0YSgpO1xuICAgIGIgPSBjb250YWN0LkdldEZpeHR1cmVCKCkuR2V0Qm9keSgpLkdldFVzZXJEYXRhKCk7XG4gICAgc3dpdGNoIChhLnR5cGUpIHtcbiAgICAgIGNhc2UgJ2FzdGVyb2lkJzpcbiAgICAgICAgc3dpdGNoIChiLnR5cGUpIHtcbiAgICAgICAgICBjYXNlICdhc3Rlcm9pZCc6XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgY2FzZSAnYnVsbGV0JzpcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnF1ZS5wdXNoKHtcbiAgICAgICAgICAgICAgdHlwZTogMSxcbiAgICAgICAgICAgICAgYTogYi5lbnRpdHksXG4gICAgICAgICAgICAgIGI6IGEuZW50aXR5XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICBjYXNlICdzcGFjZXNoaXAnOlxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucXVlLnB1c2goe1xuICAgICAgICAgICAgICB0eXBlOiAyLFxuICAgICAgICAgICAgICBhOiBhLmVudGl0eSxcbiAgICAgICAgICAgICAgYjogYi5lbnRpdHlcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnYnVsbGV0JzpcbiAgICAgICAgc3dpdGNoIChiLnR5cGUpIHtcbiAgICAgICAgICBjYXNlICdhc3Rlcm9pZCc6XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5xdWUucHVzaCh7XG4gICAgICAgICAgICAgIHR5cGU6IDEsXG4gICAgICAgICAgICAgIGE6IGEuZW50aXR5LFxuICAgICAgICAgICAgICBiOiBiLmVudGl0eVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgY2FzZSAnYnVsbGV0JzpcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICBjYXNlICdzcGFjZXNoaXAnOlxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnc3BhY2VzaGlwJzpcbiAgICAgICAgc3dpdGNoIChiLnR5cGUpIHtcbiAgICAgICAgICBjYXNlICdhc3Rlcm9pZCc6XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5xdWUucHVzaCh7XG4gICAgICAgICAgICAgIHR5cGU6IDIsXG4gICAgICAgICAgICAgIGE6IGIuZW50aXR5LFxuICAgICAgICAgICAgICBiOiBhLmVudGl0eVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgY2FzZSAnYnVsbGV0JzpcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICBjYXNlICdzcGFjZXNoaXAnOlxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiB0eXBlOlxuICAgICAqIDEgLSBidWxsZXQgaGl0cyBhc3Rlcm9pZFxuICAgICAqIDIgLSBhc3Rlcm9pZCBoaXRzIHNwYWNlc2hpcFxuICAgICAqL1xuICB9O1xuXG4gIENvbGxpc2lvblN5c3RlbS5wcm90b3R5cGUuRW5kQ29udGFjdCA9IGZ1bmN0aW9uKGNvbnRhY3QpIHt9O1xuXG4gIENvbGxpc2lvblN5c3RlbS5wcm90b3R5cGUuUHJlU29sdmUgPSBmdW5jdGlvbihjb250YWN0LCBvbGRNYW5pZm9sZCkge307XG5cbiAgQ29sbGlzaW9uU3lzdGVtLnByb3RvdHlwZS5Qb3N0U29sdmUgPSBmdW5jdGlvbihjb250YWN0LCBpbXB1bHNlKSB7fTtcblxuICByZXR1cm4gQ29sbGlzaW9uU3lzdGVtO1xuXG59KShTeXN0ZW0pO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb2xsaXNpb25fc3lzdGVtLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIERlYXRoVGhyb2VzTm9kZSwgUGh5c2ljc1N5c3RlbSwgYXNoLCBhc3Rlcm9pZHMsXG4gIF9fYmluZCA9IGZ1bmN0aW9uKGZuLCBtZSl7IHJldHVybiBmdW5jdGlvbigpeyByZXR1cm4gZm4uYXBwbHkobWUsIGFyZ3VtZW50cyk7IH07IH0sXG4gIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICBfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfTtcblxuYXNoID0gcmVxdWlyZSgnYXNoLmNvZmZlZScpO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi9pbmRleCcpO1xuXG5EZWF0aFRocm9lc05vZGUgPSBhc3Rlcm9pZHMubm9kZXMuRGVhdGhUaHJvZXNOb2RlO1xuXG5QaHlzaWNzU3lzdGVtID0gYXN0ZXJvaWRzLnN5c3RlbXMuUGh5c2ljc1N5c3RlbTtcblxuYXN0ZXJvaWRzLnN5c3RlbXMuRGVhdGhUaHJvZXNTeXN0ZW0gPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gIF9fZXh0ZW5kcyhEZWF0aFRocm9lc1N5c3RlbSwgX3N1cGVyKTtcblxuICBEZWF0aFRocm9lc1N5c3RlbS5wcm90b3R5cGUuY3JlYXRvciA9IG51bGw7XG5cbiAgZnVuY3Rpb24gRGVhdGhUaHJvZXNTeXN0ZW0oY3JlYXRvcikge1xuICAgIHRoaXMuY3JlYXRvciA9IGNyZWF0b3I7XG4gICAgdGhpcy51cGRhdGVOb2RlID0gX19iaW5kKHRoaXMudXBkYXRlTm9kZSwgdGhpcyk7XG4gICAgRGVhdGhUaHJvZXNTeXN0ZW0uX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgRGVhdGhUaHJvZXNOb2RlLCB0aGlzLnVwZGF0ZU5vZGUpO1xuICB9XG5cbiAgRGVhdGhUaHJvZXNTeXN0ZW0ucHJvdG90eXBlLnVwZGF0ZU5vZGUgPSBmdW5jdGlvbihub2RlLCB0aW1lKSB7XG4gICAgdmFyIGRlYWQ7XG4gICAgZGVhZCA9IG5vZGUuZGVhZDtcbiAgICBkZWFkLmNvdW50ZG93biAtPSB0aW1lO1xuICAgIGlmIChkZWFkLmNvdW50ZG93biA8PSAwKSB7XG4gICAgICB0aGlzLmNyZWF0b3IuZGVzdHJveUVudGl0eShub2RlLmVudGl0eSk7XG4gICAgICBQaHlzaWNzU3lzdGVtLmRlYWRQb29sLnB1c2goZGVhZC5ib2R5KTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIERlYXRoVGhyb2VzU3lzdGVtO1xuXG59KShhc2gudG9vbHMuTGlzdEl0ZXJhdGluZ1N5c3RlbSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRlYXRoX3Rocm9lc19zeXN0ZW0uanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgQXN0ZXJvaWRDb2xsaXNpb25Ob2RlLCBCdWxsZXRDb2xsaXNpb25Ob2RlLCBHYW1lTm9kZSwgUG9pbnQsIFNwYWNlc2hpcE5vZGUsIGFzaCwgYXN0ZXJvaWRzLFxuICBfX2JpbmQgPSBmdW5jdGlvbihmbiwgbWUpeyByZXR1cm4gZnVuY3Rpb24oKXsgcmV0dXJuIGZuLmFwcGx5KG1lLCBhcmd1bWVudHMpOyB9OyB9LFxuICBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgX19leHRlbmRzID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChfX2hhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH07XG5cbmFzaCA9IHJlcXVpcmUoJ2FzaC5jb2ZmZWUnKTtcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vaW5kZXgnKTtcblxuR2FtZU5vZGUgPSBhc3Rlcm9pZHMubm9kZXMuR2FtZU5vZGU7XG5cblNwYWNlc2hpcE5vZGUgPSBhc3Rlcm9pZHMubm9kZXMuU3BhY2VzaGlwTm9kZTtcblxuQXN0ZXJvaWRDb2xsaXNpb25Ob2RlID0gYXN0ZXJvaWRzLm5vZGVzLkFzdGVyb2lkQ29sbGlzaW9uTm9kZTtcblxuQnVsbGV0Q29sbGlzaW9uTm9kZSA9IGFzdGVyb2lkcy5ub2Rlcy5CdWxsZXRDb2xsaXNpb25Ob2RlO1xuXG5Qb2ludCA9IGFzdGVyb2lkcy51aS5Qb2ludDtcblxuYXN0ZXJvaWRzLnN5c3RlbXMuR2FtZU1hbmFnZXIgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gIF9fZXh0ZW5kcyhHYW1lTWFuYWdlciwgX3N1cGVyKTtcblxuICBHYW1lTWFuYWdlci5wcm90b3R5cGUuY29uZmlnID0gbnVsbDtcblxuICBHYW1lTWFuYWdlci5wcm90b3R5cGUuY3JlYXRvciA9IG51bGw7XG5cbiAgR2FtZU1hbmFnZXIucHJvdG90eXBlLmdhbWVOb2RlcyA9IG51bGw7XG5cbiAgR2FtZU1hbmFnZXIucHJvdG90eXBlLnNwYWNlc2hpcHMgPSBudWxsO1xuXG4gIEdhbWVNYW5hZ2VyLnByb3RvdHlwZS5hc3Rlcm9pZHMgPSBudWxsO1xuXG4gIEdhbWVNYW5hZ2VyLnByb3RvdHlwZS5idWxsZXRzID0gbnVsbDtcblxuICBmdW5jdGlvbiBHYW1lTWFuYWdlcihjcmVhdG9yLCBjb25maWcpIHtcbiAgICB0aGlzLmNyZWF0b3IgPSBjcmVhdG9yO1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIHRoaXMudXBkYXRlID0gX19iaW5kKHRoaXMudXBkYXRlLCB0aGlzKTtcbiAgfVxuXG4gIEdhbWVNYW5hZ2VyLnByb3RvdHlwZS5hZGRUb0VuZ2luZSA9IGZ1bmN0aW9uKGVuZ2luZSkge1xuICAgIHRoaXMuZ2FtZU5vZGVzID0gZW5naW5lLmdldE5vZGVMaXN0KEdhbWVOb2RlKTtcbiAgICB0aGlzLnNwYWNlc2hpcHMgPSBlbmdpbmUuZ2V0Tm9kZUxpc3QoU3BhY2VzaGlwTm9kZSk7XG4gICAgdGhpcy5hc3Rlcm9pZHMgPSBlbmdpbmUuZ2V0Tm9kZUxpc3QoQXN0ZXJvaWRDb2xsaXNpb25Ob2RlKTtcbiAgICB0aGlzLmJ1bGxldHMgPSBlbmdpbmUuZ2V0Tm9kZUxpc3QoQnVsbGV0Q29sbGlzaW9uTm9kZSk7XG4gIH07XG5cbiAgR2FtZU1hbmFnZXIucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKHRpbWUpIHtcbiAgICB2YXIgYXN0ZXJvaWQsIGFzdGVyb2lkQ291bnQsIGNsZWFyVG9BZGRTcGFjZXNoaXAsIGksIG5ld1NwYWNlc2hpcFBvc2l0aW9uLCBub2RlLCBwb3NpdGlvbiwgc3BhY2VzaGlwO1xuICAgIG5vZGUgPSB0aGlzLmdhbWVOb2Rlcy5oZWFkO1xuICAgIGlmIChub2RlICYmIG5vZGUuc3RhdGUucGxheWluZykge1xuICAgICAgaWYgKHRoaXMuc3BhY2VzaGlwcy5lbXB0eSkge1xuICAgICAgICBpZiAobm9kZS5zdGF0ZS5saXZlcyA+IDApIHtcbiAgICAgICAgICBuZXdTcGFjZXNoaXBQb3NpdGlvbiA9IG5ldyBQb2ludCh0aGlzLmNvbmZpZy53aWR0aCAqIDAuNSwgdGhpcy5jb25maWcuaGVpZ2h0ICogMC41KTtcbiAgICAgICAgICBjbGVhclRvQWRkU3BhY2VzaGlwID0gdHJ1ZTtcbiAgICAgICAgICBhc3Rlcm9pZCA9IHRoaXMuYXN0ZXJvaWRzLmhlYWQ7XG4gICAgICAgICAgd2hpbGUgKGFzdGVyb2lkKSB7XG4gICAgICAgICAgICBpZiAoUG9pbnQuZGlzdGFuY2UoYXN0ZXJvaWQucG9zaXRpb24ucG9zaXRpb24sIG5ld1NwYWNlc2hpcFBvc2l0aW9uKSA8PSBhc3Rlcm9pZC5jb2xsaXNpb24ucmFkaXVzICsgNTApIHtcbiAgICAgICAgICAgICAgY2xlYXJUb0FkZFNwYWNlc2hpcCA9IGZhbHNlO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFzdGVyb2lkID0gYXN0ZXJvaWQubmV4dDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGNsZWFyVG9BZGRTcGFjZXNoaXApIHtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRvci5jcmVhdGVTcGFjZXNoaXAoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbm9kZS5zdGF0ZS5wbGF5aW5nID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5jcmVhdG9yLmNyZWF0ZVdhaXRGb3JDbGljaygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5hc3Rlcm9pZHMuZW1wdHkgJiYgdGhpcy5idWxsZXRzLmVtcHR5ICYmICF0aGlzLnNwYWNlc2hpcHMuZW1wdHkpIHtcbiAgICAgICAgc3BhY2VzaGlwID0gdGhpcy5zcGFjZXNoaXBzLmhlYWQ7XG4gICAgICAgIG5vZGUuc3RhdGUubGV2ZWwrKztcbiAgICAgICAgYXN0ZXJvaWRDb3VudCA9IDIgKyBub2RlLnN0YXRlLmxldmVsO1xuICAgICAgICBpID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPCBhc3Rlcm9pZENvdW50KSB7XG4gICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgIHBvc2l0aW9uID0gbmV3IFBvaW50KE1hdGgucmFuZG9tKCkgKiB0aGlzLmNvbmZpZy53aWR0aCwgTWF0aC5yYW5kb20oKSAqIHRoaXMuY29uZmlnLmhlaWdodCk7XG4gICAgICAgICAgICBpZiAoIShQb2ludC5kaXN0YW5jZShwb3NpdGlvbiwgc3BhY2VzaGlwLnBvc2l0aW9uLnBvc2l0aW9uKSA8PSA4MCkpIHtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuY3JlYXRvci5jcmVhdGVBc3Rlcm9pZCgzMCwgcG9zaXRpb24ueCwgcG9zaXRpb24ueSk7XG4gICAgICAgICAgKytpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIEdhbWVNYW5hZ2VyLnByb3RvdHlwZS5yZW1vdmVGcm9tRW5naW5lID0gZnVuY3Rpb24oZW5naW5lKSB7XG4gICAgdGhpcy5nYW1lTm9kZXMgPSBudWxsO1xuICAgIHRoaXMuc3BhY2VzaGlwcyA9IG51bGw7XG4gICAgdGhpcy5hc3Rlcm9pZHMgPSBudWxsO1xuICAgIHRoaXMuYnVsbGV0cyA9IG51bGw7XG4gIH07XG5cbiAgcmV0dXJuIEdhbWVNYW5hZ2VyO1xuXG59KShhc2guY29yZS5TeXN0ZW0pO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1nYW1lX21hbmFnZXIuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgR3VuQ29udHJvbE5vZGUsIGFzaCwgYXN0ZXJvaWRzLFxuICBfX2JpbmQgPSBmdW5jdGlvbihmbiwgbWUpeyByZXR1cm4gZnVuY3Rpb24oKXsgcmV0dXJuIGZuLmFwcGx5KG1lLCBhcmd1bWVudHMpOyB9OyB9LFxuICBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgX19leHRlbmRzID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChfX2hhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH07XG5cbmFzaCA9IHJlcXVpcmUoJ2FzaC5jb2ZmZWUnKTtcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vaW5kZXgnKTtcblxuR3VuQ29udHJvbE5vZGUgPSBhc3Rlcm9pZHMubm9kZXMuR3VuQ29udHJvbE5vZGU7XG5cbmFzdGVyb2lkcy5zeXN0ZW1zLkd1bkNvbnRyb2xTeXN0ZW0gPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gIF9fZXh0ZW5kcyhHdW5Db250cm9sU3lzdGVtLCBfc3VwZXIpO1xuXG4gIEd1bkNvbnRyb2xTeXN0ZW0ucHJvdG90eXBlLmtleVBvbGwgPSBudWxsO1xuXG4gIEd1bkNvbnRyb2xTeXN0ZW0ucHJvdG90eXBlLmNyZWF0b3IgPSBudWxsO1xuXG4gIGZ1bmN0aW9uIEd1bkNvbnRyb2xTeXN0ZW0oa2V5UG9sbCwgY3JlYXRvcikge1xuICAgIHRoaXMua2V5UG9sbCA9IGtleVBvbGw7XG4gICAgdGhpcy5jcmVhdG9yID0gY3JlYXRvcjtcbiAgICB0aGlzLnVwZGF0ZU5vZGUgPSBfX2JpbmQodGhpcy51cGRhdGVOb2RlLCB0aGlzKTtcbiAgICBHdW5Db250cm9sU3lzdGVtLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIEd1bkNvbnRyb2xOb2RlLCB0aGlzLnVwZGF0ZU5vZGUpO1xuICB9XG5cbiAgR3VuQ29udHJvbFN5c3RlbS5wcm90b3R5cGUudXBkYXRlTm9kZSA9IGZ1bmN0aW9uKG5vZGUsIHRpbWUpIHtcbiAgICB2YXIgY29udHJvbCwgZ3VuLCBwb3NpdGlvbjtcbiAgICBjb250cm9sID0gbm9kZS5jb250cm9sO1xuICAgIHBvc2l0aW9uID0gbm9kZS5wb3NpdGlvbjtcbiAgICBndW4gPSBub2RlLmd1bjtcbiAgICBndW4uc2hvb3RpbmcgPSB0aGlzLmtleVBvbGwuaXNEb3duKGNvbnRyb2wudHJpZ2dlcik7XG4gICAgZ3VuLnRpbWVTaW5jZUxhc3RTaG90ICs9IHRpbWU7XG4gICAgaWYgKGd1bi5zaG9vdGluZyAmJiBndW4udGltZVNpbmNlTGFzdFNob3QgPj0gZ3VuLm1pbmltdW1TaG90SW50ZXJ2YWwpIHtcbiAgICAgIHRoaXMuY3JlYXRvci5jcmVhdGVVc2VyQnVsbGV0KGd1biwgcG9zaXRpb24pO1xuICAgICAgZ3VuLnRpbWVTaW5jZUxhc3RTaG90ID0gMDtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIEd1bkNvbnRyb2xTeXN0ZW07XG5cbn0pKGFzaC50b29scy5MaXN0SXRlcmF0aW5nU3lzdGVtKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Z3VuX2NvbnRyb2xfc3lzdGVtLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIEh1ZE5vZGUsIGFzaCwgYXN0ZXJvaWRzLFxuICBfX2JpbmQgPSBmdW5jdGlvbihmbiwgbWUpeyByZXR1cm4gZnVuY3Rpb24oKXsgcmV0dXJuIGZuLmFwcGx5KG1lLCBhcmd1bWVudHMpOyB9OyB9LFxuICBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgX19leHRlbmRzID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChfX2hhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH07XG5cbmFzaCA9IHJlcXVpcmUoJ2FzaC5jb2ZmZWUnKTtcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vaW5kZXgnKTtcblxuSHVkTm9kZSA9IGFzdGVyb2lkcy5ub2Rlcy5IdWROb2RlO1xuXG5hc3Rlcm9pZHMuc3lzdGVtcy5IdWRTeXN0ZW0gPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gIF9fZXh0ZW5kcyhIdWRTeXN0ZW0sIF9zdXBlcik7XG5cbiAgZnVuY3Rpb24gSHVkU3lzdGVtKCkge1xuICAgIHRoaXMudXBkYXRlTm9kZSA9IF9fYmluZCh0aGlzLnVwZGF0ZU5vZGUsIHRoaXMpO1xuICAgIEh1ZFN5c3RlbS5fX3N1cGVyX18uY29uc3RydWN0b3IuY2FsbCh0aGlzLCBIdWROb2RlLCB0aGlzLnVwZGF0ZU5vZGUpO1xuICB9XG5cbiAgSHVkU3lzdGVtLnByb3RvdHlwZS51cGRhdGVOb2RlID0gZnVuY3Rpb24obm9kZSwgdGltZSkge1xuICAgIG5vZGUuaHVkLnZpZXcuc2V0TGl2ZXMobm9kZS5zdGF0ZS5saXZlcyk7XG4gICAgbm9kZS5odWQudmlldy5zZXRTY29yZShub2RlLnN0YXRlLmhpdHMpO1xuICB9O1xuXG4gIHJldHVybiBIdWRTeXN0ZW07XG5cbn0pKGFzaC50b29scy5MaXN0SXRlcmF0aW5nU3lzdGVtKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aHVkX3N5c3RlbS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBNb3ZlbWVudE5vZGUsIGFzaCwgYXN0ZXJvaWRzLFxuICBfX2JpbmQgPSBmdW5jdGlvbihmbiwgbWUpeyByZXR1cm4gZnVuY3Rpb24oKXsgcmV0dXJuIGZuLmFwcGx5KG1lLCBhcmd1bWVudHMpOyB9OyB9LFxuICBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgX19leHRlbmRzID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChfX2hhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH07XG5cbmFzaCA9IHJlcXVpcmUoJ2FzaC5jb2ZmZWUnKTtcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vaW5kZXgnKTtcblxuTW92ZW1lbnROb2RlID0gYXN0ZXJvaWRzLm5vZGVzLk1vdmVtZW50Tm9kZTtcblxuYXN0ZXJvaWRzLnN5c3RlbXMuTW92ZW1lbnRTeXN0ZW0gPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gIF9fZXh0ZW5kcyhNb3ZlbWVudFN5c3RlbSwgX3N1cGVyKTtcblxuICBNb3ZlbWVudFN5c3RlbS5wcm90b3R5cGUuY29uZmlnID0gbnVsbDtcblxuICBmdW5jdGlvbiBNb3ZlbWVudFN5c3RlbShjb25maWcpIHtcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICB0aGlzLnVwZGF0ZU5vZGUgPSBfX2JpbmQodGhpcy51cGRhdGVOb2RlLCB0aGlzKTtcbiAgICBNb3ZlbWVudFN5c3RlbS5fX3N1cGVyX18uY29uc3RydWN0b3IuY2FsbCh0aGlzLCBNb3ZlbWVudE5vZGUsIHRoaXMudXBkYXRlTm9kZSk7XG4gIH1cblxuICBNb3ZlbWVudFN5c3RlbS5wcm90b3R5cGUudXBkYXRlTm9kZSA9IGZ1bmN0aW9uKG5vZGUsIHRpbWUpIHtcbiAgICB2YXIgbW90aW9uLCBwb3NpdGlvbiwgeERhbXAsIHlEYW1wO1xuICAgIHBvc2l0aW9uID0gbm9kZS5wb3NpdGlvbjtcbiAgICBtb3Rpb24gPSBub2RlLm1vdGlvbjtcbiAgICBwb3NpdGlvbi5wb3NpdGlvbi54ICs9IG1vdGlvbi52ZWxvY2l0eS54ICogdGltZTtcbiAgICBwb3NpdGlvbi5wb3NpdGlvbi55ICs9IG1vdGlvbi52ZWxvY2l0eS55ICogdGltZTtcbiAgICBpZiAocG9zaXRpb24ucG9zaXRpb24ueCA8IDApIHtcbiAgICAgIHBvc2l0aW9uLnBvc2l0aW9uLnggKz0gdGhpcy5jb25maWcud2lkdGg7XG4gICAgfVxuICAgIGlmIChwb3NpdGlvbi5wb3NpdGlvbi54ID4gdGhpcy5jb25maWcud2lkdGgpIHtcbiAgICAgIHBvc2l0aW9uLnBvc2l0aW9uLnggLT0gdGhpcy5jb25maWcud2lkdGg7XG4gICAgfVxuICAgIGlmIChwb3NpdGlvbi5wb3NpdGlvbi55IDwgMCkge1xuICAgICAgcG9zaXRpb24ucG9zaXRpb24ueSArPSB0aGlzLmNvbmZpZy5oZWlnaHQ7XG4gICAgfVxuICAgIGlmIChwb3NpdGlvbi5wb3NpdGlvbi55ID4gdGhpcy5jb25maWcuaGVpZ2h0KSB7XG4gICAgICBwb3NpdGlvbi5wb3NpdGlvbi55IC09IHRoaXMuY29uZmlnLmhlaWdodDtcbiAgICB9XG4gICAgcG9zaXRpb24ucm90YXRpb24gKz0gbW90aW9uLmFuZ3VsYXJWZWxvY2l0eSAqIHRpbWU7XG4gICAgaWYgKG1vdGlvbi5kYW1waW5nID4gMCkge1xuICAgICAgeERhbXAgPSBNYXRoLmFicyhNYXRoLmNvcyhwb3NpdGlvbi5yb3RhdGlvbikgKiBtb3Rpb24uZGFtcGluZyAqIHRpbWUpO1xuICAgICAgeURhbXAgPSBNYXRoLmFicyhNYXRoLnNpbihwb3NpdGlvbi5yb3RhdGlvbikgKiBtb3Rpb24uZGFtcGluZyAqIHRpbWUpO1xuICAgICAgaWYgKG1vdGlvbi52ZWxvY2l0eS54ID4geERhbXApIHtcbiAgICAgICAgbW90aW9uLnZlbG9jaXR5LnggLT0geERhbXA7XG4gICAgICB9IGVsc2UgaWYgKG1vdGlvbi52ZWxvY2l0eS54IDwgLXhEYW1wKSB7XG4gICAgICAgIG1vdGlvbi52ZWxvY2l0eS54ICs9IHhEYW1wO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbW90aW9uLnZlbG9jaXR5LnggPSAwO1xuICAgICAgfVxuICAgICAgaWYgKG1vdGlvbi52ZWxvY2l0eS55ID4geURhbXApIHtcbiAgICAgICAgbW90aW9uLnZlbG9jaXR5LnkgLT0geURhbXA7XG4gICAgICB9IGVsc2UgaWYgKG1vdGlvbi52ZWxvY2l0eS55IDwgLXlEYW1wKSB7XG4gICAgICAgIG1vdGlvbi52ZWxvY2l0eS55ICs9IHlEYW1wO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbW90aW9uLnZlbG9jaXR5LnkgPSAwO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICByZXR1cm4gTW92ZW1lbnRTeXN0ZW07XG5cbn0pKGFzaC50b29scy5MaXN0SXRlcmF0aW5nU3lzdGVtKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bW92ZW1lbnRfc3lzdGVtLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIFBoeXNpY3NDb250cm9sTm9kZSwgYXNoLCBhc3Rlcm9pZHMsIGIyVmVjMixcbiAgX19iaW5kID0gZnVuY3Rpb24oZm4sIG1lKXsgcmV0dXJuIGZ1bmN0aW9uKCl7IHJldHVybiBmbi5hcHBseShtZSwgYXJndW1lbnRzKTsgfTsgfSxcbiAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9O1xuXG5hc2ggPSByZXF1aXJlKCdhc2guY29mZmVlJyk7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uL2luZGV4Jyk7XG5cblBoeXNpY3NDb250cm9sTm9kZSA9IGFzdGVyb2lkcy5ub2Rlcy5QaHlzaWNzQ29udHJvbE5vZGU7XG5cbmIyVmVjMiA9IEJveDJELkNvbW1vbi5NYXRoLmIyVmVjMjtcblxuYXN0ZXJvaWRzLnN5c3RlbXMuUGh5c2ljc0NvbnRyb2xTeXN0ZW0gPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gIF9fZXh0ZW5kcyhQaHlzaWNzQ29udHJvbFN5c3RlbSwgX3N1cGVyKTtcblxuICBQaHlzaWNzQ29udHJvbFN5c3RlbS5wcm90b3R5cGUua2V5UG9sbCA9IG51bGw7XG5cbiAgZnVuY3Rpb24gUGh5c2ljc0NvbnRyb2xTeXN0ZW0oa2V5UG9sbCkge1xuICAgIHRoaXMua2V5UG9sbCA9IGtleVBvbGw7XG4gICAgdGhpcy51cGRhdGVOb2RlID0gX19iaW5kKHRoaXMudXBkYXRlTm9kZSwgdGhpcyk7XG4gICAgUGh5c2ljc0NvbnRyb2xTeXN0ZW0uX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgUGh5c2ljc0NvbnRyb2xOb2RlLCB0aGlzLnVwZGF0ZU5vZGUpO1xuICB9XG5cbiAgUGh5c2ljc0NvbnRyb2xTeXN0ZW0ucHJvdG90eXBlLnVwZGF0ZU5vZGUgPSBmdW5jdGlvbihub2RlLCB0aW1lKSB7XG4gICAgdmFyIGJvZHksIGNvbnRyb2wsIHJvdGF0aW9uLCB4LCB5LCBfcmVmO1xuICAgIGNvbnRyb2wgPSBub2RlLmNvbnRyb2w7XG4gICAgYm9keSA9IG5vZGUucGh5c2ljcy5ib2R5O1xuICAgIHJvdGF0aW9uID0gYm9keS5HZXRBbmd1bGFyVmVsb2NpdHkoKTtcbiAgICBpZiAodGhpcy5rZXlQb2xsLmlzRG93bihjb250cm9sLmxlZnQpKSB7XG4gICAgICBib2R5LkFwcGx5VG9ycXVlKHJvdGF0aW9uIC8gMTAwMCAtIGNvbnRyb2wucm90YXRpb25SYXRlIC8gTWF0aC5QSSAqIHRpbWUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5rZXlQb2xsLmlzRG93bihjb250cm9sLnJpZ2h0KSkge1xuICAgICAgYm9keS5BcHBseVRvcnF1ZShyb3RhdGlvbiAvIDEwMDAgKyBjb250cm9sLnJvdGF0aW9uUmF0ZSAvIE1hdGguUEkgKiB0aW1lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMua2V5UG9sbC5pc0Rvd24oY29udHJvbC5hY2NlbGVyYXRlKSkge1xuICAgICAgX3JlZiA9IGJvZHkuR2V0TGluZWFyVmVsb2NpdHkoKSwgeCA9IF9yZWYueCwgeSA9IF9yZWYueTtcbiAgICAgIHggKz0gTWF0aC5jb3Mocm90YXRpb24pICogY29udHJvbC5hY2NlbGVyYXRpb25SYXRlICogdGltZTtcbiAgICAgIHkgKz0gTWF0aC5zaW4ocm90YXRpb24pICogY29udHJvbC5hY2NlbGVyYXRpb25SYXRlICogdGltZTtcbiAgICAgIGJvZHkuQXBwbHlGb3JjZShuZXcgYjJWZWMyKHgsIHkpLCBib2R5LkdldFdvcmxkQ2VudGVyKCkpO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gUGh5c2ljc0NvbnRyb2xTeXN0ZW07XG5cbn0pKGFzaC50b29scy5MaXN0SXRlcmF0aW5nU3lzdGVtKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGh5c2ljc19jb250cm9sX3N5c3RlbS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBQaHlzaWNzTm9kZSwgYXNoLCBhc3Rlcm9pZHMsIGIyQm9keSwgYjJWZWMyLFxuICBfX2JpbmQgPSBmdW5jdGlvbihmbiwgbWUpeyByZXR1cm4gZnVuY3Rpb24oKXsgcmV0dXJuIGZuLmFwcGx5KG1lLCBhcmd1bWVudHMpOyB9OyB9LFxuICBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgX19leHRlbmRzID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChfX2hhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH07XG5cbmFzaCA9IHJlcXVpcmUoJ2FzaC5jb2ZmZWUnKTtcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vaW5kZXgnKTtcblxuUGh5c2ljc05vZGUgPSBhc3Rlcm9pZHMubm9kZXMuUGh5c2ljc05vZGU7XG5cbmIyQm9keSA9IEJveDJELkR5bmFtaWNzLmIyQm9keTtcblxuYjJWZWMyID0gQm94MkQuQ29tbW9uLk1hdGguYjJWZWMyO1xuXG5hc3Rlcm9pZHMuc3lzdGVtcy5QaHlzaWNzU3lzdGVtID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICBfX2V4dGVuZHMoUGh5c2ljc1N5c3RlbSwgX3N1cGVyKTtcblxuICBQaHlzaWNzU3lzdGVtLnByb3RvdHlwZS5jb25maWcgPSBudWxsO1xuXG4gIFBoeXNpY3NTeXN0ZW0ucHJvdG90eXBlLndvcmxkID0gbnVsbDtcblxuICBQaHlzaWNzU3lzdGVtLnByb3RvdHlwZS5jcmVhdG9yID0gbnVsbDtcblxuICBQaHlzaWNzU3lzdGVtLnByb3RvdHlwZS5ub2RlcyA9IG51bGw7XG5cbiAgUGh5c2ljc1N5c3RlbS5kZWFkUG9vbCA9IFtdO1xuXG4gIGZ1bmN0aW9uIFBoeXNpY3NTeXN0ZW0oY29uZmlnLCB3b3JsZCkge1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIHRoaXMud29ybGQgPSB3b3JsZDtcbiAgICB0aGlzLnVwZGF0ZU5vZGUgPSBfX2JpbmQodGhpcy51cGRhdGVOb2RlLCB0aGlzKTtcbiAgICB0aGlzLnVwZGF0ZSA9IF9fYmluZCh0aGlzLnVwZGF0ZSwgdGhpcyk7XG4gIH1cblxuICBQaHlzaWNzU3lzdGVtLnByb3RvdHlwZS5hZGRUb0VuZ2luZSA9IGZ1bmN0aW9uKGVuZ2luZSkge1xuICAgIHRoaXMubm9kZXMgPSBlbmdpbmUuZ2V0Tm9kZUxpc3QoUGh5c2ljc05vZGUpO1xuICB9O1xuXG4gIFBoeXNpY3NTeXN0ZW0ucHJvdG90eXBlLnJlbW92ZUZyb21FbmdpbmUgPSBmdW5jdGlvbihlbmdpbmUpIHtcbiAgICB0aGlzLm5vZGVzID0gbnVsbDtcbiAgfTtcblxuICBQaHlzaWNzU3lzdGVtLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbih0aW1lKSB7XG4gICAgdmFyIGJvZHksIG5vZGUsIHVkO1xuICAgIHRoaXMud29ybGQuU3RlcCh0aW1lLCAxMCwgMTApO1xuICAgIHRoaXMud29ybGQuQ2xlYXJGb3JjZXMoKTtcbiAgICBub2RlID0gdGhpcy5ub2Rlcy5oZWFkO1xuICAgIHdoaWxlIChub2RlKSB7XG4gICAgICB0aGlzLnVwZGF0ZU5vZGUobm9kZSwgdGltZSk7XG4gICAgICBub2RlID0gbm9kZS5uZXh0O1xuICAgIH1cblxuICAgIC8qXG4gICAgICogQ2xlYW4gdXAgdGhlIGRlYWQgYm9kaWVzXG4gICAgICovXG4gICAgd2hpbGUgKChib2R5ID0gUGh5c2ljc1N5c3RlbS5kZWFkUG9vbC5wb3AoKSkpIHtcbiAgICAgIHVkID0gYm9keS5HZXRVc2VyRGF0YSgpO1xuICAgICAgaWYgKHVkLmVudGl0eSAhPSBudWxsKSB7XG4gICAgICAgIGRlbGV0ZSB1ZC5lbnRpdHk7XG4gICAgICB9XG4gICAgICBib2R5LlNldFVzZXJEYXRhKHVkKTtcbiAgICAgIHRoaXMud29ybGQuRGVzdHJveUJvZHkoYm9keSk7XG4gICAgfVxuICB9O1xuXG5cbiAgLypcbiAgICogUHJvY2VzcyB0aGUgcGh5c2ljcyBmb3IgdGhpcyBub2RlXG4gICAqL1xuXG4gIFBoeXNpY3NTeXN0ZW0ucHJvdG90eXBlLnVwZGF0ZU5vZGUgPSBmdW5jdGlvbihub2RlLCB0aW1lKSB7XG4gICAgdmFyIGJvZHksIHBoeXNpY3MsIHBvc2l0aW9uLCB4LCB4MSwgeSwgeTEsIF9yZWY7XG4gICAgcG9zaXRpb24gPSBub2RlLnBvc2l0aW9uO1xuICAgIHBoeXNpY3MgPSBub2RlLnBoeXNpY3M7XG4gICAgYm9keSA9IHBoeXNpY3MuYm9keTtcblxuICAgIC8qXG4gICAgICogVXBkYXRlIHRoZSBwb3NpdGlvbiBjb21wb25lbnQgZnJvbSBCb3gyRCBtb2RlbFxuICAgICAqIEFzdGVyb2lkcyB1c2VzIHdyYXBhcm91bmQgc3BhY2UgY29vcmRpbmF0ZXNcbiAgICAgKi9cbiAgICBfcmVmID0gYm9keS5HZXRQb3NpdGlvbigpLCB4ID0gX3JlZi54LCB5ID0gX3JlZi55O1xuICAgIHgxID0geCA+IHRoaXMuY29uZmlnLndpZHRoID8gMCA6IHggPCAwID8gdGhpcy5jb25maWcud2lkdGggOiB4O1xuICAgIHkxID0geSA+IHRoaXMuY29uZmlnLmhlaWdodCA/IDAgOiB5IDwgMCA/IHRoaXMuY29uZmlnLmhlaWdodCA6IHk7XG4gICAgaWYgKHgxICE9PSB4IHx8IHkxICE9PSB5KSB7XG4gICAgICBib2R5LlNldFBvc2l0aW9uKG5ldyBiMlZlYzIoeDEsIHkxKSk7XG4gICAgfVxuICAgIHBvc2l0aW9uLnBvc2l0aW9uLnggPSB4MTtcbiAgICBwb3NpdGlvbi5wb3NpdGlvbi55ID0geTE7XG4gICAgcG9zaXRpb24ucm90YXRpb24gPSBib2R5LkdldEFuZ3VsYXJWZWxvY2l0eSgpO1xuICB9O1xuXG4gIHJldHVybiBQaHlzaWNzU3lzdGVtO1xuXG59KShhc2guY29yZS5TeXN0ZW0pO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1waHlzaWNzX3N5c3RlbS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBSZW5kZXJOb2RlLCBhc2gsIGFzdGVyb2lkcyxcbiAgX19iaW5kID0gZnVuY3Rpb24oZm4sIG1lKXsgcmV0dXJuIGZ1bmN0aW9uKCl7IHJldHVybiBmbi5hcHBseShtZSwgYXJndW1lbnRzKTsgfTsgfSxcbiAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9O1xuXG5hc2ggPSByZXF1aXJlKCdhc2guY29mZmVlJyk7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uL2luZGV4Jyk7XG5cblJlbmRlck5vZGUgPSBhc3Rlcm9pZHMubm9kZXMuUmVuZGVyTm9kZTtcblxuYXN0ZXJvaWRzLnN5c3RlbXMuUmVuZGVyU3lzdGVtID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICBfX2V4dGVuZHMoUmVuZGVyU3lzdGVtLCBfc3VwZXIpO1xuXG4gIFJlbmRlclN5c3RlbS5wcm90b3R5cGUuZ3JhcGhpYyA9IG51bGw7XG5cbiAgUmVuZGVyU3lzdGVtLnByb3RvdHlwZS5ub2RlcyA9IG51bGw7XG5cbiAgZnVuY3Rpb24gUmVuZGVyU3lzdGVtKGN0eCkge1xuICAgIHRoaXMuY3R4ID0gY3R4O1xuICAgIHRoaXMudXBkYXRlID0gX19iaW5kKHRoaXMudXBkYXRlLCB0aGlzKTtcbiAgfVxuXG4gIFJlbmRlclN5c3RlbS5wcm90b3R5cGUuYWRkVG9FbmdpbmUgPSBmdW5jdGlvbihlbmdpbmUpIHtcbiAgICB2YXIgbm9kZTtcbiAgICB0aGlzLm5vZGVzID0gZW5naW5lLmdldE5vZGVMaXN0KFJlbmRlck5vZGUpO1xuICAgIG5vZGUgPSB0aGlzLm5vZGVzLmhlYWQ7XG4gICAgd2hpbGUgKG5vZGUpIHtcbiAgICAgIHRoaXMuYWRkVG9EaXNwbGF5KG5vZGUpO1xuICAgICAgbm9kZSA9IG5vZGUubmV4dDtcbiAgICB9XG4gIH07XG5cbiAgUmVuZGVyU3lzdGVtLnByb3RvdHlwZS5hZGRUb0Rpc3BsYXkgPSBmdW5jdGlvbihub2RlKSB7fTtcblxuICBSZW5kZXJTeXN0ZW0ucHJvdG90eXBlLnJlbW92ZUZyb21EaXNwbGF5ID0gZnVuY3Rpb24obm9kZSkge307XG5cbiAgUmVuZGVyU3lzdGVtLnByb3RvdHlwZS5yZW1vdmVGcm9tRW5naW5lID0gZnVuY3Rpb24oZW5naW5lKSB7XG4gICAgdGhpcy5ub2RlcyA9IG51bGw7XG4gIH07XG5cbiAgUmVuZGVyU3lzdGVtLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbih0aW1lKSB7XG4gICAgdmFyIGRpc3BsYXksIGdyYXBoaWMsIG5vZGUsIHBvc2l0aW9uO1xuICAgIHRoaXMuY3R4LnNhdmUoKTtcbiAgICB0aGlzLmN0eC50cmFuc2xhdGUoMCwgMCk7XG4gICAgdGhpcy5jdHgucm90YXRlKDApO1xuICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmN0eC5jYW52YXMud2lkdGgsIHRoaXMuY3R4LmNhbnZhcy5oZWlnaHQpO1xuICAgIG5vZGUgPSB0aGlzLm5vZGVzLmhlYWQ7XG4gICAgd2hpbGUgKG5vZGUpIHtcbiAgICAgIGRpc3BsYXkgPSBub2RlLmRpc3BsYXk7XG4gICAgICBncmFwaGljID0gZGlzcGxheS5ncmFwaGljO1xuICAgICAgcG9zaXRpb24gPSBub2RlLnBvc2l0aW9uO1xuICAgICAgZ3JhcGhpYy54ID0gcG9zaXRpb24ucG9zaXRpb24ueDtcbiAgICAgIGdyYXBoaWMueSA9IHBvc2l0aW9uLnBvc2l0aW9uLnk7XG4gICAgICBncmFwaGljLnJvdGF0aW9uID0gcG9zaXRpb24ucm90YXRpb247XG4gICAgICBncmFwaGljLmRyYXcodGhpcy5jdHgpO1xuICAgICAgbm9kZSA9IG5vZGUubmV4dDtcbiAgICB9XG4gICAgdGhpcy5jdHgucmVzdG9yZSgpO1xuICB9O1xuXG4gIHJldHVybiBSZW5kZXJTeXN0ZW07XG5cbn0pKGFzaC5jb3JlLlN5c3RlbSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXJlbmRlcl9zeXN0ZW0uanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXN0ZXJvaWRzO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi9pbmRleCcpO1xuXG5hc3Rlcm9pZHMuc3lzdGVtcy5TeXN0ZW1Qcmlvcml0aWVzID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBTeXN0ZW1Qcmlvcml0aWVzKCkge31cblxuICBTeXN0ZW1Qcmlvcml0aWVzLnByZVVwZGF0ZSA9IDE7XG5cbiAgU3lzdGVtUHJpb3JpdGllcy51cGRhdGUgPSAyO1xuXG4gIFN5c3RlbVByaW9yaXRpZXMubW92ZSA9IDM7XG5cbiAgU3lzdGVtUHJpb3JpdGllcy5yZXNvbHZlQ29sbGlzaW9ucyA9IDQ7XG5cbiAgU3lzdGVtUHJpb3JpdGllcy5zdGF0ZU1hY2hpbmVzID0gNTtcblxuICBTeXN0ZW1Qcmlvcml0aWVzLmFuaW1hdGUgPSA2O1xuXG4gIFN5c3RlbVByaW9yaXRpZXMucmVuZGVyID0gNztcblxuICByZXR1cm4gU3lzdGVtUHJpb3JpdGllcztcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3lzdGVtX3ByaW9yaXRpZXMuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgQXN0ZXJvaWRDb2xsaXNpb25Ob2RlLCBHYW1lTm9kZSwgV2FpdEZvclN0YXJ0Tm9kZSwgYXNoLCBhc3Rlcm9pZHMsXG4gIF9fYmluZCA9IGZ1bmN0aW9uKGZuLCBtZSl7IHJldHVybiBmdW5jdGlvbigpeyByZXR1cm4gZm4uYXBwbHkobWUsIGFyZ3VtZW50cyk7IH07IH0sXG4gIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICBfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfTtcblxuYXNoID0gcmVxdWlyZSgnYXNoLmNvZmZlZScpO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi9pbmRleCcpO1xuXG5XYWl0Rm9yU3RhcnROb2RlID0gYXN0ZXJvaWRzLm5vZGVzLldhaXRGb3JTdGFydE5vZGU7XG5cbkFzdGVyb2lkQ29sbGlzaW9uTm9kZSA9IGFzdGVyb2lkcy5ub2Rlcy5Bc3Rlcm9pZENvbGxpc2lvbk5vZGU7XG5cbkdhbWVOb2RlID0gYXN0ZXJvaWRzLm5vZGVzLkdhbWVOb2RlO1xuXG5hc3Rlcm9pZHMuc3lzdGVtcy5XYWl0Rm9yU3RhcnRTeXN0ZW0gPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gIF9fZXh0ZW5kcyhXYWl0Rm9yU3RhcnRTeXN0ZW0sIF9zdXBlcik7XG5cbiAgV2FpdEZvclN0YXJ0U3lzdGVtLnByb3RvdHlwZS5lbmdpbmUgPSBudWxsO1xuXG4gIFdhaXRGb3JTdGFydFN5c3RlbS5wcm90b3R5cGUuY3JlYXRvciA9IG51bGw7XG5cbiAgV2FpdEZvclN0YXJ0U3lzdGVtLnByb3RvdHlwZS5nYW1lTm9kZXMgPSBudWxsO1xuXG4gIFdhaXRGb3JTdGFydFN5c3RlbS5wcm90b3R5cGUud2FpdE5vZGVzID0gbnVsbDtcblxuICBXYWl0Rm9yU3RhcnRTeXN0ZW0ucHJvdG90eXBlLmFzdGVyb2lkcyA9IG51bGw7XG5cbiAgZnVuY3Rpb24gV2FpdEZvclN0YXJ0U3lzdGVtKGNyZWF0b3IpIHtcbiAgICB0aGlzLmNyZWF0b3IgPSBjcmVhdG9yO1xuICAgIHRoaXMudXBkYXRlID0gX19iaW5kKHRoaXMudXBkYXRlLCB0aGlzKTtcbiAgfVxuXG4gIFdhaXRGb3JTdGFydFN5c3RlbS5wcm90b3R5cGUuYWRkVG9FbmdpbmUgPSBmdW5jdGlvbihlbmdpbmUpIHtcbiAgICB0aGlzLmVuZ2luZSA9IGVuZ2luZTtcbiAgICB0aGlzLndhaXROb2RlcyA9IGVuZ2luZS5nZXROb2RlTGlzdChXYWl0Rm9yU3RhcnROb2RlKTtcbiAgICB0aGlzLmdhbWVOb2RlcyA9IGVuZ2luZS5nZXROb2RlTGlzdChHYW1lTm9kZSk7XG4gICAgdGhpcy5hc3Rlcm9pZHMgPSBlbmdpbmUuZ2V0Tm9kZUxpc3QoQXN0ZXJvaWRDb2xsaXNpb25Ob2RlKTtcbiAgfTtcblxuICBXYWl0Rm9yU3RhcnRTeXN0ZW0ucHJvdG90eXBlLnJlbW92ZUZyb21FbmdpbmUgPSBmdW5jdGlvbihlbmdpbmUpIHtcbiAgICB0aGlzLndhaXROb2RlcyA9IG51bGw7XG4gICAgdGhpcy5nYW1lTm9kZXMgPSBudWxsO1xuICB9O1xuXG4gIFdhaXRGb3JTdGFydFN5c3RlbS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24odGltZSkge1xuICAgIHZhciBhc3Rlcm9pZCwgZ2FtZSwgbm9kZTtcbiAgICBub2RlID0gdGhpcy53YWl0Tm9kZXMuaGVhZDtcbiAgICBnYW1lID0gdGhpcy5nYW1lTm9kZXMuaGVhZDtcbiAgICBpZiAobm9kZSAmJiBub2RlLndhaXQuc3RhcnRHYW1lICYmIGdhbWUpIHtcbiAgICAgIGFzdGVyb2lkID0gdGhpcy5hc3Rlcm9pZHMuaGVhZDtcbiAgICAgIHdoaWxlIChhc3Rlcm9pZCkge1xuICAgICAgICB0aGlzLmNyZWF0b3IuZGVzdHJveUVudGl0eShhc3Rlcm9pZC5lbnRpdHkpO1xuICAgICAgICBhc3Rlcm9pZCA9IGFzdGVyb2lkLm5leHQ7XG4gICAgICB9XG4gICAgICBnYW1lLnN0YXRlLnNldEZvclN0YXJ0KCk7XG4gICAgICBub2RlLndhaXQuc3RhcnRHYW1lID0gZmFsc2U7XG4gICAgICB0aGlzLmVuZ2luZS5yZW1vdmVFbnRpdHkobm9kZS5lbnRpdHkpO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gV2FpdEZvclN0YXJ0U3lzdGVtO1xuXG59KShhc2guY29yZS5TeXN0ZW0pO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD13YWl0X2Zvcl9zdGFydF9zeXN0ZW0uanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXN0ZXJvaWRzLFxuICBfX2JpbmQgPSBmdW5jdGlvbihmbiwgbWUpeyByZXR1cm4gZnVuY3Rpb24oKXsgcmV0dXJuIGZuLmFwcGx5KG1lLCBhcmd1bWVudHMpOyB9OyB9O1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi9pbmRleCcpO1xuXG5hc3Rlcm9pZHMudWkuS2V5UG9sbCA9IChmdW5jdGlvbigpIHtcbiAgdmFyIGRpc3BsYXlPYmosIHN0YXRlcztcblxuICBzdGF0ZXMgPSBudWxsO1xuXG4gIGRpc3BsYXlPYmogPSBudWxsO1xuXG4gIGZ1bmN0aW9uIEtleVBvbGwoZGlzcGxheU9iaikge1xuICAgIHRoaXMuZGlzcGxheU9iaiA9IGRpc3BsYXlPYmo7XG4gICAgdGhpcy5pc1VwID0gX19iaW5kKHRoaXMuaXNVcCwgdGhpcyk7XG4gICAgdGhpcy5pc0Rvd24gPSBfX2JpbmQodGhpcy5pc0Rvd24sIHRoaXMpO1xuICAgIHRoaXMua2V5VXBMaXN0ZW5lciA9IF9fYmluZCh0aGlzLmtleVVwTGlzdGVuZXIsIHRoaXMpO1xuICAgIHRoaXMua2V5RG93bkxpc3RlbmVyID0gX19iaW5kKHRoaXMua2V5RG93bkxpc3RlbmVyLCB0aGlzKTtcbiAgICB0aGlzLnN0YXRlcyA9IHt9O1xuICAgIHRoaXMuZGlzcGxheU9iai5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCB0aGlzLmtleURvd25MaXN0ZW5lcik7XG4gICAgdGhpcy5kaXNwbGF5T2JqLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCB0aGlzLmtleVVwTGlzdGVuZXIpO1xuICB9XG5cbiAgS2V5UG9sbC5wcm90b3R5cGUua2V5RG93bkxpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB0aGlzLnN0YXRlc1tldmVudC5rZXlDb2RlXSA9IHRydWU7XG4gIH07XG5cbiAgS2V5UG9sbC5wcm90b3R5cGUua2V5VXBMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgaWYgKHRoaXMuc3RhdGVzW2V2ZW50LmtleUNvZGVdKSB7XG4gICAgICB0aGlzLnN0YXRlc1tldmVudC5rZXlDb2RlXSA9IGZhbHNlO1xuICAgIH1cbiAgfTtcblxuICBLZXlQb2xsLnByb3RvdHlwZS5pc0Rvd24gPSBmdW5jdGlvbihrZXlDb2RlKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGVzW2tleUNvZGVdO1xuICB9O1xuXG4gIEtleVBvbGwucHJvdG90eXBlLmlzVXAgPSBmdW5jdGlvbihrZXlDb2RlKSB7XG4gICAgcmV0dXJuICF0aGlzLnN0YXRlc1trZXlDb2RlXTtcbiAgfTtcblxuICByZXR1cm4gS2V5UG9sbDtcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9a2V5X3BvbGwuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXN0ZXJvaWRzO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi9pbmRleCcpO1xuXG5hc3Rlcm9pZHMudWkuUG9pbnQgPSAoZnVuY3Rpb24oKSB7XG4gIFBvaW50LnByb3RvdHlwZS54ID0gMDtcblxuICBQb2ludC5wcm90b3R5cGUueSA9IDA7XG5cbiAgZnVuY3Rpb24gUG9pbnQoeCwgeSkge1xuICAgIHRoaXMueCA9IHggIT0gbnVsbCA/IHggOiAwO1xuICAgIHRoaXMueSA9IHkgIT0gbnVsbCA/IHkgOiAwO1xuICB9XG5cbiAgUG9pbnQuZGlzdGFuY2UgPSBmdW5jdGlvbihwb2ludDEsIHBvaW50Mikge1xuICAgIHZhciBkeCwgZHk7XG4gICAgZHggPSBwb2ludDEueCAtIHBvaW50Mi54O1xuICAgIGR5ID0gcG9pbnQxLnkgLSBwb2ludDIueTtcbiAgICByZXR1cm4gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcbiAgfTtcblxuICBQb2ludC5wcm90b3R5cGUuZGlzdGFuY2VTcXVhcmVkVG8gPSBmdW5jdGlvbih0YXJnZXRQb2ludCkge1xuICAgIHZhciBkeCwgZHk7XG4gICAgZHggPSB0aGlzLnggLSB0YXJnZXRQb2ludC54O1xuICAgIGR5ID0gdGhpcy55IC0gdGFyZ2V0UG9pbnQueTtcbiAgICByZXR1cm4gZHggKiBkeCArIGR5ICogZHk7XG4gIH07XG5cbiAgUG9pbnQucHJvdG90eXBlLmRpc3RhbmNlVG8gPSBmdW5jdGlvbih0YXJnZXRQb2ludCkge1xuICAgIHZhciBkeCwgZHk7XG4gICAgZHggPSB0aGlzLnggLSB0YXJnZXRQb2ludC54O1xuICAgIGR5ID0gdGhpcy55IC0gdGFyZ2V0UG9pbnQueTtcbiAgICByZXR1cm4gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcbiAgfTtcblxuICByZXR1cm4gUG9pbnQ7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBvaW50LmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzdGVyb2lkcztcblxubW9kdWxlLmV4cG9ydHMgPSBhc3Rlcm9pZHMgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIGFzdGVyb2lkcygpIHt9XG5cbiAgcmV0dXJuIGFzdGVyb2lkcztcblxufSkoKTtcblxuYXN0ZXJvaWRzLnVpID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiB1aSgpIHt9XG5cbiAgcmV0dXJuIHVpO1xuXG59KSgpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy91aS9wb2ludCcpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy91aS9rZXlfcG9sbCcpO1xuXG5hc3Rlcm9pZHMuc3ByaXRlcyA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gc3ByaXRlcygpIHt9XG5cbiAgcmV0dXJuIHNwcml0ZXM7XG5cbn0pKCk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL3Nwcml0ZXMvYXN0ZXJvaWRfdmlldycpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9zcHJpdGVzL2FzdGVyb2lkX2RlYXRoX3ZpZXcnKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvc3ByaXRlcy9idWxsZXRfdmlldycpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9zcHJpdGVzL2h1ZF92aWV3Jyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL3Nwcml0ZXMvc3BhY2VzaGlwX2RlYXRoX3ZpZXcnKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvc3ByaXRlcy9zcGFjZXNoaXBfdmlldycpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9zcHJpdGVzL3dhaXRfZm9yX3N0YXJ0X3ZpZXcnKTtcblxuYXN0ZXJvaWRzLmNvbXBvbmVudHMgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIGNvbXBvbmVudHMoKSB7fVxuXG4gIHJldHVybiBjb21wb25lbnRzO1xuXG59KSgpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9jb21wb25lbnRzL2FuaW1hdGlvbicpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9jb21wb25lbnRzL2FzdGVyb2lkJyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL2NvbXBvbmVudHMvYXVkaW8nKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvY29tcG9uZW50cy9idWxsZXQnKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvY29tcG9uZW50cy9jb2xsaXNpb24nKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvY29tcG9uZW50cy9kZWF0aF90aHJvZXMnKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvY29tcG9uZW50cy9kaXNwbGF5Jyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL2NvbXBvbmVudHMvZ2FtZV9zdGF0ZScpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9jb21wb25lbnRzL2d1bicpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9jb21wb25lbnRzL2d1bl9jb250cm9scycpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9jb21wb25lbnRzL2h1ZCcpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9jb21wb25lbnRzL21vdGlvbl9jb250cm9scycpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9jb21wb25lbnRzL3BoeXNpY3MnKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvY29tcG9uZW50cy9wb3NpdGlvbicpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9jb21wb25lbnRzL3NwYWNlc2hpcCcpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9jb21wb25lbnRzL3dhaXRfZm9yX3N0YXJ0Jyk7XG5cbmFzdGVyb2lkcy5ub2RlcyA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gbm9kZXMoKSB7fVxuXG4gIHJldHVybiBub2RlcztcblxufSkoKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvbm9kZXMvYW5pbWF0aW9uX25vZGUnKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvbm9kZXMvYXN0ZXJvaWRfY29sbGlzaW9uX25vZGUnKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvbm9kZXMvYXVkaW9fbm9kZScpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9ub2Rlcy9idWxsZXRfYWdlX25vZGUnKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvbm9kZXMvYnVsbGV0X2NvbGxpc2lvbl9ub2RlJyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL25vZGVzL2RlYXRoX3Rocm9lc19ub2RlJyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL25vZGVzL2dhbWVfbm9kZScpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9ub2Rlcy9ndW5fY29udHJvbF9ub2RlJyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL25vZGVzL2h1ZF9ub2RlJyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL25vZGVzL21vdmVtZW50X25vZGUnKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvbm9kZXMvcGh5c2ljc19jb250cm9sX25vZGUnKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvbm9kZXMvcGh5c2ljc19ub2RlJyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL25vZGVzL3JlbmRlcl9ub2RlJyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL25vZGVzL3NwYWNlc2hpcF9jb2xsaXNpb25fbm9kZScpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9ub2Rlcy9zcGFjZXNoaXBfbm9kZScpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9ub2Rlcy93YWl0X2Zvcl9zdGFydF9ub2RlJyk7XG5cbmFzdGVyb2lkcy5zeXN0ZW1zID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBzeXN0ZW1zKCkge31cblxuICByZXR1cm4gc3lzdGVtcztcblxufSkoKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvc3lzdGVtcy9waHlzaWNzX3N5c3RlbScpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9zeXN0ZW1zL2FuaW1hdGlvbl9zeXN0ZW0nKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvc3lzdGVtcy9hdWRpb19zeXN0ZW0nKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvc3lzdGVtcy9idWxsZXRfYWdlX3N5c3RlbScpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9zeXN0ZW1zL2NvbGxpc2lvbl9zeXN0ZW0nKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvc3lzdGVtcy9kZWF0aF90aHJvZXNfc3lzdGVtJyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL3N5c3RlbXMvZ2FtZV9tYW5hZ2VyJyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL3N5c3RlbXMvZ3VuX2NvbnRyb2xfc3lzdGVtJyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL3N5c3RlbXMvaHVkX3N5c3RlbScpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9zeXN0ZW1zL21vdmVtZW50X3N5c3RlbScpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9zeXN0ZW1zL3BoeXNpY3NfY29udHJvbF9zeXN0ZW0nKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvc3lzdGVtcy9yZW5kZXJfc3lzdGVtJyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL3N5c3RlbXMvc3lzdGVtX3ByaW9yaXRpZXMnKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvc3lzdGVtcy93YWl0X2Zvcl9zdGFydF9zeXN0ZW0nKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvZW50aXR5X2NyZWF0b3InKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvZ2FtZV9jb25maWcnKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvYXN0ZXJvaWRzJyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL21haW4nKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwXG4iXX0=
