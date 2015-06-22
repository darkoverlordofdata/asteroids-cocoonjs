/*
 * Copyright (c) 2006-2007 Erin Catto http://www.gphysics.com
 *
 * This software is provided 'as-is', without any express or implied
 * warranty.  In no event will the authors be held liable for any damages
 * arising from the use of this software.
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 * 1. The origin of this software must not be misrepresented; you must not
 * claim that you wrote the original software. If you use this software
 * in a product, an acknowledgment in the product documentation would be
 * appreciated but is not required.
 * 2. Altered source versions must be plainly marked as such, and must not be
 * misrepresented as being the original software.
 * 3. This notice may not be removed or altered from any source distribution.
 *//* Box2dWeb Redux Copyright (c) 2015 by DarkOverlordOfData
 *
 *      A redux of mikolalysenko's npm listing of
 *      Uli Hecht's port of Box2DFlash which is the
 *      flash port of Erin Catto's box2d library.
 */

var Box2D = (function() {
    'use strict';
var ClipVertex, Features, b2AABB, b2Body, b2BodyDef, b2Bound, b2BoundValues, b2BuoyancyController,
    b2CircleContact, b2CircleShape, b2Collision, b2Color, b2ConstantAccelController,
    b2ConstantForceController, b2Contact, b2ContactConstraint, b2ContactConstraintPoint, b2ContactEdge,
    b2ContactFactory, b2ContactFilter, b2ContactID, b2ContactImpulse, b2ContactListener, b2ContactManager,
    b2ContactPoint, b2ContactRegister, b2ContactResult, b2ContactSolver, b2Controller, b2ControllerEdge,
    b2DebugDraw, b2DestructionListener, b2Distance, b2DistanceInput, b2DistanceJoint, b2DistanceJointDef,
    b2DistanceOutput, b2DistanceProxy, b2DynamicTree, b2DynamicTreeBroadPhase, b2DynamicTreeNode,
    b2DynamicTreePair, b2EdgeAndCircleContact, b2EdgeChainDef, b2EdgeShape, b2FilterData, b2Fixture,
    b2FixtureDef, b2FrictionJoint, b2FrictionJointDef, b2GearJoint, b2GearJointDef, b2GravityController,
    b2Island, b2Jacobian, b2Joint, b2JointDef, b2JointEdge, b2LineJoint, b2LineJointDef, b2Manifold,
    b2ManifoldPoint, b2MassData, b2Mat22, b2Mat33, b2Math, b2MouseJoint, b2MouseJointDef, b2NullContact,
    b2Point, b2PolyAndCircleContact, b2PolyAndEdgeContact, b2PolygonContact, b2PolygonShape,
    b2PositionSolverManifold, b2PrismaticJoint, b2PrismaticJointDef, b2PulleyJoint, b2PulleyJointDef,
    b2RayCastInput, b2RayCastOutput, b2RevoluteJoint, b2RevoluteJointDef, b2Segment, b2SeparationFunction,
    b2Settings, b2Shape, b2Simplex, b2SimplexCache, b2SimplexVertex, b2Sweep, b2TOIInput,
    b2TensorDampingController, b2TimeOfImpact, b2TimeStep, b2Transform, b2Vec2, b2Vec3, b2WeldJoint,
    b2WeldJointDef, b2World, b2WorldManifold,
    b2Assert = function (a) {
        if (!a) {
            throw "Assertion Failed";
        }
    },
    Box2D = {
        Common: {
            Math: {}
        },
        Collision: {
            Shapes: {}
        },
        Dynamics: {
            Contacts: {},
            Controllers: {},
            Joints: {}
        }
    };

/**
*  Class b2Color
*
* @param rr
* @param gg
* @param bb
*
*/
b2Color = Box2D.Common.b2Color = function b2Color(rr, gg, bb) {
   this.Set(rr, gg, bb);
};
b2Color.constructor = b2Color;
b2Color.prototype = {
    _r: 0,
    _g: 0,
    _b: 0,
    /**
     * Set
     *
     * @param rr
     * @param gg
     * @param bb
     *
     */
    Set: function (rr, gg, bb) {
        this._r = Math.abs(255 * b2Math.Clamp(rr, 0.0, 1.0), 10);
        this._g = Math.abs(255 * b2Math.Clamp(gg, 0.0, 1.0), 10);
        this._b = Math.abs(255 * b2Math.Clamp(bb, 0.0, 1.0), 10);
    }
};
/**
*  Class b2Settings
*
* @param
*
*/
b2Settings = Box2D.Common.b2Settings = function b2Settings() {};
b2Settings.constructor = b2Settings;

b2Settings.VERSION = "2.1alpha";
b2Settings.b2_maxFloat = Number.MAX_VALUE;
b2Settings.b2_epsilon = Number.MIN_VALUE;
b2Settings.b2_pi = Math.PI;
b2Settings.b2_maxManifoldPoints = 2;
b2Settings.b2_aabbExtension = 0.1;
b2Settings.b2_aabbMultiplier = 2.0;
b2Settings.b2_linearSlop = 0.005;
b2Settings.b2_maxTOIContactsPerIsland = 32;
b2Settings.b2_maxTOIJointsPerIsland = 32;
b2Settings.b2_velocityThreshold = 1.0;
b2Settings.b2_maxLinearCorrection = 0.2;
b2Settings.b2_maxTranslation = 2.0;
b2Settings.b2_contactBaumgarte = 0.2;
b2Settings.b2_timeToSleep = 0.5;
b2Settings.b2_linearSleepTolerance = 0.01;
b2Settings.b2_angularSleepTolerance = 2.0 / 180.0 * b2Settings.b2_pi;
b2Settings.b2_maxRotationSquared = b2Settings.b2_maxRotation * b2Settings.b2_maxRotation;
b2Settings.b2_maxRotation = 0.5 * b2Settings.b2_pi;
b2Settings.b2_maxTranslationSquared = b2Settings.b2_maxTranslation * b2Settings.b2_maxTranslation;
b2Settings.b2_maxAngularCorrection = 8.0 / 180.0 * b2Settings.b2_pi;
b2Settings.b2_toiSlop = 8.0 * b2Settings.b2_linearSlop;
b2Settings.b2_angularSlop = 2.0 / 180.0 * b2Settings.b2_pi;
b2Settings.b2_polygonRadius = 2.0 * b2Settings.b2_linearSlop;
/**
* Static b2MixFriction
*
* @param friction1
* @param friction2
*
*/
b2Settings.b2MixFriction = function (friction1, friction2) {
  return Math.sqrt(friction1 * friction2);
};

/**
* Static b2MixRestitution
*
* @param restitution1
* @param restitution2
*
*/
b2Settings.b2MixRestitution = function (restitution1, restitution2) {
  return restitution1 > restitution2 ? restitution1 : restitution2;
};


/**
*  Class b2Vec2
*
* @param x
* @param y
*
*/
b2Vec2 = Box2D.Common.Math.b2Vec2 = function b2Vec2(x, y) {
  this.x = x;
  this.y = y;
};
/**
 * Static Make
 *
 * @param x
 * @param y
 *
 */
b2Vec2.Make = function (x, y) {
    return new b2Vec2(x, y);
};
b2Vec2.constructor = b2Vec2;
b2Vec2.prototype = {
    x: 0,
    y: 0,
    /**
     * SetZero
     *
     * @param
     *
     */
    SetZero: function () {
        this.x = 0;
        this.y = 0;
        return this;
    },

    /**
     * Set
     *
     * @param x
     * @param y
     *
     */
    Set: function (x, y) {
        this.x = x;
        this.y = y;
        return this;
    },

    /**
     * SetV
     *
     * @param v
     *
     */
    SetV: function (v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    },

    /**
     * GetNegative
     *
     * @param
     *
     */
    GetNegative: function () {
        return new b2Vec2((-this.x), (-this.y));
    },

    /**
     * NegativeSelf
     *
     * @param
     *
     */
    NegativeSelf: function () {
        this.x = (-this.x);
        this.y = (-this.y);
        return this;
    },

    /**
     * Copy
     *
     * @param
     *
     */
    Copy: function () {
        return new b2Vec2(this.x, this.y);
    },

    /**
     * Add
     *
     * @param v
     *
     */
    Add: function (v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    },

    /**
     * Subtract
     *
     * @param v
     *
     */
    Subtract: function (v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    },

    /**
     * Multiply
     *
     * @param a
     *
     */
    Multiply: function (a) {
        this.x *= a;
        this.y *= a;
        return this;
    },

    /**
     * MulM
     *
     * @param A
     *
     */
    MulM: function (A) {
        var tX = this.x;
        this.x = A.col1.x * tX + A.col2.x * this.y;
        this.y = A.col1.y * tX + A.col2.y * this.y;
        return this;
    },

    /**
     * MulTM
     *
     * @param A
     *
     */
    MulTM: function (A) {
        var tX = b2Math.Dot(this, A.col1);
        this.y = b2Math.Dot(this, A.col2);
        this.x = tX;
        return this;
    },

    /**
     * CrossVF
     *
     * @param s
     *
     */
    CrossVF: function (s) {
        var tX = this.x;
        this.x = s * this.y;
        this.y = (-s * tX);
        return this;
    },

    /**
     * CrossFV
     *
     * @param s
     *
     */
    CrossFV: function (s) {
        var tX = this.x;
        this.x = (-s * this.y);
        this.y = s * tX;
        return this;
    },

    /**
     * MinV
     *
     * @param b
     *
     */
    MinV: function (b) {
        this.x = this.x < b.x ? this.x : b.x;
        this.y = this.y < b.y ? this.y : b.y;
        return this;
    },

    /**
     * MaxV
     *
     * @param b
     *
     */
    MaxV: function (b) {
        this.x = this.x > b.x ? this.x : b.x;
        this.y = this.y > b.y ? this.y : b.y;
        return this;
    },

    /**
     * Abs
     *
     * @param
     *
     */
    Abs: function () {
        if (this.x < 0) this.x = (-this.x);
        if (this.y < 0) this.y = (-this.y);
        return this;
    },

    /**
     * Length
     *
     * @param
     *
     */
    Length: function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },

    /**
     * LengthSquared
     *
     * @param
     *
     */
    LengthSquared: function () {
        return (this.x * this.x + this.y * this.y);
    },

    /**
     * Normalize
     *
     * @param
     *
     */
    Normalize: function () {
        var length = Math.sqrt(this.x * this.x + this.y * this.y);
        if (length < b2Settings.b2_epsilon) {
            return 0.0;
        }
        var invLength = 1.0 / length;
        this.x *= invLength;
        this.y *= invLength;
        return length;
    },

    /**
     * IsValid
     *
     * @param
     *
     */
    IsValid: function () {
        return b2Math.IsValid(this.x) && b2Math.IsValid(this.y);
    }
}
/**
*  Class b2Vec3
*
* @param x
* @param y
* @param z
*
*/
b2Vec3 = Box2D.Common.Math.b2Vec3 = function b2Vec3(x, y, z) {

  this.x = x;
  this.y = y;
  this.z = z;
};
b2Vec3.constructor = b2Vec3;
b2Vec3.prototype = {

    x: 0,
    y: 0,
    z: 0,
    /**
     * SetZero
     *
     * @param
     *
     */
    SetZero: function () {
        this.x = this.y = this.z = 0.0;
        return this;
    },

    /**
     * Set
     *
     * @param x
     * @param y
     * @param z
     *
     */
    Set: function (x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    },

    /**
     * SetV
     *
     * @param v
     *
     */
    SetV: function (v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    },

    /**
     * GetNegative
     *
     * @param
     *
     */
    GetNegative: function () {
        return new b2Vec3((-this.x), (-this.y), (-this.z));
    },

    /**
     * NegativeSelf
     *
     * @param
     *
     */
    NegativeSelf: function () {
        this.x = (-this.x);
        this.y = (-this.y);
        this.z = (-this.z);
        return this;
    },

    /**
     * Copy
     *
     * @param
     *
     */
    Copy: function () {
        return new b2Vec3(this.x, this.y, this.z);
    },

    /**
     * Add
     *
     * @param v
     *
     */
    Add: function (v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    },

    /**
     * Subtract
     *
     * @param v
     *
     */
    Subtract: function (v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    },

    /**
     * Multiply
     *
     * @param a
     *
     */
    Multiply: function (a) {
        this.x *= a;
        this.y *= a;
        this.z *= a;
        return this;
    }
}
/**
*  Class b2Mat22
*
* @param 
*
*/
b2Mat22 = Box2D.Common.Math.b2Mat22 = function b2Mat22() {
  this.col1 = new b2Vec2(0, 0);
  this.col2 = new b2Vec2(0, 0);
  this.SetIdentity();
};
/**
 * Static FromAngle
 *
 * @param angle
 *
 */
b2Mat22.FromAngle = function (angle) {
    var mat = new b2Mat22();
    mat.Set(angle);
    return mat;
};

/**
 * Static FromVV
 *
 * @param c1
 * @param c2
 *
 */
b2Mat22.FromVV = function (c1, c2) {
    var mat = new b2Mat22();
    mat.SetVV(c1, c2);
    return mat;
};

b2Mat22.constructor = b2Mat22;
b2Mat22.prototype = {

    col1: null,
    col2: null,


    /**
     * Set
     *
     * @param angle
     *
     */
    Set: function (angle) {
        var c = Math.cos(angle),
            s = Math.sin(angle);
        this.col1.x = c;
        this.col2.x = (-s);
        this.col1.y = s;
        this.col2.y = c;
        return this;
    },

    /**
     * SetVV
     *
     * @param c1
     * @param c2
     *
     */
    SetVV: function (c1, c2) {
        this.col1.SetV(c1);
        this.col2.SetV(c2);
        return this;
    },

    /**
     * Copy
     *
     * @param
     *
     */
    Copy: function () {
        var mat = new b2Mat22();
        mat.SetM(this);
        return mat;
    },

    /**
     * SetM
     *
     * @param m
     *
     */
    SetM: function (m) {
        this.col1.SetV(m.col1);
        this.col2.SetV(m.col2);
        return this;
    },

    /**
     * AddM
     *
     * @param m
     *
     */
    AddM: function (m) {
        this.col1.x += m.col1.x;
        this.col1.y += m.col1.y;
        this.col2.x += m.col2.x;
        this.col2.y += m.col2.y;
        return this;
    },

    /**
     * SetIdentity
     *
     * @param
     *
     */
    SetIdentity: function () {
        this.col1.x = 1.0;
        this.col2.x = 0.0;
        this.col1.y = 0.0;
        this.col2.y = 1.0;
        return this;
    },

    /**
     * SetZero
     *
     * @param
     *
     */
    SetZero: function () {
        this.col1.x = 0.0;
        this.col2.x = 0.0;
        this.col1.y = 0.0;
        this.col2.y = 0.0;
        return this;
    },

    /**
     * GetAngle
     *
     * @param
     *
     */
    GetAngle: function () {
        return Math.atan2(this.col1.y, this.col1.x);
    },

    /**
     * GetInverse
     *
     * @param out
     *
     */
    GetInverse: function (out) {
        var a = this.col1.x,
            b = this.col2.x,
            c = this.col1.y,
            d = this.col2.y,
            det = a * d - b * c;
        if (det !== 0.0) {
            det = 1.0 / det;
        }
        out.col1.x = det * d;
        out.col2.x = (-det * b);
        out.col1.y = (-det * c);
        out.col2.y = det * a;
        return out;
    },

    /**
     * Solve
     *
     * @param out
     * @param bX
     * @param bY
     *
     */
    Solve: function (out, bX, bY) {
        var a11 = this.col1.x,
            a12 = this.col2.x,
            a21 = this.col1.y,
            a22 = this.col2.y,
            det = a11 * a22 - a12 * a21;
        if (det !== 0.0) {
            det = 1.0 / det;
        }
        out.x = det * (a22 * bX - a12 * bY);
        out.y = det * (a11 * bY - a21 * bX);
        return out;
    },

    /**
     * Abs
     *
     * @param
     *
     */
    Abs: function () {
        this.col1.Abs();
        this.col2.Abs();
        return this;
    }
};
/**
*  Class b2Mat33
*
* @param c1
* @param c2
* @param c3
*
*/
b2Mat33 = Box2D.Common.Math.b2Mat33 = function b2Mat33(c1, c2, c3) {
  this.col1 = new b2Vec3(0, 0, 0);
  this.col2 = new b2Vec3(0, 0, 0);
  this.col3 = new b2Vec3(0, 0, 0);
  if (!c1 && !c2 && !c3) {
     this.col1.SetZero();
     this.col2.SetZero();
     this.col3.SetZero();
  }
  else {
     this.col1.SetV(c1);
     this.col2.SetV(c2);
     this.col3.SetV(c3);
  }
};
b2Mat33.constructor = b2Mat33;
b2Mat33.prototype = {

    col1: null,
    col2: null,
    col3: null,

    /**
     * SetVVV
     *
     * @param c1
     * @param c2
     * @param c3
     *
     */
    SetVVV: function (c1, c2, c3) {
        this.col1.SetV(c1);
        this.col2.SetV(c2);
        this.col3.SetV(c3);
        return this;
    },

    /**
     * Copy
     *
     * @param
     *
     */
    Copy: function () {
        return new b2Mat33(this.col1, this.col2, this.col3);
    },

    /**
     * SetM
     *
     * @param m
     *
     */
    SetM: function (m) {
        this.col1.SetV(m.col1);
        this.col2.SetV(m.col2);
        this.col3.SetV(m.col3);
        return this;
    },

    /**
     * AddM
     *
     * @param m
     *
     */
    AddM: function (m) {
        this.col1.x += m.col1.x;
        this.col1.y += m.col1.y;
        this.col1.z += m.col1.z;
        this.col2.x += m.col2.x;
        this.col2.y += m.col2.y;
        this.col2.z += m.col2.z;
        this.col3.x += m.col3.x;
        this.col3.y += m.col3.y;
        this.col3.z += m.col3.z;
        return this;
    },

    /**
     * SetIdentity
     *
     * @param
     *
     */
    SetIdentity: function () {
        this.col1.x = 1.0;
        this.col2.x = 0.0;
        this.col3.x = 0.0;
        this.col1.y = 0.0;
        this.col2.y = 1.0;
        this.col3.y = 0.0;
        this.col1.z = 0.0;
        this.col2.z = 0.0;
        this.col3.z = 1.0;
        return this;
    },

    /**
     * SetZero
     *
     * @param
     *
     */
    SetZero: function () {
        this.col1.x = 0.0;
        this.col2.x = 0.0;
        this.col3.x = 0.0;
        this.col1.y = 0.0;
        this.col2.y = 0.0;
        this.col3.y = 0.0;
        this.col1.z = 0.0;
        this.col2.z = 0.0;
        this.col3.z = 0.0;
        return this;
    },

    /**
     * Solve22
     *
     * @param out
     * @param bX
     * @param bY
     *
     */
    Solve22: function (out, bX, bY) {
        var a11 = this.col1.x,
            a12 = this.col2.x,
            a21 = this.col1.y,
            a22 = this.col2.y,
            det = a11 * a22 - a12 * a21;
        if (det !== 0.0) {
            det = 1.0 / det;
        }
        out.x = det * (a22 * bX - a12 * bY);
        out.y = det * (a11 * bY - a21 * bX);
        return out;
    },

    /**
     * Solve33
     *
     * @param out
     * @param bX
     * @param bY
     * @param bZ
     *
     */
    Solve33: function (out, bX, bY, bZ) {
        var a11 = this.col1.x,
            a21 = this.col1.y,
            a31 = this.col1.z,
            a12 = this.col2.x,
            a22 = this.col2.y,
            a32 = this.col2.z,
            a13 = this.col3.x,
            a23 = this.col3.y,
            a33 = this.col3.z,
            det = a11 * (a22 * a33 - a32 * a23) + a21 * (a32 * a13 - a12 * a33) + a31 * (a12 * a23 - a22 * a13);
        if (det !== 0.0) {
            det = 1.0 / det;
        }
        out.x = det * (bX * (a22 * a33 - a32 * a23) + bY * (a32 * a13 - a12 * a33) + bZ * (a12 * a23 - a22 * a13));
        out.y = det * (a11 * (bY * a33 - bZ * a23) + a21 * (bZ * a13 - bX * a33) + a31 * (bX * a23 - bY * a13));
        out.z = det * (a11 * (a22 * bZ - a32 * bY) + a21 * (a32 * bX - a12 * bZ) + a31 * (a12 * bY - a22 * bX));
        return out;
    }
};
/**
*  Class b2Sweep
*
* @param 
*
*/
b2Sweep = Box2D.Common.Math.b2Sweep = function b2Sweep() {
  this.localCenter = new b2Vec2(0, 0);
  this.c0 = new b2Vec2(0, 0);
  this.c = new b2Vec2(0, 0);

};
b2Sweep.constructor = b2Sweep;
b2Sweep.prototype = {


    localCenter: null,
    c: null,
    c0: null,
    a: 0,
    a0: 0,
    t0: 0,

    /**
     * Set
     *
     * @param other
     *
     */
    Set: function (other) {
        this.localCenter.SetV(other.localCenter);
        this.c0.SetV(other.c0);
        this.c.SetV(other.c);
        this.a0 = other.a0;
        this.a = other.a;
        this.t0 = other.t0;
        return this;
    },

    /**
     * Copy
     *
     * @param
     *
     */
    Copy: function () {
        var copy = new b2Sweep();
        copy.localCenter.SetV(this.localCenter);
        copy.c0.SetV(this.c0);
        copy.c.SetV(this.c);
        copy.a0 = this.a0;
        copy.a = this.a;
        copy.t0 = this.t0;
        return copy;
    },

    /**
     * GetTransform
     *
     * @param xf
     * @param alpha
     *
     */
    GetTransform: function (xf, alpha) {
        alpha = alpha || 0;
        xf.position.x = (1.0 - alpha) * this.c0.x + alpha * this.c.x;
        xf.position.y = (1.0 - alpha) * this.c0.y + alpha * this.c.y;
        var angle = (1.0 - alpha) * this.a0 + alpha * this.a;
        xf.R.Set(angle);
        var tMat = xf.R;
        xf.position.x -= (tMat.col1.x * this.localCenter.x + tMat.col2.x * this.localCenter.y);
        xf.position.y -= (tMat.col1.y * this.localCenter.x + tMat.col2.y * this.localCenter.y);
    },

    /**
     * Advance
     *
     * @param t
     *
     */
    Advance: function (t) {
        t = t || 0;
        if (this.t0 < t && 1.0 - this.t0 > b2Settings.b2_epsilon) {
            var alpha = (t - this.t0) / (1.0 - this.t0);
            this.c0.x = (1.0 - alpha) * this.c0.x + alpha * this.c.x;
            this.c0.y = (1.0 - alpha) * this.c0.y + alpha * this.c.y;
            this.a0 = (1.0 - alpha) * this.a0 + alpha * this.a;
            this.t0 = t;
        }
    }
};
/**
*  Class b2Transform
*
* @param pos
* @param r
*
*/
b2Transform = Box2D.Common.Math.b2Transform = function b2Transform(pos, r) {
    this.position = new b2Vec2(0, 0);
    this.R = new b2Mat22();
    if (pos) {
        this.position.SetV(pos);
        this.R.SetM(r);
    }
};
b2Transform.constructor = b2Transform;
b2Transform.prototype = {


    position: null,
    R: null,


    /**
     * Initialize
     *
     * @param pos
     * @param r
     *
     */
    Initialize: function (pos, r) {
        this.position.SetV(pos);
        this.R.SetM(r);
        return this;
    },

    /**
     * SetIdentity
     *
     * @param
     *
     */
    SetIdentity: function () {
        this.position.SetZero();
        this.R.SetIdentity();
        return this;
    },

    /**
     * Set
     *
     * @param x
     *
     */
    Set: function (x) {
        this.position.SetV(x.position);
        this.R.SetM(x.R);
        return this;
    },

    /**
     * GetAngle
     *
     * @param
     *
     */
    GetAngle: function () {
        return Math.atan2(this.R.col1.y, this.R.col1.x);
    }
};
/**
*  Class b2Math
*
* @param
*
*/
b2Math = Box2D.Common.Math.b2Math = function b2Math() {};
b2Math.constructor = b2Math;

b2Math.b2Vec2_zero = new b2Vec2(0.0, 0.0);
b2Math.b2Mat22_identity = b2Mat22.FromVV(new b2Vec2(1.0, 0.0), new b2Vec2(0.0, 1.0));

/**
* Static IsValid
*
* @param x
*
*/
b2Math.IsValid = function (x) {
  return isFinite(x);
};

/**
* Static Dot
*
* @param a
* @param b
*
*/
b2Math.Dot = function (a, b) {
  return a.x * b.x + a.y * b.y;
};

/**
* Static CrossVV
*
* @param a
* @param b
*
*/
b2Math.CrossVV = function (a, b) {
  return a.x * b.y - a.y * b.x;
};

/**
* Static CrossVF
*
* @param a
* @param s
*
*/
b2Math.CrossVF = function (a, s) {
   return new b2Vec2(s * a.y, (-s * a.x));
};

/**
* Static CrossFV
*
* @param s
* @param a
*
*/
b2Math.CrossFV = function (s, a) {
   return new b2Vec2((-s * a.y), s * a.x);
};

/**
* Static MulMV
*
* @param A
* @param v
*
*/
b2Math.MulMV = function (A, v) {
   return new b2Vec2(A.col1.x * v.x + A.col2.x * v.y, A.col1.y * v.x + A.col2.y * v.y);
};

/**
* Static MulTMV
*
* @param A
* @param v
*
*/
b2Math.MulTMV = function (A, v) {
   return new b2Vec2(b2Math.Dot(v, A.col1), b2Math.Dot(v, A.col2));
};

/**
* Static MulX
*
* @param T
* @param v
*
*/
b2Math.MulX = function (T, v) {
  var a = b2Math.MulMV(T.R, v);
  a.x += T.position.x;
  a.y += T.position.y;
  return a;
};

/**
* Static MulXT
*
* @param T
* @param v
*
*/
b2Math.MulXT = function (T, v) {
  var a = b2Math.SubtractVV(v, T.position),
      tX = (a.x * T.R.col1.x + a.y * T.R.col1.y);
  a.y = (a.x * T.R.col2.x + a.y * T.R.col2.y);
  a.x = tX;
  return a;
};

/**
* Static AddVV
*
* @param a
* @param b
*
*/
b2Math.AddVV = function (a, b) {
  return new b2Vec2(a.x + b.x, a.y + b.y);
};

/**
* Static SubtractVV
*
* @param a
* @param b
*
*/
b2Math.SubtractVV = function (a, b) {
   return new b2Vec2(a.x - b.x, a.y - b.y);
};

/**
* Static Distance
*
* @param a
* @param b
*
*/
b2Math.Distance = function (a, b) {
  var cX = a.x - b.x,
      cY = a.y - b.y;
  return Math.sqrt(cX * cX + cY * cY);
};

/**
* Static DistanceSquared
*
* @param a
* @param b
*
*/
b2Math.DistanceSquared = function (a, b) {
  var cX = a.x - b.x,
      cY = a.y - b.y;
  return (cX * cX + cY * cY);
};

/**
* Static MulFV
*
* @param s
* @param a
*
*/
b2Math.MulFV = function (s, a) {
  return new b2Vec2(s * a.x, s * a.y);
};

/**
* Static AddMM
*
* @param A
* @param B
*
*/
b2Math.AddMM = function (A, B) {
  return b2Mat22.FromVV(b2Math.AddVV(A.col1, B.col1), b2Math.AddVV(A.col2, B.col2));
};

/**
* Static MulMM
*
* @param A
* @param B
*
*/
b2Math.MulMM = function (A, B) {
  return b2Mat22.FromVV(b2Math.MulMV(A, B.col1), b2Math.MulMV(A, B.col2));
};

/**
* Static MulTMM
*
* @param A
* @param B
*
*/
b2Math.MulTMM = function (A, B) {
  var c1 = new b2Vec2(b2Math.Dot(A.col1, B.col1), b2Math.Dot(A.col2, B.col1)),
      c2 = new b2Vec2(b2Math.Dot(A.col1, B.col2), b2Math.Dot(A.col2, B.col2));
  return b2Mat22.FromVV(c1, c2);
};

/**
* Static Abs
*
* @param a
*
*/
b2Math.Abs = function (a) {
  return a > 0.0 ? a : (-a);
};

/**
* Static AbsV
*
* @param a
*
*/
b2Math.AbsV = function (a) {
  return new b2Vec2(b2Math.Abs(a.x), b2Math.Abs(a.y));
};

/**
* Static AbsM
*
* @param A
*
*/
b2Math.AbsM = function (A) {
  return b2Mat22.FromVV(b2Math.AbsV(A.col1), b2Math.AbsV(A.col2));
};

/**
* Static Min
*
* @param a
* @param b
*
*/
b2Math.Min = function (a, b) {
  return a < b ? a : b;
};

/**
* Static MinV
*
* @param a
* @param b
*
*/
b2Math.MinV = function (a, b) {
  return new b2Vec2(b2Math.Min(a.x, b.x), b2Math.Min(a.y, b.y));
};

/**
* Static Max
*
* @param a
* @param b
*
*/
b2Math.Max = function (a, b) {
  return a > b ? a : b;
};

/**
* Static MaxV
*
* @param a
* @param b
*
*/
b2Math.MaxV = function (a, b) {
  return new b2Vec2(b2Math.Max(a.x, b.x), b2Math.Max(a.y, b.y));
};

/**
* Static Clamp
*
* @param a
* @param low
* @param high
*
*/
b2Math.Clamp = function (a, low, high) {
  return a < low ? low : a > high ? high : a;
};

/**
* Static ClampV
*
* @param a
* @param low
* @param high
*
*/
b2Math.ClampV = function (a, low, high) {
  return b2Math.MaxV(low, b2Math.MinV(a, high));
};

/**
* Static Swap
*
* @param a
* @param b
*
*/
b2Math.Swap = function (a, b) {
  var tmp = a[0];
  a[0] = b[0];
  b[0] = tmp;
};

/**
* Static Random
*
* @param
*
*/
b2Math.Random = function () {
  return Math.random() * 2 - 1;
};

/**
* Static RandomRange
*
* @param lo
* @param hi
*
*/
b2Math.RandomRange = function (lo, hi) {
  return (hi - lo) * Math.random() + lo;
};

/**
* Static NextPowerOfTwo
*
* @param x
*
*/
b2Math.NextPowerOfTwo = function (x) {
  x |= (x >> 1) & 0x7FFFFFFF;
  x |= (x >> 2) & 0x3FFFFFFF;
  x |= (x >> 4) & 0x0FFFFFFF;
  x |= (x >> 8) & 0x00FFFFFF;
  x |= (x >> 16) & 0x0000FFFF;
  return x + 1;
};

/**
* Static IsPowerOfTwo
*
* @param x
*
*/
b2Math.IsPowerOfTwo = function (x) {
  return x > 0 && (x & (x - 1)) === 0;
};
b2Math.b2Transform_identity = new b2Transform(b2Math.b2Vec2_zero, b2Math.b2Mat22_identity);
   /**
    *  Class b2Shape
    *
    * @param
    *
    */
   b2Shape = Box2D.Collision.Shapes.b2Shape = function b2Shape() {};
   b2Shape.prototype.m_type         = b2Shape.e_unknownShape;
   b2Shape.prototype.m_radius       = b2Settings.b2_linearSlop;



   b2Shape.e_unknownShape = -1;
   b2Shape.e_circleShape = 0;
   b2Shape.e_polygonShape = 1;
   b2Shape.e_edgeShape = 2;
   b2Shape.e_shapeTypeCount = 3;
   b2Shape.e_hitCollide = 1;
   b2Shape.e_missCollide = 0;
   b2Shape.e_startsInsideCollide = -1;

   /**
    * Static TestOverlap
    *
    * @param shape1
    * @param transform1
    * @param shape2
    * @param transform2
    *
    */
   b2Shape.TestOverlap = function (shape1, transform1, shape2, transform2) {
      var input = new b2DistanceInput();
      input.proxyA = new b2DistanceProxy();
      input.proxyA.Set(shape1);
      input.proxyB = new b2DistanceProxy();
      input.proxyB.Set(shape2);
      input.transformA = transform1;
      input.transformB = transform2;
      input.useRadii = true;
      var simplexCache = new b2SimplexCache();
      simplexCache.count = 0;
      var output = new b2DistanceOutput();
      b2Distance.Distance(output, simplexCache, input);
      return output.distance < 10.0 * b2Settings.b2_epsilon;
   };

   /**
    * Set
    *
    * @param other
    *
    */
   b2Shape.prototype.Set = function (other) {
      this.m_radius = other.m_radius;
   };

   /**
    * GetType
    *
    * @param 
    *
    */
   b2Shape.prototype.GetType = function () {
      return this.m_type;
   };



   /**
    *  Class b2CircleShape
    *
    * @param radius
    *
    */
   b2CircleShape = Box2D.Collision.Shapes.b2CircleShape = function b2CircleShape(radius) {

       this.m_p = new b2Vec2(0, 0);
       radius = radius || 0;
       //b2Shape.call(this);
       this.m_type = b2Shape.e_circleShape;
       this.m_radius = radius;
   };

   b2CircleShape.prototype                  = Object.create(b2Shape.prototype );
   b2CircleShape.prototype.m_type           = b2Shape.e_circleShape;
   b2CircleShape.prototype.m_p              = null;


   /**
    * Copy
    *
    * @param 
    *
    */
   b2CircleShape.prototype.Copy = function () {
      var s = new b2CircleShape();
      s.Set(this);
      return s;
   };

   /**
    * Set
    *
    * @param other
    *
    */
   b2CircleShape.prototype.Set = function (other) {
      b2Shape.prototype.Set.call(this, other);
      if (other instanceof b2CircleShape) {
         var other2 = (other instanceof b2CircleShape ? other : null);
         this.m_p.SetV(other2.m_p);
      }
   };

   /**
    * TestPoint
    *
    * @param transform
    * @param p
    *
    */
   b2CircleShape.prototype.TestPoint = function (transform, p) {
      var tMat = transform.R,
          dX = transform.position.x + (tMat.col1.x * this.m_p.x + tMat.col2.x * this.m_p.y),
          dY = transform.position.y + (tMat.col1.y * this.m_p.x + tMat.col2.y * this.m_p.y);
      dX = p.x - dX;
      dY = p.y - dY;
      return (dX * dX + dY * dY) <= this.m_radius * this.m_radius;
   };

   /**
    * RayCast
    *
    * @param output
    * @param input
    * @param transform
    *
    */
   b2CircleShape.prototype.RayCast = function (output, input, transform) {
      var tMat = transform.R,
          positionX = transform.position.x + (tMat.col1.x * this.m_p.x + tMat.col2.x * this.m_p.y),
          positionY = transform.position.y + (tMat.col1.y * this.m_p.x + tMat.col2.y * this.m_p.y),
          sX = input.p1.x - positionX,
          sY = input.p1.y - positionY,
          b = (sX * sX + sY * sY) - this.m_radius * this.m_radius,
          rX = input.p2.x - input.p1.x,
          rY = input.p2.y - input.p1.y,
          c = (sX * rX + sY * rY),
          rr = (rX * rX + rY * rY),
          sigma = c * c - rr * b;
      if (sigma < 0.0 || rr < b2Settings.b2_epsilon) {
         return false;
      }
      var a = (-(c + Math.sqrt(sigma)));
      if (0.0 <= a && a <= input.maxFraction * rr) {
         a /= rr;
         output.fraction = a;
         output.normal.x = sX + a * rX;
         output.normal.y = sY + a * rY;
         output.normal.Normalize();
         return true;
      }
      return false;
   };

   /**
    * ComputeAABB
    *
    * @param aabb
    * @param transform
    *
    */
   b2CircleShape.prototype.ComputeAABB = function (aabb, transform) {
      var tMat = transform.R,
          pX = transform.position.x + (tMat.col1.x * this.m_p.x + tMat.col2.x * this.m_p.y),
          pY = transform.position.y + (tMat.col1.y * this.m_p.x + tMat.col2.y * this.m_p.y);
      aabb.lowerBound.Set(pX - this.m_radius, pY - this.m_radius);
      aabb.upperBound.Set(pX + this.m_radius, pY + this.m_radius);
   };

   /**
    * ComputeMass
    *
    * @param massData
    * @param density
    *
    */
   b2CircleShape.prototype.ComputeMass = function (massData, density) {
      density = density || 0;
      massData.mass = density * b2Settings.b2_pi * this.m_radius * this.m_radius;
      massData.center.SetV(this.m_p);
      massData.I = massData.mass * (0.5 * this.m_radius * this.m_radius + (this.m_p.x * this.m_p.x + this.m_p.y * this.m_p.y));
   };

   /**
    * ComputeSubmergedArea
    *
    * @param normal
    * @param offset
    * @param xf
    * @param c
    *
    */
   b2CircleShape.prototype.ComputeSubmergedArea = function (normal, offset, xf, c) {
      offset = offset || 0;
      var p = b2Math.MulX(xf, this.m_p),
          l = (-(b2Math.Dot(normal, p) - offset));
      if (l < (-this.m_radius) + b2Settings.b2_epsilon) {
         return 0;
      }
      if (l > this.m_radius) {
         c.SetV(p);
         return Math.PI * this.m_radius * this.m_radius;
      }
      var r2 = this.m_radius * this.m_radius,
          l2 = l * l,
          area = r2 * (Math.asin(l / this.m_radius) + Math.PI / 2) + l * Math.sqrt(r2 - l2),
          com = (-2 / 3 * Math.pow(r2 - l2, 1.5) / area);
      c.x = p.x + normal.x * com;
      c.y = p.y + normal.y * com;
      return area;
   };

   /**
    * GetLocalPosition
    *
    * @param 
    *
    */
   b2CircleShape.prototype.GetLocalPosition = function () {
      return this.m_p;
   };

   /**
    * SetLocalPosition
    *
    * @param position
    *
    */
   b2CircleShape.prototype.SetLocalPosition = function (position) {
      this.m_p.SetV(position);
   };

   /**
    * GetRadius
    *
    * @param 
    *
    */
   b2CircleShape.prototype.GetRadius = function () {
      return this.m_radius;
   };

   /**
    * SetRadius
    *
    * @param radius
    *
    */
   b2CircleShape.prototype.SetRadius = function (radius) {
      this.m_radius = radius;
   };


   /**
    *  Class b2PolygonShape
    *
    * @param 
    *
    */
   b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape = function b2PolygonShape() {

      b2Shape.call(this);
      this.m_type = b2Shape.e_polygonShape;
      this.m_centroid = new b2Vec2(0, 0);
      this.m_vertices = []; //new Vector();
      this.m_normals = []; //new Vector();
   };
   b2PolygonShape.constructor = b2PolygonShape;
   b2PolygonShape.prototype = Object.create(b2Shape.prototype );

   b2PolygonShape.s_mat = new b2Mat22();

   /**
    * Static AsArray
    *
    * @param vertices
    * @param vertexCount
    *
    */
   b2PolygonShape.AsArray = function (vertices, vertexCount) {
      var polygonShape = new b2PolygonShape();
      polygonShape.SetAsArray(vertices, vertexCount);
      return polygonShape;
   };

   /**
    * Static AsVector
    *
    * @param vertices
    * @param vertexCount
    *
    */
   b2PolygonShape.AsVector = function (vertices, vertexCount) {
      var polygonShape = new b2PolygonShape();
      polygonShape.SetAsVector(vertices, vertexCount);
      return polygonShape;
   };

   /**
    * Static AsBox
    *
    * @param hx
    * @param hy
    *
    */
   b2PolygonShape.AsBox = function (hx, hy) {
      var polygonShape = new b2PolygonShape();
      polygonShape.SetAsBox(hx, hy);
      return polygonShape;
   };

   /**
    * Static AsOrientedBox
    *
    * @param hx
    * @param hy
    * @param center
    * @param angle
    *
    */
   b2PolygonShape.AsOrientedBox = function (hx, hy, center, angle) {
      hx = hx || 0;
      hy = hy || 0;
      center = center || null;
      angle = angle || 0.0;
      var polygonShape = new b2PolygonShape();
      polygonShape.SetAsOrientedBox(hx, hy, center, angle);
      return polygonShape;
   };

   /**
    * Static AsEdge
    *
    * @param v1
    * @param v2
    *
    */
   b2PolygonShape.AsEdge = function (v1, v2) {
      var polygonShape = new b2PolygonShape();
      polygonShape.SetAsEdge(v1, v2);
      return polygonShape;
   };

   /**
    * Static ComputeCentroid
    *
    * @param vs
    * @param count
    *
    */
   b2PolygonShape.ComputeCentroid = function (vs, count) {
      var c = new b2Vec2(0, 0),
          area = 0.0,
          p1X = 0.0,
          p1Y = 0.0,
          inv3 = 1.0 / 3.0;
      for (var i = 0; i < count; ++i) {
         var p2 = vs[i],
          p3 = i + 1 < count ? vs[i + 1] : vs[0],
          e1X = p2.x - p1X,
          e1Y = p2.y - p1Y,
          e2X = p3.x - p1X,
          e2Y = p3.y - p1Y,
          D = (e1X * e2Y - e1Y * e2X),
          triangleArea = 0.5 * D;area += triangleArea;
         c.x += triangleArea * inv3 * (p1X + p2.x + p3.x);
         c.y += triangleArea * inv3 * (p1Y + p2.y + p3.y);
      }
      c.x *= 1.0 / area;
      c.y *= 1.0 / area;
      return c;
   };

   /**
    * Static ComputeOBB
    *
    * @param obb
    * @param vs
    * @param count
    *
    */
   b2PolygonShape.ComputeOBB = function (obb, vs, count) {
      var i,
          p = [];
      for (i = 0; i < count; ++i) {
          p.push(vs[i]);
      }
       p.push(p[0]);
      var minArea = b2Settings.b2_maxFloat;
      for (i = 1; i <= count; ++i) {
         var root = p[i - 1],
          uxX = p[i].x - root.x,
          uxY = p[i].y - root.y,
          length = Math.sqrt(uxX * uxX + uxY * uxY);
         uxX /= length;
         uxY /= length;
         var uyX = (-uxY),
          uyY = uxX,
          lowerX = b2Settings.b2_maxFloat,
          lowerY = b2Settings.b2_maxFloat,
          upperX = (-b2Settings.b2_maxFloat),
          upperY = (-b2Settings.b2_maxFloat);
         for (var j = 0; j < count; ++j) {
            var dX = p[j].x - root.x,
          dY = p[j].y - root.y,
          rX = (uxX * dX + uxY * dY),
          rY = (uyX * dX + uyY * dY);
            if (rX < lowerX) lowerX = rX;
            if (rY < lowerY) lowerY = rY;
            if (rX > upperX) upperX = rX;
            if (rY > upperY) upperY = rY;
         }
         var area = (upperX - lowerX) * (upperY - lowerY);
         if (area < 0.95 * minArea) {
            minArea = area;
            obb.R.col1.x = uxX;
            obb.R.col1.y = uxY;
            obb.R.col2.x = uyX;
            obb.R.col2.y = uyY;
            var centerX = 0.5 * (lowerX + upperX),
          centerY = 0.5 * (lowerY + upperY),
          tMat = obb.R;
            obb.center.x = root.x + (tMat.col1.x * centerX + tMat.col2.x * centerY);
            obb.center.y = root.y + (tMat.col1.y * centerX + tMat.col2.y * centerY);
            obb.extents.x = 0.5 * (upperX - lowerX);
            obb.extents.y = 0.5 * (upperY - lowerY);
         }
      }
   };

   /**
    * Copy
    *
    * @param 
    *
    */
   b2PolygonShape.prototype.Copy = function () {
      var s = new b2PolygonShape();
      s.Set(this);
      return s;
   };

   /**
    * Set
    *
    * @param other
    *
    */
   b2PolygonShape.prototype.Set = function (other) {
      b2Shape.prototype.Set.call(this, other);
      if (other instanceof b2PolygonShape) {
         var other2 = (other instanceof b2PolygonShape ? other : null);
         this.m_centroid.SetV(other2.m_centroid);
         this.m_vertexCount = other2.m_vertexCount;
         this.Reserve(this.m_vertexCount);
         for (var i = 0; i < this.m_vertexCount; i++) {
            this.m_vertices[i].SetV(other2.m_vertices[i]);
            this.m_normals[i].SetV(other2.m_normals[i]);
         }
      }
   };

   /**
    * SetAsArray
    *
    * @param vertices
    * @param vertexCount
    *
    */
   b2PolygonShape.prototype.SetAsArray = function (vertices, vertexCount) {
      vertexCount = vertexCount || 0;
      var v = [];
      var i,
         tVec;
      for (i = 0; i < vertices.length; ++i) {
         tVec = vertices[i];
         v.push(tVec);
      }
      this.SetAsVector(v, vertexCount);
   };

   /**
    * SetAsVector
    *
    * @param vertices
    * @param vertexCount
    *
    */
   b2PolygonShape.prototype.SetAsVector = function (vertices, vertexCount) {
      vertexCount = vertexCount || 0;
      if (vertexCount === 0) vertexCount = vertices.length;
      b2Assert(2 <= vertexCount);
      this.m_vertexCount = vertexCount;
      this.Reserve(vertexCount);
      var i = 0;
      for (i = 0; i < this.m_vertexCount; i++) {
         this.m_vertices[i].SetV(vertices[i]);
      }
      for (i = 0; i < this.m_vertexCount; ++i) {
         var i1 = i,
          i2 = i + 1 < this.m_vertexCount ? i + 1 : 0,
          edge = b2Math.SubtractVV(this.m_vertices[i2], this.m_vertices[i1]);
         b2Assert(edge.LengthSquared() > b2Settings.b2_epsilon);
         this.m_normals[i].SetV(b2Math.CrossVF(edge, 1.0));
         this.m_normals[i].Normalize();
      }
      this.m_centroid = b2PolygonShape.ComputeCentroid(this.m_vertices, this.m_vertexCount);
   };

   /**
    * SetAsBox
    *
    * @param hx
    * @param hy
    *
    */
   b2PolygonShape.prototype.SetAsBox = function (hx, hy) {
      hx = hx || 0;
      hy = hy || 0;
      this.m_vertexCount = 4;
      this.Reserve(4);
      this.m_vertices[0].Set((-hx), (-hy));
      this.m_vertices[1].Set(hx, (-hy));
      this.m_vertices[2].Set(hx, hy);
      this.m_vertices[3].Set((-hx), hy);
      this.m_normals[0].Set(0.0, (-1.0));
      this.m_normals[1].Set(1.0, 0.0);
      this.m_normals[2].Set(0.0, 1.0);
      this.m_normals[3].Set((-1.0), 0.0);
      this.m_centroid.SetZero();
   };

   /**
    * SetAsOrientedBox
    *
    * @param hx
    * @param hy
    * @param center
    * @param angle
    *
    */
   b2PolygonShape.prototype.SetAsOrientedBox = function (hx, hy, center, angle) {
      hx = hx || 0;
      hy = hy || 0;
      center = center || null;
      angle = angle || 0.0;
      this.m_vertexCount = 4;
      this.Reserve(4);
      this.m_vertices[0].Set((-hx), (-hy));
      this.m_vertices[1].Set(hx, (-hy));
      this.m_vertices[2].Set(hx, hy);
      this.m_vertices[3].Set((-hx), hy);
      this.m_normals[0].Set(0.0, (-1.0));
      this.m_normals[1].Set(1.0, 0.0);
      this.m_normals[2].Set(0.0, 1.0);
      this.m_normals[3].Set((-1.0), 0.0);
      this.m_centroid = center;
      var xf = new b2Transform();
      xf.position = center;
      xf.R.Set(angle);
      for (var i = 0; i < this.m_vertexCount; ++i) {
         this.m_vertices[i] = b2Math.MulX(xf, this.m_vertices[i]);
         this.m_normals[i] = b2Math.MulMV(xf.R, this.m_normals[i]);
      }
   };

   /**
    * SetAsEdge
    *
    * @param v1
    * @param v2
    *
    */
   b2PolygonShape.prototype.SetAsEdge = function (v1, v2) {
      this.m_vertexCount = 2;
      this.Reserve(2);
      this.m_vertices[0].SetV(v1);
      this.m_vertices[1].SetV(v2);
      this.m_centroid.x = 0.5 * (v1.x + v2.x);
      this.m_centroid.y = 0.5 * (v1.y + v2.y);
      this.m_normals[0] = b2Math.CrossVF(b2Math.SubtractVV(v2, v1), 1.0);
      this.m_normals[0].Normalize();
      this.m_normals[1].x = (-this.m_normals[0].x);
      this.m_normals[1].y = (-this.m_normals[0].y);
   };

   /**
    * TestPoint
    *
    * @param xf
    * @param p
    *
    */
   b2PolygonShape.prototype.TestPoint = function (xf, p) {
      var tVec,
          tMat = xf.R,
          tX = p.x - xf.position.x,
          tY = p.y - xf.position.y,
          pLocalX = (tX * tMat.col1.x + tY * tMat.col1.y),
          pLocalY = (tX * tMat.col2.x + tY * tMat.col2.y);
      for (var i = 0; i < this.m_vertexCount; ++i) {
         tVec = this.m_vertices[i];
         tX = pLocalX - tVec.x;
         tY = pLocalY - tVec.y;
         tVec = this.m_normals[i];
         var dot = (tVec.x * tX + tVec.y * tY);
         if (dot > 0.0) {
            return false;
         }
      }
      return true;
   };

   /**
    * RayCast
    *
    * @param output
    * @param input
    * @param transform
    *
    */
   b2PolygonShape.prototype.RayCast = function (output, input, transform) {
      var lower = 0.0,
          upper = input.maxFraction,
          tX = 0,
          tY = 0,
          tMat,
          tVec;
      tX = input.p1.x - transform.position.x;
      tY = input.p1.y - transform.position.y;
      tMat = transform.R;
      var p1X = (tX * tMat.col1.x + tY * tMat.col1.y),
          p1Y = (tX * tMat.col2.x + tY * tMat.col2.y);
      tX = input.p2.x - transform.position.x;
      tY = input.p2.y - transform.position.y;
      tMat = transform.R;
      var p2X = (tX * tMat.col1.x + tY * tMat.col1.y),
          p2Y = (tX * tMat.col2.x + tY * tMat.col2.y),
          dX = p2X - p1X,
          dY = p2Y - p1Y,
          index = -1;
      for (var i = 0; i < this.m_vertexCount; ++i) {
         tVec = this.m_vertices[i];
         tX = tVec.x - p1X;
         tY = tVec.y - p1Y;
         tVec = this.m_normals[i];
         var numerator = (tVec.x * tX + tVec.y * tY),
          denominator = (tVec.x * dX + tVec.y * dY);
         if (denominator === 0.0) {
            if (numerator < 0.0) {
               return false;
            }
         }
         else {
            if (denominator < 0.0 && numerator < lower * denominator) {
               lower = numerator / denominator;
               index = i;
            }
            else if (denominator > 0.0 && numerator < upper * denominator) {
               upper = numerator / denominator;
            }
         }
         if (upper < lower - b2Settings.b2_epsilon) {
            return false;
         }
      }
      if (index >= 0) {
         output.fraction = lower;
         tMat = transform.R;
         tVec = this.m_normals[index];
         output.normal.x = (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
         output.normal.y = (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
         return true;
      }
      return false;
   };

   /**
    * ComputeAABB
    *
    * @param aabb
    * @param xf
    *
    */
   b2PolygonShape.prototype.ComputeAABB = function (aabb, xf) {
      var tMat = xf.R,
          tVec = this.m_vertices[0],
          lowerX = xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y),
          lowerY = xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y),
          upperX = lowerX,
          upperY = lowerY;
      for (var i = 1; i < this.m_vertexCount; ++i) {
         tVec = this.m_vertices[i];
         var vX = xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y),
          vY = xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
         lowerX = lowerX < vX ? lowerX : vX;
         lowerY = lowerY < vY ? lowerY : vY;
         upperX = upperX > vX ? upperX : vX;
         upperY = upperY > vY ? upperY : vY;
      }
      aabb.lowerBound.x = lowerX - this.m_radius;
      aabb.lowerBound.y = lowerY - this.m_radius;
      aabb.upperBound.x = upperX + this.m_radius;
      aabb.upperBound.y = upperY + this.m_radius;
   };

   /**
    * ComputeMass
    *
    * @param massData
    * @param density
    *
    */
   b2PolygonShape.prototype.ComputeMass = function (massData, density) {
      if (this.m_vertexCount === 2) {
         massData.center.x = 0.5 * (this.m_vertices[0].x + this.m_vertices[1].x);
         massData.center.y = 0.5 * (this.m_vertices[0].y + this.m_vertices[1].y);
         massData.mass = 0.0;
         massData.I = 0.0;
         return;
      }
      var centerX = 0.0,
          centerY = 0.0,
          area = 0.0,
          I = 0.0,
          p1X = 0.0,
          p1Y = 0.0,
          k_inv3 = 1.0 / 3.0;
      for (var i = 0; i < this.m_vertexCount; ++i) {
         var p2 = this.m_vertices[i],
          p3 = i + 1 < this.m_vertexCount ? this.m_vertices[i + 1] : this.m_vertices[0],
          e1X = p2.x - p1X,
          e1Y = p2.y - p1Y,
          e2X = p3.x - p1X,
          e2Y = p3.y - p1Y,
          D = e1X * e2Y - e1Y * e2X,
          triangleArea = 0.5 * D;area += triangleArea;
         centerX += triangleArea * k_inv3 * (p1X + p2.x + p3.x);
         centerY += triangleArea * k_inv3 * (p1Y + p2.y + p3.y);
         var px = p1X,
          py = p1Y,
          ex1 = e1X,
          ey1 = e1Y,
          ex2 = e2X,
          ey2 = e2Y,
          intx2 = k_inv3 * (0.25 * (ex1 * ex1 + ex2 * ex1 + ex2 * ex2) + (px * ex1 + px * ex2)) + 0.5 * px * px,
          inty2 = k_inv3 * (0.25 * (ey1 * ey1 + ey2 * ey1 + ey2 * ey2) + (py * ey1 + py * ey2)) + 0.5 * py * py;I += D * (intx2 + inty2);
      }
      massData.mass = density * area;
      centerX *= 1.0 / area;
      centerY *= 1.0 / area;
      massData.center.Set(centerX, centerY);
      massData.I = density * I;
   };

   /**
    * ComputeSubmergedArea
    *
    * @param normal
    * @param offset
    * @param xf
    * @param c
    *
    */
   b2PolygonShape.prototype.ComputeSubmergedArea = function (normal, offset, xf, c) {
      var normalL = b2Math.MulTMV(xf.R, normal),
          offsetL = offset - b2Math.Dot(normal, xf.position),
          depths = [],
          diveCount = 0,
          intoIndex = -1,
          outoIndex = -1,
          lastSubmerged = false,
          i = 0;
      for (i = 0; i < this.m_vertexCount; ++i) {
         depths[i] = b2Math.Dot(normalL, this.m_vertices[i]) - offsetL;
         var isSubmerged = depths[i] < (-b2Settings.b2_epsilon);
         if (i > 0) {
            if (isSubmerged) {
               if (!lastSubmerged) {
                  intoIndex = i - 1;
                  diveCount++;
               }
            }
            else {
               if (lastSubmerged) {
                  outoIndex = i - 1;
                  diveCount++;
               }
            }
         }
         lastSubmerged = isSubmerged;
      }
      switch (diveCount) {
      case 0:
         if (lastSubmerged) {
            var md = new b2MassData();
            this.ComputeMass(md, 1);
            c.SetV(b2Math.MulX(xf, md.center));
            return md.mass;
         }
         else {
            return 0;
         }
         break;
      case 1:
         if (intoIndex === (-1)) {
            intoIndex = this.m_vertexCount - 1;
         }
         else {
            outoIndex = this.m_vertexCount - 1;
         }
         break;
      }
      var intoIndex2 = (intoIndex + 1) % this.m_vertexCount,
          outoIndex2 = (outoIndex + 1) % this.m_vertexCount,
          intoLamdda = (0 - depths[intoIndex]) / (depths[intoIndex2] - depths[intoIndex]),
          outoLamdda = (0 - depths[outoIndex]) / (depths[outoIndex2] - depths[outoIndex]),
          intoVec = new b2Vec2(this.m_vertices[intoIndex].x * (1 - intoLamdda) + this.m_vertices[intoIndex2].x * intoLamdda, this.m_vertices[intoIndex].y * (1 - intoLamdda) + this.m_vertices[intoIndex2].y * intoLamdda),
          outoVec = new b2Vec2(this.m_vertices[outoIndex].x * (1 - outoLamdda) + this.m_vertices[outoIndex2].x * outoLamdda, this.m_vertices[outoIndex].y * (1 - outoLamdda) + this.m_vertices[outoIndex2].y * outoLamdda),
          area = 0,
          center = new b2Vec2(0, 0),
          p2 = this.m_vertices[intoIndex2],
          p3;
      i = intoIndex2;
      while (i !== outoIndex2) {
         i = (i + 1) % this.m_vertexCount;
         if (i === outoIndex2) p3 = outoVec;
         else p3 = this.m_vertices[i];
         var triangleArea = 0.5 * ((p2.x - intoVec.x) * (p3.y - intoVec.y) - (p2.y - intoVec.y) * (p3.x - intoVec.x));
         area += triangleArea;
         center.x += triangleArea * (intoVec.x + p2.x + p3.x) / 3;
         center.y += triangleArea * (intoVec.y + p2.y + p3.y) / 3;
         p2 = p3;
      }
      center.Multiply(1 / area);
      c.SetV(b2Math.MulX(xf, center));
      return area;
   };

   /**
    * GetVertexCount
    *
    * @param 
    *
    */
   b2PolygonShape.prototype.GetVertexCount = function () {
      return this.m_vertexCount;
   };

   /**
    * GetVertices
    *
    * @param 
    *
    */
   b2PolygonShape.prototype.GetVertices = function () {
      return this.m_vertices;
   };

   /**
    * GetNormals
    *
    * @param 
    *
    */
   b2PolygonShape.prototype.GetNormals = function () {
      return this.m_normals;
   };

   /**
    * GetSupport
    *
    * @param d
    *
    */
   b2PolygonShape.prototype.GetSupport = function (d) {
      var bestIndex = 0,
          bestValue = this.m_vertices[0].x * d.x + this.m_vertices[0].y * d.y;
      for (var i = 1; i < this.m_vertexCount; ++i) {
         var value = this.m_vertices[i].x * d.x + this.m_vertices[i].y * d.y;
         if (value > bestValue) {
            bestIndex = i;
            bestValue = value;
         }
      }
      return bestIndex;
   };

   /**
    * GetSupportVertex
    *
    * @param d
    *
    */
   b2PolygonShape.prototype.GetSupportVertex = function (d) {
      var bestIndex = 0,
          bestValue = this.m_vertices[0].x * d.x + this.m_vertices[0].y * d.y;
      for (var i = 1; i < this.m_vertexCount; ++i) {
         var value = this.m_vertices[i].x * d.x + this.m_vertices[i].y * d.y;
         if (value > bestValue) {
            bestIndex = i;
            bestValue = value;
         }
      }
      return this.m_vertices[bestIndex];
   };

   /**
    * Validate
    *
    * @param 
    *
    */
   b2PolygonShape.prototype.Validate = function () {
      return false;
   };

   /**
    * Reserve
    *
    * @param count
    *
    */
   b2PolygonShape.prototype.Reserve = function (count) {
      for (var i = this.m_vertices.length; i < count; i++) {
         this.m_vertices[i] = new b2Vec2(0, 0);
         this.m_normals[i] = new b2Vec2(0, 0);
      }
   };



   /**
    *  Class b2EdgeChainDef
    *
    * @param 
    *
    */
   b2EdgeChainDef = Box2D.Collision.Shapes.b2EdgeChainDef = function b2EdgeChainDef() {

      this.vertexCount = 0;
      this.isALoop = true;
      this.vertices = [];
   };
   b2EdgeChainDef.constructor = b2EdgeChainDef;

   /**
    *  Class b2EdgeShape
    *
    * @param v1
    * @param v2
    *
    */
   b2EdgeShape = Box2D.Collision.Shapes.b2EdgeShape = function b2EdgeShape(v1, v2) {

      this.s_supportVec = new b2Vec2(0, 0);
      this.m_v1 = new b2Vec2(0, 0);
      this.m_v2 = new b2Vec2(0, 0);
      this.m_coreV1 = new b2Vec2(0, 0);
      this.m_coreV2 = new b2Vec2(0, 0);
      this.m_normal = new b2Vec2(0, 0);
      this.m_direction = new b2Vec2(0, 0);
      this.m_cornerDir1 = new b2Vec2(0, 0);
      this.m_cornerDir2 = new b2Vec2(0, 0);
      b2Shape.call(this);
      this.m_type = b2Shape.e_edgeShape;
      this.m_prevEdge = null;
      this.m_nextEdge = null;
      this.m_v1 = v1;
      this.m_v2 = v2;
      this.m_direction.Set(this.m_v2.x - this.m_v1.x, this.m_v2.y - this.m_v1.y);
      this.m_length = this.m_direction.Normalize();
      this.m_normal.Set(this.m_direction.y, (-this.m_direction.x));
      this.m_coreV1.Set((-b2Settings.b2_toiSlop * (this.m_normal.x - this.m_direction.x)) + this.m_v1.x, (-b2Settings.b2_toiSlop * (this.m_normal.y - this.m_direction.y)) + this.m_v1.y);
      this.m_coreV2.Set((-b2Settings.b2_toiSlop * (this.m_normal.x + this.m_direction.x)) + this.m_v2.x, (-b2Settings.b2_toiSlop * (this.m_normal.y + this.m_direction.y)) + this.m_v2.y);
      this.m_cornerDir1 = this.m_normal;
      this.m_cornerDir2.Set((-this.m_normal.x), (-this.m_normal.y));
   };
   b2EdgeShape.constructor = b2EdgeShape;
   b2EdgeShape.prototype = Object.create(b2Shape.prototype );

   /**
    * TestPoint
    *
    * @param transform
    * @param p
    *
    */
   b2EdgeShape.prototype.TestPoint = function (transform, p) {
      return false;
   };

   /**
    * RayCast
    *
    * @param output
    * @param input
    * @param transform
    *
    */
   b2EdgeShape.prototype.RayCast = function (output, input, transform) {
      var tMat,
          rX = input.p2.x - input.p1.x,
          rY = input.p2.y - input.p1.y;
      tMat = transform.R;
      var v1X = transform.position.x + (tMat.col1.x * this.m_v1.x + tMat.col2.x * this.m_v1.y),
          v1Y = transform.position.y + (tMat.col1.y * this.m_v1.x + tMat.col2.y * this.m_v1.y),
          nX = transform.position.y + (tMat.col1.y * this.m_v2.x + tMat.col2.y * this.m_v2.y) - v1Y,
          nY = (-(transform.position.x + (tMat.col1.x * this.m_v2.x + tMat.col2.x * this.m_v2.y) - v1X)),
          k_slop = 100.0 * b2Settings.b2_epsilon,
          denom = (-(rX * nX + rY * nY));
      if (denom > k_slop) {
         var bX = input.p1.x - v1X,
          bY = input.p1.y - v1Y,
          a = (bX * nX + bY * nY);
         if (0.0 <= a && a <= input.maxFraction * denom) {
            var mu2 = (-rX * bY) + rY * bX;
            if ((-k_slop * denom) <= mu2 && mu2 <= denom * (1.0 + k_slop)) {
               a /= denom;
               output.fraction = a;
               var nLen = Math.sqrt(nX * nX + nY * nY);
               output.normal.x = nX / nLen;
               output.normal.y = nY / nLen;
               return true;
            }
         }
      }
      return false;
   };

   /**
    * ComputeAABB
    *
    * @param aabb
    * @param transform
    *
    */
   b2EdgeShape.prototype.ComputeAABB = function (aabb, transform) {
      var tMat = transform.R,
          v1X = transform.position.x + (tMat.col1.x * this.m_v1.x + tMat.col2.x * this.m_v1.y),
          v1Y = transform.position.y + (tMat.col1.y * this.m_v1.x + tMat.col2.y * this.m_v1.y),
          v2X = transform.position.x + (tMat.col1.x * this.m_v2.x + tMat.col2.x * this.m_v2.y),
          v2Y = transform.position.y + (tMat.col1.y * this.m_v2.x + tMat.col2.y * this.m_v2.y);
      if (v1X < v2X) {
         aabb.lowerBound.x = v1X;
         aabb.upperBound.x = v2X;
      }
      else {
         aabb.lowerBound.x = v2X;
         aabb.upperBound.x = v1X;
      }
      if (v1Y < v2Y) {
         aabb.lowerBound.y = v1Y;
         aabb.upperBound.y = v2Y;
      }
      else {
         aabb.lowerBound.y = v2Y;
         aabb.upperBound.y = v1Y;
      }
   };

   /**
    * ComputeMass
    *
    * @param massData
    * @param density
    *
    */
   b2EdgeShape.prototype.ComputeMass = function (massData, density) {
      density = density || 0;
      massData.mass = 0;
      massData.center.SetV(this.m_v1);
      massData.I = 0;
   };

   /**
    * ComputeSubmergedArea
    *
    * @param normal
    * @param offset
    * @param xf
    * @param c
    *
    */
   b2EdgeShape.prototype.ComputeSubmergedArea = function (normal, offset, xf, c) {
      offset = offset || 0;
      var v0 = new b2Vec2(normal.x * offset, normal.y * offset),
          v1 = b2Math.MulX(xf, this.m_v1),
          v2 = b2Math.MulX(xf, this.m_v2),
          d1 = b2Math.Dot(normal, v1) - offset,
          d2 = b2Math.Dot(normal, v2) - offset;
      if (d1 > 0) {
         if (d2 > 0) {
            return 0;
         }
         else {
            v1.x = (-d2 / (d1 - d2) * v1.x) + d1 / (d1 - d2) * v2.x;
            v1.y = (-d2 / (d1 - d2) * v1.y) + d1 / (d1 - d2) * v2.y;
         }
      }
      else {
         if (d2 > 0) {
            v2.x = (-d2 / (d1 - d2) * v1.x) + d1 / (d1 - d2) * v2.x;
            v2.y = (-d2 / (d1 - d2) * v1.y) + d1 / (d1 - d2) * v2.y;
         }
         //else {}
      }
      c.x = (v0.x + v1.x + v2.x) / 3;
      c.y = (v0.y + v1.y + v2.y) / 3;
      return 0.5 * ((v1.x - v0.x) * (v2.y - v0.y) - (v1.y - v0.y) * (v2.x - v0.x));
   };

   /**
    * GetLength
    *
    * @param 
    *
    */
   b2EdgeShape.prototype.GetLength = function () {
      return this.m_length;
   };

   /**
    * GetVertex1
    *
    * @param 
    *
    */
   b2EdgeShape.prototype.GetVertex1 = function () {
      return this.m_v1;
   };

   /**
    * GetVertex2
    *
    * @param 
    *
    */
   b2EdgeShape.prototype.GetVertex2 = function () {
      return this.m_v2;
   };

   /**
    * GetCoreVertex1
    *
    * @param 
    *
    */
   b2EdgeShape.prototype.GetCoreVertex1 = function () {
      return this.m_coreV1;
   };

   /**
    * GetCoreVertex2
    *
    * @param 
    *
    */
   b2EdgeShape.prototype.GetCoreVertex2 = function () {
      return this.m_coreV2;
   };

   /**
    * GetNormalVector
    *
    * @param 
    *
    */
   b2EdgeShape.prototype.GetNormalVector = function () {
      return this.m_normal;
   };

   /**
    * GetDirectionVector
    *
    * @param 
    *
    */
   b2EdgeShape.prototype.GetDirectionVector = function () {
      return this.m_direction;
   };

   /**
    * GetCorner1Vector
    *
    * @param 
    *
    */
   b2EdgeShape.prototype.GetCorner1Vector = function () {
      return this.m_cornerDir1;
   };

   /**
    * GetCorner2Vector
    *
    * @param 
    *
    */
   b2EdgeShape.prototype.GetCorner2Vector = function () {
      return this.m_cornerDir2;
   };

   /**
    * Corner1IsConvex
    *
    * @param 
    *
    */
   b2EdgeShape.prototype.Corner1IsConvex = function () {
      return this.m_cornerConvex1;
   };

   /**
    * Corner2IsConvex
    *
    * @param 
    *
    */
   b2EdgeShape.prototype.Corner2IsConvex = function () {
      return this.m_cornerConvex2;
   };

   /**
    * GetFirstVertex
    *
    * @param xf
    *
    */
   b2EdgeShape.prototype.GetFirstVertex = function (xf) {
      var tMat = xf.R;
      return new b2Vec2(xf.position.x + (tMat.col1.x * this.m_coreV1.x + tMat.col2.x * this.m_coreV1.y), xf.position.y + (tMat.col1.y * this.m_coreV1.x + tMat.col2.y * this.m_coreV1.y));
   };

   /**
    * GetNextEdge
    *
    * @param 
    *
    */
   b2EdgeShape.prototype.GetNextEdge = function () {
      return this.m_nextEdge;
   };

   /**
    * GetPrevEdge
    *
    * @param 
    *
    */
   b2EdgeShape.prototype.GetPrevEdge = function () {
      return this.m_prevEdge;
   };

   /**
    * Support
    *
    * @param xf
    * @param dX
    * @param dY
    *
    */
   b2EdgeShape.prototype.Support = function (xf, dX, dY) {
      dX = dX || 0;
      dY = dY || 0;
      var tMat = xf.R,
          v1X = xf.position.x + (tMat.col1.x * this.m_coreV1.x + tMat.col2.x * this.m_coreV1.y),
          v1Y = xf.position.y + (tMat.col1.y * this.m_coreV1.x + tMat.col2.y * this.m_coreV1.y),
          v2X = xf.position.x + (tMat.col1.x * this.m_coreV2.x + tMat.col2.x * this.m_coreV2.y),
          v2Y = xf.position.y + (tMat.col1.y * this.m_coreV2.x + tMat.col2.y * this.m_coreV2.y);
      if ((v1X * dX + v1Y * dY) > (v2X * dX + v2Y * dY)) {
         this.s_supportVec.x = v1X;
         this.s_supportVec.y = v1Y;
      }
      else {
         this.s_supportVec.x = v2X;
         this.s_supportVec.y = v2Y;
      }
      return this.s_supportVec;
   };

   /**
    * SetPrevEdge
    *
    * @param edge
    * @param core
    * @param cornerDir
    * @param convex
    *
    */
   b2EdgeShape.prototype.SetPrevEdge = function (edge, core, cornerDir, convex) {
      this.m_prevEdge = edge;
      this.m_coreV1 = core;
      this.m_cornerDir1 = cornerDir;
      this.m_cornerConvex1 = convex;
   };

   /**
    * SetNextEdge
    *
    * @param edge
    * @param core
    * @param cornerDir
    * @param convex
    *
    */
   b2EdgeShape.prototype.SetNextEdge = function (edge, core, cornerDir, convex) {
      this.m_nextEdge = edge;
      this.m_coreV2 = core;
      this.m_cornerDir2 = cornerDir;
      this.m_cornerConvex2 = convex;
   };

   /**
    * Copy
    *
    * @param 
    *
    */
   b2EdgeShape.prototype.Copy = function () {
      return null;
   };

   /**
    * Set
    *
    * @param other
    *
    */
   //b2EdgeShape.prototype.Set = function (other) {
   //   this.m_radius = other.m_radius;
   //};



   /**
    *  Class b2MassData
    *
    * @param 
    *
    */
   b2MassData = Box2D.Collision.Shapes.b2MassData = function b2MassData() {
      this.mass = 0.0;
      this.center = new b2Vec2(0, 0);
      this.I = 0.0;

   };
   b2MassData.constructor = b2MassData;

   /**
    *  Class Features
    *
    * @param 
    *
    */
   Features = Box2D.Collision.Features = function Features() {};
   Features.constructor = Features;
   Features.prototype = {
       _m_id            : null,
       _referenceEdge   : 0,
       _incidentEdge    : 0,
       _incidentVertex  : 0,
       _flip            : 0

   };

   Object.defineProperties(Features.prototype, {
       referenceEdge: {
           enumerable: false,
           configurable: true,
           get: function () { return this._referenceEdge;},
           set: function (value) {
               this._referenceEdge = value;
               this._m_id.key = (this._m_id.key & 0xffffff00) | (this._referenceEdge & 0x000000ff);
           }
       },
       incidentEdge: {
           enumerable: false,
           configurable: true,
           get: function () { return this._incidentEdge;},
           set: function (value) {
               this._incidentEdge = value;
               this._m_id.key = (this._m_id.key & 0xffff00ff) | ((this._incidentEdge << 8) & 0x0000ff00);
           }
       },
       incidentVertex: {
           enumerable: false,
           configurable: true,
           get: function () { return this._incidentVertex;},
           set: function (value) {
               this._incidentVertex = value;
               this._m_id.key = (this._m_id.key & 0xff00ffff) | ((this._incidentVertex << 16) & 0x00ff0000);
           }
       },
       flip: {
           enumerable: false,
           configurable: true,
           get: function () { return this._flip;},
           set: function (value) {
               this._flip = value;
               this._m_id.key = (this._m_id.key & 0x00ffffff) | ((this._flip << 24) & 0xff000000);
           }
       }
   });



   /**
    *  Class b2ContactID
    *
    * @param 
    *
    */
   b2ContactID = Box2D.Collision.b2ContactID = function b2ContactID() {
      this.features = new Features();
      this.features._m_id = this;
   };
   b2ContactID.constructor = b2ContactID;
   b2ContactID.prototype._key = 0;
   b2ContactID.prototype.features = null;


   /**
    * Set
    *
    * @param id
    *
    */
   b2ContactID.prototype.Set = function (id) {
      this.key = id._key;
   };

   /**
    * Copy
    *
    * @param 
    *
    */
   b2ContactID.prototype.Copy = function () {
      var id = new b2ContactID();
      id.key = this.key;
      return id;
   };

   Object.defineProperties(b2ContactID.prototype, {
       key: {
           enumerable: false,
           configurable: true,
           get: function () { return this._key;},
           set: function (value) {
               this._key = value;
               this.features._referenceEdge = this._key & 0x000000ff;
               this.features._incidentEdge = ((this._key & 0x0000ff00) >> 8) & 0x000000ff;
               this.features._incidentVertex = ((this._key & 0x00ff0000) >> 16) & 0x000000ff;
               this.features._flip = ((this._key & 0xff000000) >> 24) & 0x000000ff;
           }
       }
   });



   /**
    *  Class ClipVertex
    *
    * @param 
    *
    */
   ClipVertex = Box2D.Collision.ClipVertex = function ClipVertex() {
      this.v = new b2Vec2(0, 0);
      this.id = new b2ContactID();

   };
   ClipVertex.constructor = ClipVertex;

   ClipVertex.prototype.v = null;
   ClipVertex.prototype.id = null;

   /**
    * Set
    *
    * @param other
    *
    */
   ClipVertex.prototype.Set = function (other) {
      this.v.SetV(other.v);
      this.id.Set(other.id);
   };

   /**
    *  Class b2AABB
    *
    * @param 
    *
    */
   b2AABB = Box2D.Collision.b2AABB = function b2AABB() {
      this.lowerBound = new b2Vec2(0, 0);
      this.upperBound = new b2Vec2(0, 0);

   };
   b2AABB.constructor = b2AABB;
   b2AABB.prototype.lowerBound = null;
   b2AABB.prototype.upperBound = null;

   /**
    * Static Combine
    *
    * @param aabb1
    * @param aabb2
    *
    */
   b2AABB.Combine = function (aabb1, aabb2) {
      var aabb = new b2AABB();
      aabb.Combine(aabb1, aabb2);
      return aabb;
   };

   /**
    * IsValid
    *
    * @param 
    *
    */
   b2AABB.prototype.IsValid = function () {
      var dX = this.upperBound.x - this.lowerBound.x,
          dY = this.upperBound.y - this.lowerBound.y,
          valid = dX >= 0.0 && dY >= 0.0;
      valid = valid && this.lowerBound.IsValid() && this.upperBound.IsValid();
      return valid;
   };

   /**
    * GetCenter
    *
    * @param 
    *
    */
   b2AABB.prototype.GetCenter = function () {
      return new b2Vec2((this.lowerBound.x + this.upperBound.x) / 2, (this.lowerBound.y + this.upperBound.y) / 2);
   };

   /**
    * GetExtents
    *
    * @param 
    *
    */
   b2AABB.prototype.GetExtents = function () {
      return new b2Vec2((this.upperBound.x - this.lowerBound.x) / 2, (this.upperBound.y - this.lowerBound.y) / 2);
   };

   /**
    * Contains
    *
    * @param aabb
    *
    */
   b2AABB.prototype.Contains = function (aabb) {
      var result = true;
      result = result && this.lowerBound.x <= aabb.lowerBound.x;
      result = result && this.lowerBound.y <= aabb.lowerBound.y;
      result = result && aabb.upperBound.x <= this.upperBound.x;
      result = result && aabb.upperBound.y <= this.upperBound.y;
      return result;
   };

   /**
    * RayCast
    *
    * @param output
    * @param input
    *
    */
   b2AABB.prototype.RayCast = function (output, input) {
      var tmin = (-b2Settings.b2_maxFloat),
          tmax = b2Settings.b2_maxFloat,
          pX = input.p1.x,
          pY = input.p1.y,
          dX = input.p2.x - input.p1.x,
          dY = input.p2.y - input.p1.y,
          absDX = Math.abs(dX),
          absDY = Math.abs(dY),
          normal = output.normal,
          inv_d = 0,
          t1 = 0,
          t2 = 0,
          t3 = 0;
      var s = 0; {
         if (absDX < b2Settings.b2_epsilon) {
            if (pX < this.lowerBound.x || this.upperBound.x < pX) return false;
         }
         else {
            inv_d = 1.0 / dX;
            t1 = (this.lowerBound.x - pX) * inv_d;
            t2 = (this.upperBound.x - pX) * inv_d;
            s = (-1.0);
            if (t1 > t2) {
               t3 = t1;
               t1 = t2;
               t2 = t3;
               s = 1.0;
            }
            if (t1 > tmin) {
               normal.x = s;
               normal.y = 0;
               tmin = t1;
            }
            tmax = Math.min(tmax, t2);
            if (tmin > tmax) return false;
         }
      } {
         if (absDY < b2Settings.b2_epsilon) {
            if (pY < this.lowerBound.y || this.upperBound.y < pY) return false;
         }
         else {
            inv_d = 1.0 / dY;
            t1 = (this.lowerBound.y - pY) * inv_d;
            t2 = (this.upperBound.y - pY) * inv_d;
            s = (-1.0);
            if (t1 > t2) {
               t3 = t1;
               t1 = t2;
               t2 = t3;
               s = 1.0;
            }
            if (t1 > tmin) {
               normal.y = s;
               normal.x = 0;
               tmin = t1;
            }
            tmax = Math.min(tmax, t2);
            if (tmin > tmax) return false;
         }
      }
      output.fraction = tmin;
      return true;
   };

   /**
    * TestOverlap
    *
    * @param other
    *
    */
   b2AABB.prototype.TestOverlap = function (other) {
      var d1X = other.lowerBound.x - this.upperBound.x,
          d1Y = other.lowerBound.y - this.upperBound.y,
          d2X = this.lowerBound.x - other.upperBound.x,
          d2Y = this.lowerBound.y - other.upperBound.y;
      if (d1X > 0.0 || d1Y > 0.0) return false;
      if (d2X > 0.0 || d2Y > 0.0) return false;
      return true;
   };

   /**
    * Combine
    *
    * @param aabb1
    * @param aabb2
    *
    */
   b2AABB.prototype.Combine = function (aabb1, aabb2) {
      this.lowerBound.x = Math.min(aabb1.lowerBound.x, aabb2.lowerBound.x);
      this.lowerBound.y = Math.min(aabb1.lowerBound.y, aabb2.lowerBound.y);
      this.upperBound.x = Math.max(aabb1.upperBound.x, aabb2.upperBound.x);
      this.upperBound.y = Math.max(aabb1.upperBound.y, aabb2.upperBound.y);
   };

   /**
    *  Class b2SimplexCache
    *
    * @param 
    *
    */
   b2SimplexCache = Box2D.Collision.b2SimplexCache = function b2SimplexCache() {
      this.indexA = [0, 0, 0];
      this.indexB = [0, 0, 0];

   };
   b2SimplexCache.constructor = b2SimplexCache;
   b2SimplexCache.prototype.indexA = null;
   b2SimplexCache.prototype.indexB = null;



   /**
    *  Class b2Bound
    *
    * @param 
    *
    */
   b2Bound = Box2D.Collision.b2Bound = function b2Bound() {};

   b2Bound.constructor = b2Bound;
   b2Bound.prototype.value = 0;
   b2Bound.prototype.proxy = null;
   b2Bound.prototype.stabbingCount = 0;

   /**
    * IsLower
    *
    * @param 
    *
    */
   b2Bound.prototype.IsLower = function () {
      return (this.value & 1) === 0;
   };

   /**
    * IsUpper
    *
    * @param 
    *
    */
   b2Bound.prototype.IsUpper = function () {
      return (this.value & 1) === 1;
   };

   /**
    * Swap
    *
    * @param b
    *
    */
   b2Bound.prototype.Swap = function (b) {
      var tempValue = this.value,
          tempProxy = this.proxy,
          tempStabbingCount = this.stabbingCount;
      this.value = b.value;
      this.proxy = b.proxy;
      this.stabbingCount = b.stabbingCount;
      b.value = tempValue;
      b.proxy = tempProxy;
      b.stabbingCount = tempStabbingCount;
   };

   /**
    *  Class b2BoundValues
    *
    * @param 
    *
    */
   b2BoundValues = Box2D.Collision.b2BoundValues = function b2BoundValues() {

      this.lowerValues = [];
      this.lowerValues[0] = 0.0;
      this.lowerValues[1] = 0.0;
      this.upperValues = [];
      this.upperValues[0] = 0.0;
      this.upperValues[1] = 0.0;
   };
   b2BoundValues.constructor = b2BoundValues;
   b2BoundValues.prototype.lowerValues = null;
   b2BoundValues.prototype.upperValues = null;


   /**
    *  Class b2ManifoldPoint
    *
    * @param 
    *
    */
   b2ManifoldPoint = Box2D.Collision.b2ManifoldPoint = function b2ManifoldPoint() {
      this.m_localPoint = new b2Vec2(0, 0);
      this.m_id = new b2ContactID();
      this.Reset();
   };
   b2ManifoldPoint.constructor = b2ManifoldPoint;
   b2ManifoldPoint.prototype.m_localPoint          = null;
   b2ManifoldPoint.prototype.m_id                  = null;
   b2ManifoldPoint.prototype.m_localPoint          = null;
   b2ManifoldPoint.prototype.m_normalImpulse       = 0.0;
   b2ManifoldPoint.prototype.m_tangentImpulse      = 0.0;


   /**
    * Reset
    *
    * @param 
    *
    */
   b2ManifoldPoint.prototype.Reset = function () {
      this.m_localPoint.SetZero();
      this.m_normalImpulse = 0.0;
      this.m_tangentImpulse = 0.0;
      this.m_id.key = 0;
   };

   /**
    * Set
    *
    * @param m
    *
    */
   b2ManifoldPoint.prototype.Set = function (m) {
      this.m_localPoint.SetV(m.m_localPoint);
      this.m_normalImpulse = m.m_normalImpulse;
      this.m_tangentImpulse = m.m_tangentImpulse;
      this.m_id.Set(m.m_id);
   };

   /**
    *  Class b2Manifold
    *
    * @param 
    *
    */
   b2Manifold = Box2D.Collision.b2Manifold = function b2Manifold() {
      this.m_pointCount = 0;

      this.m_points = [];
      for (var i = 0; i < b2Settings.b2_maxManifoldPoints; i++) {
         this.m_points.push(new b2ManifoldPoint());
      }


      this.m_localPlaneNormal = new b2Vec2(0, 0);
      this.m_localPoint = new b2Vec2(0, 0);
   };
   b2Manifold.constructor = b2Manifold;

   b2Manifold.e_circles = 0x0001;
   b2Manifold.e_faceA = 0x0002;
   b2Manifold.e_faceB = 0x0004;

   b2Manifold.prototype.m_type                = 0;
   b2Manifold.prototype.m_pointCount          = 0;
   b2Manifold.prototype.m_points              = null;
   b2Manifold.prototype.m_localPlaneNormal    = null;
   b2Manifold.prototype.m_localPoint          = null;


   /**
    * Reset
    *
    * @param 
    *
    */
   b2Manifold.prototype.Reset = function () {
      for (var i = 0; i < b2Settings.b2_maxManifoldPoints; i++) {
         ((this.m_points[i] instanceof b2ManifoldPoint ? this.m_points[i] : null)).Reset();
      }
      this.m_localPlaneNormal.SetZero();
      this.m_localPoint.SetZero();
      this.m_type = 0;
      this.m_pointCount = 0;
   };

   /**
    * Set
    *
    * @param m
    *
    */
   b2Manifold.prototype.Set = function (m) {
      this.m_pointCount = m.m_pointCount;
      for (var i = 0; i < b2Settings.b2_maxManifoldPoints; i++) {
         ((this.m_points[i] instanceof b2ManifoldPoint ? this.m_points[i] : null)).Set(m.m_points[i]);
      }
      this.m_localPlaneNormal.SetV(m.m_localPlaneNormal);
      this.m_localPoint.SetV(m.m_localPoint);
      this.m_type = m.m_type;
   };

   /**
    * Copy
    *
    * @param 
    *
    */
   b2Manifold.prototype.Copy = function () {
      var copy = new b2Manifold();
      copy.Set(this);
      return copy;
   };

   /**
    *  Class b2Collision
    *
    * @param 
    *
    */
   b2Collision = Box2D.Collision.b2Collision = function b2Collision() {


   };
   b2Collision.constructor = b2Collision;

   b2Collision.s_edgeAO = [0];
   b2Collision.s_edgeBO = [0];
   b2Collision.s_localTangent = new b2Vec2(0, 0);
   b2Collision.s_localNormal = new b2Vec2(0, 0);
   b2Collision.s_planePoint = new b2Vec2(0, 0);
   b2Collision.s_normal = new b2Vec2(0, 0);
   b2Collision.s_tangent = new b2Vec2(0, 0);
   b2Collision.s_tangent2 = new b2Vec2(0, 0);
   b2Collision.s_v11 = new b2Vec2(0, 0);
   b2Collision.s_v12 = new b2Vec2(0, 0);
   b2Collision.b2CollidePolyTempVec = new b2Vec2(0, 0);
   b2Collision.b2_nullFeature = 0x000000ff;

   /**
    * Static ClipSegmentToLine
    *
    * @param vOut
    * @param vIn
    * @param normal
    * @param offset
    *
    */
   b2Collision.ClipSegmentToLine = function (vOut, vIn, normal, offset) {
      offset = offset || 0;
      var cv,
          numOut = 0;
      cv = vIn[0];
      var vIn0 = cv.v;
      cv = vIn[1];
      var vIn1 = cv.v,
          distance0 = normal.x * vIn0.x + normal.y * vIn0.y - offset,
          distance1 = normal.x * vIn1.x + normal.y * vIn1.y - offset;
      if (distance0 <= 0.0) vOut[numOut++].Set(vIn[0]);
      if (distance1 <= 0.0) vOut[numOut++].Set(vIn[1]);
      if (distance0 * distance1 < 0.0) {
         var interp = distance0 / (distance0 - distance1);
         cv = vOut[numOut];
         var tVec = cv.v;
         tVec.x = vIn0.x + interp * (vIn1.x - vIn0.x);
         tVec.y = vIn0.y + interp * (vIn1.y - vIn0.y);
         cv = vOut[numOut];
         var cv2;
         if (distance0 > 0.0) {
            cv2 = vIn[0];
            cv.id = cv2.id;
         }
         else {
            cv2 = vIn[1];
            cv.id = cv2.id;
         }++numOut;
      }
      return numOut;
   };

   /**
    * Static EdgeSeparation
    *
    * @param poly1
    * @param xf1
    * @param edge1
    * @param poly2
    * @param xf2
    *
    */
   b2Collision.EdgeSeparation = function (poly1, xf1, edge1, poly2, xf2) {
      edge1 = edge1 || 0;
      var vertices1 = poly1.m_vertices,
          normals1 = poly1.m_normals,
          count2 = poly2.m_vertexCount,
          vertices2 = poly2.m_vertices,
          tMat,
          tVec;
      tMat = xf1.R;
      tVec = normals1[edge1];
      var normal1WorldX = (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y),
          normal1WorldY = (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      tMat = xf2.R;
      var normal1X = (tMat.col1.x * normal1WorldX + tMat.col1.y * normal1WorldY),
          normal1Y = (tMat.col2.x * normal1WorldX + tMat.col2.y * normal1WorldY),
          index = 0,
          minDot = b2Settings.b2_maxFloat;
      for (var i = 0; i < count2; ++i) {
         tVec = vertices2[i];
         var dot = tVec.x * normal1X + tVec.y * normal1Y;
         if (dot < minDot) {
            minDot = dot;
            index = i;
         }
      }
      tVec = vertices1[edge1];
      tMat = xf1.R;
      var v1X = xf1.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y),
          v1Y = xf1.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      tVec = vertices2[index];
      tMat = xf2.R;
      var v2X = xf2.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y),
          v2Y = xf2.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      v2X -= v1X;
      v2Y -= v1Y;
      return v2X * normal1WorldX + v2Y * normal1WorldY;
   };

   /**
    * Static FindMaxSeparation
    *
    * @param edgeIndex
    * @param poly1
    * @param xf1
    * @param poly2
    * @param xf2
    *
    */
   b2Collision.FindMaxSeparation = function (edgeIndex, poly1, xf1, poly2, xf2) {
      var count1 = poly1.m_vertexCount,
          normals1 = poly1.m_normals,
          tVec,
          tMat;
      tMat = xf2.R;
      tVec = poly2.m_centroid;
      var dX = xf2.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y),
          dY = xf2.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      tMat = xf1.R;
      tVec = poly1.m_centroid;
      dX -= xf1.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      dY -= xf1.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      var dLocal1X = (dX * xf1.R.col1.x + dY * xf1.R.col1.y),
          dLocal1Y = (dX * xf1.R.col2.x + dY * xf1.R.col2.y),
          edge = 0,
          maxDot = (-b2Settings.b2_maxFloat);
      for (var i = 0; i < count1; ++i) {
         tVec = normals1[i];
         var dot = (tVec.x * dLocal1X + tVec.y * dLocal1Y);
         if (dot > maxDot) {
            maxDot = dot;
            edge = i;
         }
      }
      var s = b2Collision.EdgeSeparation(poly1, xf1, edge, poly2, xf2),
          prevEdge = edge - 1 >= 0 ? edge - 1 : count1 - 1,
          sPrev = b2Collision.EdgeSeparation(poly1, xf1, prevEdge, poly2, xf2),
          nextEdge = edge + 1 < count1 ? edge + 1 : 0,
          sNext = b2Collision.EdgeSeparation(poly1, xf1, nextEdge, poly2, xf2),
          bestEdge = 0,
          bestSeparation = 0,
          increment = 0;
      if (sPrev > s && sPrev > sNext) {
         increment = (-1);
         bestEdge = prevEdge;
         bestSeparation = sPrev;
      }
      else if (sNext > s) {
         increment = 1;
         bestEdge = nextEdge;
         bestSeparation = sNext;
      }
      else {
         edgeIndex[0] = edge;
         return s;
      }
      while (true) {
         if (increment === (-1)) edge = bestEdge - 1 >= 0 ? bestEdge - 1 : count1 - 1;
         else edge = bestEdge + 1 < count1 ? bestEdge + 1 : 0;s = b2Collision.EdgeSeparation(poly1, xf1, edge, poly2, xf2);
         if (s > bestSeparation) {
            bestEdge = edge;
            bestSeparation = s;
         }
         else {
            break;
         }
      }
      edgeIndex[0] = bestEdge;
      return bestSeparation;
   };

   /**
    * Static FindIncidentEdge
    *
    * @param c
    * @param poly1
    * @param xf1
    * @param edge1
    * @param poly2
    * @param xf2
    *
    */
   b2Collision.FindIncidentEdge = function (c, poly1, xf1, edge1, poly2, xf2) {
      edge1 = edge1 || 0;
      var normals1 = poly1.m_normals,
          count2 = poly2.m_vertexCount,
          vertices2 = poly2.m_vertices,
          normals2 = poly2.m_normals,
          tMat,
          tVec;
      tMat = xf1.R;
      tVec = normals1[edge1];
      var normal1X = (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y),
          normal1Y = (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      tMat = xf2.R;
      var tX = (tMat.col1.x * normal1X + tMat.col1.y * normal1Y);
      normal1Y = (tMat.col2.x * normal1X + tMat.col2.y * normal1Y);
      normal1X = tX;
      var index = 0,
          minDot = b2Settings.b2_maxFloat;
      for (var i = 0; i < count2; ++i) {
         tVec = normals2[i];
         var dot = (normal1X * tVec.x + normal1Y * tVec.y);
         if (dot < minDot) {
            minDot = dot;
            index = i;
         }
      }
      var tClip,
          i1 = index,
          i2 = i1 + 1 < count2 ? i1 + 1 : 0;
      tClip = c[0];
      tVec = vertices2[i1];
      tMat = xf2.R;
      tClip.v.x = xf2.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      tClip.v.y = xf2.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      tClip.id.features.referenceEdge = edge1;
      tClip.id.features.incidentEdge = i1;
      tClip.id.features.incidentVertex = 0;
      tClip = c[1];
      tVec = vertices2[i2];
      tMat = xf2.R;
      tClip.v.x = xf2.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      tClip.v.y = xf2.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      tClip.id.features.referenceEdge = edge1;
      tClip.id.features.incidentEdge = i2;
      tClip.id.features.incidentVertex = 1;
   };

   /**
    * Static MakeClipPointVector
    *
    * @param 
    *
    */
   b2Collision.MakeClipPointVector = function () {
      return [new ClipVertex(), new ClipVertex()];
   };

   /**
    * Static CollidePolygons
    *
    * @param manifold
    * @param polyA
    * @param xfA
    * @param polyB
    * @param xfB
    *
    */
   b2Collision.CollidePolygons = function (manifold, polyA, xfA, polyB, xfB) {
      var cv;
      manifold.m_pointCount = 0;
      var totalRadius = polyA.m_radius + polyB.m_radius,
          edgeA = 0;
      b2Collision.s_edgeAO[0] = edgeA;
      var separationA = b2Collision.FindMaxSeparation(b2Collision.s_edgeAO, polyA, xfA, polyB, xfB);
      edgeA = b2Collision.s_edgeAO[0];
      if (separationA > totalRadius) return;
      var edgeB = 0;
      b2Collision.s_edgeBO[0] = edgeB;
      var separationB = b2Collision.FindMaxSeparation(b2Collision.s_edgeBO, polyB, xfB, polyA, xfA);
      edgeB = b2Collision.s_edgeBO[0];
      if (separationB > totalRadius) return;
      var poly1,
          poly2,
          xf1,
          xf2,
          edge1 = 0,
          flip = 0,
          k_relativeTol = 0.98,
          k_absoluteTol = 0.001,
          tMat;
      if (separationB > k_relativeTol * separationA + k_absoluteTol) {
         poly1 = polyB;
         poly2 = polyA;
         xf1 = xfB;
         xf2 = xfA;
         edge1 = edgeB;
         manifold.m_type = b2Manifold.e_faceB;
         flip = 1;
      }
      else {
         poly1 = polyA;
         poly2 = polyB;
         xf1 = xfA;
         xf2 = xfB;
         edge1 = edgeA;
         manifold.m_type = b2Manifold.e_faceA;
         flip = 0;
      }
      var incidentEdge = b2Collision.s_incidentEdge;
      b2Collision.FindIncidentEdge(incidentEdge, poly1, xf1, edge1, poly2, xf2);
      var count1 = poly1.m_vertexCount,
          vertices1 = poly1.m_vertices,
          local_v11 = vertices1[edge1],
          local_v12;
      if (edge1 + 1 < count1) {
         local_v12 = vertices1[edge1 + 1];
      }
      else {
         local_v12 = vertices1[0];
      }
      var localTangent = b2Collision.s_localTangent;
      localTangent.Set(local_v12.x - local_v11.x, local_v12.y - local_v11.y);
      localTangent.Normalize();
      var localNormal = b2Collision.s_localNormal;
      localNormal.x = localTangent.y;
      localNormal.y = (-localTangent.x);
      var planePoint = b2Collision.s_planePoint;
      planePoint.Set(0.5 * (local_v11.x + local_v12.x), 0.5 * (local_v11.y + local_v12.y));
      var tangent = b2Collision.s_tangent;
      tMat = xf1.R;
      tangent.x = (tMat.col1.x * localTangent.x + tMat.col2.x * localTangent.y);
      tangent.y = (tMat.col1.y * localTangent.x + tMat.col2.y * localTangent.y);
      var tangent2 = b2Collision.s_tangent2;
      tangent2.x = (-tangent.x);
      tangent2.y = (-tangent.y);
      var normal = b2Collision.s_normal;
      normal.x = tangent.y;
      normal.y = (-tangent.x);
      var v11 = b2Collision.s_v11,
          v12 = b2Collision.s_v12;
      v11.x = xf1.position.x + (tMat.col1.x * local_v11.x + tMat.col2.x * local_v11.y);
      v11.y = xf1.position.y + (tMat.col1.y * local_v11.x + tMat.col2.y * local_v11.y);
      v12.x = xf1.position.x + (tMat.col1.x * local_v12.x + tMat.col2.x * local_v12.y);
      v12.y = xf1.position.y + (tMat.col1.y * local_v12.x + tMat.col2.y * local_v12.y);
      var frontOffset = normal.x * v11.x + normal.y * v11.y,
          sideOffset1 = (-tangent.x * v11.x) - tangent.y * v11.y + totalRadius,
          sideOffset2 = tangent.x * v12.x + tangent.y * v12.y + totalRadius,
          clipPoints1 = b2Collision.s_clipPoints1,
          clipPoints2 = b2Collision.s_clipPoints2,
          np = 0;
      np = b2Collision.ClipSegmentToLine(clipPoints1, incidentEdge, tangent2, sideOffset1);
      if (np < 2) return;
      np = b2Collision.ClipSegmentToLine(clipPoints2, clipPoints1, tangent, sideOffset2);
      if (np < 2) return;
      manifold.m_localPlaneNormal.SetV(localNormal);
      manifold.m_localPoint.SetV(planePoint);
      var pointCount = 0;
      for (var i = 0; i < b2Settings.b2_maxManifoldPoints; ++i) {
         cv = clipPoints2[i];
         var separation = normal.x * cv.v.x + normal.y * cv.v.y - frontOffset;
         if (separation <= totalRadius) {
            var cp = manifold.m_points[pointCount];
            tMat = xf2.R;
            var tX = cv.v.x - xf2.position.x,
          tY = cv.v.y - xf2.position.y;
            cp.m_localPoint.x = (tX * tMat.col1.x + tY * tMat.col1.y);
            cp.m_localPoint.y = (tX * tMat.col2.x + tY * tMat.col2.y);
            cp.m_id.Set(cv.id);
            cp.m_id.features.flip = flip;
            ++pointCount;
         }
      }
      manifold.m_pointCount = pointCount;
   };

   /**
    * Static CollideCircles
    *
    * @param manifold
    * @param circle1
    * @param xf1
    * @param circle2
    * @param xf2
    *
    */
   b2Collision.CollideCircles = function (manifold, circle1, xf1, circle2, xf2) {
      manifold.m_pointCount = 0;
      var tMat,
          tVec;
      tMat = xf1.R;
      tVec = circle1.m_p;
      var p1X = xf1.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y),
          p1Y = xf1.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      tMat = xf2.R;
      tVec = circle2.m_p;
      var p2X = xf2.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y),
          p2Y = xf2.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y),
          dX = p2X - p1X,
          dY = p2Y - p1Y,
          distSqr = dX * dX + dY * dY,
          radius = circle1.m_radius + circle2.m_radius;
      if (distSqr > radius * radius) {
         return;
      }
      manifold.m_type = b2Manifold.e_circles;
      manifold.m_localPoint.SetV(circle1.m_p);
      manifold.m_localPlaneNormal.SetZero();
      manifold.m_pointCount = 1;
      manifold.m_points[0].m_localPoint.SetV(circle2.m_p);
      manifold.m_points[0].m_id.key = 0;
   };

   /**
    * Static CollidePolygonAndCircle
    *
    * @param manifold
    * @param polygon
    * @param xf1
    * @param circle
    * @param xf2
    *
    */
   b2Collision.CollidePolygonAndCircle = function (manifold, polygon, xf1, circle, xf2) {
      manifold.m_pointCount = 0;
      var tPoint,
          dX = 0,
          dY = 0,
          positionX = 0,
          positionY = 0,
          tVec,
          tMat;
      tMat = xf2.R;
      tVec = circle.m_p;
      var cX = xf2.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y),
          cY = xf2.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      dX = cX - xf1.position.x;
      dY = cY - xf1.position.y;
      tMat = xf1.R;
      var cLocalX = (dX * tMat.col1.x + dY * tMat.col1.y),
          cLocalY = (dX * tMat.col2.x + dY * tMat.col2.y),
          dist = 0,
          normalIndex = 0,
          separation = (-b2Settings.b2_maxFloat),
          radius = polygon.m_radius + circle.m_radius,
          vertexCount = polygon.m_vertexCount,
          vertices = polygon.m_vertices,
          normals = polygon.m_normals;
      for (var i = 0; i < vertexCount; ++i) {
         tVec = vertices[i];
         dX = cLocalX - tVec.x;
         dY = cLocalY - tVec.y;
         tVec = normals[i];
         var s = tVec.x * dX + tVec.y * dY;
         if (s > radius) {
            return;
         }
         if (s > separation) {
            separation = s;
            normalIndex = i;
         }
      }
      var vertIndex1 = normalIndex,
          vertIndex2 = vertIndex1 + 1 < vertexCount ? vertIndex1 + 1 : 0,
          v1 = vertices[vertIndex1],
          v2 = vertices[vertIndex2];
      if (separation < b2Settings.b2_epsilon) {
         manifold.m_pointCount = 1;
         manifold.m_type = b2Manifold.e_faceA;
         manifold.m_localPlaneNormal.SetV(normals[normalIndex]);
         manifold.m_localPoint.x = 0.5 * (v1.x + v2.x);
         manifold.m_localPoint.y = 0.5 * (v1.y + v2.y);
         manifold.m_points[0].m_localPoint.SetV(circle.m_p);
         manifold.m_points[0].m_id.key = 0;
         return;
      }
      var u1 = (cLocalX - v1.x) * (v2.x - v1.x) + (cLocalY - v1.y) * (v2.y - v1.y),
          u2 = (cLocalX - v2.x) * (v1.x - v2.x) + (cLocalY - v2.y) * (v1.y - v2.y);
      if (u1 <= 0.0) {
         if ((cLocalX - v1.x) * (cLocalX - v1.x) + (cLocalY - v1.y) * (cLocalY - v1.y) > radius * radius) return;
         manifold.m_pointCount = 1;
         manifold.m_type = b2Manifold.e_faceA;
         manifold.m_localPlaneNormal.x = cLocalX - v1.x;
         manifold.m_localPlaneNormal.y = cLocalY - v1.y;
         manifold.m_localPlaneNormal.Normalize();
         manifold.m_localPoint.SetV(v1);
         manifold.m_points[0].m_localPoint.SetV(circle.m_p);
         manifold.m_points[0].m_id.key = 0;
      }
      else if (u2 <= 0) {
         if ((cLocalX - v2.x) * (cLocalX - v2.x) + (cLocalY - v2.y) * (cLocalY - v2.y) > radius * radius) return;
         manifold.m_pointCount = 1;
         manifold.m_type = b2Manifold.e_faceA;
         manifold.m_localPlaneNormal.x = cLocalX - v2.x;
         manifold.m_localPlaneNormal.y = cLocalY - v2.y;
         manifold.m_localPlaneNormal.Normalize();
         manifold.m_localPoint.SetV(v2);
         manifold.m_points[0].m_localPoint.SetV(circle.m_p);
         manifold.m_points[0].m_id.key = 0;
      }
      else {
         var faceCenterX = 0.5 * (v1.x + v2.x),
          faceCenterY = 0.5 * (v1.y + v2.y);
         separation = (cLocalX - faceCenterX) * normals[vertIndex1].x + (cLocalY - faceCenterY) * normals[vertIndex1].y;
         if (separation > radius) return;
         manifold.m_pointCount = 1;
         manifold.m_type = b2Manifold.e_faceA;
         manifold.m_localPlaneNormal.x = normals[vertIndex1].x;
         manifold.m_localPlaneNormal.y = normals[vertIndex1].y;
         manifold.m_localPlaneNormal.Normalize();
         manifold.m_localPoint.Set(faceCenterX, faceCenterY);
         manifold.m_points[0].m_localPoint.SetV(circle.m_p);
         manifold.m_points[0].m_id.key = 0;
      }
   };

   /**
    * Static TestOverlap
    *
    * @param a
    * @param b
    *
    */
   b2Collision.TestOverlap = function (a, b) {
      var t1 = b.lowerBound,
          t2 = a.upperBound,
          d1X = t1.x - t2.x,
          d1Y = t1.y - t2.y;
      t1 = a.lowerBound;
      t2 = b.upperBound;
      var d2X = t1.x - t2.x,
          d2Y = t1.y - t2.y;
      if (d1X > 0.0 || d1Y > 0.0) return false;
      if (d2X > 0.0 || d2Y > 0.0) return false;
      return true;
   };
   b2Collision.s_clipPoints2 = b2Collision.MakeClipPointVector();
   b2Collision.s_clipPoints1 = b2Collision.MakeClipPointVector();
   b2Collision.s_incidentEdge = b2Collision.MakeClipPointVector();

   /**
    *  Class b2ContactPoint
    *
    * @param 
    *
    */
   b2ContactPoint = Box2D.Collision.b2ContactPoint = function b2ContactPoint() {
      this.position = new b2Vec2(0, 0);
      this.velocity = new b2Vec2(0, 0);
      this.normal = new b2Vec2(0, 0);
      this.id = new b2ContactID();

   };
   b2ContactPoint.constructor = b2ContactPoint;

   b2ContactPoint.prototype.position = null;
   b2ContactPoint.prototype.velocity = null;
   b2ContactPoint.prototype.normal = null;
   b2ContactPoint.prototype.id = null;

   /**
    *  Class b2SimplexVertex
    *
    * @param 
    *
    */
   b2SimplexVertex = Box2D.Collision.b2SimplexVertex = function b2SimplexVertex() {};
   b2SimplexVertex.constructor = b2SimplexVertex;

   b2SimplexVertex.prototype.wA = null;
   b2SimplexVertex.prototype.wB = null;
   b2SimplexVertex.prototype.w = null;
   b2SimplexVertex.prototype.a = null;
   b2SimplexVertex.prototype.indexA = null;
   b2SimplexVertex.prototype.indexB = null;
   /**
    * Set
    *
    * @param other
    *
    */
   b2SimplexVertex.prototype.Set = function (other) {
      this.wA.SetV(other.wA);
      this.wB.SetV(other.wB);
      this.w.SetV(other.w);
      this.a = other.a;
      this.indexA = other.indexA;
      this.indexB = other.indexB;
   };

   /**
    *  Class b2Simplex
    *
    * @param 
    *
    */
   b2Simplex = Box2D.Collision.b2Simplex = function b2Simplex() {
      this.m_v1 = new b2SimplexVertex();
      this.m_v2 = new b2SimplexVertex();
      this.m_v3 = new b2SimplexVertex();

      this.m_vertices = [this.m_v1, this.m_v2, this.m_v3];
   };
   b2Simplex.constructor = b2Simplex;

   b2Simplex.prototype.m_v1              = null;
   b2Simplex.prototype.m_v2              = null;
   b2Simplex.prototype.m_v3              = null;
   b2Simplex.prototype.m_vertices        = null;
   b2Simplex.prototype.m_count           = 0;


   /**
    * ReadCache
    *
    * @param cache
    * @param proxyA
    * @param transformA
    * @param proxyB
    * @param transformB
    *
    */
   b2Simplex.prototype.ReadCache = function (cache, proxyA, transformA, proxyB, transformB) {
      b2Assert(0 <= cache.count && cache.count <= 3);
      var wALocal,
          wBLocal;
      this.m_count = cache.count;
      var vertices = this.m_vertices;
      for (var i = 0; i < this.m_count; i++) {
         var v = vertices[i];
         v.indexA = cache.indexA[i];
         v.indexB = cache.indexB[i];
         wALocal = proxyA.GetVertex(v.indexA);
         wBLocal = proxyB.GetVertex(v.indexB);
         v.wA = b2Math.MulX(transformA, wALocal);
         v.wB = b2Math.MulX(transformB, wBLocal);
         v.w = b2Math.SubtractVV(v.wB, v.wA);
         v.a = 0;
      }
      if (this.m_count > 1) {
         var metric1 = cache.metric,
          metric2 = this.GetMetric();
         if (metric2 < 0.5 * metric1 || 2.0 * metric1 < metric2 || metric2 < b2Settings.b2_epsilon) {
            this.m_count = 0;
         }
      }
      if (this.m_count === 0) {
         v = vertices[0];
         v.indexA = 0;
         v.indexB = 0;
         wALocal = proxyA.GetVertex(0);
         wBLocal = proxyB.GetVertex(0);
         v.wA = b2Math.MulX(transformA, wALocal);
         v.wB = b2Math.MulX(transformB, wBLocal);
         v.w = b2Math.SubtractVV(v.wB, v.wA);
         this.m_count = 1;
      }
   };

   /**
    * WriteCache
    *
    * @param cache
    *
    */
   b2Simplex.prototype.WriteCache = function (cache) {
      cache.metric = this.GetMetric();
      cache.count = Math.abs(this.m_count);
      var vertices = this.m_vertices;
      for (var i = 0; i < this.m_count; i++) {
         cache.indexA[i] = Math.abs(vertices[i].indexA);
         cache.indexB[i] = Math.abs(vertices[i].indexB);
      }
   };

   /**
    * GetSearchDirection
    *
    * @param 
    *
    */
   b2Simplex.prototype.GetSearchDirection = function () {
      switch (this.m_count) {
      case 1:
         return this.m_v1.w.GetNegative();
      case 2:
         {
            var e12 = b2Math.SubtractVV(this.m_v2.w, this.m_v1.w),
          sgn = b2Math.CrossVV(e12, this.m_v1.w.GetNegative());
            if (sgn > 0.0) {
               return b2Math.CrossFV(1.0, e12);
            }
            else {
               return b2Math.CrossVF(e12, 1.0);
            }
         }
      default:
         b2Assert(false);
         return new b2Vec2(0, 0);
      }
   };

   /**
    * GetClosestPoint
    *
    * @param 
    *
    */
   b2Simplex.prototype.GetClosestPoint = function () {
      switch (this.m_count) {
      case 0:
         b2Assert(false);
         return new b2Vec2(0, 0);
      case 1:
         return this.m_v1.w;
      case 2:
         return new b2Vec2(this.m_v1.a * this.m_v1.w.x + this.m_v2.a * this.m_v2.w.x, this.m_v1.a * this.m_v1.w.y + this.m_v2.a * this.m_v2.w.y);
      default:
         b2Assert(false);
         return new b2Vec2(0, 0);
      }
   };

   /**
    * GetWitnessPoints
    *
    * @param pA
    * @param pB
    *
    */
   b2Simplex.prototype.GetWitnessPoints = function (pA, pB) {
      switch (this.m_count) {
      case 0:
         b2Assert(false);
         break;
      case 1:
         pA.SetV(this.m_v1.wA);
         pB.SetV(this.m_v1.wB);
         break;
      case 2:
         pA.x = this.m_v1.a * this.m_v1.wA.x + this.m_v2.a * this.m_v2.wA.x;
         pA.y = this.m_v1.a * this.m_v1.wA.y + this.m_v2.a * this.m_v2.wA.y;
         pB.x = this.m_v1.a * this.m_v1.wB.x + this.m_v2.a * this.m_v2.wB.x;
         pB.y = this.m_v1.a * this.m_v1.wB.y + this.m_v2.a * this.m_v2.wB.y;
         break;
      case 3:
         pB.x = pA.x = this.m_v1.a * this.m_v1.wA.x + this.m_v2.a * this.m_v2.wA.x + this.m_v3.a * this.m_v3.wA.x;
         pB.y = pA.y = this.m_v1.a * this.m_v1.wA.y + this.m_v2.a * this.m_v2.wA.y + this.m_v3.a * this.m_v3.wA.y;
         break;
      default:
         b2Assert(false);
         break;
      }
   };

   /**
    * GetMetric
    *
    * @param 
    *
    */
   b2Simplex.prototype.GetMetric = function () {
      switch (this.m_count) {
      case 0:
         b2Assert(false);
         return 0.0;
      case 1:
         return 0.0;
      case 2:
         return b2Math.SubtractVV(this.m_v1.w, this.m_v2.w).Length();
      case 3:
         return b2Math.CrossVV(b2Math.SubtractVV(this.m_v2.w, this.m_v1.w), b2Math.SubtractVV(this.m_v3.w, this.m_v1.w));
      default:
         b2Assert(false);
         return 0.0;
      }
   };

   /**
    * Solve2
    *
    * @param 
    *
    */
   b2Simplex.prototype.Solve2 = function () {
      var w1 = this.m_v1.w,
          w2 = this.m_v2.w,
          e12 = b2Math.SubtractVV(w2, w1),
          d12_2 = (-(w1.x * e12.x + w1.y * e12.y));
      if (d12_2 <= 0.0) {
         this.m_v1.a = 1.0;
         this.m_count = 1;
         return;
      }
      var d12_1 = (w2.x * e12.x + w2.y * e12.y);
      if (d12_1 <= 0.0) {
         this.m_v2.a = 1.0;
         this.m_count = 1;
         this.m_v1.Set(this.m_v2);
         return;
      }
      var inv_d12 = 1.0 / (d12_1 + d12_2);
      this.m_v1.a = d12_1 * inv_d12;
      this.m_v2.a = d12_2 * inv_d12;
      this.m_count = 2;
   };

   /**
    * Solve3
    *
    * @param 
    *
    */
   b2Simplex.prototype.Solve3 = function () {
      var w1 = this.m_v1.w,
          w2 = this.m_v2.w,
          w3 = this.m_v3.w,
          e12 = b2Math.SubtractVV(w2, w1),
          w1e12 = b2Math.Dot(w1, e12),
          w2e12 = b2Math.Dot(w2, e12),
          d12_1 = w2e12,
          d12_2 = (-w1e12),
          e13 = b2Math.SubtractVV(w3, w1),
          w1e13 = b2Math.Dot(w1, e13),
          w3e13 = b2Math.Dot(w3, e13),
          d13_1 = w3e13,
          d13_2 = (-w1e13),
          e23 = b2Math.SubtractVV(w3, w2),
          w2e23 = b2Math.Dot(w2, e23),
          w3e23 = b2Math.Dot(w3, e23),
          d23_1 = w3e23,
          d23_2 = (-w2e23),
          n123 = b2Math.CrossVV(e12, e13),
          d123_1 = n123 * b2Math.CrossVV(w2, w3),
          d123_2 = n123 * b2Math.CrossVV(w3, w1),
          d123_3 = n123 * b2Math.CrossVV(w1, w2);
      if (d12_2 <= 0.0 && d13_2 <= 0.0) {
         this.m_v1.a = 1.0;
         this.m_count = 1;
         return;
      }
      if (d12_1 > 0.0 && d12_2 > 0.0 && d123_3 <= 0.0) {
         var inv_d12 = 1.0 / (d12_1 + d12_2);
         this.m_v1.a = d12_1 * inv_d12;
         this.m_v2.a = d12_2 * inv_d12;
         this.m_count = 2;
         return;
      }
      if (d13_1 > 0.0 && d13_2 > 0.0 && d123_2 <= 0.0) {
         var inv_d13 = 1.0 / (d13_1 + d13_2);
         this.m_v1.a = d13_1 * inv_d13;
         this.m_v3.a = d13_2 * inv_d13;
         this.m_count = 2;
         this.m_v2.Set(this.m_v3);
         return;
      }
      if (d12_1 <= 0.0 && d23_2 <= 0.0) {
         this.m_v2.a = 1.0;
         this.m_count = 1;
         this.m_v1.Set(this.m_v2);
         return;
      }
      if (d13_1 <= 0.0 && d23_1 <= 0.0) {
         this.m_v3.a = 1.0;
         this.m_count = 1;
         this.m_v1.Set(this.m_v3);
         return;
      }
      if (d23_1 > 0.0 && d23_2 > 0.0 && d123_1 <= 0.0) {
         var inv_d23 = 1.0 / (d23_1 + d23_2);
         this.m_v2.a = d23_1 * inv_d23;
         this.m_v3.a = d23_2 * inv_d23;
         this.m_count = 2;
         this.m_v1.Set(this.m_v3);
         return;
      }
      var inv_d123 = 1.0 / (d123_1 + d123_2 + d123_3);
      this.m_v1.a = d123_1 * inv_d123;
      this.m_v2.a = d123_2 * inv_d123;
      this.m_v3.a = d123_3 * inv_d123;
      this.m_count = 3;
   };

   /**
    *  Class b2Distance
    *
    * @param 
    *
    */
   b2Distance = Box2D.Collision.b2Distance = function b2Distance() {};
   b2Distance.constructor = b2Distance;

   b2Distance.s_simplex = new b2Simplex();
   b2Distance.s_saveA = [0, 0, 0];
   b2Distance.s_saveB = [0, 0, 0];

   /**
    * Static Distance
    *
    * @param output
    * @param cache
    * @param input
    *
    */
   b2Distance.Distance = function (output, cache, input) {
      //++b2Distance.b2_gjkCalls;
      var proxyA = input.proxyA,
          proxyB = input.proxyB,
          transformA = input.transformA,
          transformB = input.transformB,
          simplex = b2Distance.s_simplex;
      simplex.ReadCache(cache, proxyA, transformA, proxyB, transformB);
      var vertices = simplex.m_vertices,
          k_maxIters = 20,
          saveA = b2Distance.s_saveA,
          saveB = b2Distance.s_saveB,
          saveCount = 0,
          closestPoint = simplex.GetClosestPoint(),
          distanceSqr1 = closestPoint.LengthSquared(),
          distanceSqr2 = distanceSqr1,
          i = 0,
          p,
          iter = 0;
      while (iter < k_maxIters) {
         saveCount = simplex.m_count;
         for (i = 0; i < saveCount; i++) {
            saveA[i] = vertices[i].indexA;
            saveB[i] = vertices[i].indexB;
         }
         switch (simplex.m_count) {
         case 1:
            break;
         case 2:
            simplex.Solve2();
            break;
         case 3:
            simplex.Solve3();
            break;
         default:
            b2Assert(false);
         }
         if (simplex.m_count === 3) {
            break;
         }
         p = simplex.GetClosestPoint();
         distanceSqr2 = p.LengthSquared();
         if (distanceSqr2 > distanceSqr1) {
             //break;
         }
         distanceSqr1 = distanceSqr2;
         var d = simplex.GetSearchDirection();
         if (d.LengthSquared() < b2Settings.b2_epsilon * b2Settings.b2_epsilon) {
            break;
         }
         var vertex = vertices[simplex.m_count];
         vertex.indexA = proxyA.GetSupport(b2Math.MulTMV(transformA.R, d.GetNegative()));
         vertex.wA = b2Math.MulX(transformA, proxyA.GetVertex(vertex.indexA));
         vertex.indexB = proxyB.GetSupport(b2Math.MulTMV(transformB.R, d));
         vertex.wB = b2Math.MulX(transformB, proxyB.GetVertex(vertex.indexB));
         vertex.w = b2Math.SubtractVV(vertex.wB, vertex.wA);
         ++iter;
         ++b2Distance.b2_gjkIters;
         var duplicate = false;
         for (i = 0; i < saveCount; i++) {
            if (vertex.indexA === saveA[i] && vertex.indexB === saveB[i]) {
               duplicate = true;
               break;
            }
         }
         if (duplicate) {
            break;
         }++simplex.m_count;
      }
      b2Distance.b2_gjkMaxIters = b2Math.Max(b2Distance.b2_gjkMaxIters, iter);
      simplex.GetWitnessPoints(output.pointA, output.pointB);
      output.distance = b2Math.SubtractVV(output.pointA, output.pointB).Length();
      output.iterations = iter;
      simplex.WriteCache(cache);
      if (input.useRadii) {
         var rA = proxyA.m_radius,
          rB = proxyB.m_radius;
         if (output.distance > rA + rB && output.distance > b2Settings.b2_epsilon) {
            output.distance -= rA + rB;
            var normal = b2Math.SubtractVV(output.pointB, output.pointA);
            normal.Normalize();
            output.pointA.x += rA * normal.x;
            output.pointA.y += rA * normal.y;
            output.pointB.x -= rB * normal.x;
            output.pointB.y -= rB * normal.y;
         }
         else {
            p = new b2Vec2(0, 0);
            p.x = .5 * (output.pointA.x + output.pointB.x);
            p.y = .5 * (output.pointA.y + output.pointB.y);
            output.pointA.x = output.pointB.x = p.x;
            output.pointA.y = output.pointB.y = p.y;
            output.distance = 0.0;
         }
      }
   };

   /**
    *  Class b2DistanceInput
    *
    * @param 
    *
    */
   b2DistanceInput = Box2D.Collision.b2DistanceInput = function b2DistanceInput() {};
   b2DistanceInput.constructor = b2DistanceInput;

   /**
    *  Class b2DistanceOutput
    *
    * @param 
    *
    */
   b2DistanceOutput = Box2D.Collision.b2DistanceOutput = function b2DistanceOutput() {
      this.pointA = new b2Vec2(0, 0);
      this.pointB = new b2Vec2(0, 0);

   };
   b2DistanceOutput.constructor = b2DistanceOutput;
   b2DistanceOutput.prototype.pointA = null;
   b2DistanceOutput.prototype.pointB = null;


   /**
    *  Class b2DistanceProxy
    *
    * @param 
    *
    */
   b2DistanceProxy = Box2D.Collision.b2DistanceProxy = function b2DistanceProxy() {}
   ;
   b2DistanceProxy.constructor = b2DistanceProxy;
   b2DistanceProxy.prototype.m_vertices = null;
   b2DistanceProxy.prototype.m_count = 0;
   b2DistanceProxy.prototype.m_radius = 0;

   /**
    * Set
    *
    * @param shape
    *
    */
   b2DistanceProxy.prototype.Set = function (shape) {
      switch (shape.GetType()) {
      case b2Shape.e_circleShape:
         {
            var circle = (shape instanceof b2CircleShape ? shape : null);
            this.m_vertices = [true];
            this.m_vertices[0] = circle.m_p;
            this.m_count = 1;
            this.m_radius = circle.m_radius;
         }
         break;
      case b2Shape.e_polygonShape:
         {
            var polygon = (shape instanceof b2PolygonShape ? shape : null);
            this.m_vertices = polygon.m_vertices;
            this.m_count = polygon.m_vertexCount;
            this.m_radius = polygon.m_radius;
         }
         break;
      default:
         b2Assert(false);
      }
   };

   /**
    * GetSupport
    *
    * @param d
    *
    */
   b2DistanceProxy.prototype.GetSupport = function (d) {
      var bestIndex = 0,
          bestValue = this.m_vertices[0].x * d.x + this.m_vertices[0].y * d.y;
      for (var i = 1; i < this.m_count; ++i) {
         var value = this.m_vertices[i].x * d.x + this.m_vertices[i].y * d.y;
         if (value > bestValue) {
            bestIndex = i;
            bestValue = value;
         }
      }
      return bestIndex;
   };

   /**
    * GetSupportVertex
    *
    * @param d
    *
    */
   b2DistanceProxy.prototype.GetSupportVertex = function (d) {
      var bestIndex = 0,
          bestValue = this.m_vertices[0].x * d.x + this.m_vertices[0].y * d.y;
      for (var i = 1; i < this.m_count; ++i) {
         var value = this.m_vertices[i].x * d.x + this.m_vertices[i].y * d.y;
         if (value > bestValue) {
            bestIndex = i;
            bestValue = value;
         }
      }
      return this.m_vertices[bestIndex];
   };

   /**
    * GetVertexCount
    *
    * @param 
    *
    */
   b2DistanceProxy.prototype.GetVertexCount = function () {
      return this.m_count;
   };

   /**
    * GetVertex
    *
    * @param index
    *
    */
   b2DistanceProxy.prototype.GetVertex = function (index) {
      index = index || 0;
      b2Assert(0 <= index && index < this.m_count);
      return this.m_vertices[index];
   };

   /**
    *  Class b2DynamicTreeNode
    *
    * @param 
    *
    */
   b2DynamicTreeNode = Box2D.Collision.b2DynamicTreeNode = function b2DynamicTreeNode() {
      this.aabb = new b2AABB();

   };
   b2DynamicTreeNode.constructor = b2DynamicTreeNode;
   b2DynamicTreeNode.prototype.aabb = null;
   b2DynamicTreeNode.prototype.child1 = null;

   /**
    * IsLeaf
    *
    * @param 
    *
    */
   b2DynamicTreeNode.prototype.IsLeaf = function () {
      return this.child1 == null;
   };

   /**
    *  Class b2DynamicTree
    *
    * @param 
    *
    */
   b2DynamicTree = Box2D.Collision.b2DynamicTree = function b2DynamicTree() {

      this.m_root = null;
      this.m_freeList = null;
      this.m_path = 0;
      this.m_insertionCount = 0;
   };
   b2DynamicTree.constructor = b2DynamicTree;
   b2DynamicTree.prototype.m_root = null;
   b2DynamicTree.prototype.m_freeList = null;
   b2DynamicTree.prototype.m_path = 0;
   b2DynamicTree.prototype.m_insertionCount = 0;


   /**
    * CreateProxy
    *
    * @param aabb
    * @param userData
    *
    */
   b2DynamicTree.prototype.CreateProxy = function (aabb, userData) {
      var node = this.AllocateNode(),
          extendX = b2Settings.b2_aabbExtension,
          extendY = b2Settings.b2_aabbExtension;
      node.aabb.lowerBound.x = aabb.lowerBound.x - extendX;
      node.aabb.lowerBound.y = aabb.lowerBound.y - extendY;
      node.aabb.upperBound.x = aabb.upperBound.x + extendX;
      node.aabb.upperBound.y = aabb.upperBound.y + extendY;
      node.userData = userData;
      this.InsertLeaf(node);
      return node;
   };

   /**
    * DestroyProxy
    *
    * @param proxy
    *
    */
   b2DynamicTree.prototype.DestroyProxy = function (proxy) {
      this.RemoveLeaf(proxy);
      this.FreeNode(proxy);
   };

   /**
    * MoveProxy
    *
    * @param proxy
    * @param aabb
    * @param displacement
    *
    */
   b2DynamicTree.prototype.MoveProxy = function (proxy, aabb, displacement) {
      b2Assert(proxy.IsLeaf());
      if (proxy.aabb.Contains(aabb)) {
         return false;
      }
      this.RemoveLeaf(proxy);
      var extendX = b2Settings.b2_aabbExtension + b2Settings.b2_aabbMultiplier * (displacement.x > 0 ? displacement.x : (-displacement.x)),
          extendY = b2Settings.b2_aabbExtension + b2Settings.b2_aabbMultiplier * (displacement.y > 0 ? displacement.y : (-displacement.y));
      proxy.aabb.lowerBound.x = aabb.lowerBound.x - extendX;
      proxy.aabb.lowerBound.y = aabb.lowerBound.y - extendY;
      proxy.aabb.upperBound.x = aabb.upperBound.x + extendX;
      proxy.aabb.upperBound.y = aabb.upperBound.y + extendY;
      this.InsertLeaf(proxy);
      return true;
   };

   /**
    * Rebalance
    *
    * @param iterations
    *
    */
   b2DynamicTree.prototype.Rebalance = function (iterations) {
      iterations = iterations || 0;
      if (this.m_root == null) return;
      for (var i = 0; i < iterations; i++) {
         var node = this.m_root,
          bit = 0;
         while (node.IsLeaf() === false) {
            node = (this.m_path >> bit) & 1 ? node.child2 : node.child1;
            bit = (bit + 1) & 31;
         }++this.m_path;
         this.RemoveLeaf(node);
         this.InsertLeaf(node);
      }
   };

   /**
    * GetFatAABB
    *
    * @param proxy
    *
    */
   b2DynamicTree.prototype.GetFatAABB = function (proxy) {
      return proxy.aabb;
   };

   /**
    * GetUserData
    *
    * @param proxy
    *
    */
   b2DynamicTree.prototype.GetUserData = function (proxy) {
      return proxy.userData;
   };

   /**
    * Query
    *
    * @param callback
    * @param aabb
    *
    */
   b2DynamicTree.prototype.Query = function (callback, aabb) {
      if (this.m_root == null) return;
      var stack = [],
          count = 0;
      stack[count++] = this.m_root;
      while (count > 0) {
         var node = stack[--count];
         if (node.aabb.TestOverlap(aabb)) {
            if (node.IsLeaf()) {
               var proceed = callback(node);
               if (!proceed) return;
            }
            else {
               stack[count++] = node.child1;
               stack[count++] = node.child2;
            }
         }
      }
   };

   /**
    * RayCast
    *
    * @param callback
    * @param input
    *
    */
   b2DynamicTree.prototype.RayCast = function (callback, input) {
      if (this.m_root == null) return;
      var p1 = input.p1,
          p2 = input.p2,
          r = b2Math.SubtractVV(p1, p2);
      r.Normalize();
      var v = b2Math.CrossFV(1.0, r),
          abs_v = b2Math.AbsV(v),
          maxFraction = input.maxFraction,
          segmentAABB = new b2AABB(),
          tX = 0;
      var tY = 0; {
         tX = p1.x + maxFraction * (p2.x - p1.x);
         tY = p1.y + maxFraction * (p2.y - p1.y);
         segmentAABB.lowerBound.x = Math.min(p1.x, tX);
         segmentAABB.lowerBound.y = Math.min(p1.y, tY);
         segmentAABB.upperBound.x = Math.max(p1.x, tX);
         segmentAABB.upperBound.y = Math.max(p1.y, tY);
      }
      var stack = [],
          count = 0;
      stack[count++] = this.m_root;
      while (count > 0) {
         var node = stack[--count];
         if (node.aabb.TestOverlap(segmentAABB) === false) {
            continue;
         }
         var c = node.aabb.GetCenter(),
          h = node.aabb.GetExtents(),
          separation = Math.abs(v.x * (p1.x - c.x) + v.y * (p1.y - c.y)) - abs_v.x * h.x - abs_v.y * h.y;
         if (separation > 0.0) continue;
         if (node.IsLeaf()) {
            var subInput = new b2RayCastInput();
            subInput.p1 = input.p1;
            subInput.p2 = input.p2;
            subInput.maxFraction = input.maxFraction;
            maxFraction = callback(subInput, node);
            if (maxFraction === 0.0) return;
            if (maxFraction > 0.0) {
               tX = p1.x + maxFraction * (p2.x - p1.x);
               tY = p1.y + maxFraction * (p2.y - p1.y);
               segmentAABB.lowerBound.x = Math.min(p1.x, tX);
               segmentAABB.lowerBound.y = Math.min(p1.y, tY);
               segmentAABB.upperBound.x = Math.max(p1.x, tX);
               segmentAABB.upperBound.y = Math.max(p1.y, tY);
            }
         }
         else {
            stack[count++] = node.child1;
            stack[count++] = node.child2;
         }
      }
   };

   /**
    * AllocateNode
    *
    * @param 
    *
    */
   b2DynamicTree.prototype.AllocateNode = function () {
      if (this.m_freeList) {
         var node = this.m_freeList;
         this.m_freeList = node.parent;
         node.parent = null;
         node.child1 = null;
         node.child2 = null;
         return node;
      }
      return new b2DynamicTreeNode();
   };

   /**
    * FreeNode
    *
    * @param node
    *
    */
   b2DynamicTree.prototype.FreeNode = function (node) {
      node.parent = this.m_freeList;
      this.m_freeList = node;
   };

   /**
    * InsertLeaf
    *
    * @param leaf
    *
    */
   b2DynamicTree.prototype.InsertLeaf = function (leaf) {
      ++this.m_insertionCount;
      if (this.m_root == null) {
         this.m_root = leaf;
         this.m_root.parent = null;
         return;
      }
      var center = leaf.aabb.GetCenter(),
          sibling = this.m_root;
      if (sibling.IsLeaf() === false) {
         do {
            var child1 = sibling.child1,
          child2 = sibling.child2,
          norm1 = Math.abs((child1.aabb.lowerBound.x + child1.aabb.upperBound.x) / 2 - center.x) + Math.abs((child1.aabb.lowerBound.y + child1.aabb.upperBound.y) / 2 - center.y),
          norm2 = Math.abs((child2.aabb.lowerBound.x + child2.aabb.upperBound.x) / 2 - center.x) + Math.abs((child2.aabb.lowerBound.y + child2.aabb.upperBound.y) / 2 - center.y);
            if (norm1 < norm2) {
               sibling = child1;
            }
            else {
               sibling = child2;
            }
         }
         while (sibling.IsLeaf() === false)
      }
      var node1 = sibling.parent,
          node2 = this.AllocateNode();
      node2.parent = node1;
      node2.userData = null;
      node2.aabb.Combine(leaf.aabb, sibling.aabb);
      if (node1) {
         if (sibling.parent.child1 === sibling) {
            node1.child1 = node2;
         }
         else {
            node1.child2 = node2;
         }
         node2.child1 = sibling;
         node2.child2 = leaf;
         sibling.parent = node2;
         leaf.parent = node2;
         do {
            if (node1.aabb.Contains(node2.aabb)) break;
            node1.aabb.Combine(node1.child1.aabb, node1.child2.aabb);
            node2 = node1;
            node1 = node1.parent;
         }
         while (node1)
      }
      else {
         node2.child1 = sibling;
         node2.child2 = leaf;
         sibling.parent = node2;
         leaf.parent = node2;
         this.m_root = node2;
      }
   };

   /**
    * RemoveLeaf
    *
    * @param leaf
    *
    */
   b2DynamicTree.prototype.RemoveLeaf = function (leaf) {
      if (leaf === this.m_root) {
         this.m_root = null;
         return;
      }
      var node2 = leaf.parent,
          node1 = node2.parent,
          sibling;
      if (node2.child1 === leaf) {
         sibling = node2.child2;
      }
      else {
         sibling = node2.child1;
      }
      if (node1) {
         if (node1.child1 === node2) {
            node1.child1 = sibling;
         }
         else {
            node1.child2 = sibling;
         }
         sibling.parent = node1;
         this.FreeNode(node2);
         while (node1) {
            var oldAABB = node1.aabb;
            node1.aabb = b2AABB.Combine(node1.child1.aabb, node1.child2.aabb);
            if (oldAABB.Contains(node1.aabb)) break;
            node1 = node1.parent;
         }
      }
      else {
         this.m_root = sibling;
         sibling.parent = null;
         this.FreeNode(node2);
      }
   };

   /**
    *  Class b2DynamicTreePair
    *
    * @param 
    *
    */
   b2DynamicTreePair = Box2D.Collision.b2DynamicTreePair = function b2DynamicTreePair() {};
   b2DynamicTreePair.constructor = b2DynamicTreePair;

   /**
    *  Class b2DynamicTreeBroadPhase
    *
    * @param 
    *
    */
   b2DynamicTreeBroadPhase = Box2D.Collision.b2DynamicTreeBroadPhase = function b2DynamicTreeBroadPhase() {
      this.m_tree = new b2DynamicTree();
      this.m_moveBuffer = [];
      this.m_pairBuffer = [];
      this.m_pairCount = 0;

   };
   b2DynamicTreeBroadPhase.constructor = b2DynamicTreeBroadPhase;
   b2DynamicTreeBroadPhase.prototype.m_tree = null;
   b2DynamicTreeBroadPhase.prototype.m_moveBuffer = null;
   b2DynamicTreeBroadPhase.prototype.m_pairBuffer = null;
   b2DynamicTreeBroadPhase.prototype.m_pairCount = null;

   /**
    * CreateProxy
    *
    * @param aabb
    * @param userData
    *
    */
   b2DynamicTreeBroadPhase.prototype.CreateProxy = function (aabb, userData) {
      var proxy = this.m_tree.CreateProxy(aabb, userData);
      ++this.m_proxyCount;
      this.BufferMove(proxy);
      return proxy;
   };

   /**
    * DestroyProxy
    *
    * @param proxy
    *
    */
   b2DynamicTreeBroadPhase.prototype.DestroyProxy = function (proxy) {
      this.UnBufferMove(proxy);
      --this.m_proxyCount;
      this.m_tree.DestroyProxy(proxy);
   };

   /**
    * MoveProxy
    *
    * @param proxy
    * @param aabb
    * @param displacement
    *
    */
   b2DynamicTreeBroadPhase.prototype.MoveProxy = function (proxy, aabb, displacement) {
      var buffer = this.m_tree.MoveProxy(proxy, aabb, displacement);
      if (buffer) {
         this.BufferMove(proxy);
      }
   };

   /**
    * TestOverlap
    *
    * @param proxyA
    * @param proxyB
    *
    */
   b2DynamicTreeBroadPhase.prototype.TestOverlap = function (proxyA, proxyB) {
      var aabbA = this.m_tree.GetFatAABB(proxyA),
          aabbB = this.m_tree.GetFatAABB(proxyB);
      return aabbA.TestOverlap(aabbB);
   };

   /**
    * GetUserData
    *
    * @param proxy
    *
    */
   b2DynamicTreeBroadPhase.prototype.GetUserData = function (proxy) {
      return this.m_tree.GetUserData(proxy);
   };

   /**
    * GetFatAABB
    *
    * @param proxy
    *
    */
   b2DynamicTreeBroadPhase.prototype.GetFatAABB = function (proxy) {
      return this.m_tree.GetFatAABB(proxy);
   };

   /**
    * GetProxyCount
    *
    * @param 
    *
    */
   b2DynamicTreeBroadPhase.prototype.GetProxyCount = function () {
      return this.m_proxyCount;
   };

   /**
    * UpdatePairs
    *
    * @param callback
    *
    */
   b2DynamicTreeBroadPhase.prototype.UpdatePairs = function (callback) {
      var __this = this;
      __this.m_pairCount = 0;
      var i = 0,
         queryProxy;

       function QueryCallback(proxy) {
           if (proxy === queryProxy) return true;
           if (__this.m_pairCount === __this.m_pairBuffer.length) {
               __this.m_pairBuffer[__this.m_pairCount] = new b2DynamicTreePair();
           }
           var pair = __this.m_pairBuffer[__this.m_pairCount];
           pair.proxyA = proxy < queryProxy ? proxy : queryProxy;
           pair.proxyB = proxy >= queryProxy ? proxy : queryProxy;++__this.m_pairCount;
           return true;
       }

      for (i = 0;
      i < __this.m_moveBuffer.length; ++i) {
         queryProxy = __this.m_moveBuffer[i];

         //function QueryCallback(proxy) {
         //   if (proxy == queryProxy) return true;
         //   if (__this.m_pairCount == __this.m_pairBuffer.length) {
         //      __this.m_pairBuffer[__this.m_pairCount] = new b2DynamicTreePair();
         //   }
         //   var pair = __this.m_pairBuffer[__this.m_pairCount];
         //   pair.proxyA = proxy < queryProxy ? proxy : queryProxy;
         //   pair.proxyB = proxy >= queryProxy ? proxy : queryProxy;++__this.m_pairCount;
         //   return true;
         //};
         var fatAABB = __this.m_tree.GetFatAABB(queryProxy);
         __this.m_tree.Query(QueryCallback, fatAABB);
      }
      __this.m_moveBuffer.length = 0;
      for (var i = 0; i < __this.m_pairCount;) {
         var primaryPair = __this.m_pairBuffer[i],
          userDataA = __this.m_tree.GetUserData(primaryPair.proxyA),
          userDataB = __this.m_tree.GetUserData(primaryPair.proxyB);
         callback(userDataA, userDataB);
         ++i;
         while (i < __this.m_pairCount) {
            var pair = __this.m_pairBuffer[i];
            if (pair.proxyA !== primaryPair.proxyA || pair.proxyB !== primaryPair.proxyB) {
               break;
            }++i;
         }
      }
   };

   /**
    * Query
    *
    * @param callback
    * @param aabb
    *
    */
   b2DynamicTreeBroadPhase.prototype.Query = function (callback, aabb) {
      this.m_tree.Query(callback, aabb);
   };

   /**
    * RayCast
    *
    * @param callback
    * @param input
    *
    */
   b2DynamicTreeBroadPhase.prototype.RayCast = function (callback, input) {
      this.m_tree.RayCast(callback, input);
   };

   /**
    * Validate
    *
    * @param 
    *
    */
   b2DynamicTreeBroadPhase.prototype.Validate = function () {};

   /**
    * Rebalance
    *
    * @param iterations
    *
    */
   b2DynamicTreeBroadPhase.prototype.Rebalance = function (iterations) {
      iterations = iterations || 0;
      this.m_tree.Rebalance(iterations);
   };

   /**
    * BufferMove
    *
    * @param proxy
    *
    */
   b2DynamicTreeBroadPhase.prototype.BufferMove = function (proxy) {
      this.m_moveBuffer[this.m_moveBuffer.length] = proxy;
   };

   /**
    * UnBufferMove
    *
    * @param proxy
    *
    */
   b2DynamicTreeBroadPhase.prototype.UnBufferMove = function (proxy) {
      var i = this.m_moveBuffer.indexOf(proxy);
      this.m_moveBuffer.splice(i, 1);
   };

   /**
    * ComparePairs
    *
    * @param pair1
    * @param pair2
    *
    */
   b2DynamicTreeBroadPhase.prototype.ComparePairs = function (pair1, pair2) {
      return 0;
   };

   /**
    *  Class b2Point
    *
    * @param 
    *
    */
   b2Point = Box2D.Collision.b2Point = function b2Point() {
      this.p = new b2Vec2(0, 0);

   };
   b2Point.constructor = b2Point;
   b2Point.prototype.p = null;

   /**
    * Support
    *
    * @param xf
    * @param vX
    * @param vY
    *
    */
   b2Point.prototype.Support = function (xf, vX, vY) {
      return this.p;
   };

   /**
    * GetFirstVertex
    *
    * @param xf
    *
    */
   b2Point.prototype.GetFirstVertex = function (xf) {
      return this.p;
   };

   /**
    *  Class b2RayCastInput
    *
    * @param p1
    * @param p2
    * @param maxFraction
    *
    */
   b2RayCastInput = Box2D.Collision.b2RayCastInput = function b2RayCastInput(p1, p2, maxFraction) {
      this.p1 = new b2Vec2(0, 0);
      this.p2 = new b2Vec2(0, 0);
      p1 = p1 || null;
      p2 = p2 || null;
      maxFraction = maxFraction || 1;
      if (p1) this.p1.SetV(p1);
      if (p2) this.p2.SetV(p2);
      this.maxFraction = maxFraction;
   };
   b2RayCastInput.constructor = b2RayCastInput;

   b2RayCastInput.prototype.p1 = null;
   b2RayCastInput.prototype.p2 = null;
   b2RayCastInput.prototype.maxFraction = 1;



   /**
    *  Class b2RayCastOutput
    *
    * @param 
    *
    */
   b2RayCastOutput = Box2D.Collision.b2RayCastOutput = function b2RayCastOutput() {
      this.normal = new b2Vec2(0, 0);

   };
   b2RayCastOutput.constructor = b2RayCastOutput;
   b2RayCastOutput.prototype.normal = null;

   /**
    *  Class b2Segment
    *
    * @param 
    *
    */
   b2Segment = Box2D.Collision.b2Segment = function b2Segment() {
      this.p1 = new b2Vec2(0, 0);
      this.p2 = new b2Vec2(0, 0);

   };
   b2Segment.constructor = b2Segment;
   b2Segment.prototype.p1 = null;
   b2Segment.prototype.p2 = null;

   /**
    * TestSegment
    *
    * @param lambda
    * @param normal
    * @param segment
    * @param maxLambda
    *
    */
   b2Segment.prototype.TestSegment = function (lambda, normal, segment, maxLambda) {
      maxLambda = maxLambda || 0;
      var s = segment.p1,
          rX = segment.p2.x - s.x,
          rY = segment.p2.y - s.y,
          dX = this.p2.x - this.p1.x,
          dY = this.p2.y - this.p1.y,
          nX = dY,
          nY = (-dX),
          k_slop = 100.0 * b2Settings.b2_epsilon,
          denom = (-(rX * nX + rY * nY));
      if (denom > k_slop) {
         var bX = s.x - this.p1.x,
          bY = s.y - this.p1.y,
          a = (bX * nX + bY * nY);
         if (0.0 <= a && a <= maxLambda * denom) {
            var mu2 = (-rX * bY) + rY * bX;
            if ((-k_slop * denom) <= mu2 && mu2 <= denom * (1.0 + k_slop)) {
               a /= denom;
               var nLen = Math.sqrt(nX * nX + nY * nY);
               nX /= nLen;
               nY /= nLen;
               lambda[0] = a;
               normal.Set(nX, nY);
               return true;
            }
         }
      }
      return false;
   };

   /**
    * Extend
    *
    * @param aabb
    *
    */
   b2Segment.prototype.Extend = function (aabb) {
      this.ExtendForward(aabb);
      this.ExtendBackward(aabb);
   };

   /**
    * ExtendForward
    *
    * @param aabb
    *
    */
   b2Segment.prototype.ExtendForward = function (aabb) {
      var dX = this.p2.x - this.p1.x,
          dY = this.p2.y - this.p1.y;
      var lambda = Math.min(dX > 0 ? (aabb.upperBound.x - this.p1.x) / dX : dX < 0 ? (aabb.lowerBound.x - this.p1.x) / dX : Number.POSITIVE_INFINITY,
      dY > 0 ? (aabb.upperBound.y - this.p1.y) / dY : dY < 0 ? (aabb.lowerBound.y - this.p1.y) / dY : Number.POSITIVE_INFINITY);
      this.p2.x = this.p1.x + dX * lambda;
      this.p2.y = this.p1.y + dY * lambda;
   };

   /**
    * ExtendBackward
    *
    * @param aabb
    *
    */
   b2Segment.prototype.ExtendBackward = function (aabb) {
      var dX = (-this.p2.x) + this.p1.x,
          dY = (-this.p2.y) + this.p1.y;
      var lambda = Math.min(dX > 0 ? (aabb.upperBound.x - this.p2.x) / dX : dX < 0 ? (aabb.lowerBound.x - this.p2.x) / dX : Number.POSITIVE_INFINITY,
      dY > 0 ? (aabb.upperBound.y - this.p2.y) / dY : dY < 0 ? (aabb.lowerBound.y - this.p2.y) / dY : Number.POSITIVE_INFINITY);
      this.p1.x = this.p2.x + dX * lambda;
      this.p1.y = this.p2.y + dY * lambda;
   };

   /**
    *  Class b2SeparationFunction
    *
    * @param 
    *
    */
   b2SeparationFunction = Box2D.Collision.b2SeparationFunction = function b2SeparationFunction() {
      this.m_localPoint = new b2Vec2(0, 0);
      this.m_axis = new b2Vec2(0, 0);
   };
   b2SeparationFunction.constructor = b2SeparationFunction;

   b2SeparationFunction.e_points = 0x01;
   b2SeparationFunction.e_faceA = 0x02;
   b2SeparationFunction.e_faceB = 0x04;

   b2SeparationFunction.prototype.m_localPoint        = null;
   b2SeparationFunction.prototype.m_axis              = null;
   b2SeparationFunction.prototype.m_proxyA            = null;
   b2SeparationFunction.prototype.m_proxyB            = null;


   /**
    * Initialize
    *
    * @param cache
    * @param proxyA
    * @param transformA
    * @param proxyB
    * @param transformB
    *
    */
   b2SeparationFunction.prototype.Initialize = function (cache, proxyA, transformA, proxyB, transformB) {
      this.m_proxyA = proxyA;
      this.m_proxyB = proxyB;
      var count = cache.count;
      b2Assert(0 < count && count < 3);
      var localPointA,
          localPointA1,
          localPointA2,
          localPointB,
          localPointB1,
          localPointB2,
          pointAX = 0,
          pointAY = 0,
          pointBX = 0,
          pointBY = 0,
          normalX = 0,
          normalY = 0,
          tMat,
          tVec,
          s = 0,
          sgn = 0;
      if (count === 1) {
         this.m_type = b2SeparationFunction.e_points;
         localPointA = this.m_proxyA.GetVertex(cache.indexA[0]);
         localPointB = this.m_proxyB.GetVertex(cache.indexB[0]);
         tVec = localPointA;
         tMat = transformA.R;
         pointAX = transformA.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
         pointAY = transformA.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
         tVec = localPointB;
         tMat = transformB.R;
         pointBX = transformB.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
         pointBY = transformB.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
         this.m_axis.x = pointBX - pointAX;
         this.m_axis.y = pointBY - pointAY;
         this.m_axis.Normalize();
      }
      else if (cache.indexB[0] === cache.indexB[1]) {
         this.m_type = b2SeparationFunction.e_faceA;
         localPointA1 = this.m_proxyA.GetVertex(cache.indexA[0]);
         localPointA2 = this.m_proxyA.GetVertex(cache.indexA[1]);
         localPointB = this.m_proxyB.GetVertex(cache.indexB[0]);
         this.m_localPoint.x = 0.5 * (localPointA1.x + localPointA2.x);
         this.m_localPoint.y = 0.5 * (localPointA1.y + localPointA2.y);
         this.m_axis = b2Math.CrossVF(b2Math.SubtractVV(localPointA2, localPointA1), 1.0);
         this.m_axis.Normalize();
         tVec = this.m_axis;
         tMat = transformA.R;
         normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
         normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
         tVec = this.m_localPoint;
         tMat = transformA.R;
         pointAX = transformA.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
         pointAY = transformA.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
         tVec = localPointB;
         tMat = transformB.R;
         pointBX = transformB.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
         pointBY = transformB.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
         s = (pointBX - pointAX) * normalX + (pointBY - pointAY) * normalY;
         if (s < 0.0) {
            this.m_axis.NegativeSelf();
         }
      }
      else if (cache.indexA[0] === cache.indexA[0]) {
         this.m_type = b2SeparationFunction.e_faceB;
         localPointB1 = this.m_proxyB.GetVertex(cache.indexB[0]);
         localPointB2 = this.m_proxyB.GetVertex(cache.indexB[1]);
         localPointA = this.m_proxyA.GetVertex(cache.indexA[0]);
         this.m_localPoint.x = 0.5 * (localPointB1.x + localPointB2.x);
         this.m_localPoint.y = 0.5 * (localPointB1.y + localPointB2.y);
         this.m_axis = b2Math.CrossVF(b2Math.SubtractVV(localPointB2, localPointB1), 1.0);
         this.m_axis.Normalize();
         tVec = this.m_axis;
         tMat = transformB.R;
         normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
         normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
         tVec = this.m_localPoint;
         tMat = transformB.R;
         pointBX = transformB.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
         pointBY = transformB.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
         tVec = localPointA;
         tMat = transformA.R;
         pointAX = transformA.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
         pointAY = transformA.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
         s = (pointAX - pointBX) * normalX + (pointAY - pointBY) * normalY;
         if (s < 0.0) {
            this.m_axis.NegativeSelf();
         }
      }
      else {
         localPointA1 = this.m_proxyA.GetVertex(cache.indexA[0]);
         localPointA2 = this.m_proxyA.GetVertex(cache.indexA[1]);
         localPointB1 = this.m_proxyB.GetVertex(cache.indexB[0]);
         localPointB2 = this.m_proxyB.GetVertex(cache.indexB[1]);
         var pA = b2Math.MulX(transformA, localPointA),
          dA = b2Math.MulMV(transformA.R, b2Math.SubtractVV(localPointA2, localPointA1)),
          pB = b2Math.MulX(transformB, localPointB),
          dB = b2Math.MulMV(transformB.R, b2Math.SubtractVV(localPointB2, localPointB1)),
          a = dA.x * dA.x + dA.y * dA.y,
          e = dB.x * dB.x + dB.y * dB.y,
          r = b2Math.SubtractVV(dB, dA),
          c = dA.x * r.x + dA.y * r.y,
          f = dB.x * r.x + dB.y * r.y,
          b = dA.x * dB.x + dA.y * dB.y,
          denom = a * e - b * b;
         s = 0.0;
         if (denom !== 0.0) {
            s = b2Math.Clamp((b * f - c * e) / denom, 0.0, 1.0);
         }
         var t = (b * s + f) / e;
         if (t < 0.0) {
            t = 0.0;
            s = b2Math.Clamp((b - c) / a, 0.0, 1.0);
         }
         localPointA = new b2Vec2(0, 0);
         localPointA.x = localPointA1.x + s * (localPointA2.x - localPointA1.x);
         localPointA.y = localPointA1.y + s * (localPointA2.y - localPointA1.y);
         localPointB = new b2Vec2(0, 0);
         localPointB.x = localPointB1.x + s * (localPointB2.x - localPointB1.x);
         localPointB.y = localPointB1.y + s * (localPointB2.y - localPointB1.y);
         if (s === 0.0 || s === 1.0) {
            this.m_type = b2SeparationFunction.e_faceB;
            this.m_axis = b2Math.CrossVF(b2Math.SubtractVV(localPointB2, localPointB1), 1.0);
            this.m_axis.Normalize();
            this.m_localPoint = localPointB;
            tVec = this.m_axis;
            tMat = transformB.R;
            normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
            normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
            tVec = this.m_localPoint;
            tMat = transformB.R;
            pointBX = transformB.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
            pointBY = transformB.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
            tVec = localPointA;
            tMat = transformA.R;
            pointAX = transformA.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
            pointAY = transformA.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
            sgn = (pointAX - pointBX) * normalX + (pointAY - pointBY) * normalY;
            if (s < 0.0) {
               this.m_axis.NegativeSelf();
            }
         }
         else {
            this.m_type = b2SeparationFunction.e_faceA;
            this.m_axis = b2Math.CrossVF(b2Math.SubtractVV(localPointA2, localPointA1), 1.0);
            this.m_localPoint = localPointA;
            tVec = this.m_axis;
            tMat = transformA.R;
            normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
            normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
            tVec = this.m_localPoint;
            tMat = transformA.R;
            pointAX = transformA.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
            pointAY = transformA.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
            tVec = localPointB;
            tMat = transformB.R;
            pointBX = transformB.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
            pointBY = transformB.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
            sgn = (pointBX - pointAX) * normalX + (pointBY - pointAY) * normalY;
            if (s < 0.0) {
               this.m_axis.NegativeSelf();
            }
         }
      }
   };

   /**
    * Evaluate
    *
    * @param transformA
    * @param transformB
    *
    */
   b2SeparationFunction.prototype.Evaluate = function (transformA, transformB) {
      var axisA,
          axisB,
          localPointA,
          localPointB,
          pointA,
          pointB,
          seperation = 0,
          normal;
      switch (this.m_type) {
      case b2SeparationFunction.e_points:
         {
            axisA = b2Math.MulTMV(transformA.R, this.m_axis);
            axisB = b2Math.MulTMV(transformB.R, this.m_axis.GetNegative());
            localPointA = this.m_proxyA.GetSupportVertex(axisA);
            localPointB = this.m_proxyB.GetSupportVertex(axisB);
            pointA = b2Math.MulX(transformA, localPointA);
            pointB = b2Math.MulX(transformB, localPointB);
            seperation = (pointB.x - pointA.x) * this.m_axis.x + (pointB.y - pointA.y) * this.m_axis.y;
            return seperation;
         }
      case b2SeparationFunction.e_faceA:
         {
            normal = b2Math.MulMV(transformA.R, this.m_axis);
            pointA = b2Math.MulX(transformA, this.m_localPoint);
            axisB = b2Math.MulTMV(transformB.R, normal.GetNegative());
            localPointB = this.m_proxyB.GetSupportVertex(axisB);
            pointB = b2Math.MulX(transformB, localPointB);
            seperation = (pointB.x - pointA.x) * normal.x + (pointB.y - pointA.y) * normal.y;
            return seperation;
         }
      case b2SeparationFunction.e_faceB:
         {
            normal = b2Math.MulMV(transformB.R, this.m_axis);
            pointB = b2Math.MulX(transformB, this.m_localPoint);
            axisA = b2Math.MulTMV(transformA.R, normal.GetNegative());
            localPointA = this.m_proxyA.GetSupportVertex(axisA);
            pointA = b2Math.MulX(transformA, localPointA);
            seperation = (pointA.x - pointB.x) * normal.x + (pointA.y - pointB.y) * normal.y;
            return seperation;
         }
      default:
         b2Assert(false);
         return 0.0;
      }
   };

   /**
    *  Class b2TimeOfImpact
    *
    * @param 
    *
    */
   b2TimeOfImpact = Box2D.Collision.b2TimeOfImpact = function b2TimeOfImpact() {


   };
   b2TimeOfImpact.constructor = b2TimeOfImpact;

   b2TimeOfImpact.b2_toiCalls = 0;
   b2TimeOfImpact.b2_toiIters = 0;
   b2TimeOfImpact.b2_toiMaxIters = 0;
   b2TimeOfImpact.b2_toiRootIters = 0;
   b2TimeOfImpact.b2_toiMaxRootIters = 0;
   b2TimeOfImpact.s_cache = new b2SimplexCache();
   b2TimeOfImpact.s_distanceInput = new b2DistanceInput();
   b2TimeOfImpact.s_xfA = new b2Transform();
   b2TimeOfImpact.s_xfB = new b2Transform();
   b2TimeOfImpact.s_fcn = new b2SeparationFunction();
   b2TimeOfImpact.s_distanceOutput = new b2DistanceOutput();

   /**
    * Static TimeOfImpact
    *
    * @param input
    *
    */
   b2TimeOfImpact.TimeOfImpact = function (input) {
      ++b2TimeOfImpact.b2_toiCalls;
      var proxyA = input.proxyA,
          proxyB = input.proxyB,
          sweepA = input.sweepA,
          sweepB = input.sweepB;
      b2Assert(sweepA.t0 === sweepB.t0);
      b2Assert(1.0 - sweepA.t0 > b2Settings.b2_epsilon);
      var radius = proxyA.m_radius + proxyB.m_radius,
          tolerance = input.tolerance,
          alpha = 0.0,
          k_maxIterations = 1000,
          iter = 0,
          target = 0.0;
      b2TimeOfImpact.s_cache.count = 0;
      b2TimeOfImpact.s_distanceInput.useRadii = false;
      for (;;) {
         sweepA.GetTransform(b2TimeOfImpact.s_xfA, alpha);
         sweepB.GetTransform(b2TimeOfImpact.s_xfB, alpha);
         b2TimeOfImpact.s_distanceInput.proxyA = proxyA;
         b2TimeOfImpact.s_distanceInput.proxyB = proxyB;
         b2TimeOfImpact.s_distanceInput.transformA = b2TimeOfImpact.s_xfA;
         b2TimeOfImpact.s_distanceInput.transformB = b2TimeOfImpact.s_xfB;
         b2Distance.Distance(b2TimeOfImpact.s_distanceOutput, b2TimeOfImpact.s_cache, b2TimeOfImpact.s_distanceInput);
         if (b2TimeOfImpact.s_distanceOutput.distance <= 0.0) {
            alpha = 1.0;
            break;
         }
         b2TimeOfImpact.s_fcn.Initialize(b2TimeOfImpact.s_cache, proxyA, b2TimeOfImpact.s_xfA, proxyB, b2TimeOfImpact.s_xfB);
         var separation = b2TimeOfImpact.s_fcn.Evaluate(b2TimeOfImpact.s_xfA, b2TimeOfImpact.s_xfB);
         if (separation <= 0.0) {
            alpha = 1.0;
            break;
         }
         if (iter === 0) {
            if (separation > radius) {
               target = b2Math.Max(radius - tolerance, 0.75 * radius);
            }
            else {
               target = b2Math.Max(separation - tolerance, 0.02 * radius);
            }
         }
         if (separation - target < 0.5 * tolerance) {
            if (iter === 0) {
               alpha = 1.0;
               break;
            }
            break;
         }
         var newAlpha = alpha; {
            var x1 = alpha,
          x2 = 1.0,
          f1 = separation;
            sweepA.GetTransform(b2TimeOfImpact.s_xfA, x2);
            sweepB.GetTransform(b2TimeOfImpact.s_xfB, x2);
            var f2 = b2TimeOfImpact.s_fcn.Evaluate(b2TimeOfImpact.s_xfA, b2TimeOfImpact.s_xfB);
            if (f2 >= target) {
               alpha = 1.0;
               break;
            }
            var rootIterCount = 0;
            for (;;) {
               var x = 0;
               if (rootIterCount & 1) {
                  x = x1 + (target - f1) * (x2 - x1) / (f2 - f1);
               }
               else {
                  x = 0.5 * (x1 + x2);
               }
               sweepA.GetTransform(b2TimeOfImpact.s_xfA, x);
               sweepB.GetTransform(b2TimeOfImpact.s_xfB, x);
               var f = b2TimeOfImpact.s_fcn.Evaluate(b2TimeOfImpact.s_xfA, b2TimeOfImpact.s_xfB);
               if (b2Math.Abs(f - target) < 0.025 * tolerance) {
                  newAlpha = x;
                  break;
               }
               if (f > target) {
                  x1 = x;
                  f1 = f;
               }
               else {
                  x2 = x;
                  f2 = f;
               }++rootIterCount;
               ++b2TimeOfImpact.b2_toiRootIters;
               if (rootIterCount === 50) {
                  break;
               }
            }
            b2TimeOfImpact.b2_toiMaxRootIters = b2Math.Max(b2TimeOfImpact.b2_toiMaxRootIters, rootIterCount);
         }
         if (newAlpha < (1.0 + 100.0 * b2Settings.b2_epsilon) * alpha) {
            break;
         }
         alpha = newAlpha;
         iter++;
         ++b2TimeOfImpact.b2_toiIters;
         if (iter === k_maxIterations) {
            break;
         }
      }
      b2TimeOfImpact.b2_toiMaxIters = b2Math.Max(b2TimeOfImpact.b2_toiMaxIters, iter);
      return alpha;
   };

   /**
    *  Class b2TOIInput
    *
    * @param 
    *
    */
   b2TOIInput = Box2D.Collision.b2TOIInput = function b2TOIInput() {
      this.proxyA = new b2DistanceProxy();
      this.proxyB = new b2DistanceProxy();
      this.sweepA = new b2Sweep();
      this.sweepB = new b2Sweep();

   };
   b2TOIInput.constructor = b2TOIInput;
   b2TOIInput.prototype.proxyA = null;
   b2TOIInput.prototype.proxyB = null;
   b2TOIInput.prototype.sweepA = null;
   b2TOIInput.prototype.sweepB = null;



   /**
    *  Class b2WorldManifold
    *
    * @param 
    *
    */
   b2WorldManifold = Box2D.Collision.b2WorldManifold = function b2WorldManifold() {
      this.m_normal = new b2Vec2(0, 0);

      this.m_points = [];
      for (var i = 0; i < b2Settings.b2_maxManifoldPoints; i++) {
         this.m_points.push(new b2Vec2(0, 0));
      }
   };
   b2WorldManifold.constructor = b2WorldManifold;

   b2WorldManifold.prototype.m_normal = null;
   b2WorldManifold.prototype.m_points = null;


   /**
    * Initialize
    *
    * @param manifold
    * @param xfA
    * @param radiusA
    * @param xfB
    * @param radiusB
    *
    */
   b2WorldManifold.prototype.Initialize = function (manifold, xfA, radiusA, xfB, radiusB) {
      radiusA = radiusA || 0;
      radiusB = radiusB || 0;
      if (manifold.m_pointCount === 0) {
         return;
      }
      var i = 0,
          tVec,
          tMat,
          normalX = 0,
          normalY = 0,
          planePointX = 0,
          planePointY = 0,
          clipPointX = 0,
          clipPointY = 0;
      switch (manifold.m_type) {
      case b2Manifold.e_circles:
         {
            tMat = xfA.R;
            tVec = manifold.m_localPoint;
            var pointAX = xfA.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y,
          pointAY = xfA.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
            tMat = xfB.R;
            tVec = manifold.m_points[0].m_localPoint;
            var pointBX = xfB.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y,
          pointBY = xfB.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y,
          dX = pointBX - pointAX,
          dY = pointBY - pointAY,
          d2 = dX * dX + dY * dY;
            if (d2 > b2Settings.b2_epsilon * b2Settings.b2_epsilon) {
               var d = Math.sqrt(d2);
               this.m_normal.x = dX / d;
               this.m_normal.y = dY / d;
            }
            else {
               this.m_normal.x = 1;
               this.m_normal.y = 0;
            }
            var cAX = pointAX + radiusA * this.m_normal.x,
          cAY = pointAY + radiusA * this.m_normal.y,
          cBX = pointBX - radiusB * this.m_normal.x,
          cBY = pointBY - radiusB * this.m_normal.y;
            this.m_points[0].x = 0.5 * (cAX + cBX);
            this.m_points[0].y = 0.5 * (cAY + cBY);
         }
         break;
      case b2Manifold.e_faceA:
         {
            tMat = xfA.R;
            tVec = manifold.m_localPlaneNormal;
            normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
            normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
            tMat = xfA.R;
            tVec = manifold.m_localPoint;
            planePointX = xfA.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
            planePointY = xfA.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
            this.m_normal.x = normalX;
            this.m_normal.y = normalY;
            for (i = 0; i < manifold.m_pointCount; i++) {
               tMat = xfB.R;
               tVec = manifold.m_points[i].m_localPoint;
               clipPointX = xfB.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
               clipPointY = xfB.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
               this.m_points[i].x = clipPointX + 0.5 * (radiusA - (clipPointX - planePointX) * normalX - (clipPointY - planePointY) * normalY - radiusB) * normalX;
               this.m_points[i].y = clipPointY + 0.5 * (radiusA - (clipPointX - planePointX) * normalX - (clipPointY - planePointY) * normalY - radiusB) * normalY;
            }
         }
         break;
      case b2Manifold.e_faceB:
         {
            tMat = xfB.R;
            tVec = manifold.m_localPlaneNormal;
            normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
            normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
            tMat = xfB.R;
            tVec = manifold.m_localPoint;
            planePointX = xfB.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
            planePointY = xfB.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
            this.m_normal.x = (-normalX);
            this.m_normal.y = (-normalY);
            for (i = 0; i < manifold.m_pointCount; i++) {
               tMat = xfA.R;
               tVec = manifold.m_points[i].m_localPoint;
               clipPointX = xfA.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
               clipPointY = xfA.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
               this.m_points[i].x = clipPointX + 0.5 * (radiusB - (clipPointX - planePointX) * normalX - (clipPointY - planePointY) * normalY - radiusA) * normalX;
               this.m_points[i].y = clipPointY + 0.5 * (radiusB - (clipPointX - planePointX) * normalX - (clipPointY - planePointY) * normalY - radiusA) * normalY;
            }
         }
         break;
      }
   };
/**
*  Class b2FilterData
*
* @param
*
*/
b2FilterData = Box2D.Dynamics.b2FilterData = function b2FilterData() {};
b2FilterData.constructor = b2FilterData;
b2FilterData.prototype = {
    categoryBits: 0x0001,
    maskBits: 0xffff,
    groupIndex: 0,

    /**
     * Copy
     *
     * @param
     *
     */
    Copy: function () {
        var copy = new b2FilterData();
        copy.categoryBits = this.categoryBits;
        copy.maskBits = this.maskBits;
        copy.groupIndex = this.groupIndex;
        return copy;
    }
};
/**
*  Class b2TimeStep
*
* @param
*
*/
b2TimeStep = Box2D.Dynamics.b2TimeStep = function b2TimeStep() {};
b2TimeStep.constructor = b2TimeStep;
b2TimeStep.prototype = {
    dt: 0,
    inv_dt: 0,
    positionIterations: 0,
    velocityIterations: 0,
    warmStarting: 0,
    /**
     * Set
     *
     * @param step
     *
     */
    Set: function (step) {
        this.dt = step.dt;
        this.inv_dt = step.inv_dt;
        this.positionIterations = step.positionIterations;
        this.velocityIterations = step.velocityIterations;
        this.warmStarting = step.warmStarting;
    }
}

   /**
    *  Class b2ContactRegister
    *
    * @param 
    *
    */
   b2ContactRegister = Box2D.Dynamics.Contacts.b2ContactRegister = function b2ContactRegister() {};
   b2ContactRegister.constructor = b2ContactRegister;

   /**
    *  Class b2ContactResult
    *
    * @param 
    *
    */
   b2ContactResult = Box2D.Dynamics.Contacts.b2ContactResult = function b2ContactResult() {
      this.position = new b2Vec2(0, 0);
      this.normal = new b2Vec2(0, 0);
      this.id = new b2ContactID();

   };
   b2ContactResult.constructor = b2ContactResult;
   b2ContactResult.prototype.position   = null;
   b2ContactResult.prototype.normal     = null;
   b2ContactResult.prototype.id         = null;

   /**
    *  Class b2ContactEdge
    *
    * @param 
    *
    */
   b2ContactEdge = Box2D.Dynamics.Contacts.b2ContactEdge = function b2ContactEdge() {};
   b2ContactEdge.constructor = b2ContactEdge;

   /**
    *  Class b2ContactConstraintPoint
    *
    * @param 
    *
    */
   b2ContactConstraintPoint = Box2D.Dynamics.Contacts.b2ContactConstraintPoint = function b2ContactConstraintPoint() {
      this.localPoint = new b2Vec2(0, 0);
      this.rA = new b2Vec2(0, 0);
      this.rB = new b2Vec2(0, 0);

   };
   b2ContactConstraintPoint.constructor = b2ContactConstraintPoint;
   b2ContactConstraintPoint.prototype.localPoint    = null;
   b2ContactConstraintPoint.prototype.rA            = null;
   b2ContactConstraintPoint.prototype.rB            = null;

   /**
    *  Class b2ContactConstraint
    *
    * @param 
    *
    */
   b2ContactConstraint = Box2D.Dynamics.Contacts.b2ContactConstraint = function b2ContactConstraint() {
      this.localPlaneNormal = new b2Vec2(0, 0);
      this.localPoint = new b2Vec2(0, 0);
      this.normal = new b2Vec2(0, 0);
      this.normalMass = new b2Mat22();
      this.K = new b2Mat22();
      this.points = [];
      for (var i = 0; i < b2Settings.b2_maxManifoldPoints; i++) {
         this.points.push(new b2ContactConstraintPoint());
      }
   };
   b2ContactConstraint.constructor = b2ContactConstraint;
   b2ContactConstraint.prototype.localPlaneNormal  = null;
   b2ContactConstraint.prototype.localPoint        = null;
   b2ContactConstraint.prototype.normal            = null;
   b2ContactConstraint.prototype.normalMass        = null;
   b2ContactConstraint.prototype.K                 = null;
   b2ContactConstraint.prototype.points            = null;


   /**
    *  Class b2Contact
    *
    * @param 
    *
    */
   b2Contact = Box2D.Dynamics.Contacts.b2Contact = function b2Contact() {
      this.m_nodeA = new b2ContactEdge();
      this.m_nodeB = new b2ContactEdge();
      this.m_manifold = new b2Manifold();
      this.m_oldManifold = new b2Manifold();

   };
   b2Contact.constructor = b2Contact;

   b2Contact.e_sensorFlag = 0x0001;
   b2Contact.e_continuousFlag = 0x0002;
   b2Contact.e_islandFlag = 0x0004;
   b2Contact.e_toiFlag = 0x0008;
   b2Contact.e_touchingFlag = 0x0010;
   b2Contact.e_enabledFlag = 0x0020;
   b2Contact.e_filterFlag = 0x0040;
   b2Contact.s_input = new b2TOIInput();

   b2Contact.prototype.m_flags              = 0x0000;
   b2Contact.prototype.m_next               = null;
   b2Contact.prototype.m_prev               = null;
   b2Contact.prototype.m_nodeA              = null;
   b2Contact.prototype.m_nodeB              = null;
   b2Contact.prototype.m_manifold           = null;
   b2Contact.prototype.m_oldManifold        = null;
   b2Contact.prototype.m_fixtureA           = null;
   b2Contact.prototype.m_fixtureB           = null;
   b2Contact.prototype.m_touching           = false;

   /**
    * GetManifold
    *
    * @param 
    *
    */
   b2Contact.prototype.GetManifold = function () {
      return this.m_manifold;
   };

   /**
    * GetWorldManifold
    *
    * @param worldManifold
    *
    */
   b2Contact.prototype.GetWorldManifold = function (worldManifold) {
      var bodyA = this.m_fixtureA.GetBody(),
          bodyB = this.m_fixtureB.GetBody(),
          shapeA = this.m_fixtureA.GetShape(),
          shapeB = this.m_fixtureB.GetShape();
      worldManifold.Initialize(this.m_manifold, bodyA.GetTransform(), shapeA.m_radius, bodyB.GetTransform(), shapeB.m_radius);
   };

   /**
    * IsTouching
    *
    * @param 
    *
    */
   b2Contact.prototype.IsTouching = function () {
      return (this.m_flags & b2Contact.e_touchingFlag) === b2Contact.e_touchingFlag;
   };

   /**
    * IsContinuous
    *
    * @param 
    *
    */
   b2Contact.prototype.IsContinuous = function () {
      return (this.m_flags & b2Contact.e_continuousFlag) === b2Contact.e_continuousFlag;
   };

   /**
    * SetSensor
    *
    * @param sensor
    *
    */
   b2Contact.prototype.SetSensor = function (sensor) {
      if (sensor) {
         this.m_flags |= b2Contact.e_sensorFlag;
      }
      else {
         this.m_flags &= ~b2Contact.e_sensorFlag;
      }
   };

   /**
    * IsSensor
    *
    * @param 
    *
    */
   b2Contact.prototype.IsSensor = function () {
      return (this.m_flags & b2Contact.e_sensorFlag) === b2Contact.e_sensorFlag;
   };

   /**
    * SetEnabled
    *
    * @param flag
    *
    */
   b2Contact.prototype.SetEnabled = function (flag) {
      if (flag) {
         this.m_flags |= b2Contact.e_enabledFlag;
      }
      else {
         this.m_flags &= ~b2Contact.e_enabledFlag;
      }
   };

   /**
    * IsEnabled
    *
    * @param 
    *
    */
   b2Contact.prototype.IsEnabled = function () {
      return (this.m_flags & b2Contact.e_enabledFlag) === b2Contact.e_enabledFlag;
   };

   /**
    * GetNext
    *
    * @param 
    *
    */
   b2Contact.prototype.GetNext = function () {
      return this.m_next;
   };

   /**
    * GetFixtureA
    *
    * @param 
    *
    */
   b2Contact.prototype.GetFixtureA = function () {
      return this.m_fixtureA;
   };

   /**
    * GetFixtureB
    *
    * @param 
    *
    */
   b2Contact.prototype.GetFixtureB = function () {
      return this.m_fixtureB;
   };

   /**
    * FlagForFiltering
    *
    * @param 
    *
    */
   b2Contact.prototype.FlagForFiltering = function () {
      this.m_flags |= b2Contact.e_filterFlag;
   };

   /**
    * Reset
    *
    * @param fixtureA
    * @param fixtureB
    *
    */
   b2Contact.prototype.Reset = function (fixtureA, fixtureB) {
      fixtureA = fixtureA || null;
      fixtureB = fixtureB || null;
      this.m_flags = b2Contact.e_enabledFlag;
      if (!fixtureA || !fixtureB) {
         this.m_fixtureA = null;
         this.m_fixtureB = null;
         return;
      }
      if (fixtureA.IsSensor() || fixtureB.IsSensor()) {
         this.m_flags |= b2Contact.e_sensorFlag;
      }
      var bodyA = fixtureA.GetBody(),
          bodyB = fixtureB.GetBody();
      if (bodyA.GetType() !== b2Body.b2_dynamicBody || bodyA.IsBullet() || bodyB.GetType() !== b2Body.b2_dynamicBody || bodyB.IsBullet()) {
         this.m_flags |= b2Contact.e_continuousFlag;
      }
      this.m_fixtureA = fixtureA;
      this.m_fixtureB = fixtureB;
      this.m_manifold.m_pointCount = 0;
      this.m_prev = null;
      this.m_next = null;
      this.m_nodeA.contact = null;
      this.m_nodeA.prev = null;
      this.m_nodeA.next = null;
      this.m_nodeA.other = null;
      this.m_nodeB.contact = null;
      this.m_nodeB.prev = null;
      this.m_nodeB.next = null;
      this.m_nodeB.other = null;
   };

   /**
    * Update
    *
    * @param listener
    *
    */
   b2Contact.prototype.Update = function (listener) {
      var tManifold = this.m_oldManifold;
      this.m_oldManifold = this.m_manifold;
      this.m_manifold = tManifold;
      this.m_flags |= b2Contact.e_enabledFlag;
      var touching = false,
          wasTouching = (this.m_flags & b2Contact.e_touchingFlag) === b2Contact.e_touchingFlag,
          bodyA = this.m_fixtureA.m_body,
          bodyB = this.m_fixtureB.m_body,
          aabbOverlap = this.m_fixtureA.m_aabb.TestOverlap(this.m_fixtureB.m_aabb);
      if (this.m_flags & b2Contact.e_sensorFlag) {
         if (aabbOverlap) {
            var shapeA = this.m_fixtureA.GetShape(),
          shapeB = this.m_fixtureB.GetShape(),
          xfA = bodyA.GetTransform(),
          xfB = bodyB.GetTransform();
            touching = b2Shape.TestOverlap(shapeA, xfA, shapeB, xfB);
         }
         this.m_manifold.m_pointCount = 0;
      }
      else {
         if (bodyA.GetType() !== b2Body.b2_dynamicBody || bodyA.IsBullet() || bodyB.GetType() !== b2Body.b2_dynamicBody || bodyB.IsBullet()) {
            this.m_flags |= b2Contact.e_continuousFlag;
         }
         else {
            this.m_flags &= ~b2Contact.e_continuousFlag;
         }
         if (aabbOverlap) {
            this.Evaluate();
            touching = this.m_manifold.m_pointCount > 0;
            for (var i = 0; i < this.m_manifold.m_pointCount; ++i) {
               var mp2 = this.m_manifold.m_points[i];
               mp2.m_normalImpulse = 0.0;
               mp2.m_tangentImpulse = 0.0;
               var id2 = mp2.m_id;
               for (var j = 0; j < this.m_oldManifold.m_pointCount; ++j) {
                  var mp1 = this.m_oldManifold.m_points[j];
                  if (mp1.m_id.key === id2.key) {
                     mp2.m_normalImpulse = mp1.m_normalImpulse;
                     mp2.m_tangentImpulse = mp1.m_tangentImpulse;
                     break;
                  }
               }
            }
         }
         else {
            this.m_manifold.m_pointCount = 0;
         }
         if (touching !== wasTouching) {
            bodyA.SetAwake(true);
            bodyB.SetAwake(true);
         }
      }
      if (touching) {
         this.m_flags |= b2Contact.e_touchingFlag;
      }
      else {
         this.m_flags &= ~b2Contact.e_touchingFlag;
      }
      if (wasTouching === false && touching === true) {
         listener.BeginContact(this);
      }
      if (wasTouching === true && touching === false) {
         listener.EndContact(this);
      }
      if ((this.m_flags & b2Contact.e_sensorFlag) === 0) {
         listener.PreSolve(this, this.m_oldManifold);
      }
   };

   /**
    * Evaluate
    *
    * @param 
    *
    */
   b2Contact.prototype.Evaluate = function () {};

   /**
    * ComputeTOI
    *
    * @param sweepA
    * @param sweepB
    *
    */
   b2Contact.prototype.ComputeTOI = function (sweepA, sweepB) {
      b2Contact.s_input.proxyA.Set(this.m_fixtureA.GetShape());
      b2Contact.s_input.proxyB.Set(this.m_fixtureB.GetShape());
      b2Contact.s_input.sweepA = sweepA;
      b2Contact.s_input.sweepB = sweepB;
      b2Contact.s_input.tolerance = b2Settings.b2_linearSlop;
      return b2TimeOfImpact.TimeOfImpact(b2Contact.s_input);
   };

   /**
    *  Class b2CircleContact
    *
    * @param 
    *
    */
   b2CircleContact = Box2D.Dynamics.Contacts.b2CircleContact = function b2CircleContact() {

      b2Contact.apply(this, arguments);
   };
   b2CircleContact.constructor = b2CircleContact;
   b2CircleContact.prototype = Object.create(b2Contact.prototype );

   /**
    * Static Create
    *
    * @param allocator
    *
    */
   b2CircleContact.Create = function (allocator) {
      return new b2CircleContact();
   };

   /**
    * Static Destroy
    *
    * @param contact
    * @param allocator
    *
    */
   b2CircleContact.Destroy = function (contact, allocator) {};

   /**
    * Reset
    *
    * @param fixtureA
    * @param fixtureB
    *
    */
   b2CircleContact.prototype.Reset = function (fixtureA, fixtureB) {
      b2Contact.prototype.Reset.call(this, fixtureA, fixtureB);
   };

   /**
    * Evaluate
    *
    * @param 
    *
    */
   b2CircleContact.prototype.Evaluate = function () {
      var bA = this.m_fixtureA.GetBody(),
          bB = this.m_fixtureB.GetBody();
      b2Collision.CollideCircles(this.m_manifold, (this.m_fixtureA.GetShape() instanceof b2CircleShape ? this.m_fixtureA.GetShape() : null), bA.m_xf, (this.m_fixtureB.GetShape() instanceof b2CircleShape ? this.m_fixtureB.GetShape() : null), bB.m_xf);
   };

   /**
    * GetManifold
    *
    * @param 
    *
    */
   b2CircleContact.prototype.GetManifold = function () {
      return this.m_manifold;
   };

   /**
    * GetWorldManifold
    *
    * @param worldManifold
    *
    */
   b2CircleContact.prototype.GetWorldManifold = function (worldManifold) {
      var bodyA = this.m_fixtureA.GetBody(),
          bodyB = this.m_fixtureB.GetBody(),
          shapeA = this.m_fixtureA.GetShape(),
          shapeB = this.m_fixtureB.GetShape();
      worldManifold.Initialize(this.m_manifold, bodyA.GetTransform(), shapeA.m_radius, bodyB.GetTransform(), shapeB.m_radius);
   };

   /**
    * IsTouching
    *
    * @param 
    *
    */
   b2CircleContact.prototype.IsTouching = function () {
      return (this.m_flags & b2Contact.e_touchingFlag) === b2Contact.e_touchingFlag;
   };

   /**
    * IsContinuous
    *
    * @param 
    *
    */
   b2CircleContact.prototype.IsContinuous = function () {
      return (this.m_flags & b2Contact.e_continuousFlag) === b2Contact.e_continuousFlag;
   };

   /**
    * SetSensor
    *
    * @param sensor
    *
    */
   b2CircleContact.prototype.SetSensor = function (sensor) {
      if (sensor) {
         this.m_flags |= b2Contact.e_sensorFlag;
      }
      else {
         this.m_flags &= ~b2Contact.e_sensorFlag;
      }
   };

   /**
    * IsSensor
    *
    * @param 
    *
    */
   b2CircleContact.prototype.IsSensor = function () {
      return (this.m_flags & b2Contact.e_sensorFlag) === b2Contact.e_sensorFlag;
   };

   /**
    * SetEnabled
    *
    * @param flag
    *
    */
   b2CircleContact.prototype.SetEnabled = function (flag) {
      if (flag) {
         this.m_flags |= b2Contact.e_enabledFlag;
      }
      else {
         this.m_flags &= ~b2Contact.e_enabledFlag;
      }
   };

   /**
    * IsEnabled
    *
    * @param 
    *
    */
   b2CircleContact.prototype.IsEnabled = function () {
      return (this.m_flags & b2Contact.e_enabledFlag) === b2Contact.e_enabledFlag;
   };

   /**
    * GetNext
    *
    * @param 
    *
    */
   b2CircleContact.prototype.GetNext = function () {
      return this.m_next;
   };

   /**
    * GetFixtureA
    *
    * @param 
    *
    */
   b2CircleContact.prototype.GetFixtureA = function () {
      return this.m_fixtureA;
   };

   /**
    * GetFixtureB
    *
    * @param 
    *
    */
   b2CircleContact.prototype.GetFixtureB = function () {
      return this.m_fixtureB;
   };

   /**
    * FlagForFiltering
    *
    * @param 
    *
    */
   b2CircleContact.prototype.FlagForFiltering = function () {
      this.m_flags |= b2Contact.e_filterFlag;
   };

   /**
    * b2Contact
    *
    * @param 
    *
    */
   b2CircleContact.prototype.b2Contact = function () {};

   /**
    * Update
    *
    * @param listener
    *
    */
   b2CircleContact.prototype.Update = function (listener) {
      var tManifold = this.m_oldManifold;
      this.m_oldManifold = this.m_manifold;
      this.m_manifold = tManifold;
      this.m_flags |= b2Contact.e_enabledFlag;
      var touching = false,
          wasTouching = (this.m_flags & b2Contact.e_touchingFlag) === b2Contact.e_touchingFlag,
          bodyA = this.m_fixtureA.m_body,
          bodyB = this.m_fixtureB.m_body,
          aabbOverlap = this.m_fixtureA.m_aabb.TestOverlap(this.m_fixtureB.m_aabb);
      if (this.m_flags & b2Contact.e_sensorFlag) {
         if (aabbOverlap) {
            var shapeA = this.m_fixtureA.GetShape(),
          shapeB = this.m_fixtureB.GetShape(),
          xfA = bodyA.GetTransform(),
          xfB = bodyB.GetTransform();
            touching = b2Shape.TestOverlap(shapeA, xfA, shapeB, xfB);
         }
         this.m_manifold.m_pointCount = 0;
      }
      else {
         if (bodyA.GetType() !== b2Body.b2_dynamicBody || bodyA.IsBullet() || bodyB.GetType() !== b2Body.b2_dynamicBody || bodyB.IsBullet()) {
            this.m_flags |= b2Contact.e_continuousFlag;
         }
         else {
            this.m_flags &= ~b2Contact.e_continuousFlag;
         }
         if (aabbOverlap) {
            this.Evaluate();
            touching = this.m_manifold.m_pointCount > 0;
            for (var i = 0; i < this.m_manifold.m_pointCount; ++i) {
               var mp2 = this.m_manifold.m_points[i];
               mp2.m_normalImpulse = 0.0;
               mp2.m_tangentImpulse = 0.0;
               var id2 = mp2.m_id;
               for (var j = 0; j < this.m_oldManifold.m_pointCount; ++j) {
                  var mp1 = this.m_oldManifold.m_points[j];
                  if (mp1.m_id.key === id2.key) {
                     mp2.m_normalImpulse = mp1.m_normalImpulse;
                     mp2.m_tangentImpulse = mp1.m_tangentImpulse;
                     break;
                  }
               }
            }
         }
         else {
            this.m_manifold.m_pointCount = 0;
         }
         if (touching !== wasTouching) {
            bodyA.SetAwake(true);
            bodyB.SetAwake(true);
         }
      }
      if (touching) {
         this.m_flags |= b2Contact.e_touchingFlag;
      }
      else {
         this.m_flags &= ~b2Contact.e_touchingFlag;
      }
      if (wasTouching === false && touching === true) {
         listener.BeginContact(this);
      }
      if (wasTouching === true && touching === false) {
         listener.EndContact(this);
      }
      if ((this.m_flags & b2Contact.e_sensorFlag) === 0) {
         listener.PreSolve(this, this.m_oldManifold);
      }
   };

   /**
    * ComputeTOI
    *
    * @param sweepA
    * @param sweepB
    *
    */
   b2CircleContact.prototype.ComputeTOI = function (sweepA, sweepB) {
      b2Contact.s_input.proxyA.Set(this.m_fixtureA.GetShape());
      b2Contact.s_input.proxyB.Set(this.m_fixtureB.GetShape());
      b2Contact.s_input.sweepA = sweepA;
      b2Contact.s_input.sweepB = sweepB;
      b2Contact.s_input.tolerance = b2Settings.b2_linearSlop;
      return b2TimeOfImpact.TimeOfImpact(b2Contact.s_input);
   };

   /**
    *  Class b2PositionSolverManifold
    *
    * @param 
    *
    */
   b2PositionSolverManifold = Box2D.Dynamics.Contacts.b2PositionSolverManifold = function b2PositionSolverManifold() {

      this.m_normal = new b2Vec2(0, 0);
      this.m_separations = [];
      var i = b2Settings.b2_maxManifoldPoints;
      while (i) {
         this.m_separations.push(0);
         i--;
      }
      this.m_points = [];
      for (i = 0; i < b2Settings.b2_maxManifoldPoints; i++) {
         this.m_points.push(new b2Vec2(0, 0));
      }
   };
   b2PositionSolverManifold.constructor = b2PositionSolverManifold;

   b2PositionSolverManifold.circlePointA = new b2Vec2(0, 0);
   b2PositionSolverManifold.circlePointB = new b2Vec2(0, 0);

   b2PositionSolverManifold.prototype.m_normal          = null;
   b2PositionSolverManifold.prototype.m_separations     = null;
   b2PositionSolverManifold.prototype.m_points          = null;


   /**
    * Initialize
    *
    * @param cc
    *
    */
   b2PositionSolverManifold.prototype.Initialize = function (cc) {
      b2Assert(cc.pointCount > 0);
      var i = 0,
          clipPointX = 0,
          clipPointY = 0,
          tMat,
          tVec,
          planePointX = 0,
          planePointY = 0;
      switch (cc.type) {
      case b2Manifold.e_circles:
         {
            tMat = cc.bodyA.m_xf.R;
            tVec = cc.localPoint;
            var pointAX = cc.bodyA.m_xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y),
          pointAY = cc.bodyA.m_xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
            tMat = cc.bodyB.m_xf.R;
            tVec = cc.points[0].localPoint;
            var pointBX = cc.bodyB.m_xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y),
          pointBY = cc.bodyB.m_xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y),
          dX = pointBX - pointAX,
          dY = pointBY - pointAY,
          d2 = dX * dX + dY * dY;
            if (d2 > b2Settings.b2_epsilon * b2Settings.b2_epsilon) {
               var d = Math.sqrt(d2);
               this.m_normal.x = dX / d;
               this.m_normal.y = dY / d;
            }
            else {
               this.m_normal.x = 1.0;
               this.m_normal.y = 0.0;
            }
            this.m_points[0].x = 0.5 * (pointAX + pointBX);
            this.m_points[0].y = 0.5 * (pointAY + pointBY);
            this.m_separations[0] = dX * this.m_normal.x + dY * this.m_normal.y - cc.radius;
         }
         break;
      case b2Manifold.e_faceA:
         {
            tMat = cc.bodyA.m_xf.R;
            tVec = cc.localPlaneNormal;
            this.m_normal.x = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
            this.m_normal.y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
            tMat = cc.bodyA.m_xf.R;
            tVec = cc.localPoint;
            planePointX = cc.bodyA.m_xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
            planePointY = cc.bodyA.m_xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
            tMat = cc.bodyB.m_xf.R;
            for (i = 0; i < cc.pointCount; ++i) {
               tVec = cc.points[i].localPoint;
               clipPointX = cc.bodyB.m_xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
               clipPointY = cc.bodyB.m_xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
               this.m_separations[i] = (clipPointX - planePointX) * this.m_normal.x + (clipPointY - planePointY) * this.m_normal.y - cc.radius;
               this.m_points[i].x = clipPointX;
               this.m_points[i].y = clipPointY;
            }
         }
         break;
      case b2Manifold.e_faceB:
         {
            tMat = cc.bodyB.m_xf.R;
            tVec = cc.localPlaneNormal;
            this.m_normal.x = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
            this.m_normal.y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
            tMat = cc.bodyB.m_xf.R;
            tVec = cc.localPoint;
            planePointX = cc.bodyB.m_xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
            planePointY = cc.bodyB.m_xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
            tMat = cc.bodyA.m_xf.R;
            for (i = 0; i < cc.pointCount; ++i) {
               tVec = cc.points[i].localPoint;
               clipPointX = cc.bodyA.m_xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
               clipPointY = cc.bodyA.m_xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
               this.m_separations[i] = (clipPointX - planePointX) * this.m_normal.x + (clipPointY - planePointY) * this.m_normal.y - cc.radius;
               this.m_points[i].Set(clipPointX, clipPointY);
            }
            this.m_normal.x *= (-1);
            this.m_normal.y *= (-1);
         }
         break;
      }
   };

   /**
    *  Class b2ContactSolver
    *
    * @param 
    *
    */
   b2ContactSolver = Box2D.Dynamics.Contacts.b2ContactSolver = function b2ContactSolver() {
      this.m_step = new b2TimeStep();
      this.m_constraints = [];

   };
   b2ContactSolver.constructor = b2ContactSolver;

   b2ContactSolver.prototype.m_step              = null;
   b2ContactSolver.prototype.m_constraints       = null;
   b2ContactSolver.prototype.m_allocator         = null;
   b2ContactSolver.prototype.m_constraintCount   = 0;

   b2ContactSolver.s_worldManifold = new b2WorldManifold();
   b2ContactSolver.s_psm = new b2PositionSolverManifold();

   /**
    * Initialize
    *
    * @param step
    * @param contacts
    * @param contactCount
    * @param allocator
    *
    */
   b2ContactSolver.prototype.Initialize = function (step, contacts, contactCount, allocator) {
      contactCount = contactCount || 0;
      var contact;
      this.m_step.Set(step);
      this.m_allocator = allocator;
      var i = 0,
          tVec,
          tMat;
      this.m_constraintCount = contactCount;
      while (this.m_constraints.length < this.m_constraintCount) {
         this.m_constraints[this.m_constraints.length] = new b2ContactConstraint();
      }
      for (i = 0; i < contactCount; ++i) {
         contact = contacts[i];
         var fixtureA = contact.m_fixtureA,
          fixtureB = contact.m_fixtureB,
          shapeA = fixtureA.m_shape,
          shapeB = fixtureB.m_shape,
          radiusA = shapeA.m_radius,
          radiusB = shapeB.m_radius,
          bodyA = fixtureA.m_body,
          bodyB = fixtureB.m_body,
          manifold = contact.GetManifold(),
          friction = b2Settings.b2MixFriction(fixtureA.GetFriction(), fixtureB.GetFriction()),
          restitution = b2Settings.b2MixRestitution(fixtureA.GetRestitution(), fixtureB.GetRestitution()),
          vAX = bodyA.m_linearVelocity.x,
          vAY = bodyA.m_linearVelocity.y,
          vBX = bodyB.m_linearVelocity.x,
          vBY = bodyB.m_linearVelocity.y,
          wA = bodyA.m_angularVelocity,
          wB = bodyB.m_angularVelocity;
         b2Assert(manifold.m_pointCount > 0);
         b2ContactSolver.s_worldManifold.Initialize(manifold, bodyA.m_xf, radiusA, bodyB.m_xf, radiusB);
         var normalX = b2ContactSolver.s_worldManifold.m_normal.x,
          normalY = b2ContactSolver.s_worldManifold.m_normal.y,
          cc = this.m_constraints[i];
         cc.bodyA = bodyA;
         cc.bodyB = bodyB;
         cc.manifold = manifold;
         cc.normal.x = normalX;
         cc.normal.y = normalY;
         cc.pointCount = manifold.m_pointCount;
         cc.friction = friction;
         cc.restitution = restitution;
         cc.localPlaneNormal.x = manifold.m_localPlaneNormal.x;
         cc.localPlaneNormal.y = manifold.m_localPlaneNormal.y;
         cc.localPoint.x = manifold.m_localPoint.x;
         cc.localPoint.y = manifold.m_localPoint.y;
         cc.radius = radiusA + radiusB;
         cc.type = manifold.m_type;
         for (var k = 0; k < cc.pointCount; ++k) {
            var cp = manifold.m_points[k],
          ccp = cc.points[k];
            ccp.normalImpulse = cp.m_normalImpulse;
            ccp.tangentImpulse = cp.m_tangentImpulse;
            ccp.localPoint.SetV(cp.m_localPoint);
            var rAX = ccp.rA.x = b2ContactSolver.s_worldManifold.m_points[k].x - bodyA.m_sweep.c.x,
          rAY = ccp.rA.y = b2ContactSolver.s_worldManifold.m_points[k].y - bodyA.m_sweep.c.y,
          rBX = ccp.rB.x = b2ContactSolver.s_worldManifold.m_points[k].x - bodyB.m_sweep.c.x,
          rBY = ccp.rB.y = b2ContactSolver.s_worldManifold.m_points[k].y - bodyB.m_sweep.c.y,
          rnA = rAX * normalY - rAY * normalX,
          rnB = rBX * normalY - rBY * normalX;
            rnA *= rnA;
            rnB *= rnB;
            var kNormal = bodyA.m_invMass + bodyB.m_invMass + bodyA.m_invI * rnA + bodyB.m_invI * rnB;
            ccp.normalMass = 1.0 / kNormal;
            var kEqualized = bodyA.m_mass * bodyA.m_invMass + bodyB.m_mass * bodyB.m_invMass;
            kEqualized += bodyA.m_mass * bodyA.m_invI * rnA + bodyB.m_mass * bodyB.m_invI * rnB;
            ccp.equalizedMass = 1.0 / kEqualized;
            var tangentX = normalY,
          tangentY = (-normalX),
          rtA = rAX * tangentY - rAY * tangentX,
          rtB = rBX * tangentY - rBY * tangentX;
            rtA *= rtA;
            rtB *= rtB;
            var kTangent = bodyA.m_invMass + bodyB.m_invMass + bodyA.m_invI * rtA + bodyB.m_invI * rtB;
            ccp.tangentMass = 1.0 / kTangent;
            ccp.velocityBias = 0.0;
            var tX = vBX + ((-wB * rBY)) - vAX - ((-wA * rAY)),
          tY = vBY + (wB * rBX) - vAY - (wA * rAX),
          vRel = cc.normal.x * tX + cc.normal.y * tY;
            if (vRel < (-b2Settings.b2_velocityThreshold)) {
               ccp.velocityBias += (-cc.restitution * vRel);
            }
         }
         if (cc.pointCount === 2) {
            var ccp1 = cc.points[0],
          ccp2 = cc.points[1],
          invMassA = bodyA.m_invMass,
          invIA = bodyA.m_invI,
          invMassB = bodyB.m_invMass,
          invIB = bodyB.m_invI,
          rn1A = ccp1.rA.x * normalY - ccp1.rA.y * normalX,
          rn1B = ccp1.rB.x * normalY - ccp1.rB.y * normalX,
          rn2A = ccp2.rA.x * normalY - ccp2.rA.y * normalX,
          rn2B = ccp2.rB.x * normalY - ccp2.rB.y * normalX,
          k11 = invMassA + invMassB + invIA * rn1A * rn1A + invIB * rn1B * rn1B,
          k22 = invMassA + invMassB + invIA * rn2A * rn2A + invIB * rn2B * rn2B,
          k12 = invMassA + invMassB + invIA * rn1A * rn2A + invIB * rn1B * rn2B,
          k_maxConditionNumber = 100.0;
            if (k11 * k11 < k_maxConditionNumber * (k11 * k22 - k12 * k12)) {
               cc.K.col1.Set(k11, k12);
               cc.K.col2.Set(k12, k22);
               cc.K.GetInverse(cc.normalMass);
            }
            else {
               cc.pointCount = 1;
            }
         }
      }
   };

   /**
    * InitVelocityConstraints
    *
    * @param step
    *
    */
   b2ContactSolver.prototype.InitVelocityConstraints = function (step) {
      var tVec,
          tVec2,
          tMat;
      for (var i = 0; i < this.m_constraintCount; ++i) {
         var c = this.m_constraints[i],
          bodyA = c.bodyA,
          bodyB = c.bodyB,
          invMassA = bodyA.m_invMass,
          invIA = bodyA.m_invI,
          invMassB = bodyB.m_invMass,
          invIB = bodyB.m_invI,
          normalX = c.normal.x,
          normalY = c.normal.y,
          tangentX = normalY,
          tangentY = (-normalX),
          tX = 0,
          j = 0,
          tCount = 0;
         if (step.warmStarting) {
            tCount = c.pointCount;
            for (j = 0; j < tCount; ++j) {
               var ccp = c.points[j];
               ccp.normalImpulse *= step.dtRatio;
               ccp.tangentImpulse *= step.dtRatio;
               var PX = ccp.normalImpulse * normalX + ccp.tangentImpulse * tangentX,
          PY = ccp.normalImpulse * normalY + ccp.tangentImpulse * tangentY;
               bodyA.m_angularVelocity -= invIA * (ccp.rA.x * PY - ccp.rA.y * PX);
               bodyA.m_linearVelocity.x -= invMassA * PX;
               bodyA.m_linearVelocity.y -= invMassA * PY;
               bodyB.m_angularVelocity += invIB * (ccp.rB.x * PY - ccp.rB.y * PX);
               bodyB.m_linearVelocity.x += invMassB * PX;
               bodyB.m_linearVelocity.y += invMassB * PY;
            }
         }
         else {
            tCount = c.pointCount;
            for (j = 0; j < tCount; ++j) {
               var ccp2 = c.points[j];
               ccp2.normalImpulse = 0.0;
               ccp2.tangentImpulse = 0.0;
            }
         }
      }
   };

   /**
    * SolveVelocityConstraints
    *
    * @param 
    *
    */
   b2ContactSolver.prototype.SolveVelocityConstraints = function () {
      var j = 0,
          ccp,
          rAX = 0,
          rAY = 0,
          rBX = 0,
          rBY = 0,
          dvX = 0,
          dvY = 0,
          vn = 0,
          vt = 0,
          lambda = 0,
          maxFriction = 0,
          newImpulse = 0,
          PX = 0,
          PY = 0,
          dX = 0,
          dY = 0,
          P1X = 0,
          P1Y = 0,
          P2X = 0,
          P2Y = 0,
          tMat,
          tVec;
      for (var i = 0; i < this.m_constraintCount; ++i) {
         var c = this.m_constraints[i],
          bodyA = c.bodyA,
          bodyB = c.bodyB,
          wA = bodyA.m_angularVelocity,
          wB = bodyB.m_angularVelocity,
          vA = bodyA.m_linearVelocity,
          vB = bodyB.m_linearVelocity,
          invMassA = bodyA.m_invMass,
          invIA = bodyA.m_invI,
          invMassB = bodyB.m_invMass,
          invIB = bodyB.m_invI,
          normalX = c.normal.x,
          normalY = c.normal.y,
          tangentX = normalY,
          tangentY = (-normalX),
          friction = c.friction,
          tX = 0;
         for (j = 0; j < c.pointCount; j++) {
            ccp = c.points[j];
            dvX = vB.x - wB * ccp.rB.y - vA.x + wA * ccp.rA.y;
            dvY = vB.y + wB * ccp.rB.x - vA.y - wA * ccp.rA.x;
            vt = dvX * tangentX + dvY * tangentY;
            lambda = ccp.tangentMass * (-vt);
            maxFriction = friction * ccp.normalImpulse;
            newImpulse = b2Math.Clamp(ccp.tangentImpulse + lambda, (-maxFriction), maxFriction);
            lambda = newImpulse - ccp.tangentImpulse;
            PX = lambda * tangentX;
            PY = lambda * tangentY;
            vA.x -= invMassA * PX;
            vA.y -= invMassA * PY;
            wA -= invIA * (ccp.rA.x * PY - ccp.rA.y * PX);
            vB.x += invMassB * PX;
            vB.y += invMassB * PY;
            wB += invIB * (ccp.rB.x * PY - ccp.rB.y * PX);
            ccp.tangentImpulse = newImpulse;
         }
         var tCount = c.pointCount;
         if (c.pointCount === 1) {
            ccp = c.points[0];
            dvX = vB.x + ((-wB * ccp.rB.y)) - vA.x - ((-wA * ccp.rA.y));
            dvY = vB.y + (wB * ccp.rB.x) - vA.y - (wA * ccp.rA.x);
            vn = dvX * normalX + dvY * normalY;
            lambda = (-ccp.normalMass * (vn - ccp.velocityBias));
            newImpulse = ccp.normalImpulse + lambda;
            newImpulse = newImpulse > 0 ? newImpulse : 0.0;
            lambda = newImpulse - ccp.normalImpulse;
            PX = lambda * normalX;
            PY = lambda * normalY;
            vA.x -= invMassA * PX;
            vA.y -= invMassA * PY;
            wA -= invIA * (ccp.rA.x * PY - ccp.rA.y * PX);
            vB.x += invMassB * PX;
            vB.y += invMassB * PY;
            wB += invIB * (ccp.rB.x * PY - ccp.rB.y * PX);
            ccp.normalImpulse = newImpulse;
         }
         else {
            var cp1 = c.points[0],
          cp2 = c.points[1],
          aX = cp1.normalImpulse,
          aY = cp2.normalImpulse,
          dv1X = vB.x - wB * cp1.rB.y - vA.x + wA * cp1.rA.y,
          dv1Y = vB.y + wB * cp1.rB.x - vA.y - wA * cp1.rA.x,
          dv2X = vB.x - wB * cp2.rB.y - vA.x + wA * cp2.rA.y,
          dv2Y = vB.y + wB * cp2.rB.x - vA.y - wA * cp2.rA.x,
          vn1 = dv1X * normalX + dv1Y * normalY,
          vn2 = dv2X * normalX + dv2Y * normalY,
          bX = vn1 - cp1.velocityBias,
          bY = vn2 - cp2.velocityBias;
            tMat = c.K;
            bX -= tMat.col1.x * aX + tMat.col2.x * aY;
            bY -= tMat.col1.y * aX + tMat.col2.y * aY;
            var k_errorTol = 0.001;
            for (;;) {
               tMat = c.normalMass;
               var xX = (-(tMat.col1.x * bX + tMat.col2.x * bY)),
          xY = (-(tMat.col1.y * bX + tMat.col2.y * bY));
               if (xX >= 0.0 && xY >= 0.0) {
                  dX = xX - aX;
                  dY = xY - aY;
                  P1X = dX * normalX;
                  P1Y = dX * normalY;
                  P2X = dY * normalX;
                  P2Y = dY * normalY;
                  vA.x -= invMassA * (P1X + P2X);
                  vA.y -= invMassA * (P1Y + P2Y);
                  wA -= invIA * (cp1.rA.x * P1Y - cp1.rA.y * P1X + cp2.rA.x * P2Y - cp2.rA.y * P2X);
                  vB.x += invMassB * (P1X + P2X);
                  vB.y += invMassB * (P1Y + P2Y);
                  wB += invIB * (cp1.rB.x * P1Y - cp1.rB.y * P1X + cp2.rB.x * P2Y - cp2.rB.y * P2X);
                  cp1.normalImpulse = xX;
                  cp2.normalImpulse = xY;
                  break;
               }
               xX = (-cp1.normalMass * bX);
               xY = 0.0;
               vn1 = 0.0;
               vn2 = c.K.col1.y * xX + bY;
               if (xX >= 0.0 && vn2 >= 0.0) {
                  dX = xX - aX;
                  dY = xY - aY;
                  P1X = dX * normalX;
                  P1Y = dX * normalY;
                  P2X = dY * normalX;
                  P2Y = dY * normalY;
                  vA.x -= invMassA * (P1X + P2X);
                  vA.y -= invMassA * (P1Y + P2Y);
                  wA -= invIA * (cp1.rA.x * P1Y - cp1.rA.y * P1X + cp2.rA.x * P2Y - cp2.rA.y * P2X);
                  vB.x += invMassB * (P1X + P2X);
                  vB.y += invMassB * (P1Y + P2Y);
                  wB += invIB * (cp1.rB.x * P1Y - cp1.rB.y * P1X + cp2.rB.x * P2Y - cp2.rB.y * P2X);
                  cp1.normalImpulse = xX;
                  cp2.normalImpulse = xY;
                  break;
               }
               xX = 0.0;
               xY = (-cp2.normalMass * bY);
               vn1 = c.K.col2.x * xY + bX;
               vn2 = 0.0;
               if (xY >= 0.0 && vn1 >= 0.0) {
                  dX = xX - aX;
                  dY = xY - aY;
                  P1X = dX * normalX;
                  P1Y = dX * normalY;
                  P2X = dY * normalX;
                  P2Y = dY * normalY;
                  vA.x -= invMassA * (P1X + P2X);
                  vA.y -= invMassA * (P1Y + P2Y);
                  wA -= invIA * (cp1.rA.x * P1Y - cp1.rA.y * P1X + cp2.rA.x * P2Y - cp2.rA.y * P2X);
                  vB.x += invMassB * (P1X + P2X);
                  vB.y += invMassB * (P1Y + P2Y);
                  wB += invIB * (cp1.rB.x * P1Y - cp1.rB.y * P1X + cp2.rB.x * P2Y - cp2.rB.y * P2X);
                  cp1.normalImpulse = xX;
                  cp2.normalImpulse = xY;
                  break;
               }
               xX = 0.0;
               xY = 0.0;
               vn1 = bX;
               vn2 = bY;
               if (vn1 >= 0.0 && vn2 >= 0.0) {
                  dX = xX - aX;
                  dY = xY - aY;
                  P1X = dX * normalX;
                  P1Y = dX * normalY;
                  P2X = dY * normalX;
                  P2Y = dY * normalY;
                  vA.x -= invMassA * (P1X + P2X);
                  vA.y -= invMassA * (P1Y + P2Y);
                  wA -= invIA * (cp1.rA.x * P1Y - cp1.rA.y * P1X + cp2.rA.x * P2Y - cp2.rA.y * P2X);
                  vB.x += invMassB * (P1X + P2X);
                  vB.y += invMassB * (P1Y + P2Y);
                  wB += invIB * (cp1.rB.x * P1Y - cp1.rB.y * P1X + cp2.rB.x * P2Y - cp2.rB.y * P2X);
                  cp1.normalImpulse = xX;
                  cp2.normalImpulse = xY;
                  break;
               }
               break;
            }
         }
         bodyA.m_angularVelocity = wA;
         bodyB.m_angularVelocity = wB;
      }
   };

   /**
    * FinalizeVelocityConstraints
    *
    * @param 
    *
    */
   b2ContactSolver.prototype.FinalizeVelocityConstraints = function () {
      for (var i = 0; i < this.m_constraintCount; ++i) {
         var c = this.m_constraints[i],
          m = c.manifold;
         for (var j = 0; j < c.pointCount; ++j) {
            var point1 = m.m_points[j],
          point2 = c.points[j];
            point1.m_normalImpulse = point2.normalImpulse;
            point1.m_tangentImpulse = point2.tangentImpulse;
         }
      }
   };

   /**
    * SolvePositionConstraints
    *
    * @param baumgarte
    *
    */
   b2ContactSolver.prototype.SolvePositionConstraints = function (baumgarte) {
      baumgarte = baumgarte || 0;
      var minSeparation = 0.0;
      for (var i = 0; i < this.m_constraintCount; i++) {
         var c = this.m_constraints[i],
          bodyA = c.bodyA,
          bodyB = c.bodyB,
          invMassA = bodyA.m_mass * bodyA.m_invMass,
          invIA = bodyA.m_mass * bodyA.m_invI,
          invMassB = bodyB.m_mass * bodyB.m_invMass,
          invIB = bodyB.m_mass * bodyB.m_invI;
         b2ContactSolver.s_psm.Initialize(c);
         var normal = b2ContactSolver.s_psm.m_normal;
         for (var j = 0; j < c.pointCount; j++) {
            var ccp = c.points[j],
          point = b2ContactSolver.s_psm.m_points[j],
          separation = b2ContactSolver.s_psm.m_separations[j],
          rAX = point.x - bodyA.m_sweep.c.x,
          rAY = point.y - bodyA.m_sweep.c.y,
          rBX = point.x - bodyB.m_sweep.c.x,
          rBY = point.y - bodyB.m_sweep.c.y;
            minSeparation = minSeparation < separation ? minSeparation : separation;
            var C = b2Math.Clamp(baumgarte * (separation + b2Settings.b2_linearSlop), (-b2Settings.b2_maxLinearCorrection), 0.0),
          impulse = (-ccp.equalizedMass * C),
          PX = impulse * normal.x,
          PY = impulse * normal.y;bodyA.m_sweep.c.x -= invMassA * PX;
            bodyA.m_sweep.c.y -= invMassA * PY;
            bodyA.m_sweep.a -= invIA * (rAX * PY - rAY * PX);
            bodyA.SynchronizeTransform();
            bodyB.m_sweep.c.x += invMassB * PX;
            bodyB.m_sweep.c.y += invMassB * PY;
            bodyB.m_sweep.a += invIB * (rBX * PY - rBY * PX);
            bodyB.SynchronizeTransform();
         }
      }
      return minSeparation > (-1.5 * b2Settings.b2_linearSlop);
   };

   /**
    *  Class b2EdgeAndCircleContact
    *
    * @param 
    *
    */
   b2EdgeAndCircleContact = Box2D.Dynamics.Contacts.b2EdgeAndCircleContact = function b2EdgeAndCircleContact() {
      b2Contact.call(this);
   };
   b2EdgeAndCircleContact.constructor = b2EdgeAndCircleContact;
   b2EdgeAndCircleContact.prototype = Object.create(b2Contact.prototype );


   /**
    * Static Create
    *
    * @param allocator
    *
    */
   b2EdgeAndCircleContact.Create = function (allocator) {
      return new b2EdgeAndCircleContact();
   };

   /**
    * Static Destroy
    *
    * @param contact
    * @param allocator
    *
    */
   b2EdgeAndCircleContact.Destroy = function (contact, allocator) {};

   /**
    * Reset
    *
    * @param fixtureA
    * @param fixtureB
    *
    */
   b2EdgeAndCircleContact.prototype.Reset = function (fixtureA, fixtureB) {
      b2Contact.prototype.Reset.call(this, fixtureA, fixtureB);
   };

   /**
    * Evaluate
    *
    * @param 
    *
    */
   b2EdgeAndCircleContact.prototype.Evaluate = function () {
      var bA = this.m_fixtureA.GetBody(),
          bB = this.m_fixtureB.GetBody();
      this.b2CollideEdgeAndCircle(this.m_manifold, (this.m_fixtureA.GetShape() instanceof b2EdgeShape ? this.m_fixtureA.GetShape() : null), bA.m_xf, (this.m_fixtureB.GetShape() instanceof b2CircleShape ? this.m_fixtureB.GetShape() : null), bB.m_xf);
   };

   /**
    * b2CollideEdgeAndCircle
    *
    * @param manifold
    * @param edge
    * @param xf1
    * @param circle
    * @param xf2
    *
    */
   b2EdgeAndCircleContact.prototype.b2CollideEdgeAndCircle = function (manifold, edge, xf1, circle, xf2) {};

   /**
    * GetManifold
    *
    * @param 
    *
    */
   b2EdgeAndCircleContact.prototype.GetManifold = function () {
      return this.m_manifold;
   };

   /**
    * GetWorldManifold
    *
    * @param worldManifold
    *
    */
   b2EdgeAndCircleContact.prototype.GetWorldManifold = function (worldManifold) {
      var bodyA = this.m_fixtureA.GetBody(),
          bodyB = this.m_fixtureB.GetBody(),
          shapeA = this.m_fixtureA.GetShape(),
          shapeB = this.m_fixtureB.GetShape();
      worldManifold.Initialize(this.m_manifold, bodyA.GetTransform(), shapeA.m_radius, bodyB.GetTransform(), shapeB.m_radius);
   };

   /**
    * IsTouching
    *
    * @param 
    *
    */
   b2EdgeAndCircleContact.prototype.IsTouching = function () {
      return (this.m_flags & b2Contact.e_touchingFlag) === b2Contact.e_touchingFlag;
   };

   /**
    * IsContinuous
    *
    * @param 
    *
    */
   b2EdgeAndCircleContact.prototype.IsContinuous = function () {
      return (this.m_flags & b2Contact.e_continuousFlag) === b2Contact.e_continuousFlag;
   };

   /**
    * SetSensor
    *
    * @param sensor
    *
    */
   b2EdgeAndCircleContact.prototype.SetSensor = function (sensor) {
      if (sensor) {
         this.m_flags |= b2Contact.e_sensorFlag;
      }
      else {
         this.m_flags &= ~b2Contact.e_sensorFlag;
      }
   };

   /**
    * IsSensor
    *
    * @param 
    *
    */
   b2EdgeAndCircleContact.prototype.IsSensor = function () {
      return (this.m_flags & b2Contact.e_sensorFlag) === b2Contact.e_sensorFlag;
   };

   /**
    * SetEnabled
    *
    * @param flag
    *
    */
   b2EdgeAndCircleContact.prototype.SetEnabled = function (flag) {
      if (flag) {
         this.m_flags |= b2Contact.e_enabledFlag;
      }
      else {
         this.m_flags &= ~b2Contact.e_enabledFlag;
      }
   };

   /**
    * IsEnabled
    *
    * @param 
    *
    */
   b2EdgeAndCircleContact.prototype.IsEnabled = function () {
      return (this.m_flags & b2Contact.e_enabledFlag) === b2Contact.e_enabledFlag;
   };

   /**
    * GetNext
    *
    * @param 
    *
    */
   b2EdgeAndCircleContact.prototype.GetNext = function () {
      return this.m_next;
   };

   /**
    * GetFixtureA
    *
    * @param 
    *
    */
   b2EdgeAndCircleContact.prototype.GetFixtureA = function () {
      return this.m_fixtureA;
   };

   /**
    * GetFixtureB
    *
    * @param 
    *
    */
   b2EdgeAndCircleContact.prototype.GetFixtureB = function () {
      return this.m_fixtureB;
   };

   /**
    * FlagForFiltering
    *
    * @param 
    *
    */
   b2EdgeAndCircleContact.prototype.FlagForFiltering = function () {
      this.m_flags |= b2Contact.e_filterFlag;
   };

   /**
    * b2Contact
    *
    * @param 
    *
    */
   b2EdgeAndCircleContact.prototype.b2Contact = function () {};

   /**
    * Update
    *
    * @param listener
    *
    */
   b2EdgeAndCircleContact.prototype.Update = function (listener) {
      var tManifold = this.m_oldManifold;
      this.m_oldManifold = this.m_manifold;
      this.m_manifold = tManifold;
      this.m_flags |= b2Contact.e_enabledFlag;
      var touching = false,
          wasTouching = (this.m_flags & b2Contact.e_touchingFlag) === b2Contact.e_touchingFlag,
          bodyA = this.m_fixtureA.m_body,
          bodyB = this.m_fixtureB.m_body,
          aabbOverlap = this.m_fixtureA.m_aabb.TestOverlap(this.m_fixtureB.m_aabb);
      if (this.m_flags & b2Contact.e_sensorFlag) {
         if (aabbOverlap) {
            var shapeA = this.m_fixtureA.GetShape(),
          shapeB = this.m_fixtureB.GetShape(),
          xfA = bodyA.GetTransform(),
          xfB = bodyB.GetTransform();
            touching = b2Shape.TestOverlap(shapeA, xfA, shapeB, xfB);
         }
         this.m_manifold.m_pointCount = 0;
      }
      else {
         if (bodyA.GetType() !== b2Body.b2_dynamicBody || bodyA.IsBullet() || bodyB.GetType() !== b2Body.b2_dynamicBody || bodyB.IsBullet()) {
            this.m_flags |= b2Contact.e_continuousFlag;
         }
         else {
            this.m_flags &= ~b2Contact.e_continuousFlag;
         }
         if (aabbOverlap) {
            this.Evaluate();
            touching = this.m_manifold.m_pointCount > 0;
            for (var i = 0; i < this.m_manifold.m_pointCount; ++i) {
               var mp2 = this.m_manifold.m_points[i];
               mp2.m_normalImpulse = 0.0;
               mp2.m_tangentImpulse = 0.0;
               var id2 = mp2.m_id;
               for (var j = 0; j < this.m_oldManifold.m_pointCount; ++j) {
                  var mp1 = this.m_oldManifold.m_points[j];
                  if (mp1.m_id.key === id2.key) {
                     mp2.m_normalImpulse = mp1.m_normalImpulse;
                     mp2.m_tangentImpulse = mp1.m_tangentImpulse;
                     break;
                  }
               }
            }
         }
         else {
            this.m_manifold.m_pointCount = 0;
         }
         if (touching !== wasTouching) {
            bodyA.SetAwake(true);
            bodyB.SetAwake(true);
         }
      }
      if (touching) {
         this.m_flags |= b2Contact.e_touchingFlag;
      }
      else {
         this.m_flags &= ~b2Contact.e_touchingFlag;
      }
      if (wasTouching === false && touching === true) {
         listener.BeginContact(this);
      }
      if (wasTouching === true && touching === false) {
         listener.EndContact(this);
      }
      if ((this.m_flags & b2Contact.e_sensorFlag) === 0) {
         listener.PreSolve(this, this.m_oldManifold);
      }
   };

   /**
    * ComputeTOI
    *
    * @param sweepA
    * @param sweepB
    *
    */
   b2EdgeAndCircleContact.prototype.ComputeTOI = function (sweepA, sweepB) {
      b2Contact.s_input.proxyA.Set(this.m_fixtureA.GetShape());
      b2Contact.s_input.proxyB.Set(this.m_fixtureB.GetShape());
      b2Contact.s_input.sweepA = sweepA;
      b2Contact.s_input.sweepB = sweepB;
      b2Contact.s_input.tolerance = b2Settings.b2_linearSlop;
      return b2TimeOfImpact.TimeOfImpact(b2Contact.s_input);
   };

   /**
    *  Class b2NullContact
    *
    * @param 
    *
    */
   b2NullContact = Box2D.Dynamics.Contacts.b2NullContact = function b2NullContact() {
      b2Contact.call(this);
   };
   b2NullContact.constructor = b2NullContact;
   b2NullContact.prototype = Object.create(b2Contact.prototype );

   /**
    * Evaluate
    *
    * @param 
    *
    */
   b2NullContact.prototype.Evaluate = function () {};

   /**
    * GetManifold
    *
    * @param 
    *
    */
   b2NullContact.prototype.GetManifold = function () {
      return this.m_manifold;
   };

   /**
    * GetWorldManifold
    *
    * @param worldManifold
    *
    */
   b2NullContact.prototype.GetWorldManifold = function (worldManifold) {
      var bodyA = this.m_fixtureA.GetBody(),
          bodyB = this.m_fixtureB.GetBody(),
          shapeA = this.m_fixtureA.GetShape(),
          shapeB = this.m_fixtureB.GetShape();
      worldManifold.Initialize(this.m_manifold, bodyA.GetTransform(), shapeA.m_radius, bodyB.GetTransform(), shapeB.m_radius);
   };

   /**
    * IsTouching
    *
    * @param 
    *
    */
   b2NullContact.prototype.IsTouching = function () {
      return (this.m_flags & b2Contact.e_touchingFlag) === b2Contact.e_touchingFlag;
   };

   /**
    * IsContinuous
    *
    * @param 
    *
    */
   b2NullContact.prototype.IsContinuous = function () {
      return (this.m_flags & b2Contact.e_continuousFlag) === b2Contact.e_continuousFlag;
   };

   /**
    * SetSensor
    *
    * @param sensor
    *
    */
   b2NullContact.prototype.SetSensor = function (sensor) {
      if (sensor) {
         this.m_flags |= b2Contact.e_sensorFlag;
      }
      else {
         this.m_flags &= ~b2Contact.e_sensorFlag;
      }
   };

   /**
    * IsSensor
    *
    * @param 
    *
    */
   b2NullContact.prototype.IsSensor = function () {
      return (this.m_flags & b2Contact.e_sensorFlag) === b2Contact.e_sensorFlag;
   };

   /**
    * SetEnabled
    *
    * @param flag
    *
    */
   b2NullContact.prototype.SetEnabled = function (flag) {
      if (flag) {
         this.m_flags |= b2Contact.e_enabledFlag;
      }
      else {
         this.m_flags &= ~b2Contact.e_enabledFlag;
      }
   };

   /**
    * IsEnabled
    *
    * @param 
    *
    */
   b2NullContact.prototype.IsEnabled = function () {
      return (this.m_flags & b2Contact.e_enabledFlag) === b2Contact.e_enabledFlag;
   };

   /**
    * GetNext
    *
    * @param 
    *
    */
   b2NullContact.prototype.GetNext = function () {
      return this.m_next;
   };

   /**
    * GetFixtureA
    *
    * @param 
    *
    */
   b2NullContact.prototype.GetFixtureA = function () {
      return this.m_fixtureA;
   };

   /**
    * GetFixtureB
    *
    * @param 
    *
    */
   b2NullContact.prototype.GetFixtureB = function () {
      return this.m_fixtureB;
   };

   /**
    * FlagForFiltering
    *
    * @param 
    *
    */
   b2NullContact.prototype.FlagForFiltering = function () {
      this.m_flags |= b2Contact.e_filterFlag;
   };

   /**
    * b2Contact
    *
    * @param 
    *
    */
   b2NullContact.prototype.b2Contact = function () {};

   /**
    * Reset
    *
    * @param fixtureA
    * @param fixtureB
    *
    */
   b2NullContact.prototype.Reset = function (fixtureA, fixtureB) {
      fixtureA = fixtureA || null;
      fixtureB = fixtureB || null;
      this.m_flags = b2Contact.e_enabledFlag;
      if (!fixtureA || !fixtureB) {
         this.m_fixtureA = null;
         this.m_fixtureB = null;
         return;
      }
      if (fixtureA.IsSensor() || fixtureB.IsSensor()) {
         this.m_flags |= b2Contact.e_sensorFlag;
      }
      var bodyA = fixtureA.GetBody(),
          bodyB = fixtureB.GetBody();
      if (bodyA.GetType() !== b2Body.b2_dynamicBody || bodyA.IsBullet() || bodyB.GetType() !== b2Body.b2_dynamicBody || bodyB.IsBullet()) {
         this.m_flags |= b2Contact.e_continuousFlag;
      }
      this.m_fixtureA = fixtureA;
      this.m_fixtureB = fixtureB;
      this.m_manifold.m_pointCount = 0;
      this.m_prev = null;
      this.m_next = null;
      this.m_nodeA.contact = null;
      this.m_nodeA.prev = null;
      this.m_nodeA.next = null;
      this.m_nodeA.other = null;
      this.m_nodeB.contact = null;
      this.m_nodeB.prev = null;
      this.m_nodeB.next = null;
      this.m_nodeB.other = null;
   };

   /**
    * Update
    *
    * @param listener
    *
    */
   b2NullContact.prototype.Update = function (listener) {
      var tManifold = this.m_oldManifold;
      this.m_oldManifold = this.m_manifold;
      this.m_manifold = tManifold;
      this.m_flags |= b2Contact.e_enabledFlag;
      var touching = false,
          wasTouching = (this.m_flags & b2Contact.e_touchingFlag) === b2Contact.e_touchingFlag,
          bodyA = this.m_fixtureA.m_body,
          bodyB = this.m_fixtureB.m_body,
          aabbOverlap = this.m_fixtureA.m_aabb.TestOverlap(this.m_fixtureB.m_aabb);
      if (this.m_flags & b2Contact.e_sensorFlag) {
         if (aabbOverlap) {
            var shapeA = this.m_fixtureA.GetShape(),
          shapeB = this.m_fixtureB.GetShape(),
          xfA = bodyA.GetTransform(),
          xfB = bodyB.GetTransform();
            touching = b2Shape.TestOverlap(shapeA, xfA, shapeB, xfB);
         }
         this.m_manifold.m_pointCount = 0;
      }
      else {
         if (bodyA.GetType() !== b2Body.b2_dynamicBody || bodyA.IsBullet() || bodyB.GetType() !== b2Body.b2_dynamicBody || bodyB.IsBullet()) {
            this.m_flags |= b2Contact.e_continuousFlag;
         }
         else {
            this.m_flags &= ~b2Contact.e_continuousFlag;
         }
         if (aabbOverlap) {
            this.Evaluate();
            touching = this.m_manifold.m_pointCount > 0;
            for (var i = 0; i < this.m_manifold.m_pointCount; ++i) {
               var mp2 = this.m_manifold.m_points[i];
               mp2.m_normalImpulse = 0.0;
               mp2.m_tangentImpulse = 0.0;
               var id2 = mp2.m_id;
               for (var j = 0; j < this.m_oldManifold.m_pointCount; ++j) {
                  var mp1 = this.m_oldManifold.m_points[j];
                  if (mp1.m_id.key === id2.key) {
                     mp2.m_normalImpulse = mp1.m_normalImpulse;
                     mp2.m_tangentImpulse = mp1.m_tangentImpulse;
                     break;
                  }
               }
            }
         }
         else {
            this.m_manifold.m_pointCount = 0;
         }
         if (touching !== wasTouching) {
            bodyA.SetAwake(true);
            bodyB.SetAwake(true);
         }
      }
      if (touching) {
         this.m_flags |= b2Contact.e_touchingFlag;
      }
      else {
         this.m_flags &= ~b2Contact.e_touchingFlag;
      }
      if (wasTouching === false && touching === true) {
         listener.BeginContact(this);
      }
      if (wasTouching === true && touching === false) {
         listener.EndContact(this);
      }
      if ((this.m_flags & b2Contact.e_sensorFlag) === 0) {
         listener.PreSolve(this, this.m_oldManifold);
      }
   };

   /**
    * ComputeTOI
    *
    * @param sweepA
    * @param sweepB
    *
    */
   b2NullContact.prototype.ComputeTOI = function (sweepA, sweepB) {
      b2Contact.s_input.proxyA.Set(this.m_fixtureA.GetShape());
      b2Contact.s_input.proxyB.Set(this.m_fixtureB.GetShape());
      b2Contact.s_input.sweepA = sweepA;
      b2Contact.s_input.sweepB = sweepB;
      b2Contact.s_input.tolerance = b2Settings.b2_linearSlop;
      return b2TimeOfImpact.TimeOfImpact(b2Contact.s_input);
   };

   /**
    *  Class b2PolyAndCircleContact
    *
    * @param 
    *
    */
   b2PolyAndCircleContact = Box2D.Dynamics.Contacts.b2PolyAndCircleContact = function b2PolyAndCircleContact() {

      b2Contact.call(this);
   };
   b2PolyAndCircleContact.constructor = b2PolyAndCircleContact;
   b2PolyAndCircleContact.prototype = Object.create(b2Contact.prototype );

   /**
    * Static Create
    *
    * @param allocator
    *
    */
   b2PolyAndCircleContact.Create = function (allocator) {
      return new b2PolyAndCircleContact();
   };

   /**
    * Static Destroy
    *
    * @param contact
    * @param allocator
    *
    */
   b2PolyAndCircleContact.Destroy = function (contact, allocator) {};

   /**
    * Reset
    *
    * @param fixtureA
    * @param fixtureB
    *
    */
   b2PolyAndCircleContact.prototype.Reset = function (fixtureA, fixtureB) {
      b2Contact.prototype.Reset.call(this, fixtureA, fixtureB);
      b2Assert(fixtureA.GetType() === b2Shape.e_polygonShape);
      b2Assert(fixtureB.GetType() === b2Shape.e_circleShape);
   };

   /**
    * Evaluate
    *
    * @param 
    *
    */
   b2PolyAndCircleContact.prototype.Evaluate = function () {
      var bA = this.m_fixtureA.m_body,
          bB = this.m_fixtureB.m_body;
      b2Collision.CollidePolygonAndCircle(this.m_manifold, (this.m_fixtureA.GetShape() instanceof b2PolygonShape ? this.m_fixtureA.GetShape() : null), bA.m_xf, (this.m_fixtureB.GetShape() instanceof b2CircleShape ? this.m_fixtureB.GetShape() : null), bB.m_xf);
   };

   /**
    * GetManifold
    *
    * @param 
    *
    */
   b2PolyAndCircleContact.prototype.GetManifold = function () {
      return this.m_manifold;
   };

   /**
    * GetWorldManifold
    *
    * @param worldManifold
    *
    */
   b2PolyAndCircleContact.prototype.GetWorldManifold = function (worldManifold) {
      var bodyA = this.m_fixtureA.GetBody(),
          bodyB = this.m_fixtureB.GetBody(),
          shapeA = this.m_fixtureA.GetShape(),
          shapeB = this.m_fixtureB.GetShape();
      worldManifold.Initialize(this.m_manifold, bodyA.GetTransform(), shapeA.m_radius, bodyB.GetTransform(), shapeB.m_radius);
   };

   /**
    * IsTouching
    *
    * @param 
    *
    */
   b2PolyAndCircleContact.prototype.IsTouching = function () {
      return (this.m_flags & b2Contact.e_touchingFlag) === b2Contact.e_touchingFlag;
   };

   /**
    * IsContinuous
    *
    * @param 
    *
    */
   b2PolyAndCircleContact.prototype.IsContinuous = function () {
      return (this.m_flags & b2Contact.e_continuousFlag) === b2Contact.e_continuousFlag;
   };

   /**
    * SetSensor
    *
    * @param sensor
    *
    */
   b2PolyAndCircleContact.prototype.SetSensor = function (sensor) {
      if (sensor) {
         this.m_flags |= b2Contact.e_sensorFlag;
      }
      else {
         this.m_flags &= ~b2Contact.e_sensorFlag;
      }
   };

   /**
    * IsSensor
    *
    * @param 
    *
    */
   b2PolyAndCircleContact.prototype.IsSensor = function () {
      return (this.m_flags & b2Contact.e_sensorFlag) === b2Contact.e_sensorFlag;
   };

   /**
    * SetEnabled
    *
    * @param flag
    *
    */
   b2PolyAndCircleContact.prototype.SetEnabled = function (flag) {
      if (flag) {
         this.m_flags |= b2Contact.e_enabledFlag;
      }
      else {
         this.m_flags &= ~b2Contact.e_enabledFlag;
      }
   };

   /**
    * IsEnabled
    *
    * @param 
    *
    */
   b2PolyAndCircleContact.prototype.IsEnabled = function () {
      return (this.m_flags & b2Contact.e_enabledFlag) === b2Contact.e_enabledFlag;
   };

   /**
    * GetNext
    *
    * @param 
    *
    */
   b2PolyAndCircleContact.prototype.GetNext = function () {
      return this.m_next;
   };

   /**
    * GetFixtureA
    *
    * @param 
    *
    */
   b2PolyAndCircleContact.prototype.GetFixtureA = function () {
      return this.m_fixtureA;
   };

   /**
    * GetFixtureB
    *
    * @param 
    *
    */
   b2PolyAndCircleContact.prototype.GetFixtureB = function () {
      return this.m_fixtureB;
   };

   /**
    * FlagForFiltering
    *
    * @param 
    *
    */
   b2PolyAndCircleContact.prototype.FlagForFiltering = function () {
      this.m_flags |= b2Contact.e_filterFlag;
   };

   /**
    * b2Contact
    *
    * @param 
    *
    */
   b2PolyAndCircleContact.prototype.b2Contact = function () {};

   /**
    * Update
    *
    * @param listener
    *
    */
   b2PolyAndCircleContact.prototype.Update = function (listener) {
      var tManifold = this.m_oldManifold;
      this.m_oldManifold = this.m_manifold;
      this.m_manifold = tManifold;
      this.m_flags |= b2Contact.e_enabledFlag;
      var touching = false,
          wasTouching = (this.m_flags & b2Contact.e_touchingFlag) === b2Contact.e_touchingFlag,
          bodyA = this.m_fixtureA.m_body,
          bodyB = this.m_fixtureB.m_body,
          aabbOverlap = this.m_fixtureA.m_aabb.TestOverlap(this.m_fixtureB.m_aabb);
      if (this.m_flags & b2Contact.e_sensorFlag) {
         if (aabbOverlap) {
            var shapeA = this.m_fixtureA.GetShape(),
          shapeB = this.m_fixtureB.GetShape(),
          xfA = bodyA.GetTransform(),
          xfB = bodyB.GetTransform();
            touching = b2Shape.TestOverlap(shapeA, xfA, shapeB, xfB);
         }
         this.m_manifold.m_pointCount = 0;
      }
      else {
         if (bodyA.GetType() !== b2Body.b2_dynamicBody || bodyA.IsBullet() || bodyB.GetType() !== b2Body.b2_dynamicBody || bodyB.IsBullet()) {
            this.m_flags |= b2Contact.e_continuousFlag;
         }
         else {
            this.m_flags &= ~b2Contact.e_continuousFlag;
         }
         if (aabbOverlap) {
            this.Evaluate();
            touching = this.m_manifold.m_pointCount > 0;
            for (var i = 0; i < this.m_manifold.m_pointCount; ++i) {
               var mp2 = this.m_manifold.m_points[i];
               mp2.m_normalImpulse = 0.0;
               mp2.m_tangentImpulse = 0.0;
               var id2 = mp2.m_id;
               for (var j = 0; j < this.m_oldManifold.m_pointCount; ++j) {
                  var mp1 = this.m_oldManifold.m_points[j];
                  if (mp1.m_id.key === id2.key) {
                     mp2.m_normalImpulse = mp1.m_normalImpulse;
                     mp2.m_tangentImpulse = mp1.m_tangentImpulse;
                     break;
                  }
               }
            }
         }
         else {
            this.m_manifold.m_pointCount = 0;
         }
         if (touching !== wasTouching) {
            bodyA.SetAwake(true);
            bodyB.SetAwake(true);
         }
      }
      if (touching) {
         this.m_flags |= b2Contact.e_touchingFlag;
      }
      else {
         this.m_flags &= ~b2Contact.e_touchingFlag;
      }
      if (wasTouching === false && touching === true) {
         listener.BeginContact(this);
      }
      if (wasTouching === true && touching === false) {
         listener.EndContact(this);
      }
      if ((this.m_flags & b2Contact.e_sensorFlag) === 0) {
         listener.PreSolve(this, this.m_oldManifold);
      }
   };

   /**
    * ComputeTOI
    *
    * @param sweepA
    * @param sweepB
    *
    */
   b2PolyAndCircleContact.prototype.ComputeTOI = function (sweepA, sweepB) {
      b2Contact.s_input.proxyA.Set(this.m_fixtureA.GetShape());
      b2Contact.s_input.proxyB.Set(this.m_fixtureB.GetShape());
      b2Contact.s_input.sweepA = sweepA;
      b2Contact.s_input.sweepB = sweepB;
      b2Contact.s_input.tolerance = b2Settings.b2_linearSlop;
      return b2TimeOfImpact.TimeOfImpact(b2Contact.s_input);
   };

   /**
    *  Class b2PolyAndEdgeContact
    *
    * @param 
    *
    */
   b2PolyAndEdgeContact = Box2D.Dynamics.Contacts.b2PolyAndEdgeContact = function b2PolyAndEdgeContact() {

      b2Contact.call(this);
   };
   b2PolyAndEdgeContact.constructor = b2PolyAndEdgeContact;
   b2PolyAndEdgeContact.prototype = Object.create(b2Contact.prototype );

   /**
    * Static Create
    *
    * @param allocator
    *
    */
   b2PolyAndEdgeContact.Create = function (allocator) {
      return new b2PolyAndEdgeContact();
   };

   /**
    * Static Destroy
    *
    * @param contact
    * @param allocator
    *
    */
   b2PolyAndEdgeContact.Destroy = function (contact, allocator) {};

   /**
    * Reset
    *
    * @param fixtureA
    * @param fixtureB
    *
    */
   b2PolyAndEdgeContact.prototype.Reset = function (fixtureA, fixtureB) {
      b2Contact.prototype.Reset.call(this, fixtureA, fixtureB);
      b2Assert(fixtureA.GetType() === b2Shape.e_polygonShape);
      b2Assert(fixtureB.GetType() === b2Shape.e_edgeShape);
   };

   /**
    * Evaluate
    *
    * @param 
    *
    */
   b2PolyAndEdgeContact.prototype.Evaluate = function () {
      var bA = this.m_fixtureA.GetBody(),
          bB = this.m_fixtureB.GetBody();
      this.b2CollidePolyAndEdge(this.m_manifold, (this.m_fixtureA.GetShape() instanceof b2PolygonShape ? this.m_fixtureA.GetShape() : null), bA.m_xf, (this.m_fixtureB.GetShape() instanceof b2EdgeShape ? this.m_fixtureB.GetShape() : null), bB.m_xf);
   };

   /**
    * b2CollidePolyAndEdge
    *
    * @param manifold
    * @param polygon
    * @param xf1
    * @param edge
    * @param xf2
    *
    */
   b2PolyAndEdgeContact.prototype.b2CollidePolyAndEdge = function (manifold, polygon, xf1, edge, xf2) {};

   /**
    * GetManifold
    *
    * @param 
    *
    */
   b2PolyAndEdgeContact.prototype.GetManifold = function () {
      return this.m_manifold;
   };

   /**
    * GetWorldManifold
    *
    * @param worldManifold
    *
    */
   b2PolyAndEdgeContact.prototype.GetWorldManifold = function (worldManifold) {
      var bodyA = this.m_fixtureA.GetBody(),
          bodyB = this.m_fixtureB.GetBody(),
          shapeA = this.m_fixtureA.GetShape(),
          shapeB = this.m_fixtureB.GetShape();
      worldManifold.Initialize(this.m_manifold, bodyA.GetTransform(), shapeA.m_radius, bodyB.GetTransform(), shapeB.m_radius);
   };

   /**
    * IsTouching
    *
    * @param 
    *
    */
   b2PolyAndEdgeContact.prototype.IsTouching = function () {
      return (this.m_flags & b2Contact.e_touchingFlag) === b2Contact.e_touchingFlag;
   };

   /**
    * IsContinuous
    *
    * @param 
    *
    */
   b2PolyAndEdgeContact.prototype.IsContinuous = function () {
      return (this.m_flags & b2Contact.e_continuousFlag) === b2Contact.e_continuousFlag;
   };

   /**
    * SetSensor
    *
    * @param sensor
    *
    */
   b2PolyAndEdgeContact.prototype.SetSensor = function (sensor) {
      if (sensor) {
         this.m_flags |= b2Contact.e_sensorFlag;
      }
      else {
         this.m_flags &= ~b2Contact.e_sensorFlag;
      }
   };

   /**
    * IsSensor
    *
    * @param 
    *
    */
   b2PolyAndEdgeContact.prototype.IsSensor = function () {
      return (this.m_flags & b2Contact.e_sensorFlag) === b2Contact.e_sensorFlag;
   };

   /**
    * SetEnabled
    *
    * @param flag
    *
    */
   b2PolyAndEdgeContact.prototype.SetEnabled = function (flag) {
      if (flag) {
         this.m_flags |= b2Contact.e_enabledFlag;
      }
      else {
         this.m_flags &= ~b2Contact.e_enabledFlag;
      }
   };

   /**
    * IsEnabled
    *
    * @param 
    *
    */
   b2PolyAndEdgeContact.prototype.IsEnabled = function () {
      return (this.m_flags & b2Contact.e_enabledFlag) === b2Contact.e_enabledFlag;
   };

   /**
    * GetNext
    *
    * @param 
    *
    */
   b2PolyAndEdgeContact.prototype.GetNext = function () {
      return this.m_next;
   };

   /**
    * GetFixtureA
    *
    * @param 
    *
    */
   b2PolyAndEdgeContact.prototype.GetFixtureA = function () {
      return this.m_fixtureA;
   };

   /**
    * GetFixtureB
    *
    * @param 
    *
    */
   b2PolyAndEdgeContact.prototype.GetFixtureB = function () {
      return this.m_fixtureB;
   };

   /**
    * FlagForFiltering
    *
    * @param 
    *
    */
   b2PolyAndEdgeContact.prototype.FlagForFiltering = function () {
      this.m_flags |= b2Contact.e_filterFlag;
   };

   /**
    * b2Contact
    *
    * @param 
    *
    */
   b2PolyAndEdgeContact.prototype.b2Contact = function () {};

   /**
    * Update
    *
    * @param listener
    *
    */
   b2PolyAndEdgeContact.prototype.Update = function (listener) {
      var tManifold = this.m_oldManifold;
      this.m_oldManifold = this.m_manifold;
      this.m_manifold = tManifold;
      this.m_flags |= b2Contact.e_enabledFlag;
      var touching = false,
          wasTouching = (this.m_flags & b2Contact.e_touchingFlag) === b2Contact.e_touchingFlag,
          bodyA = this.m_fixtureA.m_body,
          bodyB = this.m_fixtureB.m_body,
          aabbOverlap = this.m_fixtureA.m_aabb.TestOverlap(this.m_fixtureB.m_aabb);
      if (this.m_flags & b2Contact.e_sensorFlag) {
         if (aabbOverlap) {
            var shapeA = this.m_fixtureA.GetShape(),
          shapeB = this.m_fixtureB.GetShape(),
          xfA = bodyA.GetTransform(),
          xfB = bodyB.GetTransform();
            touching = b2Shape.TestOverlap(shapeA, xfA, shapeB, xfB);
         }
         this.m_manifold.m_pointCount = 0;
      }
      else {
         if (bodyA.GetType() !== b2Body.b2_dynamicBody || bodyA.IsBullet() || bodyB.GetType() !== b2Body.b2_dynamicBody || bodyB.IsBullet()) {
            this.m_flags |= b2Contact.e_continuousFlag;
         }
         else {
            this.m_flags &= ~b2Contact.e_continuousFlag;
         }
         if (aabbOverlap) {
            this.Evaluate();
            touching = this.m_manifold.m_pointCount > 0;
            for (var i = 0; i < this.m_manifold.m_pointCount; ++i) {
               var mp2 = this.m_manifold.m_points[i];
               mp2.m_normalImpulse = 0.0;
               mp2.m_tangentImpulse = 0.0;
               var id2 = mp2.m_id;
               for (var j = 0; j < this.m_oldManifold.m_pointCount; ++j) {
                  var mp1 = this.m_oldManifold.m_points[j];
                  if (mp1.m_id.key === id2.key) {
                     mp2.m_normalImpulse = mp1.m_normalImpulse;
                     mp2.m_tangentImpulse = mp1.m_tangentImpulse;
                     break;
                  }
               }
            }
         }
         else {
            this.m_manifold.m_pointCount = 0;
         }
         if (touching !== wasTouching) {
            bodyA.SetAwake(true);
            bodyB.SetAwake(true);
         }
      }
      if (touching) {
         this.m_flags |= b2Contact.e_touchingFlag;
      }
      else {
         this.m_flags &= ~b2Contact.e_touchingFlag;
      }
      if (wasTouching === false && touching === true) {
         listener.BeginContact(this);
      }
      if (wasTouching === true && touching === false) {
         listener.EndContact(this);
      }
      if ((this.m_flags & b2Contact.e_sensorFlag) === 0) {
         listener.PreSolve(this, this.m_oldManifold);
      }
   };

   /**
    * ComputeTOI
    *
    * @param sweepA
    * @param sweepB
    *
    */
   b2PolyAndEdgeContact.prototype.ComputeTOI = function (sweepA, sweepB) {
      b2Contact.s_input.proxyA.Set(this.m_fixtureA.GetShape());
      b2Contact.s_input.proxyB.Set(this.m_fixtureB.GetShape());
      b2Contact.s_input.sweepA = sweepA;
      b2Contact.s_input.sweepB = sweepB;
      b2Contact.s_input.tolerance = b2Settings.b2_linearSlop;
      return b2TimeOfImpact.TimeOfImpact(b2Contact.s_input);
   };

   /**
    *  Class b2PolygonContact
    *
    * @param 
    *
    */
   b2PolygonContact = Box2D.Dynamics.Contacts.b2PolygonContact = function b2PolygonContact() {

      b2Contact.call(this);
   };
   b2PolygonContact.constructor = b2PolygonContact;
   b2PolygonContact.prototype = Object.create(b2Contact.prototype );

   /**
    * Static Create
    *
    * @param allocator
    *
    */
   b2PolygonContact.Create = function (allocator) {
      return new b2PolygonContact();
   };

   /**
    * Static Destroy
    *
    * @param contact
    * @param allocator
    *
    */
   b2PolygonContact.Destroy = function (contact, allocator) {};

   /**
    * Reset
    *
    * @param fixtureA
    * @param fixtureB
    *
    */
   b2PolygonContact.prototype.Reset = function (fixtureA, fixtureB) {
      b2Contact.prototype.Reset.call(this, fixtureA, fixtureB);
   };

   /**
    * Evaluate
    *
    * @param 
    *
    */
   b2PolygonContact.prototype.Evaluate = function () {
      var bA = this.m_fixtureA.GetBody(),
          bB = this.m_fixtureB.GetBody();
      b2Collision.CollidePolygons(this.m_manifold, (this.m_fixtureA.GetShape() instanceof b2PolygonShape ? this.m_fixtureA.GetShape() : null), bA.m_xf, (this.m_fixtureB.GetShape() instanceof b2PolygonShape ? this.m_fixtureB.GetShape() : null), bB.m_xf);
   };

   /**
    * GetManifold
    *
    * @param 
    *
    */
   b2PolygonContact.prototype.GetManifold = function () {
      return this.m_manifold;
   };

   /**
    * GetWorldManifold
    *
    * @param worldManifold
    *
    */
   b2PolygonContact.prototype.GetWorldManifold = function (worldManifold) {
      var bodyA = this.m_fixtureA.GetBody(),
          bodyB = this.m_fixtureB.GetBody(),
          shapeA = this.m_fixtureA.GetShape(),
          shapeB = this.m_fixtureB.GetShape();
      worldManifold.Initialize(this.m_manifold, bodyA.GetTransform(), shapeA.m_radius, bodyB.GetTransform(), shapeB.m_radius);
   };

   /**
    * IsTouching
    *
    * @param 
    *
    */
   b2PolygonContact.prototype.IsTouching = function () {
      return (this.m_flags & b2Contact.e_touchingFlag) === b2Contact.e_touchingFlag;
   };

   /**
    * IsContinuous
    *
    * @param 
    *
    */
   b2PolygonContact.prototype.IsContinuous = function () {
      return (this.m_flags & b2Contact.e_continuousFlag) === b2Contact.e_continuousFlag;
   };

   /**
    * SetSensor
    *
    * @param sensor
    *
    */
   b2PolygonContact.prototype.SetSensor = function (sensor) {
      if (sensor) {
         this.m_flags |= b2Contact.e_sensorFlag;
      }
      else {
         this.m_flags &= ~b2Contact.e_sensorFlag;
      }
   };

   /**
    * IsSensor
    *
    * @param 
    *
    */
   b2PolygonContact.prototype.IsSensor = function () {
      return (this.m_flags & b2Contact.e_sensorFlag) === b2Contact.e_sensorFlag;
   };

   /**
    * SetEnabled
    *
    * @param flag
    *
    */
   b2PolygonContact.prototype.SetEnabled = function (flag) {
      if (flag) {
         this.m_flags |= b2Contact.e_enabledFlag;
      }
      else {
         this.m_flags &= ~b2Contact.e_enabledFlag;
      }
   };

   /**
    * IsEnabled
    *
    * @param 
    *
    */
   b2PolygonContact.prototype.IsEnabled = function () {
      return (this.m_flags & b2Contact.e_enabledFlag) === b2Contact.e_enabledFlag;
   };

   /**
    * GetNext
    *
    * @param 
    *
    */
   b2PolygonContact.prototype.GetNext = function () {
      return this.m_next;
   };

   /**
    * GetFixtureA
    *
    * @param 
    *
    */
   b2PolygonContact.prototype.GetFixtureA = function () {
      return this.m_fixtureA;
   };

   /**
    * GetFixtureB
    *
    * @param 
    *
    */
   b2PolygonContact.prototype.GetFixtureB = function () {
      return this.m_fixtureB;
   };

   /**
    * FlagForFiltering
    *
    * @param 
    *
    */
   b2PolygonContact.prototype.FlagForFiltering = function () {
      this.m_flags |= b2Contact.e_filterFlag;
   };

   /**
    * b2Contact
    *
    * @param 
    *
    */
   b2PolygonContact.prototype.b2Contact = function () {};

   /**
    * Update
    *
    * @param listener
    *
    */
   b2PolygonContact.prototype.Update = function (listener) {
      var tManifold = this.m_oldManifold;
      this.m_oldManifold = this.m_manifold;
      this.m_manifold = tManifold;
      this.m_flags |= b2Contact.e_enabledFlag;
      var touching = false,
          wasTouching = (this.m_flags & b2Contact.e_touchingFlag) === b2Contact.e_touchingFlag,
          bodyA = this.m_fixtureA.m_body,
          bodyB = this.m_fixtureB.m_body,
          aabbOverlap = this.m_fixtureA.m_aabb.TestOverlap(this.m_fixtureB.m_aabb);
      if (this.m_flags & b2Contact.e_sensorFlag) {
         if (aabbOverlap) {
            var shapeA = this.m_fixtureA.GetShape(),
          shapeB = this.m_fixtureB.GetShape(),
          xfA = bodyA.GetTransform(),
          xfB = bodyB.GetTransform();
            touching = b2Shape.TestOverlap(shapeA, xfA, shapeB, xfB);
         }
         this.m_manifold.m_pointCount = 0;
      }
      else {
         if (bodyA.GetType() !== b2Body.b2_dynamicBody || bodyA.IsBullet() || bodyB.GetType() !== b2Body.b2_dynamicBody || bodyB.IsBullet()) {
            this.m_flags |= b2Contact.e_continuousFlag;
         }
         else {
            this.m_flags &= ~b2Contact.e_continuousFlag;
         }
         if (aabbOverlap) {
            this.Evaluate();
            touching = this.m_manifold.m_pointCount > 0;
            for (var i = 0; i < this.m_manifold.m_pointCount; ++i) {
               var mp2 = this.m_manifold.m_points[i];
               mp2.m_normalImpulse = 0.0;
               mp2.m_tangentImpulse = 0.0;
               var id2 = mp2.m_id;
               for (var j = 0; j < this.m_oldManifold.m_pointCount; ++j) {
                  var mp1 = this.m_oldManifold.m_points[j];
                  if (mp1.m_id.key === id2.key) {
                     mp2.m_normalImpulse = mp1.m_normalImpulse;
                     mp2.m_tangentImpulse = mp1.m_tangentImpulse;
                     break;
                  }
               }
            }
         }
         else {
            this.m_manifold.m_pointCount = 0;
         }
         if (touching !== wasTouching) {
            bodyA.SetAwake(true);
            bodyB.SetAwake(true);
         }
      }
      if (touching) {
         this.m_flags |= b2Contact.e_touchingFlag;
      }
      else {
         this.m_flags &= ~b2Contact.e_touchingFlag;
      }
      if (wasTouching === false && touching === true) {
         listener.BeginContact(this);
      }
      if (wasTouching === true && touching === false) {
         listener.EndContact(this);
      }
      if ((this.m_flags & b2Contact.e_sensorFlag) === 0) {
         listener.PreSolve(this, this.m_oldManifold);
      }
   };

   /**
    * ComputeTOI
    *
    * @param sweepA
    * @param sweepB
    *
    */
   b2PolygonContact.prototype.ComputeTOI = function (sweepA, sweepB) {
      b2Contact.s_input.proxyA.Set(this.m_fixtureA.GetShape());
      b2Contact.s_input.proxyB.Set(this.m_fixtureB.GetShape());
      b2Contact.s_input.sweepA = sweepA;
      b2Contact.s_input.sweepB = sweepB;
      b2Contact.s_input.tolerance = b2Settings.b2_linearSlop;
      return b2TimeOfImpact.TimeOfImpact(b2Contact.s_input);
   };

   /**
    *  Class b2ContactFactory
    *
    * @param allocator
    *
    */
   b2ContactFactory = Box2D.Dynamics.Contacts.b2ContactFactory = function b2ContactFactory(allocator) {

      this.m_allocator = allocator;
      this.InitializeRegisters();
   };
   b2ContactFactory.constructor = b2ContactFactory;
   b2ContactFactory.prototype.m_allocator       = null;
   b2ContactFactory.prototype.m_registers       = null;


   /**
    * AddType
    *
    * @param createFcn
    * @param destroyFcn
    * @param type1
    * @param type2
    *
    */
   b2ContactFactory.prototype.AddType = function (createFcn, destroyFcn, type1, type2) {
      this.m_registers[type1][type2].createFcn = createFcn;
      this.m_registers[type1][type2].destroyFcn = destroyFcn;
      this.m_registers[type1][type2].primary = true;
      if (type1 !== type2) {
         this.m_registers[type2][type1].createFcn = createFcn;
         this.m_registers[type2][type1].destroyFcn = destroyFcn;
         this.m_registers[type2][type1].primary = false;
      }
   };

   /**
    * InitializeRegisters
    *
    * @param 
    *
    */
   b2ContactFactory.prototype.InitializeRegisters = function () {
      this.m_registers = [];
      for (var i = 0; i < b2Shape.e_shapeTypeCount; i++) {
         this.m_registers.push([]);
         for (var j = 0; j < b2Shape.e_shapeTypeCount; j++) {
            this.m_registers[i].push(new b2ContactRegister());
         }
      }
      this.AddType(b2CircleContact.Create, b2CircleContact.Destroy, b2Shape.e_circleShape, b2Shape.e_circleShape);
      this.AddType(b2PolyAndCircleContact.Create, b2PolyAndCircleContact.Destroy, b2Shape.e_polygonShape, b2Shape.e_circleShape);
      this.AddType(b2PolygonContact.Create, b2PolygonContact.Destroy, b2Shape.e_polygonShape, b2Shape.e_polygonShape);
      this.AddType(b2EdgeAndCircleContact.Create, b2EdgeAndCircleContact.Destroy, b2Shape.e_edgeShape, b2Shape.e_circleShape);
      this.AddType(b2PolyAndEdgeContact.Create, b2PolyAndEdgeContact.Destroy, b2Shape.e_polygonShape, b2Shape.e_edgeShape);
   };

   /**
    * Create
    *
    * @param fixtureA
    * @param fixtureB
    *
    */
   b2ContactFactory.prototype.Create = function (fixtureA, fixtureB) {
      var type1 = fixtureA.GetType(),
          type2 = fixtureB.GetType(),
          reg = this.m_registers[type1][type2],
          c;
      if (reg.pool) {
         c = reg.pool;
         reg.pool = c.m_next;
         reg.poolCount--;
         c.Reset(fixtureA, fixtureB);
         return c;
      }
      var createFcn = reg.createFcn;
      if (createFcn != null) {
         if (reg.primary) {
            c = createFcn(this.m_allocator);
            c.Reset(fixtureA, fixtureB);
            return c;
         }
         else {
            c = createFcn(this.m_allocator);
            c.Reset(fixtureB, fixtureA);
            return c;
         }
      }
      else {
         return null;
      }
   };

   /**
    * Destroy
    *
    * @param contact
    *
    */
   b2ContactFactory.prototype.Destroy = function (contact) {
      if (contact.m_manifold.m_pointCount > 0) {
         contact.m_fixtureA.m_body.SetAwake(true);
         contact.m_fixtureB.m_body.SetAwake(true);
      }
      var type1 = contact.m_fixtureA.GetType(),
          type2 = contact.m_fixtureB.GetType(),
          reg = this.m_registers[type1][type2];
      reg.poolCount++;
      contact.m_next = reg.pool;
      reg.pool = contact;
      var destroyFcn = reg.destroyFcn;
      destroyFcn(contact, this.m_allocator);
   };

   /**
    *  Class b2ControllerEdge
    *
    * @param 
    *
    */
   b2ControllerEdge = Box2D.Dynamics.Controllers.b2ControllerEdge = function b2ControllerEdge() {};
   b2ControllerEdge.constructor = b2ControllerEdge;

   /**
    *  Class b2Controller
    *
    * @param 
    *
    */
   b2Controller = Box2D.Dynamics.Controllers.b2Controller = function b2Controller() {};
   b2Controller.constructor = b2Controller;
   b2Controller.prototype.m_bodyList    = null;
   b2Controller.prototype.m_bodyCount   = 0;
   b2Controller.prototype.m_next        = null;
   b2Controller.prototype.m_world       = null;

   /**
    * Step
    *
    * @param step
    *
    */
   b2Controller.prototype.Step = function (step) {};

   /**
    * Draw
    *
    * @param debugDraw
    *
    */
   b2Controller.prototype.Draw = function (debugDraw) {};

   /**
    * AddBody
    *
    * @param body
    *
    */
   b2Controller.prototype.AddBody = function (body) {
      var edge = new b2ControllerEdge();
      edge.controller = this;
      edge.body = body;
      edge.nextBody = this.m_bodyList;
      edge.prevBody = null;
      this.m_bodyList = edge;
      if (edge.nextBody) edge.nextBody.prevBody = edge;
      this.m_bodyCount++;
      edge.nextController = body.m_controllerList;
      edge.prevController = null;
      body.m_controllerList = edge;
      if (edge.nextController) edge.nextController.prevController = edge;
      body.m_controllerCount++;
   };

   /**
    * RemoveBody
    *
    * @param body
    *
    */
   b2Controller.prototype.RemoveBody = function (body) {
      var edge = body.m_controllerList;
      while (edge && edge.controller !== this)
      edge = edge.nextController;
      if (edge.prevBody) edge.prevBody.nextBody = edge.nextBody;
      if (edge.nextBody) edge.nextBody.prevBody = edge.prevBody;
      if (edge.nextController) edge.nextController.prevController = edge.prevController;
      if (edge.prevController) edge.prevController.nextController = edge.nextController;
      if (this.m_bodyList === edge) this.m_bodyList = edge.nextBody;
      if (body.m_controllerList === edge) body.m_controllerList = edge.nextController;
      body.m_controllerCount--;
      this.m_bodyCount--;
   };

   /**
    * Clear
    *
    * @param 
    *
    */
   b2Controller.prototype.Clear = function () {
      while (this.m_bodyList)
      this.RemoveBody(this.m_bodyList.body);
   };

   /**
    * GetNext
    *
    * @param 
    *
    */
   b2Controller.prototype.GetNext = function () {
      return this.m_next;
   };

   /**
    * GetWorld
    *
    * @param 
    *
    */
   b2Controller.prototype.GetWorld = function () {
      return this.m_world;
   };

   /**
    * GetBodyList
    *
    * @param 
    *
    */
   b2Controller.prototype.GetBodyList = function () {
      return this.m_bodyList;
   };
   /**
    *  Class b2BuoyancyController
    *
    * @param
    *
    */
   b2BuoyancyController = Box2D.Dynamics.Controllers.b2BuoyancyController = function b2BuoyancyController() {
      this.normal = new b2Vec2(0, (-1));
      this.velocity = new b2Vec2(0, 0);
   };
   b2BuoyancyController.constructor = b2BuoyancyController;
   b2BuoyancyController.prototype = Object.create(b2Controller.prototype );
   b2BuoyancyController.prototype.normal            = null;
   b2BuoyancyController.prototype.offset            = 0;
   b2BuoyancyController.prototype.density           = 0;
   b2BuoyancyController.prototype.velocity          = null;
   b2BuoyancyController.prototype.linearDrag        = 2;
   b2BuoyancyController.prototype.angularDrag       = 1;
   b2BuoyancyController.prototype.useDensity        = false;
   b2BuoyancyController.prototype.useWorldGravity   = true;
   b2BuoyancyController.prototype.gravity           = null;

   /**
    * Step
    *
    * @param step
    *
    */
   b2BuoyancyController.prototype.Step = function (step) {
      if (!this.m_bodyList) return;
      if (this.useWorldGravity) {
         this.gravity = this.GetWorld().GetGravity().Copy();
      }
      for (var i = this.m_bodyList; i; i = i.nextBody) {
         var body = i.body;
         if (body.IsAwake() === false) {
            continue;
         }
         var areac = new b2Vec2(0, 0),
          massc = new b2Vec2(0, 0),
          area = 0.0,
          mass = 0.0;
         for (var fixture = body.GetFixtureList(); fixture; fixture = fixture.GetNext()) {
            var sc = new b2Vec2(0, 0),
          sarea = fixture.GetShape().ComputeSubmergedArea(this.normal, this.offset, body.GetTransform(), sc);
            area += sarea;
            areac.x += sarea * sc.x;
            areac.y += sarea * sc.y;
            var shapeDensity = 0;
            if (this.useDensity) {
               shapeDensity = 1;
            }
            else {
               shapeDensity = 1;
            }
            mass += sarea * shapeDensity;
            massc.x += sarea * sc.x * shapeDensity;
            massc.y += sarea * sc.y * shapeDensity;
         }
         areac.x /= area;
         areac.y /= area;
         massc.x /= mass;
         massc.y /= mass;
         if (area < b2Settings.b2_epsilon) continue;
         var buoyancyForce = this.gravity.GetNegative();
         buoyancyForce.Multiply(this.density * area);
         body.ApplyForce(buoyancyForce, massc);
         var dragForce = body.GetLinearVelocityFromWorldPoint(areac);
         dragForce.Subtract(this.velocity);
         dragForce.Multiply((-this.linearDrag * area));
         body.ApplyForce(dragForce, areac);
         body.ApplyTorque((-body.GetInertia() / body.GetMass() * area * body.GetAngularVelocity() * this.angularDrag));
      }
   };

   /**
    * Draw
    *
    * @param debugDraw
    *
    */
   b2BuoyancyController.prototype.Draw = function (debugDraw) {
      var r = 1000,
          p1 = new b2Vec2(0, 0),
          p2 = new b2Vec2(0, 0);
      p1.x = this.normal.x * this.offset + this.normal.y * r;
      p1.y = this.normal.y * this.offset - this.normal.x * r;
      p2.x = this.normal.x * this.offset - this.normal.y * r;
      p2.y = this.normal.y * this.offset + this.normal.x * r;
      var color = new b2Color(0, 0, 1);
      debugDraw.DrawSegment(p1, p2, color);
   };

   /**
    * AddBody
    *
    * @param body
    *
    */
   b2BuoyancyController.prototype.AddBody = function (body) {
      var edge = new b2ControllerEdge();
      edge.controller = this;
      edge.body = body;
      edge.nextBody = this.m_bodyList;
      edge.prevBody = null;
      this.m_bodyList = edge;
      if (edge.nextBody) edge.nextBody.prevBody = edge;
      this.m_bodyCount++;
      edge.nextController = body.m_controllerList;
      edge.prevController = null;
      body.m_controllerList = edge;
      if (edge.nextController) edge.nextController.prevController = edge;
      body.m_controllerCount++;
   };

   /**
    * RemoveBody
    *
    * @param body
    *
    */
   b2BuoyancyController.prototype.RemoveBody = function (body) {
      var edge = body.m_controllerList;
      while (edge && edge.controller !== this)
      edge = edge.nextController;
      if (edge.prevBody) edge.prevBody.nextBody = edge.nextBody;
      if (edge.nextBody) edge.nextBody.prevBody = edge.prevBody;
      if (edge.nextController) edge.nextController.prevController = edge.prevController;
      if (edge.prevController) edge.prevController.nextController = edge.nextController;
      if (this.m_bodyList === edge) this.m_bodyList = edge.nextBody;
      if (body.m_controllerList === edge) body.m_controllerList = edge.nextController;
      body.m_controllerCount--;
      this.m_bodyCount--;
   };

   /**
    * Clear
    *
    * @param 
    *
    */
   b2BuoyancyController.prototype.Clear = function () {
      while (this.m_bodyList)
      this.RemoveBody(this.m_bodyList.body);
   };

   /**
    * GetNext
    *
    * @param 
    *
    */
   b2BuoyancyController.prototype.GetNext = function () {
      return this.m_next;
   };

   /**
    * GetWorld
    *
    * @param 
    *
    */
   b2BuoyancyController.prototype.GetWorld = function () {
      return this.m_world;
   };

   /**
    * GetBodyList
    *
    * @param 
    *
    */
   b2BuoyancyController.prototype.GetBodyList = function () {
      return this.m_bodyList;
   };

   /**
    *  Class b2ConstantAccelController
    *
    * @param 
    *
    */
   b2ConstantAccelController = Box2D.Dynamics.Controllers.b2ConstantAccelController = function b2ConstantAccelController() {
      this.A = new b2Vec2(0, 0);
   };
   b2ConstantAccelController.constructor = b2ConstantAccelController;
   b2ConstantAccelController.prototype = Object.create(b2Controller.prototype );
   b2ConstantAccelController.prototype.A = null;
   /**
    * Step
    *
    * @param step
    *
    */
   b2ConstantAccelController.prototype.Step = function (step) {
      var smallA = new b2Vec2(this.A.x * step.dt, this.A.y * step.dt);
      for (var i = this.m_bodyList; i; i = i.nextBody) {
         var body = i.body;
         if (!body.IsAwake()) continue;
         body.SetLinearVelocity(new b2Vec2(body.GetLinearVelocity().x + smallA.x, body.GetLinearVelocity().y + smallA.y));
      }
   };

   /**
    * Draw
    *
    * @param debugDraw
    *
    */
   b2ConstantAccelController.prototype.Draw = function (debugDraw) {};

   /**
    * AddBody
    *
    * @param body
    *
    */
   b2ConstantAccelController.prototype.AddBody = function (body) {
      var edge = new b2ControllerEdge();
      edge.controller = this;
      edge.body = body;
      edge.nextBody = this.m_bodyList;
      edge.prevBody = null;
      this.m_bodyList = edge;
      if (edge.nextBody) edge.nextBody.prevBody = edge;
      this.m_bodyCount++;
      edge.nextController = body.m_controllerList;
      edge.prevController = null;
      body.m_controllerList = edge;
      if (edge.nextController) edge.nextController.prevController = edge;
      body.m_controllerCount++;
   };

   /**
    * RemoveBody
    *
    * @param body
    *
    */
   b2ConstantAccelController.prototype.RemoveBody = function (body) {
      var edge = body.m_controllerList;
      while (edge && edge.controller !== this)
      edge = edge.nextController;
      if (edge.prevBody) edge.prevBody.nextBody = edge.nextBody;
      if (edge.nextBody) edge.nextBody.prevBody = edge.prevBody;
      if (edge.nextController) edge.nextController.prevController = edge.prevController;
      if (edge.prevController) edge.prevController.nextController = edge.nextController;
      if (this.m_bodyList === edge) this.m_bodyList = edge.nextBody;
      if (body.m_controllerList === edge) body.m_controllerList = edge.nextController;
      body.m_controllerCount--;
      this.m_bodyCount--;
   };

   /**
    * Clear
    *
    * @param 
    *
    */
   b2ConstantAccelController.prototype.Clear = function () {
      while (this.m_bodyList)
      this.RemoveBody(this.m_bodyList.body);
   };

   /**
    * GetNext
    *
    * @param 
    *
    */
   b2ConstantAccelController.prototype.GetNext = function () {
      return this.m_next;
   };

   /**
    * GetWorld
    *
    * @param 
    *
    */
   b2ConstantAccelController.prototype.GetWorld = function () {
      return this.m_world;
   };

   /**
    * GetBodyList
    *
    * @param 
    *
    */
   b2ConstantAccelController.prototype.GetBodyList = function () {
      return this.m_bodyList;
   };

   /**
    *  Class b2ConstantForceController
    *
    * @param 
    *
    */
   b2ConstantForceController = Box2D.Dynamics.Controllers.b2ConstantForceController = function b2ConstantForceController() {
      this.F = new b2Vec2(0, 0);
   };
   b2ConstantForceController.constructor = b2ConstantForceController;
   b2ConstantForceController.prototype = Object.create(b2Controller.prototype );
   b2ConstantForceController.prototype.F = null;
   /**
    * Step
    *
    * @param step
    *
    */
   b2ConstantForceController.prototype.Step = function (step) {
      for (var i = this.m_bodyList; i; i = i.nextBody) {
         var body = i.body;
         if (!body.IsAwake()) continue;
         body.ApplyForce(this.F, body.GetWorldCenter());
      }
   };

   /**
    * Draw
    *
    * @param debugDraw
    *
    */
   b2ConstantForceController.prototype.Draw = function (debugDraw) {};

   /**
    * AddBody
    *
    * @param body
    *
    */
   b2ConstantForceController.prototype.AddBody = function (body) {
      var edge = new b2ControllerEdge();
      edge.controller = this;
      edge.body = body;
      edge.nextBody = this.m_bodyList;
      edge.prevBody = null;
      this.m_bodyList = edge;
      if (edge.nextBody) edge.nextBody.prevBody = edge;
      this.m_bodyCount++;
      edge.nextController = body.m_controllerList;
      edge.prevController = null;
      body.m_controllerList = edge;
      if (edge.nextController) edge.nextController.prevController = edge;
      body.m_controllerCount++;
   };

   /**
    * RemoveBody
    *
    * @param body
    *
    */
   b2ConstantForceController.prototype.RemoveBody = function (body) {
      var edge = body.m_controllerList;
      while (edge && edge.controller !== this)
      edge = edge.nextController;
      if (edge.prevBody) edge.prevBody.nextBody = edge.nextBody;
      if (edge.nextBody) edge.nextBody.prevBody = edge.prevBody;
      if (edge.nextController) edge.nextController.prevController = edge.prevController;
      if (edge.prevController) edge.prevController.nextController = edge.nextController;
      if (this.m_bodyList === edge) this.m_bodyList = edge.nextBody;
      if (body.m_controllerList === edge) body.m_controllerList = edge.nextController;
      body.m_controllerCount--;
      this.m_bodyCount--;
   };

   /**
    * Clear
    *
    * @param 
    *
    */
   b2ConstantForceController.prototype.Clear = function () {
      while (this.m_bodyList)
      this.RemoveBody(this.m_bodyList.body);
   };

   /**
    * GetNext
    *
    * @param 
    *
    */
   b2ConstantForceController.prototype.GetNext = function () {
      return this.m_next;
   };

   /**
    * GetWorld
    *
    * @param 
    *
    */
   b2ConstantForceController.prototype.GetWorld = function () {
      return this.m_world;
   };

   /**
    * GetBodyList
    *
    * @param 
    *
    */
   b2ConstantForceController.prototype.GetBodyList = function () {
      return this.m_bodyList;
   };

   /**
    *  Class b2GravityController
    *
    * @param 
    *
    */
   b2GravityController = Box2D.Dynamics.Controllers.b2GravityController = function b2GravityController() {};
   b2GravityController.constructor = b2GravityController;
   b2GravityController.prototype = Object.create(b2Controller.prototype );
   b2GravityController.prototype.G      = 1;
   b2GravityController.prototype.invSqr = true;

   /**
    * Step
    *
    * @param step
    *
    */
   b2GravityController.prototype.Step = function (step) {
      var i = null,
          body1 = null,
          p1 = null,
          mass1 = 0,
          j = null,
          body2 = null,
          p2 = null,
          dx = 0,
          dy = 0,
          r2 = 0,
          f = null;
      if (this.invSqr) {
         for (i = this.m_bodyList;
         i; i = i.nextBody) {
            body1 = i.body;
            p1 = body1.GetWorldCenter();
            mass1 = body1.GetMass();
            for (j = this.m_bodyList; j !== i; j = j.nextBody) {
               body2 = j.body;
               p2 = body2.GetWorldCenter();
               dx = p2.x - p1.x;
               dy = p2.y - p1.y;
               r2 = dx * dx + dy * dy;
               if (r2 < b2Settings.b2_epsilon) continue;
               f = new b2Vec2(dx, dy);
               f.Multiply(this.G / r2 / Math.sqrt(r2) * mass1 * body2.GetMass());
               if (body1.IsAwake()) body1.ApplyForce(f, p1);
               f.Multiply((-1));
               if (body2.IsAwake()) body2.ApplyForce(f, p2);
            }
         }
      }
      else {
         for (i = this.m_bodyList;
         i; i = i.nextBody) {
            body1 = i.body;
            p1 = body1.GetWorldCenter();
            mass1 = body1.GetMass();
            for (j = this.m_bodyList; j !== i; j = j.nextBody) {
               body2 = j.body;
               p2 = body2.GetWorldCenter();
               dx = p2.x - p1.x;
               dy = p2.y - p1.y;
               r2 = dx * dx + dy * dy;
               if (r2 < b2Settings.b2_epsilon) continue;
               f = new b2Vec2(dx, dy);
               f.Multiply(this.G / r2 * mass1 * body2.GetMass());
               if (body1.IsAwake()) body1.ApplyForce(f, p1);
               f.Multiply((-1));
               if (body2.IsAwake()) body2.ApplyForce(f, p2);
            }
         }
      }
   };

   /**
    * Draw
    *
    * @param debugDraw
    *
    */
   b2GravityController.prototype.Draw = function (debugDraw) {};

   /**
    * AddBody
    *
    * @param body
    *
    */
   b2GravityController.prototype.AddBody = function (body) {
      var edge = new b2ControllerEdge();
      edge.controller = this;
      edge.body = body;
      edge.nextBody = this.m_bodyList;
      edge.prevBody = null;
      this.m_bodyList = edge;
      if (edge.nextBody) edge.nextBody.prevBody = edge;
      this.m_bodyCount++;
      edge.nextController = body.m_controllerList;
      edge.prevController = null;
      body.m_controllerList = edge;
      if (edge.nextController) edge.nextController.prevController = edge;
      body.m_controllerCount++;
   };

   /**
    * RemoveBody
    *
    * @param body
    *
    */
   b2GravityController.prototype.RemoveBody = function (body) {
      var edge = body.m_controllerList;
      while (edge && edge.controller !== this)
      edge = edge.nextController;
      if (edge.prevBody) edge.prevBody.nextBody = edge.nextBody;
      if (edge.nextBody) edge.nextBody.prevBody = edge.prevBody;
      if (edge.nextController) edge.nextController.prevController = edge.prevController;
      if (edge.prevController) edge.prevController.nextController = edge.nextController;
      if (this.m_bodyList === edge) this.m_bodyList = edge.nextBody;
      if (body.m_controllerList === edge) body.m_controllerList = edge.nextController;
      body.m_controllerCount--;
      this.m_bodyCount--;
   };

   /**
    * Clear
    *
    * @param 
    *
    */
   b2GravityController.prototype.Clear = function () {
      while (this.m_bodyList)
      this.RemoveBody(this.m_bodyList.body);
   };

   /**
    * GetNext
    *
    * @param 
    *
    */
   b2GravityController.prototype.GetNext = function () {
      return this.m_next;
   };

   /**
    * GetWorld
    *
    * @param 
    *
    */
   b2GravityController.prototype.GetWorld = function () {
      return this.m_world;
   };

   /**
    * GetBodyList
    *
    * @param 
    *
    */
   b2GravityController.prototype.GetBodyList = function () {
      return this.m_bodyList;
   };

   /**
    *  Class b2TensorDampingController
    *
    * @param 
    *
    */
   b2TensorDampingController = Box2D.Dynamics.Controllers.b2TensorDampingController = function b2TensorDampingController() {
      this.T = new b2Mat22();
   };
   b2TensorDampingController.constructor = b2TensorDampingController;
   b2TensorDampingController.prototype = Object.create(b2Controller.prototype );
   b2TensorDampingController.prototype.T            = null;
   b2TensorDampingController.prototype.maxTimestep  = 0;
   /**
    * SetAxisAligned
    *
    * @param xDamping
    * @param yDamping
    *
    */
   b2TensorDampingController.prototype.SetAxisAligned = function (xDamping, yDamping) {
      xDamping = xDamping || 0;
      yDamping = yDamping || 0;
      this.T.col1.x = (-xDamping);
      this.T.col1.y = 0;
      this.T.col2.x = 0;
      this.T.col2.y = (-yDamping);
      if (xDamping > 0 || yDamping > 0) {
         this.maxTimestep = 1 / Math.max(xDamping, yDamping);
      }
      else {
         this.maxTimestep = 0;
      }
   };

   /**
    * Step
    *
    * @param step
    *
    */
   b2TensorDampingController.prototype.Step = function (step) {
      var timestep = step.dt;
      if (timestep <= b2Settings.b2_epsilon) return;
      if (timestep > this.maxTimestep && this.maxTimestep > 0) timestep = this.maxTimestep;
      for (var i = this.m_bodyList; i; i = i.nextBody) {
         var body = i.body;
         if (!body.IsAwake()) {
            continue;
         }
         var damping = body.GetWorldVector(b2Math.MulMV(this.T, body.GetLocalVector(body.GetLinearVelocity())));
         body.SetLinearVelocity(new b2Vec2(body.GetLinearVelocity().x + damping.x * timestep, body.GetLinearVelocity().y + damping.y * timestep));
      }
   };

   /**
    * Draw
    *
    * @param debugDraw
    *
    */
   b2TensorDampingController.prototype.Draw = function (debugDraw) {};

   /**
    * AddBody
    *
    * @param body
    *
    */
   b2TensorDampingController.prototype.AddBody = function (body) {
      var edge = new b2ControllerEdge();
      edge.controller = this;
      edge.body = body;
      edge.nextBody = this.m_bodyList;
      edge.prevBody = null;
      this.m_bodyList = edge;
      if (edge.nextBody) edge.nextBody.prevBody = edge;
      this.m_bodyCount++;
      edge.nextController = body.m_controllerList;
      edge.prevController = null;
      body.m_controllerList = edge;
      if (edge.nextController) edge.nextController.prevController = edge;
      body.m_controllerCount++;
   };

   /**
    * RemoveBody
    *
    * @param body
    *
    */
   b2TensorDampingController.prototype.RemoveBody = function (body) {
      var edge = body.m_controllerList;
      while (edge && edge.controller !== this)
      edge = edge.nextController;
      if (edge.prevBody) edge.prevBody.nextBody = edge.nextBody;
      if (edge.nextBody) edge.nextBody.prevBody = edge.prevBody;
      if (edge.nextController) edge.nextController.prevController = edge.prevController;
      if (edge.prevController) edge.prevController.nextController = edge.nextController;
      if (this.m_bodyList === edge) this.m_bodyList = edge.nextBody;
      if (body.m_controllerList === edge) body.m_controllerList = edge.nextController;
      body.m_controllerCount--;
      this.m_bodyCount--;
   };

   /**
    * Clear
    *
    * @param 
    *
    */
   b2TensorDampingController.prototype.Clear = function () {
      while (this.m_bodyList)
      this.RemoveBody(this.m_bodyList.body);
   };

   /**
    * GetNext
    *
    * @param 
    *
    */
   b2TensorDampingController.prototype.GetNext = function () {
      return this.m_next;
   };

   /**
    * GetWorld
    *
    * @param 
    *
    */
   b2TensorDampingController.prototype.GetWorld = function () {
      return this.m_world;
   };

   /**
    * GetBodyList
    *
    * @param 
    *
    */
   b2TensorDampingController.prototype.GetBodyList = function () {
      return this.m_bodyList;
   };

   /**
    *  Class b2Joint
    *
    * @param def
    *
    */
   b2Joint = Box2D.Dynamics.Joints.b2Joint = function b2Joint(def) {
      this.m_edgeA = new b2JointEdge();
      this.m_edgeB = new b2JointEdge();
      this.m_localCenterA = new b2Vec2(0, 0);
      this.m_localCenterB = new b2Vec2(0, 0);
      b2Assert(def.bodyA !== def.bodyB);
      this.m_type = def.type;
      this.m_bodyA = def.bodyA;
      this.m_bodyB = def.bodyB;
      this.m_collideConnected = def.collideConnected;
      this.m_userData = def.userData;
   };
   b2Joint.constructor = b2Joint;

   b2Joint.e_unknownJoint = 0;
   b2Joint.e_revoluteJoint = 1;
   b2Joint.e_prismaticJoint = 2;
   b2Joint.e_distanceJoint = 3;
   b2Joint.e_pulleyJoint = 4;
   b2Joint.e_mouseJoint = 5;
   b2Joint.e_gearJoint = 6;
   b2Joint.e_lineJoint = 7;
   b2Joint.e_weldJoint = 8;
   b2Joint.e_frictionJoint = 9;
   b2Joint.e_inactiveLimit = 0;
   b2Joint.e_atLowerLimit = 1;
   b2Joint.e_atUpperLimit = 2;
   b2Joint.e_equalLimits = 3;

   b2Joint.prototype.m_type                  = b2Joint.e_unknownJoint;
   b2Joint.prototype.m_edgeA                 = null;
   b2Joint.prototype.m_edgeB                 = null;
   b2Joint.prototype.m_localAnchor1          = null;
   b2Joint.prototype.m_localAnchor2          = null;
   b2Joint.prototype.m_localCenterA          = null;
   b2Joint.prototype.m_localCenterB          = null;
   b2Joint.prototype.m_prev                  = null;
   b2Joint.prototype.m_next                  = null;
   b2Joint.prototype.m_bodyA                 = null;
   b2Joint.prototype.m_bodyB                 = null;
   b2Joint.prototype.m_collideConnected      = false;
   b2Joint.prototype.m_islandFlag            = false;
   b2Joint.prototype.m_userData              = null;

   /**
    * Static Create
    *
    * @param def
    * @param allocator
    *
    */
   b2Joint.Create = function (def, allocator) {
      var joint = null;
      switch (def.type) {
      case b2Joint.e_distanceJoint:
         {
            joint = new b2DistanceJoint((def instanceof b2DistanceJointDef ? def : null));
         }
         break;
      case b2Joint.e_mouseJoint:
         {
            joint = new b2MouseJoint((def instanceof b2MouseJointDef ? def : null));
         }
         break;
      case b2Joint.e_prismaticJoint:
         {
            joint = new b2PrismaticJoint((def instanceof b2PrismaticJointDef ? def : null));
         }
         break;
      case b2Joint.e_revoluteJoint:
         {
            joint = new b2RevoluteJoint((def instanceof b2RevoluteJointDef ? def : null));
         }
         break;
      case b2Joint.e_pulleyJoint:
         {
            joint = new b2PulleyJoint((def instanceof b2PulleyJointDef ? def : null));
         }
         break;
      case b2Joint.e_gearJoint:
         {
            joint = new b2GearJoint((def instanceof b2GearJointDef ? def : null));
         }
         break;
      case b2Joint.e_lineJoint:
         {
            joint = new b2LineJoint((def instanceof b2LineJointDef ? def : null));
         }
         break;
      case b2Joint.e_weldJoint:
         {
            joint = new b2WeldJoint((def instanceof b2WeldJointDef ? def : null));
         }
         break;
      case b2Joint.e_frictionJoint:
         {
            joint = new b2FrictionJoint((def instanceof b2FrictionJointDef ? def : null));
         }
         break;
      default:
         break;
      }
      return joint;
   };

   /**
    * Static Destroy
    *
    * @param joint
    * @param allocator
    *
    */
   b2Joint.Destroy = function (joint, allocator) {};

   /**
    * GetType
    *
    * @param 
    *
    */
   b2Joint.prototype.GetType = function () {
      return this.m_type;
   };

   /**
    * GetAnchorA
    *
    * @param 
    *
    */
   b2Joint.prototype.GetAnchorA = function () {
      return null;
   };

   /**
    * GetAnchorB
    *
    * @param 
    *
    */
   b2Joint.prototype.GetAnchorB = function () {
      return null;
   };

   /**
    * GetReactionForce
    *
    * @param inv_dt
    *
    */
   b2Joint.prototype.GetReactionForce = function (inv_dt) {
      inv_dt = inv_dt || 0;
      return null;
   };

   /**
    * GetReactionTorque
    *
    * @param inv_dt
    *
    */
   b2Joint.prototype.GetReactionTorque = function (inv_dt) {
      inv_dt = inv_dt || 0;
      return 0.0;
   };

   /**
    * GetBodyA
    *
    * @param 
    *
    */
   b2Joint.prototype.GetBodyA = function () {
      return this.m_bodyA;
   };

   /**
    * GetBodyB
    *
    * @param 
    *
    */
   b2Joint.prototype.GetBodyB = function () {
      return this.m_bodyB;
   };

   /**
    * GetNext
    *
    * @param 
    *
    */
   b2Joint.prototype.GetNext = function () {
      return this.m_next;
   };

   /**
    * GetUserData
    *
    * @param 
    *
    */
   b2Joint.prototype.GetUserData = function () {
      return this.m_userData;
   };

   /**
    * SetUserData
    *
    * @param data
    *
    */
   b2Joint.prototype.SetUserData = function (data) {
      this.m_userData = data;
   };

   /**
    * IsActive
    *
    * @param 
    *
    */
   b2Joint.prototype.IsActive = function () {
      return this.m_bodyA.IsActive() && this.m_bodyB.IsActive();
   };

   /**
    * InitVelocityConstraints
    *
    * @param step
    *
    */
   b2Joint.prototype.InitVelocityConstraints = function (step) {};

   /**
    * SolveVelocityConstraints
    *
    * @param step
    *
    */
   b2Joint.prototype.SolveVelocityConstraints = function (step) {};

   /**
    * FinalizeVelocityConstraints
    *
    * @param 
    *
    */
   b2Joint.prototype.FinalizeVelocityConstraints = function () {};

   /**
    * SolvePositionConstraints
    *
    * @param baumgarte
    *
    */
   b2Joint.prototype.SolvePositionConstraints = function (baumgarte) {
      baumgarte = baumgarte || 0;
      return false;
   };

   /**
    *  Class b2JointDef
    *
    * @param 
    *
    */
   b2JointDef = Box2D.Dynamics.Joints.b2JointDef = function b2JointDef() {};
   b2JointDef.constructor = b2JointDef;

   b2JointDef.prototype.type                = b2Joint.e_unknownJoint;
   b2JointDef.prototype.userData            = null;
   b2JointDef.prototype.bodyA               = null;
   b2JointDef.prototype.bodyB               = null;
   b2JointDef.prototype.collideConnected    = false;


   /**
    *  Class b2JointEdge
    *
    * @param 
    *
    */
   b2JointEdge = Box2D.Dynamics.Joints.b2JointEdge = function b2JointEdge() {};
   b2JointEdge.constructor = b2JointEdge;

   /**
    *  Class b2Jacobian
    *
    * @param 
    *
    */
   b2Jacobian = Box2D.Dynamics.Joints.b2Jacobian = function b2Jacobian() {
      this.linearA = new b2Vec2(0, 0);
      this.linearB = new b2Vec2(0, 0);

   };
   b2Jacobian.constructor = b2Jacobian;
   b2Jacobian.prototype.linearA           = null;
   b2Jacobian.prototype.linearB           = null;
   b2Jacobian.prototype.angularA          = null;
   b2Jacobian.prototype.angularB          = null;

   /**
    * SetZero
    *
    * @param 
    *
    */
   b2Jacobian.prototype.SetZero = function () {
      this.linearA.SetZero();
      this.angularA = 0.0;
      this.linearB.SetZero();
      this.angularB = 0.0;
   };

   /**
    * Set
    *
    * @param x1
    * @param a1
    * @param x2
    * @param a2
    *
    */
   b2Jacobian.prototype.Set = function (x1, a1, x2, a2) {
      a1 = a1 || 0;
      a2 = a2 || 0;
      this.linearA.SetV(x1);
      this.angularA = a1;
      this.linearB.SetV(x2);
      this.angularB = a2;
   };

   /**
    * Compute
    *
    * @param x1
    * @param a1
    * @param x2
    * @param a2
    *
    */
   b2Jacobian.prototype.Compute = function (x1, a1, x2, a2) {
      a1 = a1 || 0;
      a2 = a2 || 0;
      return (this.linearA.x * x1.x + this.linearA.y * x1.y) + this.angularA * a1 + (this.linearB.x * x2.x + this.linearB.y * x2.y) + this.angularB * a2;
   };

   /**
    *  Class b2DistanceJoint
    *
    * @param def
    *
    */
   b2DistanceJoint = Box2D.Dynamics.Joints.b2DistanceJoint = function b2DistanceJoint(def) {

      this.m_localAnchor1 = new b2Vec2(0, 0);
      this.m_localAnchor2 = new b2Vec2(0, 0);
      this.m_u = new b2Vec2(0, 0);
      b2Joint.call(this, def);
      this.m_localAnchor1.SetV(def.localAnchorA);
      this.m_localAnchor2.SetV(def.localAnchorB);
      this.m_length = def.length;
      this.m_frequencyHz = def.frequencyHz;
      this.m_dampingRatio = def.dampingRatio;
   };
   b2DistanceJoint.constructor = b2DistanceJoint;
   b2DistanceJoint.prototype = Object.create(b2Joint.prototype );
   b2DistanceJoint.prototype.m_u                     = null;
   b2DistanceJoint.prototype.m_length                = 0;
   b2DistanceJoint.prototype.m_frequencyHz           = 0;
   b2DistanceJoint.prototype.m_dampingRatio          = 0;
   b2DistanceJoint.prototype.m_impulse               = 0.0;
   b2DistanceJoint.prototype.m_gamma                 = 0.0;
   b2DistanceJoint.prototype.m_bias                  = 0.0;

   /**
    * GetAnchorA
    *
    * @param 
    *
    */
   b2DistanceJoint.prototype.GetAnchorA = function () {
      return this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
   };

   /**
    * GetAnchorB
    *
    * @param 
    *
    */
   b2DistanceJoint.prototype.GetAnchorB = function () {
      return this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
   };

   /**
    * GetReactionForce
    *
    * @param inv_dt
    *
    */
   b2DistanceJoint.prototype.GetReactionForce = function (inv_dt) {
      inv_dt = inv_dt || 0;
      return new b2Vec2(inv_dt * this.m_impulse * this.m_u.x, inv_dt * this.m_impulse * this.m_u.y);
   };

   /**
    * GetReactionTorque
    *
    * @param inv_dt
    *
    */
   b2DistanceJoint.prototype.GetReactionTorque = function (inv_dt) {
      inv_dt = inv_dt || 0;
      return 0.0;
   };

   /**
    * GetLength
    *
    * @param 
    *
    */
   b2DistanceJoint.prototype.GetLength = function () {
      return this.m_length;
   };

   /**
    * SetLength
    *
    * @param length
    *
    */
   b2DistanceJoint.prototype.SetLength = function (length) {
      length = length || 0;
      this.m_length = length;
   };

   /**
    * GetFrequency
    *
    * @param 
    *
    */
   b2DistanceJoint.prototype.GetFrequency = function () {
      return this.m_frequencyHz;
   };

   /**
    * SetFrequency
    *
    * @param hz
    *
    */
   b2DistanceJoint.prototype.SetFrequency = function (hz) {
      hz = hz || 0;
      this.m_frequencyHz = hz;
   };

   /**
    * GetDampingRatio
    *
    * @param 
    *
    */
   b2DistanceJoint.prototype.GetDampingRatio = function () {
      return this.m_dampingRatio;
   };

   /**
    * SetDampingRatio
    *
    * @param ratio
    *
    */
   b2DistanceJoint.prototype.SetDampingRatio = function (ratio) {
      ratio = ratio || 0;
      this.m_dampingRatio = ratio;
   };

   /**
    * InitVelocityConstraints
    *
    * @param step
    *
    */
   b2DistanceJoint.prototype.InitVelocityConstraints = function (step) {
      var tMat,
          tX = 0,
          bA = this.m_bodyA,
          bB = this.m_bodyB;
      tMat = bA.m_xf.R;
      var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x,
          r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
      tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
      r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
      r1X = tX;
      tMat = bB.m_xf.R;
      var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x,
          r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
      r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
      r2X = tX;
      this.m_u.x = bB.m_sweep.c.x + r2X - bA.m_sweep.c.x - r1X;
      this.m_u.y = bB.m_sweep.c.y + r2Y - bA.m_sweep.c.y - r1Y;
      var length = Math.sqrt(this.m_u.x * this.m_u.x + this.m_u.y * this.m_u.y);
      if (length > b2Settings.b2_linearSlop) {
         this.m_u.Multiply(1.0 / length);
      }
      else {
         this.m_u.SetZero();
      }
      var cr1u = (r1X * this.m_u.y - r1Y * this.m_u.x),
          cr2u = (r2X * this.m_u.y - r2Y * this.m_u.x),
          invMass = bA.m_invMass + bA.m_invI * cr1u * cr1u + bB.m_invMass + bB.m_invI * cr2u * cr2u;
      this.m_mass = invMass !== 0.0 ? 1.0 / invMass : 0.0;
      if (this.m_frequencyHz > 0.0) {
         var C = length - this.m_length,
          omega = 2.0 * Math.PI * this.m_frequencyHz,
          d = 2.0 * this.m_mass * this.m_dampingRatio * omega,
          k = this.m_mass * omega * omega;
         this.m_gamma = step.dt * (d + step.dt * k);
         this.m_gamma = this.m_gamma !== 0.0 ? 1 / this.m_gamma : 0.0;
         this.m_bias = C * step.dt * k * this.m_gamma;
         this.m_mass = invMass + this.m_gamma;
         this.m_mass = this.m_mass !== 0.0 ? 1.0 / this.m_mass : 0.0;
      }
      if (step.warmStarting) {
         this.m_impulse *= step.dtRatio;
         var PX = this.m_impulse * this.m_u.x,
          PY = this.m_impulse * this.m_u.y;
         bA.m_linearVelocity.x -= bA.m_invMass * PX;
         bA.m_linearVelocity.y -= bA.m_invMass * PY;
         bA.m_angularVelocity -= bA.m_invI * (r1X * PY - r1Y * PX);
         bB.m_linearVelocity.x += bB.m_invMass * PX;
         bB.m_linearVelocity.y += bB.m_invMass * PY;
         bB.m_angularVelocity += bB.m_invI * (r2X * PY - r2Y * PX);
      }
      else {
         this.m_impulse = 0.0;
      }
   };

   /**
    * SolveVelocityConstraints
    *
    * @param step
    *
    */
   b2DistanceJoint.prototype.SolveVelocityConstraints = function (step) {
      var tMat,
          bA = this.m_bodyA,
          bB = this.m_bodyB;
      tMat = bA.m_xf.R;
      var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x,
          r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y,
          tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
      r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
      r1X = tX;
      tMat = bB.m_xf.R;
      var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x,
          r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
      r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
      r2X = tX;
      var v1X = bA.m_linearVelocity.x + ((-bA.m_angularVelocity * r1Y)),
          v1Y = bA.m_linearVelocity.y + (bA.m_angularVelocity * r1X),
          v2X = bB.m_linearVelocity.x + ((-bB.m_angularVelocity * r2Y)),
          v2Y = bB.m_linearVelocity.y + (bB.m_angularVelocity * r2X),
          Cdot = (this.m_u.x * (v2X - v1X) + this.m_u.y * (v2Y - v1Y)),
          impulse = (-this.m_mass * (Cdot + this.m_bias + this.m_gamma * this.m_impulse));
      this.m_impulse += impulse;
      var PX = impulse * this.m_u.x,
          PY = impulse * this.m_u.y;
      bA.m_linearVelocity.x -= bA.m_invMass * PX;
      bA.m_linearVelocity.y -= bA.m_invMass * PY;
      bA.m_angularVelocity -= bA.m_invI * (r1X * PY - r1Y * PX);
      bB.m_linearVelocity.x += bB.m_invMass * PX;
      bB.m_linearVelocity.y += bB.m_invMass * PY;
      bB.m_angularVelocity += bB.m_invI * (r2X * PY - r2Y * PX);
   };

   /**
    * SolvePositionConstraints
    *
    * @param baumgarte
    *
    */
   b2DistanceJoint.prototype.SolvePositionConstraints = function (baumgarte) {
      baumgarte = baumgarte || 0;
      var tMat;
      if (this.m_frequencyHz > 0.0) {
         return true;
      }
      var bA = this.m_bodyA,
          bB = this.m_bodyB;
      tMat = bA.m_xf.R;
      var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x,
          r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y,
          tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
      r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
      r1X = tX;
      tMat = bB.m_xf.R;
      var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x,
          r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
      r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
      r2X = tX;
      var dX = bB.m_sweep.c.x + r2X - bA.m_sweep.c.x - r1X,
          dY = bB.m_sweep.c.y + r2Y - bA.m_sweep.c.y - r1Y,
          length = Math.sqrt(dX * dX + dY * dY);
      dX /= length;
      dY /= length;
      var C = length - this.m_length;
      C = b2Math.Clamp(C, (-b2Settings.b2_maxLinearCorrection), b2Settings.b2_maxLinearCorrection);
      var impulse = (-this.m_mass * C);
      this.m_u.Set(dX, dY);
      var PX = impulse * this.m_u.x,
          PY = impulse * this.m_u.y;
      bA.m_sweep.c.x -= bA.m_invMass * PX;
      bA.m_sweep.c.y -= bA.m_invMass * PY;
      bA.m_sweep.a -= bA.m_invI * (r1X * PY - r1Y * PX);
      bB.m_sweep.c.x += bB.m_invMass * PX;
      bB.m_sweep.c.y += bB.m_invMass * PY;
      bB.m_sweep.a += bB.m_invI * (r2X * PY - r2Y * PX);
      bA.SynchronizeTransform();
      bB.SynchronizeTransform();
      return b2Math.Abs(C) < b2Settings.b2_linearSlop;
   };

   /**
    * GetType
    *
    * @param 
    *
    */
   b2DistanceJoint.prototype.GetType = function () {
      return this.m_type;
   };

   /**
    * GetBodyA
    *
    * @param 
    *
    */
   b2DistanceJoint.prototype.GetBodyA = function () {
      return this.m_bodyA;
   };

   /**
    * GetBodyB
    *
    * @param 
    *
    */
   b2DistanceJoint.prototype.GetBodyB = function () {
      return this.m_bodyB;
   };

   /**
    * GetNext
    *
    * @param 
    *
    */
   b2DistanceJoint.prototype.GetNext = function () {
      return this.m_next;
   };

   /**
    * GetUserData
    *
    * @param 
    *
    */
   b2DistanceJoint.prototype.GetUserData = function () {
      return this.m_userData;
   };

   /**
    * SetUserData
    *
    * @param data
    *
    */
   b2DistanceJoint.prototype.SetUserData = function (data) {
      this.m_userData = data;
   };

   /**
    * IsActive
    *
    * @param 
    *
    */
   b2DistanceJoint.prototype.IsActive = function () {
      return this.m_bodyA.IsActive() && this.m_bodyB.IsActive();
   };

   /**
    * b2Joint
    *
    * @param def
    *
    */
   b2DistanceJoint.prototype.b2Joint = function (def) {
      b2Assert(def.bodyA !== def.bodyB);
      this.m_type = def.type;
      this.m_prev = null;
      this.m_next = null;
      this.m_bodyA = def.bodyA;
      this.m_bodyB = def.bodyB;
      this.m_collideConnected = def.collideConnected;
      this.m_islandFlag = false;
      this.m_userData = def.userData;
   };

   /**
    * FinalizeVelocityConstraints
    *
    * @param 
    *
    */
   b2DistanceJoint.prototype.FinalizeVelocityConstraints = function () {};

   /**
    *  Class b2DistanceJointDef
    *
    * @param 
    *
    */
   b2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef = function b2DistanceJointDef() {
      this.localAnchorA = new b2Vec2(0, 0);
      this.localAnchorB = new b2Vec2(0, 0);
   };
   b2DistanceJointDef.constructor = b2DistanceJointDef;
   b2DistanceJointDef.prototype = Object.create(b2JointDef.prototype );

   b2DistanceJointDef.prototype.type              = b2Joint.e_distanceJoint;;
   b2DistanceJointDef.prototype.localAnchorA      = null;
   b2DistanceJointDef.prototype.localAnchorB      = null;
   b2DistanceJointDef.prototype.length            = 1.0;
   b2DistanceJointDef.prototype.frequencyHz       = 0.0;
   b2DistanceJointDef.prototype.dampingRatio      = 0.0;


   /**
    * Initialize
    *
    * @param bA
    * @param bB
    * @param anchorA
    * @param anchorB
    *
    */
   b2DistanceJointDef.prototype.Initialize = function (bA, bB, anchorA, anchorB) {
      this.bodyA = bA;
      this.bodyB = bB;
      this.localAnchorA.SetV(this.bodyA.GetLocalPoint(anchorA));
      this.localAnchorB.SetV(this.bodyB.GetLocalPoint(anchorB));
      var dX = anchorB.x - anchorA.x,
          dY = anchorB.y - anchorA.y;
      this.length = Math.sqrt(dX * dX + dY * dY);
      this.frequencyHz = 0.0;
      this.dampingRatio = 0.0;
   };

   /**
    * b2JointDef
    *
    * @param 
    *
    */
   b2DistanceJointDef.prototype.b2JointDef = function () {
      this.type = b2Joint.e_unknownJoint;
      this.userData = null;
      this.bodyA = null;
      this.bodyB = null;
      this.collideConnected = false;
   };

   /**
    *  Class b2FrictionJoint
    *
    * @param def
    *
    */
   b2FrictionJoint = Box2D.Dynamics.Joints.b2FrictionJoint = function b2FrictionJoint(def) {

      this.m_localAnchorA = new b2Vec2(0, 0);
      this.m_localAnchorB = new b2Vec2(0, 0);
      this.m_linearMass = new b2Mat22();
      this.m_linearImpulse = new b2Vec2(0, 0);
      b2Joint.call(this, def);
      this.m_localAnchorA.SetV(def.localAnchorA);
      this.m_localAnchorB.SetV(def.localAnchorB);
      this.m_linearMass.SetZero();
      this.m_linearImpulse.SetZero();
      this.m_maxForce = def.maxForce;
      this.m_maxTorque = def.maxTorque;
   };
   b2FrictionJoint.constructor = b2FrictionJoint;
   b2FrictionJoint.prototype = Object.create(b2Joint.prototype);
   b2FrictionJoint.prototype.m_linearMass        = null;
   b2FrictionJoint.prototype.m_linearImpulse     = null;
   b2FrictionJoint.prototype.m_angularMass       = 0.0;
   b2FrictionJoint.prototype.m_angularImpulse    = 0.0;
   b2FrictionJoint.prototype.m_maxForce          = 0;
   b2FrictionJoint.prototype.m_maxTorque         = 0;


   /**
    * GetAnchorA
    *
    * @param 
    *
    */
   b2FrictionJoint.prototype.GetAnchorA = function () {
      return this.m_bodyA.GetWorldPoint(this.m_localAnchorA);
   };

   /**
    * GetAnchorB
    *
    * @param 
    *
    */
   b2FrictionJoint.prototype.GetAnchorB = function () {
      return this.m_bodyB.GetWorldPoint(this.m_localAnchorB);
   };

   /**
    * GetReactionForce
    *
    * @param inv_dt
    *
    */
   b2FrictionJoint.prototype.GetReactionForce = function (inv_dt) {
      inv_dt = inv_dt || 0;
      return new b2Vec2(inv_dt * this.m_linearImpulse.x, inv_dt * this.m_linearImpulse.y);
   };

   /**
    * GetReactionTorque
    *
    * @param inv_dt
    *
    */
   b2FrictionJoint.prototype.GetReactionTorque = function (inv_dt) {
      inv_dt = inv_dt || 0;
      return inv_dt * this.m_angularImpulse;
   };

   /**
    * SetMaxForce
    *
    * @param force
    *
    */
   b2FrictionJoint.prototype.SetMaxForce = function (force) {
      force = force || 0;
      this.m_maxForce = force;
   };

   /**
    * GetMaxForce
    *
    * @param 
    *
    */
   b2FrictionJoint.prototype.GetMaxForce = function () {
      return this.m_maxForce;
   };

   /**
    * SetMaxTorque
    *
    * @param torque
    *
    */
   b2FrictionJoint.prototype.SetMaxTorque = function (torque) {
      torque = torque || 0;
      this.m_maxTorque = torque;
   };

   /**
    * GetMaxTorque
    *
    * @param 
    *
    */
   b2FrictionJoint.prototype.GetMaxTorque = function () {
      return this.m_maxTorque;
   };

   /**
    * InitVelocityConstraints
    *
    * @param step
    *
    */
   b2FrictionJoint.prototype.InitVelocityConstraints = function (step) {
      var tMat,
          tX = 0,
          bA = this.m_bodyA,
          bB = this.m_bodyB;
      tMat = bA.m_xf.R;
      var rAX = this.m_localAnchorA.x - bA.m_sweep.localCenter.x,
          rAY = this.m_localAnchorA.y - bA.m_sweep.localCenter.y;
      tX = (tMat.col1.x * rAX + tMat.col2.x * rAY);
      rAY = (tMat.col1.y * rAX + tMat.col2.y * rAY);
      rAX = tX;
      tMat = bB.m_xf.R;
      var rBX = this.m_localAnchorB.x - bB.m_sweep.localCenter.x,
          rBY = this.m_localAnchorB.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * rBX + tMat.col2.x * rBY);
      rBY = (tMat.col1.y * rBX + tMat.col2.y * rBY);
      rBX = tX;
      var mA = bA.m_invMass,
          mB = bB.m_invMass,
          iA = bA.m_invI,
          iB = bB.m_invI,
          K = new b2Mat22();
      K.col1.x = mA + mB;
      K.col2.x = 0.0;
      K.col1.y = 0.0;
      K.col2.y = mA + mB;
      K.col1.x += iA * rAY * rAY;
      K.col2.x += (-iA * rAX * rAY);
      K.col1.y += (-iA * rAX * rAY);
      K.col2.y += iA * rAX * rAX;
      K.col1.x += iB * rBY * rBY;
      K.col2.x += (-iB * rBX * rBY);
      K.col1.y += (-iB * rBX * rBY);
      K.col2.y += iB * rBX * rBX;
      K.GetInverse(this.m_linearMass);
      this.m_angularMass = iA + iB;
      if (this.m_angularMass > 0.0) {
         this.m_angularMass = 1.0 / this.m_angularMass;
      }
      if (step.warmStarting) {
         this.m_linearImpulse.x *= step.dtRatio;
         this.m_linearImpulse.y *= step.dtRatio;
         this.m_angularImpulse *= step.dtRatio;
         var P = this.m_linearImpulse;
         bA.m_linearVelocity.x -= mA * P.x;
         bA.m_linearVelocity.y -= mA * P.y;
         bA.m_angularVelocity -= iA * (rAX * P.y - rAY * P.x + this.m_angularImpulse);
         bB.m_linearVelocity.x += mB * P.x;
         bB.m_linearVelocity.y += mB * P.y;
         bB.m_angularVelocity += iB * (rBX * P.y - rBY * P.x + this.m_angularImpulse);
      }
      else {
         this.m_linearImpulse.SetZero();
         this.m_angularImpulse = 0.0;
      }
   };

   /**
    * SolveVelocityConstraints
    *
    * @param step
    *
    */
   b2FrictionJoint.prototype.SolveVelocityConstraints = function (step) {
      var tMat,
          tX = 0,
          bA = this.m_bodyA,
          bB = this.m_bodyB,
          vA = bA.m_linearVelocity,
          wA = bA.m_angularVelocity,
          vB = bB.m_linearVelocity,
          wB = bB.m_angularVelocity,
          mA = bA.m_invMass,
          mB = bB.m_invMass,
          iA = bA.m_invI,
          iB = bB.m_invI;
      tMat = bA.m_xf.R;
      var rAX = this.m_localAnchorA.x - bA.m_sweep.localCenter.x,
          rAY = this.m_localAnchorA.y - bA.m_sweep.localCenter.y;
      tX = (tMat.col1.x * rAX + tMat.col2.x * rAY);
      rAY = (tMat.col1.y * rAX + tMat.col2.y * rAY);
      rAX = tX;
      tMat = bB.m_xf.R;
      var rBX = this.m_localAnchorB.x - bB.m_sweep.localCenter.x,
          rBY = this.m_localAnchorB.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * rBX + tMat.col2.x * rBY);
      rBY = (tMat.col1.y * rBX + tMat.col2.y * rBY);
      rBX = tX;
      var maxImpulse = 0; {
         var Cdot = wB - wA,
          impulse = (-this.m_angularMass * Cdot),
          oldImpulse = this.m_angularImpulse;
         maxImpulse = step.dt * this.m_maxTorque;
         this.m_angularImpulse = b2Math.Clamp(this.m_angularImpulse + impulse, (-maxImpulse), maxImpulse);
         impulse = this.m_angularImpulse - oldImpulse;
         wA -= iA * impulse;
         wB += iB * impulse;
      } {
         var CdotX = vB.x - wB * rBY - vA.x + wA * rAY,
          CdotY = vB.y + wB * rBX - vA.y - wA * rAX,
          impulseV = b2Math.MulMV(this.m_linearMass, new b2Vec2((-CdotX), (-CdotY))),
          oldImpulseV = this.m_linearImpulse.Copy();
         this.m_linearImpulse.Add(impulseV);
         maxImpulse = step.dt * this.m_maxForce;
         if (this.m_linearImpulse.LengthSquared() > maxImpulse * maxImpulse) {
            this.m_linearImpulse.Normalize();
            this.m_linearImpulse.Multiply(maxImpulse);
         }
         impulseV = b2Math.SubtractVV(this.m_linearImpulse, oldImpulseV);
         vA.x -= mA * impulseV.x;
         vA.y -= mA * impulseV.y;
         wA -= iA * (rAX * impulseV.y - rAY * impulseV.x);
         vB.x += mB * impulseV.x;
         vB.y += mB * impulseV.y;
         wB += iB * (rBX * impulseV.y - rBY * impulseV.x);
      }
      bA.m_angularVelocity = wA;
      bB.m_angularVelocity = wB;
   };

   /**
    * SolvePositionConstraints
    *
    * @param baumgarte
    *
    */
   b2FrictionJoint.prototype.SolvePositionConstraints = function (baumgarte) {
      baumgarte = baumgarte || 0;
      return true;
   };

   /**
    * GetType
    *
    * @param 
    *
    */
   b2FrictionJoint.prototype.GetType = function () {
      return this.m_type;
   };

   /**
    * GetBodyA
    *
    * @param 
    *
    */
   b2FrictionJoint.prototype.GetBodyA = function () {
      return this.m_bodyA;
   };

   /**
    * GetBodyB
    *
    * @param 
    *
    */
   b2FrictionJoint.prototype.GetBodyB = function () {
      return this.m_bodyB;
   };

   /**
    * GetNext
    *
    * @param 
    *
    */
   b2FrictionJoint.prototype.GetNext = function () {
      return this.m_next;
   };

   /**
    * GetUserData
    *
    * @param 
    *
    */
   b2FrictionJoint.prototype.GetUserData = function () {
      return this.m_userData;
   };

   /**
    * SetUserData
    *
    * @param data
    *
    */
   b2FrictionJoint.prototype.SetUserData = function (data) {
      this.m_userData = data;
   };

   /**
    * IsActive
    *
    * @param 
    *
    */
   b2FrictionJoint.prototype.IsActive = function () {
      return this.m_bodyA.IsActive() && this.m_bodyB.IsActive();
   };

   /**
    * b2Joint
    *
    * @param def
    *
    */
   b2FrictionJoint.prototype.b2Joint = function (def) {
      b2Assert(def.bodyA !== def.bodyB);
      this.m_type = def.type;
      this.m_prev = null;
      this.m_next = null;
      this.m_bodyA = def.bodyA;
      this.m_bodyB = def.bodyB;
      this.m_collideConnected = def.collideConnected;
      this.m_islandFlag = false;
      this.m_userData = def.userData;
   };

   /**
    * FinalizeVelocityConstraints
    *
    * @param 
    *
    */
   b2FrictionJoint.prototype.FinalizeVelocityConstraints = function () {};

   /**
    *  Class b2FrictionJointDef
    *
    * @param 
    *
    */
   b2FrictionJointDef = Box2D.Dynamics.Joints.b2FrictionJointDef = function b2FrictionJointDef() {

      this.localAnchorA = new b2Vec2(0, 0);
      this.localAnchorB = new b2Vec2(0, 0);
   };
   b2FrictionJointDef.constructor = b2FrictionJointDef;
   b2FrictionJointDef.prototype = Object.create(b2JointDef.prototype );
   b2FrictionJointDef.prototype.type              = b2Joint.e_frictionJoint;
   b2FrictionJointDef.prototype.localAnchorA      = null;
   b2FrictionJointDef.prototype.localAnchorB      = null;
   b2FrictionJointDef.prototype.maxForce          = 0.0;
   b2FrictionJointDef.prototype.maxTorque         = 0.0;

   /**
    * Initialize
    *
    * @param bA
    * @param bB
    * @param anchor
    *
    */
   b2FrictionJointDef.prototype.Initialize = function (bA, bB, anchor) {
      this.bodyA = bA;
      this.bodyB = bB;
      this.localAnchorA.SetV(this.bodyA.GetLocalPoint(anchor));
      this.localAnchorB.SetV(this.bodyB.GetLocalPoint(anchor));
   };

   /**
    * b2JointDef
    *
    * @param 
    *
    */
   b2FrictionJointDef.prototype.b2JointDef = function () {
      this.type = b2Joint.e_unknownJoint;
      this.userData = null;
      this.bodyA = null;
      this.bodyB = null;
      this.collideConnected = false;
   };

   /**
    *  Class b2GearJoint
    *
    * @param def
    *
    */
   b2GearJoint = Box2D.Dynamics.Joints.b2GearJoint = function b2GearJoint(def) {

      this.m_groundAnchor1 = new b2Vec2(0, 0);
      this.m_groundAnchor2 = new b2Vec2(0, 0);
      this.m_localAnchor1 = new b2Vec2(0, 0);
      this.m_localAnchor2 = new b2Vec2(0, 0);
      this.m_J = new b2Jacobian();
      b2Joint.call(this, def);
      var type1 = def.joint1.m_type,
          type2 = def.joint2.m_type;
      var coordinate1 = 0,
          coordinate2 = 0;
      this.m_ground1 = def.joint1.GetBodyA();
      this.m_bodyA = def.joint1.GetBodyB();
      if (type1 === b2Joint.e_revoluteJoint) {
         this.m_revolute1 = (def.joint1 instanceof b2RevoluteJoint ? def.joint1 : null);
         this.m_groundAnchor1.SetV(this.m_revolute1.m_localAnchor1);
         this.m_localAnchor1.SetV(this.m_revolute1.m_localAnchor2);
         coordinate1 = this.m_revolute1.GetJointAngle();
      }
      else {
         this.m_prismatic1 = (def.joint1 instanceof b2PrismaticJoint ? def.joint1 : null);
         this.m_groundAnchor1.SetV(this.m_prismatic1.m_localAnchor1);
         this.m_localAnchor1.SetV(this.m_prismatic1.m_localAnchor2);
         coordinate1 = this.m_prismatic1.GetJointTranslation();
      }
      this.m_ground2 = def.joint2.GetBodyA();
      this.m_bodyB = def.joint2.GetBodyB();
      if (type2 === b2Joint.e_revoluteJoint) {
         this.m_revolute2 = (def.joint2 instanceof b2RevoluteJoint ? def.joint2 : null);
         this.m_groundAnchor2.SetV(this.m_revolute2.m_localAnchor1);
         this.m_localAnchor2.SetV(this.m_revolute2.m_localAnchor2);
         coordinate2 = this.m_revolute2.GetJointAngle();
      }
      else {
         this.m_prismatic2 = (def.joint2 instanceof b2PrismaticJoint ? def.joint2 : null);
         this.m_groundAnchor2.SetV(this.m_prismatic2.m_localAnchor1);
         this.m_localAnchor2.SetV(this.m_prismatic2.m_localAnchor2);
         coordinate2 = this.m_prismatic2.GetJointTranslation();
      }
      this.m_ratio = def.ratio;
      this.m_constant = coordinate1 + this.m_ratio * coordinate2;
   };
   b2GearJoint.constructor = b2GearJoint;
   b2GearJoint.prototype = Object.create(b2Joint.prototype );
   b2GearJoint.prototype.m_groundAnchor1         = null;
   b2GearJoint.prototype.m_groundAnchor2         = null;
   b2GearJoint.prototype.m_J                     = null;
   b2GearJoint.prototype.m_revolute1             = null;
   b2GearJoint.prototype.m_prismatic1            = null;
   b2GearJoint.prototype.m_revolute2             = null;
   b2GearJoint.prototype.m_prismatic2            = null;
   b2GearJoint.prototype.m_ground1               = null;
   b2GearJoint.prototype.m_ground2               = null;
   b2GearJoint.prototype.m_ratio                 = 0;
   b2GearJoint.prototype.m_constant              = 0;
   b2GearJoint.prototype.m_impulse               = 0.0;



   /**
    * GetAnchorA
    *
    * @param 
    *
    */
   b2GearJoint.prototype.GetAnchorA = function () {
      return this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
   };

   /**
    * GetAnchorB
    *
    * @param 
    *
    */
   b2GearJoint.prototype.GetAnchorB = function () {
      return this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
   };

   /**
    * GetReactionForce
    *
    * @param inv_dt
    *
    */
   b2GearJoint.prototype.GetReactionForce = function (inv_dt) {
      inv_dt = inv_dt || 0;
      return new b2Vec2(inv_dt * this.m_impulse * this.m_J.linearB.x, inv_dt * this.m_impulse * this.m_J.linearB.y);
   };

   /**
    * GetReactionTorque
    *
    * @param inv_dt
    *
    */
   b2GearJoint.prototype.GetReactionTorque = function (inv_dt) {
      inv_dt = inv_dt || 0;
      var tMat = this.m_bodyB.m_xf.R,
          rX = this.m_localAnchor1.x - this.m_bodyB.m_sweep.localCenter.x,
          rY = this.m_localAnchor1.y - this.m_bodyB.m_sweep.localCenter.y,
          tX = tMat.col1.x * rX + tMat.col2.x * rY;
      rY = tMat.col1.y * rX + tMat.col2.y * rY;
      rX = tX;
      var PX = this.m_impulse * this.m_J.linearB.x,
          PY = this.m_impulse * this.m_J.linearB.y;
      return inv_dt * (this.m_impulse * this.m_J.angularB - rX * PY + rY * PX);
   };

   /**
    * GetRatio
    *
    * @param 
    *
    */
   b2GearJoint.prototype.GetRatio = function () {
      return this.m_ratio;
   };

   /**
    * SetRatio
    *
    * @param ratio
    *
    */
   b2GearJoint.prototype.SetRatio = function (ratio) {
      ratio = ratio || 0;
      this.m_ratio = ratio;
   };

   /**
    * InitVelocityConstraints
    *
    * @param step
    *
    */
   b2GearJoint.prototype.InitVelocityConstraints = function (step) {
      var g1 = this.m_ground1,
          g2 = this.m_ground2,
          bA = this.m_bodyA,
          bB = this.m_bodyB,
          ugX = 0,
          ugY = 0,
          rX = 0,
          rY = 0,
          tMat,
          tVec,
          crug = 0,
          tX = 0,
          K = 0.0;
      this.m_J.SetZero();
      if (this.m_revolute1) {
         this.m_J.angularA = (-1.0);
         K += bA.m_invI;
      }
      else {
         tMat = g1.m_xf.R;
         tVec = this.m_prismatic1.m_localXAxis1;
         ugX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
         ugY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
         tMat = bA.m_xf.R;
         rX = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
         rY = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
         tX = tMat.col1.x * rX + tMat.col2.x * rY;
         rY = tMat.col1.y * rX + tMat.col2.y * rY;
         rX = tX;
         crug = rX * ugY - rY * ugX;
         this.m_J.linearA.Set((-ugX), (-ugY));
         this.m_J.angularA = (-crug);
         K += bA.m_invMass + bA.m_invI * crug * crug;
      }
      if (this.m_revolute2) {
         this.m_J.angularB = (-this.m_ratio);
         K += this.m_ratio * this.m_ratio * bB.m_invI;
      }
      else {
         tMat = g2.m_xf.R;
         tVec = this.m_prismatic2.m_localXAxis1;
         ugX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
         ugY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
         tMat = bB.m_xf.R;
         rX = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
         rY = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
         tX = tMat.col1.x * rX + tMat.col2.x * rY;
         rY = tMat.col1.y * rX + tMat.col2.y * rY;
         rX = tX;
         crug = rX * ugY - rY * ugX;
         this.m_J.linearB.Set((-this.m_ratio * ugX), (-this.m_ratio * ugY));
         this.m_J.angularB = (-this.m_ratio * crug);
         K += this.m_ratio * this.m_ratio * (bB.m_invMass + bB.m_invI * crug * crug);
      }
      this.m_mass = K > 0.0 ? 1.0 / K : 0.0;
      if (step.warmStarting) {
         bA.m_linearVelocity.x += bA.m_invMass * this.m_impulse * this.m_J.linearA.x;
         bA.m_linearVelocity.y += bA.m_invMass * this.m_impulse * this.m_J.linearA.y;
         bA.m_angularVelocity += bA.m_invI * this.m_impulse * this.m_J.angularA;
         bB.m_linearVelocity.x += bB.m_invMass * this.m_impulse * this.m_J.linearB.x;
         bB.m_linearVelocity.y += bB.m_invMass * this.m_impulse * this.m_J.linearB.y;
         bB.m_angularVelocity += bB.m_invI * this.m_impulse * this.m_J.angularB;
      }
      else {
         this.m_impulse = 0.0;
      }
   };

   /**
    * SolveVelocityConstraints
    *
    * @param step
    *
    */
   b2GearJoint.prototype.SolveVelocityConstraints = function (step) {
      var bA = this.m_bodyA,
          bB = this.m_bodyB,
          Cdot = this.m_J.Compute(bA.m_linearVelocity, bA.m_angularVelocity, bB.m_linearVelocity, bB.m_angularVelocity),
          impulse = (-this.m_mass * Cdot);
      this.m_impulse += impulse;
      bA.m_linearVelocity.x += bA.m_invMass * impulse * this.m_J.linearA.x;
      bA.m_linearVelocity.y += bA.m_invMass * impulse * this.m_J.linearA.y;
      bA.m_angularVelocity += bA.m_invI * impulse * this.m_J.angularA;
      bB.m_linearVelocity.x += bB.m_invMass * impulse * this.m_J.linearB.x;
      bB.m_linearVelocity.y += bB.m_invMass * impulse * this.m_J.linearB.y;
      bB.m_angularVelocity += bB.m_invI * impulse * this.m_J.angularB;
   };

   /**
    * SolvePositionConstraints
    *
    * @param baumgarte
    *
    */
   b2GearJoint.prototype.SolvePositionConstraints = function (baumgarte) {
      baumgarte = baumgarte || 0;
      var linearError = 0.0,
          bA = this.m_bodyA,
          bB = this.m_bodyB,
          coordinate1 = 0,
          coordinate2 = 0;
      if (this.m_revolute1) {
         coordinate1 = this.m_revolute1.GetJointAngle();
      }
      else {
         coordinate1 = this.m_prismatic1.GetJointTranslation();
      }
      if (this.m_revolute2) {
         coordinate2 = this.m_revolute2.GetJointAngle();
      }
      else {
         coordinate2 = this.m_prismatic2.GetJointTranslation();
      }
      var C = this.m_constant - (coordinate1 + this.m_ratio * coordinate2),
          impulse = (-this.m_mass * C);
      bA.m_sweep.c.x += bA.m_invMass * impulse * this.m_J.linearA.x;
      bA.m_sweep.c.y += bA.m_invMass * impulse * this.m_J.linearA.y;
      bA.m_sweep.a += bA.m_invI * impulse * this.m_J.angularA;
      bB.m_sweep.c.x += bB.m_invMass * impulse * this.m_J.linearB.x;
      bB.m_sweep.c.y += bB.m_invMass * impulse * this.m_J.linearB.y;
      bB.m_sweep.a += bB.m_invI * impulse * this.m_J.angularB;
      bA.SynchronizeTransform();
      bB.SynchronizeTransform();
      return linearError < b2Settings.b2_linearSlop;
   };

   /**
    * GetType
    *
    * @param 
    *
    */
   b2GearJoint.prototype.GetType = function () {
      return this.m_type;
   };

   /**
    * GetBodyA
    *
    * @param 
    *
    */
   b2GearJoint.prototype.GetBodyA = function () {
      return this.m_bodyA;
   };

   /**
    * GetBodyB
    *
    * @param 
    *
    */
   b2GearJoint.prototype.GetBodyB = function () {
      return this.m_bodyB;
   };

   /**
    * GetNext
    *
    * @param 
    *
    */
   b2GearJoint.prototype.GetNext = function () {
      return this.m_next;
   };

   /**
    * GetUserData
    *
    * @param 
    *
    */
   b2GearJoint.prototype.GetUserData = function () {
      return this.m_userData;
   };

   /**
    * SetUserData
    *
    * @param data
    *
    */
   b2GearJoint.prototype.SetUserData = function (data) {
      this.m_userData = data;
   };

   /**
    * IsActive
    *
    * @param 
    *
    */
   b2GearJoint.prototype.IsActive = function () {
      return this.m_bodyA.IsActive() && this.m_bodyB.IsActive();
   };

   /**
    * b2Joint
    *
    * @param def
    *
    */
   b2GearJoint.prototype.b2Joint = function (def) {
      b2Assert(def.bodyA !== def.bodyB);
      this.m_type = def.type;
      this.m_prev = null;
      this.m_next = null;
      this.m_bodyA = def.bodyA;
      this.m_bodyB = def.bodyB;
      this.m_collideConnected = def.collideConnected;
      this.m_islandFlag = false;
      this.m_userData = def.userData;
   };

   /**
    * FinalizeVelocityConstraints
    *
    * @param 
    *
    */
   b2GearJoint.prototype.FinalizeVelocityConstraints = function () {};

   /**
    *  Class b2GearJointDef
    *
    * @param 
    *
    */
   b2GearJointDef = Box2D.Dynamics.Joints.b2GearJointDef = function b2GearJointDef() {};
   b2GearJointDef.constructor = b2GearJointDef;
   b2GearJointDef.prototype = Object.create(b2JointDef.prototype );
   b2GearJointDef.prototype.type              = b2Joint.e_gearJoint;
   b2GearJointDef.prototype.joint1            = null;
   b2GearJointDef.prototype.joint2            = null;
   b2GearJointDef.prototype.ratio             = 1.0;



   /**
    *  Class b2LineJoint
    *
    * @param def
    *
    */
   b2LineJoint = Box2D.Dynamics.Joints.b2LineJoint = function b2LineJoint(def) {

      this.m_localAnchor1 = new b2Vec2(0, 0);
      this.m_localAnchor2 = new b2Vec2(0, 0);
      this.m_localXAxis1 = new b2Vec2(0, 0);
      this.m_localYAxis1 = new b2Vec2(0, 0);
      this.m_axis = new b2Vec2(0, 0);
      this.m_perp = new b2Vec2(0, 0);
      this.m_K = new b2Mat22();
      this.m_impulse = new b2Vec2(0, 0);
      b2Joint.call(this, def);
      this.m_localAnchor1.SetV(def.localAnchorA);
      this.m_localAnchor2.SetV(def.localAnchorB);
      this.m_localXAxis1.SetV(def.localAxisA);
      this.m_localYAxis1.x = (-this.m_localXAxis1.y);
      this.m_localYAxis1.y = this.m_localXAxis1.x;
      this.m_impulse.SetZero();
      this.m_lowerTranslation = def.lowerTranslation;
      this.m_upperTranslation = def.upperTranslation;
      this.m_maxMotorForce = def.maxMotorForce;
      this.m_motorSpeed = def.motorSpeed;
      this.m_enableLimit = def.enableLimit;
      this.m_enableMotor = def.enableMotor;
      this.m_limitState = b2Joint.e_inactiveLimit;
      this.m_axis.SetZero();
      this.m_perp.SetZero();
   };
   b2LineJoint.constructor = b2LineJoint;
   b2LineJoint.prototype = Object.create(b2Joint.prototype );
   b2LineJoint.prototype.m_localXAxis1             = null;
   b2LineJoint.prototype.m_localYAxis1             = null;
   b2LineJoint.prototype.m_axis                    = null;
   b2LineJoint.prototype.m_perp                    = null;
   b2LineJoint.prototype.m_K                       = null;
   b2LineJoint.prototype.m_impulse                 = null;
   b2LineJoint.prototype.m_motorMass               = 0.0;
   b2LineJoint.prototype.m_motorImpulse            = 0.0;
   b2LineJoint.prototype.m_lowerTranslation        = 0.0;
   b2LineJoint.prototype.m_upperTranslation        = 0.0;
   b2LineJoint.prototype.m_maxMotorForce           = 0.0;
   b2LineJoint.prototype.m_motorSpeed              = 0.0;
   b2LineJoint.prototype.m_enableLimit             = false;
   b2LineJoint.prototype.m_enableMotor             = false;
   b2LineJoint.prototype.m_limitState              = b2Joint.e_inactiveLimit;

   /**
    * GetAnchorA
    *
    * @param 
    *
    */
   b2LineJoint.prototype.GetAnchorA = function () {
      return this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
   };

   /**
    * GetAnchorB
    *
    * @param 
    *
    */
   b2LineJoint.prototype.GetAnchorB = function () {
      return this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
   };

   /**
    * GetReactionForce
    *
    * @param inv_dt
    *
    */
   b2LineJoint.prototype.GetReactionForce = function (inv_dt) {
      inv_dt = inv_dt || 0;
      return new b2Vec2(inv_dt * (this.m_impulse.x * this.m_perp.x + (this.m_motorImpulse + this.m_impulse.y) * this.m_axis.x), inv_dt * (this.m_impulse.x * this.m_perp.y + (this.m_motorImpulse + this.m_impulse.y) * this.m_axis.y));
   };

   /**
    * GetReactionTorque
    *
    * @param inv_dt
    *
    */
   b2LineJoint.prototype.GetReactionTorque = function (inv_dt) {
      return inv_dt * this.m_impulse.y;
   };

   /**
    * GetJointTranslation
    *
    * @param 
    *
    */
   b2LineJoint.prototype.GetJointTranslation = function () {
      var bA = this.m_bodyA,
          bB = this.m_bodyB,
          p1 = bA.GetWorldPoint(this.m_localAnchor1),
          p2 = bB.GetWorldPoint(this.m_localAnchor2),
          dX = p2.x - p1.x,
          dY = p2.y - p1.y,
          axis = bA.GetWorldVector(this.m_localXAxis1);
      return axis.x * dX + axis.y * dY;
   };

   /**
    * GetJointSpeed
    *
    * @param 
    *
    */
   b2LineJoint.prototype.GetJointSpeed = function () {
      var bA = this.m_bodyA,
          bB = this.m_bodyB,
          tMat;
      tMat = bA.m_xf.R;
      var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x,
          r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y,
          tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
      r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
      r1X = tX;
      tMat = bB.m_xf.R;
      var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x,
          r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
      r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
      r2X = tX;
      var p1X = bA.m_sweep.c.x + r1X,
          p1Y = bA.m_sweep.c.y + r1Y,
          p2X = bB.m_sweep.c.x + r2X,
          p2Y = bB.m_sweep.c.y + r2Y,
          dX = p2X - p1X,
          dY = p2Y - p1Y,
          axis = bA.GetWorldVector(this.m_localXAxis1),
          v1 = bA.m_linearVelocity,
          v2 = bB.m_linearVelocity,
          w1 = bA.m_angularVelocity,
          w2 = bB.m_angularVelocity;
      return (dX * ((-w1 * axis.y)) + dY * (w1 * axis.x)) + (axis.x * (((v2.x + ((-w2 * r2Y))) - v1.x) - ((-w1 * r1Y))) + axis.y * (((v2.y + (w2 * r2X)) - v1.y) - (w1 * r1X)));
   };

   /**
    * IsLimitEnabled
    *
    * @param 
    *
    */
   b2LineJoint.prototype.IsLimitEnabled = function () {
      return this.m_enableLimit;
   };

   /**
    * EnableLimit
    *
    * @param flag
    *
    */
   b2LineJoint.prototype.EnableLimit = function (flag) {
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      this.m_enableLimit = flag;
   };

   /**
    * GetLowerLimit
    *
    * @param 
    *
    */
   b2LineJoint.prototype.GetLowerLimit = function () {
      return this.m_lowerTranslation;
   };

   /**
    * GetUpperLimit
    *
    * @param 
    *
    */
   b2LineJoint.prototype.GetUpperLimit = function () {
      return this.m_upperTranslation;
   };

   /**
    * SetLimits
    *
    * @param lower
    * @param upper
    *
    */
   b2LineJoint.prototype.SetLimits = function (lower, upper) {
      lower = lower || 0;
      upper = upper || 0;
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      this.m_lowerTranslation = lower;
      this.m_upperTranslation = upper;
   };

   /**
    * IsMotorEnabled
    *
    * @param 
    *
    */
   b2LineJoint.prototype.IsMotorEnabled = function () {
      return this.m_enableMotor;
   };

   /**
    * EnableMotor
    *
    * @param flag
    *
    */
   b2LineJoint.prototype.EnableMotor = function (flag) {
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      this.m_enableMotor = flag;
   };

   /**
    * SetMotorSpeed
    *
    * @param speed
    *
    */
   b2LineJoint.prototype.SetMotorSpeed = function (speed) {
      speed = speed || 0;
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      this.m_motorSpeed = speed;
   };

   /**
    * GetMotorSpeed
    *
    * @param 
    *
    */
   b2LineJoint.prototype.GetMotorSpeed = function () {
      return this.m_motorSpeed;
   };

   /**
    * SetMaxMotorForce
    *
    * @param force
    *
    */
   b2LineJoint.prototype.SetMaxMotorForce = function (force) {
      force = force || 0;
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      this.m_maxMotorForce = force;
   };

   /**
    * GetMaxMotorForce
    *
    * @param 
    *
    */
   b2LineJoint.prototype.GetMaxMotorForce = function () {
      return this.m_maxMotorForce;
   };

   /**
    * GetMotorForce
    *
    * @param 
    *
    */
   b2LineJoint.prototype.GetMotorForce = function () {
      return this.m_motorImpulse;
   };

   /**
    * InitVelocityConstraints
    *
    * @param step
    *
    */
   b2LineJoint.prototype.InitVelocityConstraints = function (step) {
      var bA = this.m_bodyA,
          bB = this.m_bodyB,
          tMat,
          tX = 0;
      this.m_localCenterA.SetV(bA.GetLocalCenter());
      this.m_localCenterB.SetV(bB.GetLocalCenter());
      var xf1 = bA.GetTransform(),
          xf2 = bB.GetTransform();
      tMat = bA.m_xf.R;
      var r1X = this.m_localAnchor1.x - this.m_localCenterA.x,
          r1Y = this.m_localAnchor1.y - this.m_localCenterA.y;
      tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
      r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
      r1X = tX;
      tMat = bB.m_xf.R;
      var r2X = this.m_localAnchor2.x - this.m_localCenterB.x,
          r2Y = this.m_localAnchor2.y - this.m_localCenterB.y;
      tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
      r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
      r2X = tX;
      var dX = bB.m_sweep.c.x + r2X - bA.m_sweep.c.x - r1X,
          dY = bB.m_sweep.c.y + r2Y - bA.m_sweep.c.y - r1Y;
      this.m_invMassA = bA.m_invMass;
      this.m_invMassB = bB.m_invMass;
      this.m_invIA = bA.m_invI;
      this.m_invIB = bB.m_invI; {
         this.m_axis.SetV(b2Math.MulMV(xf1.R, this.m_localXAxis1));
         this.m_a1 = (dX + r1X) * this.m_axis.y - (dY + r1Y) * this.m_axis.x;
         this.m_a2 = r2X * this.m_axis.y - r2Y * this.m_axis.x;
         this.m_motorMass = this.m_invMassA + this.m_invMassB + this.m_invIA * this.m_a1 * this.m_a1 + this.m_invIB * this.m_a2 * this.m_a2;
         this.m_motorMass = this.m_motorMass > b2Settings.b2_epsilon ? 1.0 / this.m_motorMass : 0.0;
      } {
         this.m_perp.SetV(b2Math.MulMV(xf1.R, this.m_localYAxis1));
         this.m_s1 = (dX + r1X) * this.m_perp.y - (dY + r1Y) * this.m_perp.x;
         this.m_s2 = r2X * this.m_perp.y - r2Y * this.m_perp.x;
         var m1 = this.m_invMassA,
          m2 = this.m_invMassB,
          i1 = this.m_invIA,
          i2 = this.m_invIB;
         this.m_K.col1.x = m1 + m2 + i1 * this.m_s1 * this.m_s1 + i2 * this.m_s2 * this.m_s2;
         this.m_K.col1.y = i1 * this.m_s1 * this.m_a1 + i2 * this.m_s2 * this.m_a2;
         this.m_K.col2.x = this.m_K.col1.y;
         this.m_K.col2.y = m1 + m2 + i1 * this.m_a1 * this.m_a1 + i2 * this.m_a2 * this.m_a2;
      }
      if (this.m_enableLimit) {
         var jointTransition = this.m_axis.x * dX + this.m_axis.y * dY;
         if (b2Math.Abs(this.m_upperTranslation - this.m_lowerTranslation) < 2.0 * b2Settings.b2_linearSlop) {
            this.m_limitState = b2Joint.e_equalLimits;
         }
         else if (jointTransition <= this.m_lowerTranslation) {
            if (this.m_limitState !== b2Joint.e_atLowerLimit) {
               this.m_limitState = b2Joint.e_atLowerLimit;
               this.m_impulse.y = 0.0;
            }
         }
         else if (jointTransition >= this.m_upperTranslation) {
            if (this.m_limitState !== b2Joint.e_atUpperLimit) {
               this.m_limitState = b2Joint.e_atUpperLimit;
               this.m_impulse.y = 0.0;
            }
         }
         else {
            this.m_limitState = b2Joint.e_inactiveLimit;
            this.m_impulse.y = 0.0;
         }
      }
      else {
         this.m_limitState = b2Joint.e_inactiveLimit;
      }
      if (this.m_enableMotor === false) {
         this.m_motorImpulse = 0.0;
      }
      if (step.warmStarting) {
         this.m_impulse.x *= step.dtRatio;
         this.m_impulse.y *= step.dtRatio;
         this.m_motorImpulse *= step.dtRatio;
         var PX = this.m_impulse.x * this.m_perp.x + (this.m_motorImpulse + this.m_impulse.y) * this.m_axis.x,
          PY = this.m_impulse.x * this.m_perp.y + (this.m_motorImpulse + this.m_impulse.y) * this.m_axis.y,
          L1 = this.m_impulse.x * this.m_s1 + (this.m_motorImpulse + this.m_impulse.y) * this.m_a1,
          L2 = this.m_impulse.x * this.m_s2 + (this.m_motorImpulse + this.m_impulse.y) * this.m_a2;
         bA.m_linearVelocity.x -= this.m_invMassA * PX;
         bA.m_linearVelocity.y -= this.m_invMassA * PY;
         bA.m_angularVelocity -= this.m_invIA * L1;
         bB.m_linearVelocity.x += this.m_invMassB * PX;
         bB.m_linearVelocity.y += this.m_invMassB * PY;
         bB.m_angularVelocity += this.m_invIB * L2;
      }
      else {
         this.m_impulse.SetZero();
         this.m_motorImpulse = 0.0;
      }
   };

   /**
    * SolveVelocityConstraints
    *
    * @param step
    *
    */
   b2LineJoint.prototype.SolveVelocityConstraints = function (step) {
      var bA = this.m_bodyA,
          bB = this.m_bodyB,
          v1 = bA.m_linearVelocity,
          w1 = bA.m_angularVelocity,
          v2 = bB.m_linearVelocity,
          w2 = bB.m_angularVelocity,
          PX = 0,
          PY = 0,
          L1 = 0,
          L2 = 0;
      if (this.m_enableMotor && this.m_limitState !== b2Joint.e_equalLimits) {
         var Cdot = this.m_axis.x * (v2.x - v1.x) + this.m_axis.y * (v2.y - v1.y) + this.m_a2 * w2 - this.m_a1 * w1,
          impulse = this.m_motorMass * (this.m_motorSpeed - Cdot),
          oldImpulse = this.m_motorImpulse,
          maxImpulse = step.dt * this.m_maxMotorForce;
         this.m_motorImpulse = b2Math.Clamp(this.m_motorImpulse + impulse, (-maxImpulse), maxImpulse);
         impulse = this.m_motorImpulse - oldImpulse;
         PX = impulse * this.m_axis.x;
         PY = impulse * this.m_axis.y;
         L1 = impulse * this.m_a1;
         L2 = impulse * this.m_a2;
         v1.x -= this.m_invMassA * PX;
         v1.y -= this.m_invMassA * PY;
         w1 -= this.m_invIA * L1;
         v2.x += this.m_invMassB * PX;
         v2.y += this.m_invMassB * PY;
         w2 += this.m_invIB * L2;
      }
      var Cdot1 = this.m_perp.x * (v2.x - v1.x) + this.m_perp.y * (v2.y - v1.y) + this.m_s2 * w2 - this.m_s1 * w1;
      if (this.m_enableLimit && this.m_limitState !== b2Joint.e_inactiveLimit) {
         var Cdot2 = this.m_axis.x * (v2.x - v1.x) + this.m_axis.y * (v2.y - v1.y) + this.m_a2 * w2 - this.m_a1 * w1,
          f1 = this.m_impulse.Copy(),
          df = this.m_K.Solve(new b2Vec2(0, 0), (-Cdot1), (-Cdot2));
         this.m_impulse.Add(df);
         if (this.m_limitState === b2Joint.e_atLowerLimit) {
            this.m_impulse.y = b2Math.Max(this.m_impulse.y, 0.0);
         }
         else if (this.m_limitState === b2Joint.e_atUpperLimit) {
            this.m_impulse.y = b2Math.Min(this.m_impulse.y, 0.0);
         }
         var b = (-Cdot1) - (this.m_impulse.y - f1.y) * this.m_K.col2.x,
          f2r = 0;
         if (this.m_K.col1.x !== 0.0) {
            f2r = b / this.m_K.col1.x + f1.x;
         }
         else {
            f2r = f1.x;
         }
         this.m_impulse.x = f2r;
         df.x = this.m_impulse.x - f1.x;
         df.y = this.m_impulse.y - f1.y;
         PX = df.x * this.m_perp.x + df.y * this.m_axis.x;
         PY = df.x * this.m_perp.y + df.y * this.m_axis.y;
         L1 = df.x * this.m_s1 + df.y * this.m_a1;
         L2 = df.x * this.m_s2 + df.y * this.m_a2;
         v1.x -= this.m_invMassA * PX;
         v1.y -= this.m_invMassA * PY;
         w1 -= this.m_invIA * L1;
         v2.x += this.m_invMassB * PX;
         v2.y += this.m_invMassB * PY;
         w2 += this.m_invIB * L2;
      }
      else {
         var df2 = 0;
         if (this.m_K.col1.x !== 0.0) {
            df2 = ((-Cdot1)) / this.m_K.col1.x;
         }
         else {
            df2 = 0.0;
         }
         this.m_impulse.x += df2;
         PX = df2 * this.m_perp.x;
         PY = df2 * this.m_perp.y;
         L1 = df2 * this.m_s1;
         L2 = df2 * this.m_s2;
         v1.x -= this.m_invMassA * PX;
         v1.y -= this.m_invMassA * PY;
         w1 -= this.m_invIA * L1;
         v2.x += this.m_invMassB * PX;
         v2.y += this.m_invMassB * PY;
         w2 += this.m_invIB * L2;
      }
      bA.m_linearVelocity.SetV(v1);
      bA.m_angularVelocity = w1;
      bB.m_linearVelocity.SetV(v2);
      bB.m_angularVelocity = w2;
   };

   /**
    * SolvePositionConstraints
    *
    * @param baumgarte
    *
    */
   b2LineJoint.prototype.SolvePositionConstraints = function (baumgarte) {
      baumgarte = baumgarte || 0;
      var limitC = 0,
          oldLimitImpulse = 0,
          bA = this.m_bodyA,
          bB = this.m_bodyB,
          c1 = bA.m_sweep.c,
          a1 = bA.m_sweep.a,
          c2 = bB.m_sweep.c,
          a2 = bB.m_sweep.a,
          tMat,
          tX = 0,
          m1 = 0,
          m2 = 0,
          i1 = 0,
          i2 = 0,
          linearError = 0.0,
          angularError = 0.0,
          active = false,
          C2 = 0.0,
          R1 = b2Mat22.FromAngle(a1),
          R2 = b2Mat22.FromAngle(a2);
      tMat = R1;
      var r1X = this.m_localAnchor1.x - this.m_localCenterA.x,
          r1Y = this.m_localAnchor1.y - this.m_localCenterA.y;
      tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
      r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
      r1X = tX;
      tMat = R2;
      var r2X = this.m_localAnchor2.x - this.m_localCenterB.x,
          r2Y = this.m_localAnchor2.y - this.m_localCenterB.y;
      tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
      r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
      r2X = tX;
      var dX = c2.x + r2X - c1.x - r1X,
          dY = c2.y + r2Y - c1.y - r1Y;
      if (this.m_enableLimit) {
         this.m_axis = b2Math.MulMV(R1, this.m_localXAxis1);
         this.m_a1 = (dX + r1X) * this.m_axis.y - (dY + r1Y) * this.m_axis.x;
         this.m_a2 = r2X * this.m_axis.y - r2Y * this.m_axis.x;
         var translation = this.m_axis.x * dX + this.m_axis.y * dY;
         if (b2Math.Abs(this.m_upperTranslation - this.m_lowerTranslation) < 2.0 * b2Settings.b2_linearSlop) {
            C2 = b2Math.Clamp(translation, (-b2Settings.b2_maxLinearCorrection), b2Settings.b2_maxLinearCorrection);
            linearError = b2Math.Abs(translation);
            active = true;
         }
         else if (translation <= this.m_lowerTranslation) {
            C2 = b2Math.Clamp(translation - this.m_lowerTranslation + b2Settings.b2_linearSlop, (-b2Settings.b2_maxLinearCorrection), 0.0);
            linearError = this.m_lowerTranslation - translation;
            active = true;
         }
         else if (translation >= this.m_upperTranslation) {
            C2 = b2Math.Clamp(translation - this.m_upperTranslation + b2Settings.b2_linearSlop, 0.0, b2Settings.b2_maxLinearCorrection);
            linearError = translation - this.m_upperTranslation;
            active = true;
         }
      }
      this.m_perp = b2Math.MulMV(R1, this.m_localYAxis1);
      this.m_s1 = (dX + r1X) * this.m_perp.y - (dY + r1Y) * this.m_perp.x;
      this.m_s2 = r2X * this.m_perp.y - r2Y * this.m_perp.x;
      var impulse = new b2Vec2(0, 0),
          C1 = this.m_perp.x * dX + this.m_perp.y * dY;
      linearError = b2Math.Max(linearError, b2Math.Abs(C1));
      angularError = 0.0;
      if (active) {
         m1 = this.m_invMassA;
         m2 = this.m_invMassB;
         i1 = this.m_invIA;
         i2 = this.m_invIB;
         this.m_K.col1.x = m1 + m2 + i1 * this.m_s1 * this.m_s1 + i2 * this.m_s2 * this.m_s2;
         this.m_K.col1.y = i1 * this.m_s1 * this.m_a1 + i2 * this.m_s2 * this.m_a2;
         this.m_K.col2.x = this.m_K.col1.y;
         this.m_K.col2.y = m1 + m2 + i1 * this.m_a1 * this.m_a1 + i2 * this.m_a2 * this.m_a2;
         this.m_K.Solve(impulse, (-C1), (-C2));
      }
      else {
         m1 = this.m_invMassA;
         m2 = this.m_invMassB;
         i1 = this.m_invIA;
         i2 = this.m_invIB;
         var k11 = m1 + m2 + i1 * this.m_s1 * this.m_s1 + i2 * this.m_s2 * this.m_s2,
          impulse1 = 0;
         if (k11 !== 0.0) {
            impulse1 = ((-C1)) / k11;
         }
         else {
            impulse1 = 0.0;
         }
         impulse.x = impulse1;
         impulse.y = 0.0;
      }
      var PX = impulse.x * this.m_perp.x + impulse.y * this.m_axis.x,
          PY = impulse.x * this.m_perp.y + impulse.y * this.m_axis.y,
          L1 = impulse.x * this.m_s1 + impulse.y * this.m_a1,
          L2 = impulse.x * this.m_s2 + impulse.y * this.m_a2;
      c1.x -= this.m_invMassA * PX;
      c1.y -= this.m_invMassA * PY;
      a1 -= this.m_invIA * L1;
      c2.x += this.m_invMassB * PX;
      c2.y += this.m_invMassB * PY;
      a2 += this.m_invIB * L2;
      bA.m_sweep.a = a1;
      bB.m_sweep.a = a2;
      bA.SynchronizeTransform();
      bB.SynchronizeTransform();
      return linearError <= b2Settings.b2_linearSlop && angularError <= b2Settings.b2_angularSlop;
   };

   /**
    * GetType
    *
    * @param 
    *
    */
   b2LineJoint.prototype.GetType = function () {
      return this.m_type;
   };

   /**
    * GetBodyA
    *
    * @param 
    *
    */
   b2LineJoint.prototype.GetBodyA = function () {
      return this.m_bodyA;
   };

   /**
    * GetBodyB
    *
    * @param 
    *
    */
   b2LineJoint.prototype.GetBodyB = function () {
      return this.m_bodyB;
   };

   /**
    * GetNext
    *
    * @param 
    *
    */
   b2LineJoint.prototype.GetNext = function () {
      return this.m_next;
   };

   /**
    * GetUserData
    *
    * @param 
    *
    */
   b2LineJoint.prototype.GetUserData = function () {
      return this.m_userData;
   };

   /**
    * SetUserData
    *
    * @param data
    *
    */
   b2LineJoint.prototype.SetUserData = function (data) {
      this.m_userData = data;
   };

   /**
    * IsActive
    *
    * @param 
    *
    */
   b2LineJoint.prototype.IsActive = function () {
      return this.m_bodyA.IsActive() && this.m_bodyB.IsActive();
   };

   /**
    * b2Joint
    *
    * @param def
    *
    */
   b2LineJoint.prototype.b2Joint = function (def) {
      b2Assert(def.bodyA !== def.bodyB);
      this.m_type = def.type;
      this.m_prev = null;
      this.m_next = null;
      this.m_bodyA = def.bodyA;
      this.m_bodyB = def.bodyB;
      this.m_collideConnected = def.collideConnected;
      this.m_islandFlag = false;
      this.m_userData = def.userData;
   };

   /**
    * FinalizeVelocityConstraints
    *
    * @param 
    *
    */
   b2LineJoint.prototype.FinalizeVelocityConstraints = function () {};

   /**
    *  Class b2LineJointDef
    *
    * @param 
    *
    */
   b2LineJointDef = Box2D.Dynamics.Joints.b2LineJointDef = function b2LineJointDef() {

      this.localAnchorA = new b2Vec2(0, 0);
      this.localAnchorB = new b2Vec2(0, 0);
      this.localAxisA = new b2Vec2(0, 0);
      this.localAxisA.Set(1.0, 0.0);
   };
   b2LineJointDef.constructor = b2LineJointDef;
   b2LineJointDef.prototype = Object.create(b2JointDef.prototype );
   b2LineJointDef.prototype.type                = b2Joint.e_lineJoint;
   b2LineJointDef.prototype.localAnchorA        = null;
   b2LineJointDef.prototype.localAnchorB        = null;
   b2LineJointDef.prototype.localAxisA          = null;
   b2LineJointDef.prototype.enableLimit         = false;
   b2LineJointDef.prototype.lowerTranslation    = 0.0;
   b2LineJointDef.prototype.upperTranslation    = 0.0;
   b2LineJointDef.prototype.enableMotor         = false;
   b2LineJointDef.prototype.maxMotorForce       = 0.0;
   b2LineJointDef.prototype.motorSpeed          = 0.0;

   /**
    * Initialize
    *
    * @param bA
    * @param bB
    * @param anchor
    * @param axis
    *
    */
   b2LineJointDef.prototype.Initialize = function (bA, bB, anchor, axis) {
      this.bodyA = bA;
      this.bodyB = bB;
      this.localAnchorA = this.bodyA.GetLocalPoint(anchor);
      this.localAnchorB = this.bodyB.GetLocalPoint(anchor);
      this.localAxisA = this.bodyA.GetLocalVector(axis);
   };

   /**
    * b2JointDef
    *
    * @param 
    *
    */
   b2LineJointDef.prototype.b2JointDef = function () {
      this.type = b2Joint.e_unknownJoint;
      this.userData = null;
      this.bodyA = null;
      this.bodyB = null;
      this.collideConnected = false;
   };

   /**
    *  Class b2MouseJoint
    *
    * @param def
    *
    */
   b2MouseJoint = Box2D.Dynamics.Joints.b2MouseJoint = function b2MouseJoint(def) {

      this.K = new b2Mat22();
      this.K1 = new b2Mat22();
      this.K2 = new b2Mat22();
      this.m_localAnchor = new b2Vec2(0, 0);
      this.m_target = new b2Vec2(0, 0);
      this.m_impulse = new b2Vec2(0, 0);
      this.m_mass = new b2Mat22();
      this.m_C = new b2Vec2(0, 0);
      b2Joint.call(this, def);
      this.m_target.SetV(def.target);
      var tX = this.m_target.x - this.m_bodyB.m_xf.position.x,
          tY = this.m_target.y - this.m_bodyB.m_xf.position.y,
          tMat = this.m_bodyB.m_xf.R;
      this.m_localAnchor.x = (tX * tMat.col1.x + tY * tMat.col1.y);
      this.m_localAnchor.y = (tX * tMat.col2.x + tY * tMat.col2.y);
      this.m_maxForce = def.maxForce;
      this.m_impulse.SetZero();
      this.m_frequencyHz = def.frequencyHz;
      this.m_dampingRatio = def.dampingRatio;
   };
   b2MouseJoint.constructor = b2MouseJoint;
   b2MouseJoint.prototype = Object.create(b2Joint.prototype );
   b2MouseJoint.prototype.K               = null;
   b2MouseJoint.prototype.K1              = null;
   b2MouseJoint.prototype.K2              = null;
   b2MouseJoint.prototype.m_localAnchor   = null;
   b2MouseJoint.prototype.m_target        = null;
   b2MouseJoint.prototype.m_impulse       = null;
   b2MouseJoint.prototype.m_mass          = null;
   b2MouseJoint.prototype.m_C             = null;
   b2MouseJoint.prototype.m_frequencyHz   = 0.0;
   b2MouseJoint.prototype.m_dampingRatio  = 0.0;
   b2MouseJoint.prototype.m_beta          = 0.0;
   b2MouseJoint.prototype.m_gamma         = 0.0;

   /**
    * GetAnchorA
    *
    * @param 
    *
    */
   b2MouseJoint.prototype.GetAnchorA = function () {
      return this.m_target;
   };

   /**
    * GetAnchorB
    *
    * @param 
    *
    */
   b2MouseJoint.prototype.GetAnchorB = function () {
      return this.m_bodyB.GetWorldPoint(this.m_localAnchor);
   };

   /**
    * GetReactionForce
    *
    * @param inv_dt
    *
    */
   b2MouseJoint.prototype.GetReactionForce = function (inv_dt) {
      inv_dt = inv_dt || 0;
      return new b2Vec2(inv_dt * this.m_impulse.x, inv_dt * this.m_impulse.y);
   };

   /**
    * GetReactionTorque
    *
    * @param inv_dt
    *
    */
   b2MouseJoint.prototype.GetReactionTorque = function (inv_dt) {
      inv_dt = inv_dt || 0;
      return 0.0;
   };

   /**
    * GetTarget
    *
    * @param 
    *
    */
   b2MouseJoint.prototype.GetTarget = function () {
      return this.m_target;
   };

   /**
    * SetTarget
    *
    * @param target
    *
    */
   b2MouseJoint.prototype.SetTarget = function (target) {
      if (this.m_bodyB.IsAwake() === false) {
         this.m_bodyB.SetAwake(true);
      }
      this.m_target = target;
   };

   /**
    * GetMaxForce
    *
    * @param 
    *
    */
   b2MouseJoint.prototype.GetMaxForce = function () {
      return this.m_maxForce;
   };

   /**
    * SetMaxForce
    *
    * @param maxForce
    *
    */
   b2MouseJoint.prototype.SetMaxForce = function (maxForce) {
      maxForce = maxForce || 0;
      this.m_maxForce = maxForce;
   };

   /**
    * GetFrequency
    *
    * @param 
    *
    */
   b2MouseJoint.prototype.GetFrequency = function () {
      return this.m_frequencyHz;
   };

   /**
    * SetFrequency
    *
    * @param hz
    *
    */
   b2MouseJoint.prototype.SetFrequency = function (hz) {
      hz = hz || 0;
      this.m_frequencyHz = hz;
   };

   /**
    * GetDampingRatio
    *
    * @param 
    *
    */
   b2MouseJoint.prototype.GetDampingRatio = function () {
      return this.m_dampingRatio;
   };

   /**
    * SetDampingRatio
    *
    * @param ratio
    *
    */
   b2MouseJoint.prototype.SetDampingRatio = function (ratio) {
      ratio = ratio || 0;
      this.m_dampingRatio = ratio;
   };

   /**
    * InitVelocityConstraints
    *
    * @param step
    *
    */
   b2MouseJoint.prototype.InitVelocityConstraints = function (step) {
      var b = this.m_bodyB,
          mass = b.GetMass(),
          omega = 2.0 * Math.PI * this.m_frequencyHz,
          d = 2.0 * mass * this.m_dampingRatio * omega,
          k = mass * omega * omega,
          rX,
          rY,
          tX;
      this.m_gamma = step.dt * (d + step.dt * k);
      this.m_gamma = this.m_gamma !== 0 ? 1 / this.m_gamma : 0.0;
      this.m_beta = step.dt * k * this.m_gamma;
      var tMat;tMat = b.m_xf.R,
          rX = this.m_localAnchor.x - b.m_sweep.localCenter.x,
          rY = this.m_localAnchor.y - b.m_sweep.localCenter.y,
          tX = (tMat.col1.x * rX + tMat.col2.x * rY);rY = (tMat.col1.y * rX + tMat.col2.y * rY);
      rX = tX;
      var invMass = b.m_invMass,
          invI = b.m_invI;this.K1.col1.x = invMass;
      this.K1.col2.x = 0.0;
      this.K1.col1.y = 0.0;
      this.K1.col2.y = invMass;
      this.K2.col1.x = invI * rY * rY;
      this.K2.col2.x = (-invI * rX * rY);
      this.K2.col1.y = (-invI * rX * rY);
      this.K2.col2.y = invI * rX * rX;
      this.K.SetM(this.K1);
      this.K.AddM(this.K2);
      this.K.col1.x += this.m_gamma;
      this.K.col2.y += this.m_gamma;
      this.K.GetInverse(this.m_mass);
      this.m_C.x = b.m_sweep.c.x + rX - this.m_target.x;
      this.m_C.y = b.m_sweep.c.y + rY - this.m_target.y;
      b.m_angularVelocity *= 0.98;
      this.m_impulse.x *= step.dtRatio;
      this.m_impulse.y *= step.dtRatio;
      b.m_linearVelocity.x += invMass * this.m_impulse.x;
      b.m_linearVelocity.y += invMass * this.m_impulse.y;
      b.m_angularVelocity += invI * (rX * this.m_impulse.y - rY * this.m_impulse.x);
   };

   /**
    * SolveVelocityConstraints
    *
    * @param step
    *
    */
   b2MouseJoint.prototype.SolveVelocityConstraints = function (step) {
      var b = this.m_bodyB,
          tMat,
          tX = 0,
          tY = 0;
      tMat = b.m_xf.R;
      var rX = this.m_localAnchor.x - b.m_sweep.localCenter.x,
          rY = this.m_localAnchor.y - b.m_sweep.localCenter.y;
      tX = (tMat.col1.x * rX + tMat.col2.x * rY);
      rY = (tMat.col1.y * rX + tMat.col2.y * rY);
      rX = tX;
      var CdotX = b.m_linearVelocity.x + ((-b.m_angularVelocity * rY)),
          CdotY = b.m_linearVelocity.y + (b.m_angularVelocity * rX);
      tMat = this.m_mass;
      tX = CdotX + this.m_beta * this.m_C.x + this.m_gamma * this.m_impulse.x;
      tY = CdotY + this.m_beta * this.m_C.y + this.m_gamma * this.m_impulse.y;
      var impulseX = (-(tMat.col1.x * tX + tMat.col2.x * tY)),
          impulseY = (-(tMat.col1.y * tX + tMat.col2.y * tY)),
          oldImpulseX = this.m_impulse.x,
          oldImpulseY = this.m_impulse.y;
      this.m_impulse.x += impulseX;
      this.m_impulse.y += impulseY;
      var maxImpulse = step.dt * this.m_maxForce;
      if (this.m_impulse.LengthSquared() > maxImpulse * maxImpulse) {
         this.m_impulse.Multiply(maxImpulse / this.m_impulse.Length());
      }
      impulseX = this.m_impulse.x - oldImpulseX;
      impulseY = this.m_impulse.y - oldImpulseY;
      b.m_linearVelocity.x += b.m_invMass * impulseX;
      b.m_linearVelocity.y += b.m_invMass * impulseY;
      b.m_angularVelocity += b.m_invI * (rX * impulseY - rY * impulseX);
   };

   /**
    * SolvePositionConstraints
    *
    * @param baumgarte
    *
    */
   b2MouseJoint.prototype.SolvePositionConstraints = function (baumgarte) {
      baumgarte = baumgarte || 0;
      return true;
   };

   /**
    * GetType
    *
    * @param 
    *
    */
   b2MouseJoint.prototype.GetType = function () {
      return this.m_type;
   };

   /**
    * GetBodyA
    *
    * @param 
    *
    */
   b2MouseJoint.prototype.GetBodyA = function () {
      return this.m_bodyA;
   };

   /**
    * GetBodyB
    *
    * @param 
    *
    */
   b2MouseJoint.prototype.GetBodyB = function () {
      return this.m_bodyB;
   };

   /**
    * GetNext
    *
    * @param 
    *
    */
   b2MouseJoint.prototype.GetNext = function () {
      return this.m_next;
   };

   /**
    * GetUserData
    *
    * @param 
    *
    */
   b2MouseJoint.prototype.GetUserData = function () {
      return this.m_userData;
   };

   /**
    * SetUserData
    *
    * @param data
    *
    */
   b2MouseJoint.prototype.SetUserData = function (data) {
      this.m_userData = data;
   };

   /**
    * IsActive
    *
    * @param 
    *
    */
   b2MouseJoint.prototype.IsActive = function () {
      return this.m_bodyA.IsActive() && this.m_bodyB.IsActive();
   };

   /**
    * b2Joint
    *
    * @param def
    *
    */
   b2MouseJoint.prototype.b2Joint = function (def) {
      b2Assert(def.bodyA !== def.bodyB);
      this.m_type = def.type;
      this.m_prev = null;
      this.m_next = null;
      this.m_bodyA = def.bodyA;
      this.m_bodyB = def.bodyB;
      this.m_collideConnected = def.collideConnected;
      this.m_islandFlag = false;
      this.m_userData = def.userData;
   };

   /**
    * FinalizeVelocityConstraints
    *
    * @param 
    *
    */
   b2MouseJoint.prototype.FinalizeVelocityConstraints = function () {};

   /**
    *  Class b2MouseJointDef
    *
    * @param 
    *
    */
   b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef = function b2MouseJointDef() {
      this.target = new b2Vec2(0, 0);
   };

   b2MouseJointDef.constructor = b2MouseJointDef;
   b2MouseJointDef.prototype = Object.create(b2JointDef.prototype );
   b2MouseJointDef.prototype.type            = b2Joint.e_mouseJoint;
   b2MouseJointDef.prototype.target          = null;
   b2MouseJointDef.prototype.maxForce        = 0.0;
   b2MouseJointDef.prototype.frequencyHz     = 5.0;
   b2MouseJointDef.prototype.dampingRatio    = 0.7;

   /**
    * b2JointDef
    *
    * @param 
    *
    */
   b2MouseJointDef.prototype.b2JointDef = function () {
      this.type = b2Joint.e_unknownJoint;
      this.userData = null;
      this.bodyA = null;
      this.bodyB = null;
      this.collideConnected = false;
   };

   /**
    *  Class b2PrismaticJoint
    *
    * @param def
    *
    */
   b2PrismaticJoint = Box2D.Dynamics.Joints.b2PrismaticJoint = function b2PrismaticJoint(def) {

      this.m_localAnchor1 = new b2Vec2(0, 0);
      this.m_localAnchor2 = new b2Vec2(0, 0);
      this.m_localXAxis1 = new b2Vec2(0, 0);
      this.m_localYAxis1 = new b2Vec2(0, 0);
      this.m_axis = new b2Vec2(0, 0);
      this.m_perp = new b2Vec2(0, 0);
      this.m_K = new b2Mat33();
      this.m_impulse = new b2Vec3(0, 0, 0);
      b2Joint.call(this, def);
      this.m_localAnchor1.SetV(def.localAnchorA);
      this.m_localAnchor2.SetV(def.localAnchorB);
      this.m_localXAxis1.SetV(def.localAxisA);
      this.m_localYAxis1.x = (-this.m_localXAxis1.y);
      this.m_localYAxis1.y = this.m_localXAxis1.x;
      this.m_refAngle = def.referenceAngle;
      this.m_impulse.SetZero();
      this.m_lowerTranslation = def.lowerTranslation;
      this.m_upperTranslation = def.upperTranslation;
      this.m_maxMotorForce = def.maxMotorForce;
      this.m_motorSpeed = def.motorSpeed;
      this.m_enableLimit = def.enableLimit;
      this.m_enableMotor = def.enableMotor;
      this.m_limitState = b2Joint.e_inactiveLimit;
      this.m_axis.SetZero();
      this.m_perp.SetZero();
   };
   b2PrismaticJoint.constructor = b2PrismaticJoint;
   b2PrismaticJoint.prototype = Object.create(b2Joint.prototype );
   b2PrismaticJoint.prototype.m_localXAxis1             = null;
   b2PrismaticJoint.prototype.m_localYAxis1             = null;
   b2PrismaticJoint.prototype.m_axis                    = null;
   b2PrismaticJoint.prototype.m_perp                    = null;
   b2PrismaticJoint.prototype.m_K                       = null;
   b2PrismaticJoint.prototype.m_refAngle                = null;
   b2PrismaticJoint.prototype.m_impulse                 = null;
   b2PrismaticJoint.prototype.m_motorMass               = 0.0;
   b2PrismaticJoint.prototype.m_motorImpulse            = 0.0;
   b2PrismaticJoint.prototype.m_lowerTranslation        = 0.0;
   b2PrismaticJoint.prototype.m_upperTranslation        = 0.0;
   b2PrismaticJoint.prototype.m_maxMotorForce           = 0.0;
   b2PrismaticJoint.prototype.m_motorSpeed              = 0.0;
   b2PrismaticJoint.prototype.m_enableLimit             = false;
   b2PrismaticJoint.prototype.m_enableMotor             = false;
   b2PrismaticJoint.prototype.m_limitState              = b2Joint.e_inactiveLimit;

   /**
    * GetAnchorA
    *
    * @param 
    *
    */
   b2PrismaticJoint.prototype.GetAnchorA = function () {
      return this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
   };

   /**
    * GetAnchorB
    *
    * @param 
    *
    */
   b2PrismaticJoint.prototype.GetAnchorB = function () {
      return this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
   };

   /**
    * GetReactionForce
    *
    * @param inv_dt
    *
    */
   b2PrismaticJoint.prototype.GetReactionForce = function (inv_dt) {
      inv_dt = inv_dt || 0;
      return new b2Vec2(inv_dt * (this.m_impulse.x * this.m_perp.x + (this.m_motorImpulse + this.m_impulse.z) * this.m_axis.x), inv_dt * (this.m_impulse.x * this.m_perp.y + (this.m_motorImpulse + this.m_impulse.z) * this.m_axis.y));
   };

   /**
    * GetReactionTorque
    *
    * @param inv_dt
    *
    */
   b2PrismaticJoint.prototype.GetReactionTorque = function (inv_dt) {
      inv_dt = inv_dt || 0;
      return inv_dt * this.m_impulse.y;
   };

   /**
    * GetJointTranslation
    *
    * @param 
    *
    */
   b2PrismaticJoint.prototype.GetJointTranslation = function () {
      var bA = this.m_bodyA,
          bB = this.m_bodyB,
          tMat,
          p1 = bA.GetWorldPoint(this.m_localAnchor1),
          p2 = bB.GetWorldPoint(this.m_localAnchor2),
          dX = p2.x - p1.x,
          dY = p2.y - p1.y,
          axis = bA.GetWorldVector(this.m_localXAxis1);
      return axis.x * dX + axis.y * dY;
   };

   /**
    * GetJointSpeed
    *
    * @param 
    *
    */
   b2PrismaticJoint.prototype.GetJointSpeed = function () {
      var bA = this.m_bodyA,
          bB = this.m_bodyB,
          tMat;
      tMat = bA.m_xf.R;
      var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x,
          r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y,
          tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
      r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
      r1X = tX;
      tMat = bB.m_xf.R;
      var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x,
          r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
      r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
      r2X = tX;
      var p1X = bA.m_sweep.c.x + r1X,
          p1Y = bA.m_sweep.c.y + r1Y,
          p2X = bB.m_sweep.c.x + r2X,
          p2Y = bB.m_sweep.c.y + r2Y,
          dX = p2X - p1X,
          dY = p2Y - p1Y,
          axis = bA.GetWorldVector(this.m_localXAxis1),
          v1 = bA.m_linearVelocity,
          v2 = bB.m_linearVelocity,
          w1 = bA.m_angularVelocity,
          w2 = bB.m_angularVelocity;
      return (dX * ((-w1 * axis.y)) + dY * (w1 * axis.x)) + (axis.x * (((v2.x + ((-w2 * r2Y))) - v1.x) - ((-w1 * r1Y))) + axis.y * (((v2.y + (w2 * r2X)) - v1.y) - (w1 * r1X)));
   };

   /**
    * IsLimitEnabled
    *
    * @param 
    *
    */
   b2PrismaticJoint.prototype.IsLimitEnabled = function () {
      return this.m_enableLimit;
   };

   /**
    * EnableLimit
    *
    * @param flag
    *
    */
   b2PrismaticJoint.prototype.EnableLimit = function (flag) {
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      this.m_enableLimit = flag;
   };

   /**
    * GetLowerLimit
    *
    * @param 
    *
    */
   b2PrismaticJoint.prototype.GetLowerLimit = function () {
      return this.m_lowerTranslation;
   };

   /**
    * GetUpperLimit
    *
    * @param 
    *
    */
   b2PrismaticJoint.prototype.GetUpperLimit = function () {
      return this.m_upperTranslation;
   };

   /**
    * SetLimits
    *
    * @param lower
    * @param upper
    *
    */
   b2PrismaticJoint.prototype.SetLimits = function (lower, upper) {
      lower = lower || 0;
      upper = upper || 0;
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      this.m_lowerTranslation = lower;
      this.m_upperTranslation = upper;
   };

   /**
    * IsMotorEnabled
    *
    * @param 
    *
    */
   b2PrismaticJoint.prototype.IsMotorEnabled = function () {
      return this.m_enableMotor;
   };

   /**
    * EnableMotor
    *
    * @param flag
    *
    */
   b2PrismaticJoint.prototype.EnableMotor = function (flag) {
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      this.m_enableMotor = flag;
   };

   /**
    * SetMotorSpeed
    *
    * @param speed
    *
    */
   b2PrismaticJoint.prototype.SetMotorSpeed = function (speed) {
      speed = speed || 0;
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      this.m_motorSpeed = speed;
   };

   /**
    * GetMotorSpeed
    *
    * @param 
    *
    */
   b2PrismaticJoint.prototype.GetMotorSpeed = function () {
      return this.m_motorSpeed;
   };

   /**
    * SetMaxMotorForce
    *
    * @param force
    *
    */
   b2PrismaticJoint.prototype.SetMaxMotorForce = function (force) {
      force = force || 0;
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      this.m_maxMotorForce = force;
   };

   /**
    * GetMotorForce
    *
    * @param 
    *
    */
   b2PrismaticJoint.prototype.GetMotorForce = function () {
      return this.m_motorImpulse;
   };

   /**
    * InitVelocityConstraints
    *
    * @param step
    *
    */
   b2PrismaticJoint.prototype.InitVelocityConstraints = function (step) {
      var bA = this.m_bodyA,
          bB = this.m_bodyB,
          tMat,
          tX = 0;
      this.m_localCenterA.SetV(bA.GetLocalCenter());
      this.m_localCenterB.SetV(bB.GetLocalCenter());
      var xf1 = bA.GetTransform(),
          xf2 = bB.GetTransform();
      tMat = bA.m_xf.R;
      var r1X = this.m_localAnchor1.x - this.m_localCenterA.x,
          r1Y = this.m_localAnchor1.y - this.m_localCenterA.y;
      tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
      r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
      r1X = tX;
      tMat = bB.m_xf.R;
      var r2X = this.m_localAnchor2.x - this.m_localCenterB.x,
          r2Y = this.m_localAnchor2.y - this.m_localCenterB.y;
      tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
      r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
      r2X = tX;
      var dX = bB.m_sweep.c.x + r2X - bA.m_sweep.c.x - r1X,
          dY = bB.m_sweep.c.y + r2Y - bA.m_sweep.c.y - r1Y;
      this.m_invMassA = bA.m_invMass;
      this.m_invMassB = bB.m_invMass;
      this.m_invIA = bA.m_invI;
      this.m_invIB = bB.m_invI; {
         this.m_axis.SetV(b2Math.MulMV(xf1.R, this.m_localXAxis1));
         this.m_a1 = (dX + r1X) * this.m_axis.y - (dY + r1Y) * this.m_axis.x;
         this.m_a2 = r2X * this.m_axis.y - r2Y * this.m_axis.x;
         this.m_motorMass = this.m_invMassA + this.m_invMassB + this.m_invIA * this.m_a1 * this.m_a1 + this.m_invIB * this.m_a2 * this.m_a2;
         if (this.m_motorMass > b2Settings.b2_epsilon) this.m_motorMass = 1.0 / this.m_motorMass;
      } {
         this.m_perp.SetV(b2Math.MulMV(xf1.R, this.m_localYAxis1));
         this.m_s1 = (dX + r1X) * this.m_perp.y - (dY + r1Y) * this.m_perp.x;
         this.m_s2 = r2X * this.m_perp.y - r2Y * this.m_perp.x;
         var m1 = this.m_invMassA,
          m2 = this.m_invMassB,
          i1 = this.m_invIA,
          i2 = this.m_invIB;
         this.m_K.col1.x = m1 + m2 + i1 * this.m_s1 * this.m_s1 + i2 * this.m_s2 * this.m_s2;
         this.m_K.col1.y = i1 * this.m_s1 + i2 * this.m_s2;
         this.m_K.col1.z = i1 * this.m_s1 * this.m_a1 + i2 * this.m_s2 * this.m_a2;
         this.m_K.col2.x = this.m_K.col1.y;
         this.m_K.col2.y = i1 + i2;
         this.m_K.col2.z = i1 * this.m_a1 + i2 * this.m_a2;
         this.m_K.col3.x = this.m_K.col1.z;
         this.m_K.col3.y = this.m_K.col2.z;
         this.m_K.col3.z = m1 + m2 + i1 * this.m_a1 * this.m_a1 + i2 * this.m_a2 * this.m_a2;
      }
      if (this.m_enableLimit) {
         var jointTransition = this.m_axis.x * dX + this.m_axis.y * dY;
         if (b2Math.Abs(this.m_upperTranslation - this.m_lowerTranslation) < 2.0 * b2Settings.b2_linearSlop) {
            this.m_limitState = b2Joint.e_equalLimits;
         }
         else if (jointTransition <= this.m_lowerTranslation) {
            if (this.m_limitState !== b2Joint.e_atLowerLimit) {
               this.m_limitState = b2Joint.e_atLowerLimit;
               this.m_impulse.z = 0.0;
            }
         }
         else if (jointTransition >= this.m_upperTranslation) {
            if (this.m_limitState !== b2Joint.e_atUpperLimit) {
               this.m_limitState = b2Joint.e_atUpperLimit;
               this.m_impulse.z = 0.0;
            }
         }
         else {
            this.m_limitState = b2Joint.e_inactiveLimit;
            this.m_impulse.z = 0.0;
         }
      }
      else {
         this.m_limitState = b2Joint.e_inactiveLimit;
      }
      if (this.m_enableMotor === false) {
         this.m_motorImpulse = 0.0;
      }
      if (step.warmStarting) {
         this.m_impulse.x *= step.dtRatio;
         this.m_impulse.y *= step.dtRatio;
         this.m_motorImpulse *= step.dtRatio;
         var PX = this.m_impulse.x * this.m_perp.x + (this.m_motorImpulse + this.m_impulse.z) * this.m_axis.x,
          PY = this.m_impulse.x * this.m_perp.y + (this.m_motorImpulse + this.m_impulse.z) * this.m_axis.y,
          L1 = this.m_impulse.x * this.m_s1 + this.m_impulse.y + (this.m_motorImpulse + this.m_impulse.z) * this.m_a1,
          L2 = this.m_impulse.x * this.m_s2 + this.m_impulse.y + (this.m_motorImpulse + this.m_impulse.z) * this.m_a2;
         bA.m_linearVelocity.x -= this.m_invMassA * PX;
         bA.m_linearVelocity.y -= this.m_invMassA * PY;
         bA.m_angularVelocity -= this.m_invIA * L1;
         bB.m_linearVelocity.x += this.m_invMassB * PX;
         bB.m_linearVelocity.y += this.m_invMassB * PY;
         bB.m_angularVelocity += this.m_invIB * L2;
      }
      else {
         this.m_impulse.SetZero();
         this.m_motorImpulse = 0.0;
      }
   };

   /**
    * SolveVelocityConstraints
    *
    * @param step
    *
    */
   b2PrismaticJoint.prototype.SolveVelocityConstraints = function (step) {
      var bA = this.m_bodyA,
          bB = this.m_bodyB,
          v1 = bA.m_linearVelocity,
          w1 = bA.m_angularVelocity,
          v2 = bB.m_linearVelocity,
          w2 = bB.m_angularVelocity,
          PX = 0,
          PY = 0,
          L1 = 0,
          L2 = 0;
      if (this.m_enableMotor && this.m_limitState !== b2Joint.e_equalLimits) {
         var Cdot = this.m_axis.x * (v2.x - v1.x) + this.m_axis.y * (v2.y - v1.y) + this.m_a2 * w2 - this.m_a1 * w1,
          impulse = this.m_motorMass * (this.m_motorSpeed - Cdot),
          oldImpulse = this.m_motorImpulse,
          maxImpulse = step.dt * this.m_maxMotorForce;
         this.m_motorImpulse = b2Math.Clamp(this.m_motorImpulse + impulse, (-maxImpulse), maxImpulse);
         impulse = this.m_motorImpulse - oldImpulse;
         PX = impulse * this.m_axis.x;
         PY = impulse * this.m_axis.y;
         L1 = impulse * this.m_a1;
         L2 = impulse * this.m_a2;
         v1.x -= this.m_invMassA * PX;
         v1.y -= this.m_invMassA * PY;
         w1 -= this.m_invIA * L1;
         v2.x += this.m_invMassB * PX;
         v2.y += this.m_invMassB * PY;
         w2 += this.m_invIB * L2;
      }
      var Cdot1X = this.m_perp.x * (v2.x - v1.x) + this.m_perp.y * (v2.y - v1.y) + this.m_s2 * w2 - this.m_s1 * w1,
          Cdot1Y = w2 - w1;
      if (this.m_enableLimit && this.m_limitState !== b2Joint.e_inactiveLimit) {
         var Cdot2 = this.m_axis.x * (v2.x - v1.x) + this.m_axis.y * (v2.y - v1.y) + this.m_a2 * w2 - this.m_a1 * w1,
          f1 = this.m_impulse.Copy(),
          df = this.m_K.Solve33(new b2Vec3(0, 0, 0), (-Cdot1X), (-Cdot1Y), (-Cdot2));
         this.m_impulse.Add(df);
         if (this.m_limitState === b2Joint.e_atLowerLimit) {
            this.m_impulse.z = b2Math.Max(this.m_impulse.z, 0.0);
         }
         else if (this.m_limitState === b2Joint.e_atUpperLimit) {
            this.m_impulse.z = b2Math.Min(this.m_impulse.z, 0.0);
         }
         var bX = (-Cdot1X) - (this.m_impulse.z - f1.z) * this.m_K.col3.x,
          bY = (-Cdot1Y) - (this.m_impulse.z - f1.z) * this.m_K.col3.y,
          f2r = this.m_K.Solve22(new b2Vec2(0, 0), bX, bY);
         f2r.x += f1.x;
         f2r.y += f1.y;
         this.m_impulse.x = f2r.x;
         this.m_impulse.y = f2r.y;
         df.x = this.m_impulse.x - f1.x;
         df.y = this.m_impulse.y - f1.y;
         df.z = this.m_impulse.z - f1.z;
         PX = df.x * this.m_perp.x + df.z * this.m_axis.x;
         PY = df.x * this.m_perp.y + df.z * this.m_axis.y;
         L1 = df.x * this.m_s1 + df.y + df.z * this.m_a1;
         L2 = df.x * this.m_s2 + df.y + df.z * this.m_a2;
         v1.x -= this.m_invMassA * PX;
         v1.y -= this.m_invMassA * PY;
         w1 -= this.m_invIA * L1;
         v2.x += this.m_invMassB * PX;
         v2.y += this.m_invMassB * PY;
         w2 += this.m_invIB * L2;
      }
      else {
         var df2 = this.m_K.Solve22(new b2Vec2(0, 0), (-Cdot1X), (-Cdot1Y));
         this.m_impulse.x += df2.x;
         this.m_impulse.y += df2.y;
         PX = df2.x * this.m_perp.x;
         PY = df2.x * this.m_perp.y;
         L1 = df2.x * this.m_s1 + df2.y;
         L2 = df2.x * this.m_s2 + df2.y;
         v1.x -= this.m_invMassA * PX;
         v1.y -= this.m_invMassA * PY;
         w1 -= this.m_invIA * L1;
         v2.x += this.m_invMassB * PX;
         v2.y += this.m_invMassB * PY;
         w2 += this.m_invIB * L2;
      }
      bA.m_linearVelocity.SetV(v1);
      bA.m_angularVelocity = w1;
      bB.m_linearVelocity.SetV(v2);
      bB.m_angularVelocity = w2;
   };

   /**
    * SolvePositionConstraints
    *
    * @param baumgarte
    *
    */
   b2PrismaticJoint.prototype.SolvePositionConstraints = function (baumgarte) {
      baumgarte = baumgarte || 0;
      var limitC = 0,
          oldLimitImpulse = 0,
          bA = this.m_bodyA,
          bB = this.m_bodyB,
          c1 = bA.m_sweep.c,
          a1 = bA.m_sweep.a,
          c2 = bB.m_sweep.c,
          a2 = bB.m_sweep.a,
          tMat,
          tX = 0,
          m1 = 0,
          m2 = 0,
          i1 = 0,
          i2 = 0,
          linearError = 0.0,
          angularError = 0.0,
          active = false,
          C2 = 0.0,
          R1 = b2Mat22.FromAngle(a1),
          R2 = b2Mat22.FromAngle(a2);
      tMat = R1;
      var r1X = this.m_localAnchor1.x - this.m_localCenterA.x,
          r1Y = this.m_localAnchor1.y - this.m_localCenterA.y;
      tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
      r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
      r1X = tX;
      tMat = R2;
      var r2X = this.m_localAnchor2.x - this.m_localCenterB.x,
          r2Y = this.m_localAnchor2.y - this.m_localCenterB.y;
      tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
      r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
      r2X = tX;
      var dX = c2.x + r2X - c1.x - r1X,
          dY = c2.y + r2Y - c1.y - r1Y;
      if (this.m_enableLimit) {
         this.m_axis = b2Math.MulMV(R1, this.m_localXAxis1);
         this.m_a1 = (dX + r1X) * this.m_axis.y - (dY + r1Y) * this.m_axis.x;
         this.m_a2 = r2X * this.m_axis.y - r2Y * this.m_axis.x;
         var translation = this.m_axis.x * dX + this.m_axis.y * dY;
         if (b2Math.Abs(this.m_upperTranslation - this.m_lowerTranslation) < 2.0 * b2Settings.b2_linearSlop) {
            C2 = b2Math.Clamp(translation, (-b2Settings.b2_maxLinearCorrection), b2Settings.b2_maxLinearCorrection);
            linearError = b2Math.Abs(translation);
            active = true;
         }
         else if (translation <= this.m_lowerTranslation) {
            C2 = b2Math.Clamp(translation - this.m_lowerTranslation + b2Settings.b2_linearSlop, (-b2Settings.b2_maxLinearCorrection), 0.0);
            linearError = this.m_lowerTranslation - translation;
            active = true;
         }
         else if (translation >= this.m_upperTranslation) {
            C2 = b2Math.Clamp(translation - this.m_upperTranslation + b2Settings.b2_linearSlop, 0.0, b2Settings.b2_maxLinearCorrection);
            linearError = translation - this.m_upperTranslation;
            active = true;
         }
      }
      this.m_perp = b2Math.MulMV(R1, this.m_localYAxis1);
      this.m_s1 = (dX + r1X) * this.m_perp.y - (dY + r1Y) * this.m_perp.x;
      this.m_s2 = r2X * this.m_perp.y - r2Y * this.m_perp.x;
      var impulse = new b2Vec3(0, 0, 0),
          C1X = this.m_perp.x * dX + this.m_perp.y * dY,
          C1Y = a2 - a1 - this.m_refAngle;
      linearError = b2Math.Max(linearError, b2Math.Abs(C1X));
      angularError = b2Math.Abs(C1Y);
      if (active) {
         m1 = this.m_invMassA;
         m2 = this.m_invMassB;
         i1 = this.m_invIA;
         i2 = this.m_invIB;
         this.m_K.col1.x = m1 + m2 + i1 * this.m_s1 * this.m_s1 + i2 * this.m_s2 * this.m_s2;
         this.m_K.col1.y = i1 * this.m_s1 + i2 * this.m_s2;
         this.m_K.col1.z = i1 * this.m_s1 * this.m_a1 + i2 * this.m_s2 * this.m_a2;
         this.m_K.col2.x = this.m_K.col1.y;
         this.m_K.col2.y = i1 + i2;
         this.m_K.col2.z = i1 * this.m_a1 + i2 * this.m_a2;
         this.m_K.col3.x = this.m_K.col1.z;
         this.m_K.col3.y = this.m_K.col2.z;
         this.m_K.col3.z = m1 + m2 + i1 * this.m_a1 * this.m_a1 + i2 * this.m_a2 * this.m_a2;
         this.m_K.Solve33(impulse, (-C1X), (-C1Y), (-C2));
      }
      else {
         m1 = this.m_invMassA;
         m2 = this.m_invMassB;
         i1 = this.m_invIA;
         i2 = this.m_invIB;
         var k11 = m1 + m2 + i1 * this.m_s1 * this.m_s1 + i2 * this.m_s2 * this.m_s2,
          k12 = i1 * this.m_s1 + i2 * this.m_s2,
          k22 = i1 + i2;
         this.m_K.col1.Set(k11, k12, 0.0);
         this.m_K.col2.Set(k12, k22, 0.0);
         var impulse1 = this.m_K.Solve22(new b2Vec2(0, 0), (-C1X), (-C1Y));
         impulse.x = impulse1.x;
         impulse.y = impulse1.y;
         impulse.z = 0.0;
      }
      var PX = impulse.x * this.m_perp.x + impulse.z * this.m_axis.x,
          PY = impulse.x * this.m_perp.y + impulse.z * this.m_axis.y,
          L1 = impulse.x * this.m_s1 + impulse.y + impulse.z * this.m_a1,
          L2 = impulse.x * this.m_s2 + impulse.y + impulse.z * this.m_a2;
      c1.x -= this.m_invMassA * PX;
      c1.y -= this.m_invMassA * PY;
      a1 -= this.m_invIA * L1;
      c2.x += this.m_invMassB * PX;
      c2.y += this.m_invMassB * PY;
      a2 += this.m_invIB * L2;
      bA.m_sweep.a = a1;
      bB.m_sweep.a = a2;
      bA.SynchronizeTransform();
      bB.SynchronizeTransform();
      return linearError <= b2Settings.b2_linearSlop && angularError <= b2Settings.b2_angularSlop;
   };

   /**
    * GetType
    *
    * @param 
    *
    */
   b2PrismaticJoint.prototype.GetType = function () {
      return this.m_type;
   };

   /**
    * GetBodyA
    *
    * @param 
    *
    */
   b2PrismaticJoint.prototype.GetBodyA = function () {
      return this.m_bodyA;
   };

   /**
    * GetBodyB
    *
    * @param 
    *
    */
   b2PrismaticJoint.prototype.GetBodyB = function () {
      return this.m_bodyB;
   };

   /**
    * GetNext
    *
    * @param 
    *
    */
   b2PrismaticJoint.prototype.GetNext = function () {
      return this.m_next;
   };

   /**
    * GetUserData
    *
    * @param 
    *
    */
   b2PrismaticJoint.prototype.GetUserData = function () {
      return this.m_userData;
   };

   /**
    * SetUserData
    *
    * @param data
    *
    */
   b2PrismaticJoint.prototype.SetUserData = function (data) {
      this.m_userData = data;
   };

   /**
    * IsActive
    *
    * @param 
    *
    */
   b2PrismaticJoint.prototype.IsActive = function () {
      return this.m_bodyA.IsActive() && this.m_bodyB.IsActive();
   };

   /**
    * b2Joint
    *
    * @param def
    *
    */
   b2PrismaticJoint.prototype.b2Joint = function (def) {
      b2Assert(def.bodyA !== def.bodyB);
      this.m_type = def.type;
      this.m_prev = null;
      this.m_next = null;
      this.m_bodyA = def.bodyA;
      this.m_bodyB = def.bodyB;
      this.m_collideConnected = def.collideConnected;
      this.m_islandFlag = false;
      this.m_userData = def.userData;
   };

   /**
    * FinalizeVelocityConstraints
    *
    * @param 
    *
    */
   b2PrismaticJoint.prototype.FinalizeVelocityConstraints = function () {};

   /**
    *  Class b2PrismaticJointDef
    *
    * @param 
    *
    */
   b2PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef = function b2PrismaticJointDef() {

      this.localAnchorA = new b2Vec2(0, 0);
      this.localAnchorB = new b2Vec2(0, 0);
      this.localAxisA = new b2Vec2(0, 0);
      b2JointDef.call(this);
      this.type = b2Joint.e_prismaticJoint;
      this.localAxisA.Set(1.0, 0.0);
   };
   b2PrismaticJointDef.constructor = b2PrismaticJointDef;
   b2PrismaticJointDef.prototype = Object.create(b2JointDef.prototype );
   b2PrismaticJointDef.prototype.type                = b2Joint.e_prismaticJoint;
   b2PrismaticJointDef.prototype.localAnchorA        = null;
   b2PrismaticJointDef.prototype.localAnchorB        = null;
   b2PrismaticJointDef.prototype.localAxisA          = null;
   b2PrismaticJointDef.prototype.referenceAngle      = 0.0;
   b2PrismaticJointDef.prototype.enableLimit         = false;
   b2PrismaticJointDef.prototype.lowerTranslation    = 0.0;
   b2PrismaticJointDef.prototype.upperTranslation    = 0.0;
   b2PrismaticJointDef.prototype.enableMotor         = false;
   b2PrismaticJointDef.prototype.maxMotorForce       = 0.0;
   b2PrismaticJointDef.prototype.motorSpeed          = 0.0;

   /**
    * Initialize
    *
    * @param bA
    * @param bB
    * @param anchor
    * @param axis
    *
    */
   b2PrismaticJointDef.prototype.Initialize = function (bA, bB, anchor, axis) {
      this.bodyA = bA;
      this.bodyB = bB;
      this.localAnchorA = this.bodyA.GetLocalPoint(anchor);
      this.localAnchorB = this.bodyB.GetLocalPoint(anchor);
      this.localAxisA = this.bodyA.GetLocalVector(axis);
      this.referenceAngle = this.bodyB.GetAngle() - this.bodyA.GetAngle();
   };

   /**
    * b2JointDef
    *
    * @param 
    *
    */
   b2PrismaticJointDef.prototype.b2JointDef = function () {
      this.type = b2Joint.e_unknownJoint;
      this.userData = null;
      this.bodyA = null;
      this.bodyB = null;
      this.collideConnected = false;
   };

   /**
    *  Class b2PulleyJoint
    *
    * @param def
    *
    */
   b2PulleyJoint = Box2D.Dynamics.Joints.b2PulleyJoint = function b2PulleyJoint(def) {

      this.m_groundAnchor1 = new b2Vec2(0, 0);
      this.m_groundAnchor2 = new b2Vec2(0, 0);
      this.m_localAnchor1 = new b2Vec2(0, 0);
      this.m_localAnchor2 = new b2Vec2(0, 0);
      this.m_u1 = new b2Vec2(0, 0);
      this.m_u2 = new b2Vec2(0, 0);
      b2Joint.call(this, def);
      this.m_ground = this.m_bodyA.m_world.m_groundBody;
      this.m_groundAnchor1.x = def.groundAnchorA.x - this.m_ground.m_xf.position.x;
      this.m_groundAnchor1.y = def.groundAnchorA.y - this.m_ground.m_xf.position.y;
      this.m_groundAnchor2.x = def.groundAnchorB.x - this.m_ground.m_xf.position.x;
      this.m_groundAnchor2.y = def.groundAnchorB.y - this.m_ground.m_xf.position.y;
      this.m_localAnchor1.SetV(def.localAnchorA);
      this.m_localAnchor2.SetV(def.localAnchorB);
      this.m_ratio = def.ratio;
      this.m_constant = def.lengthA + this.m_ratio * def.lengthB;
      this.m_maxLength1 = b2Math.Min(def.maxLengthA, this.m_constant - this.m_ratio * b2PulleyJoint.b2_minPulleyLength);
      this.m_maxLength2 = b2Math.Min(def.maxLengthB, (this.m_constant - b2PulleyJoint.b2_minPulleyLength) / this.m_ratio);
   };
   b2PulleyJoint.constructor = b2PulleyJoint;
   b2PulleyJoint.b2_minPulleyLength = 2.0;
   b2PulleyJoint.prototype = Object.create(b2Joint.prototype );
   b2PulleyJoint.prototype.m_localXAxis1             = null;
   b2PulleyJoint.prototype.m_localYAxis1             = null;
   b2PulleyJoint.prototype.m_u1                      = null;
   b2PulleyJoint.prototype.m_u2                      = null;
   b2PulleyJoint.prototype.m_ground                  = null;
   b2PulleyJoint.prototype.m_ratio                   = 0.0;
   b2PulleyJoint.prototype.m_constant                = 0.0;
   b2PulleyJoint.prototype.m_maxLength1              = 0.0;
   b2PulleyJoint.prototype.m_maxLength2              = 0.0;
   b2PulleyJoint.prototype.m_impulse                 = 0.0;
   b2PulleyJoint.prototype.m_limitImpulse1           = 0.0;
   b2PulleyJoint.prototype.m_limitImpulse2           = 0.0;



   /**
    * GetAnchorA
    *
    * @param 
    *
    */
   b2PulleyJoint.prototype.GetAnchorA = function () {
      return this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
   };

   /**
    * GetAnchorB
    *
    * @param 
    *
    */
   b2PulleyJoint.prototype.GetAnchorB = function () {
      return this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
   };

   /**
    * GetReactionForce
    *
    * @param inv_dt
    *
    */
   b2PulleyJoint.prototype.GetReactionForce = function (inv_dt) {
      inv_dt = inv_dt || 0;
      return new b2Vec2(inv_dt * this.m_impulse * this.m_u2.x, inv_dt * this.m_impulse * this.m_u2.y);
   };

   /**
    * GetReactionTorque
    *
    * @param inv_dt
    *
    */
   b2PulleyJoint.prototype.GetReactionTorque = function (inv_dt) {
      inv_dt = inv_dt || 0;
      return 0.0;
   };

   /**
    * GetGroundAnchorA
    *
    * @param 
    *
    */
   b2PulleyJoint.prototype.GetGroundAnchorA = function () {
      var a = this.m_ground.m_xf.position.Copy();
      a.Add(this.m_groundAnchor1);
      return a;
   };

   /**
    * GetGroundAnchorB
    *
    * @param 
    *
    */
   b2PulleyJoint.prototype.GetGroundAnchorB = function () {
      var a = this.m_ground.m_xf.position.Copy();
      a.Add(this.m_groundAnchor2);
      return a;
   };

   /**
    * GetLength1
    *
    * @param 
    *
    */
   b2PulleyJoint.prototype.GetLength1 = function () {
      var p = this.m_bodyA.GetWorldPoint(this.m_localAnchor1),
          sX = this.m_ground.m_xf.position.x + this.m_groundAnchor1.x,
          sY = this.m_ground.m_xf.position.y + this.m_groundAnchor1.y,
          dX = p.x - sX,
          dY = p.y - sY;
      return Math.sqrt(dX * dX + dY * dY);
   };

   /**
    * GetLength2
    *
    * @param 
    *
    */
   b2PulleyJoint.prototype.GetLength2 = function () {
      var p = this.m_bodyB.GetWorldPoint(this.m_localAnchor2),
          sX = this.m_ground.m_xf.position.x + this.m_groundAnchor2.x,
          sY = this.m_ground.m_xf.position.y + this.m_groundAnchor2.y,
          dX = p.x - sX,
          dY = p.y - sY;
      return Math.sqrt(dX * dX + dY * dY);
   };

   /**
    * GetRatio
    *
    * @param 
    *
    */
   b2PulleyJoint.prototype.GetRatio = function () {
      return this.m_ratio;
   };

   /**
    * InitVelocityConstraints
    *
    * @param step
    *
    */
   b2PulleyJoint.prototype.InitVelocityConstraints = function (step) {
      var bA = this.m_bodyA,
          bB = this.m_bodyB,
          tMat;
      tMat = bA.m_xf.R;
      var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x,
          r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y,
          tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
      r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
      r1X = tX;
      tMat = bB.m_xf.R;
      var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x,
          r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
      r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
      r2X = tX;
      var p1X = bA.m_sweep.c.x + r1X,
          p1Y = bA.m_sweep.c.y + r1Y,
          p2X = bB.m_sweep.c.x + r2X,
          p2Y = bB.m_sweep.c.y + r2Y,
          s1X = this.m_ground.m_xf.position.x + this.m_groundAnchor1.x,
          s1Y = this.m_ground.m_xf.position.y + this.m_groundAnchor1.y,
          s2X = this.m_ground.m_xf.position.x + this.m_groundAnchor2.x,
          s2Y = this.m_ground.m_xf.position.y + this.m_groundAnchor2.y;
      this.m_u1.Set(p1X - s1X, p1Y - s1Y);
      this.m_u2.Set(p2X - s2X, p2Y - s2Y);
      var length1 = this.m_u1.Length(),
          length2 = this.m_u2.Length();
      if (length1 > b2Settings.b2_linearSlop) {
         this.m_u1.Multiply(1.0 / length1);
      }
      else {
         this.m_u1.SetZero();
      }
      if (length2 > b2Settings.b2_linearSlop) {
         this.m_u2.Multiply(1.0 / length2);
      }
      else {
         this.m_u2.SetZero();
      }
      var C = this.m_constant - length1 - this.m_ratio * length2;
      if (C > 0.0) {
         this.m_state = b2Joint.e_inactiveLimit;
         this.m_impulse = 0.0;
      }
      else {
         this.m_state = b2Joint.e_atUpperLimit;
      }
      if (length1 < this.m_maxLength1) {
         this.m_limitState1 = b2Joint.e_inactiveLimit;
         this.m_limitImpulse1 = 0.0;
      }
      else {
         this.m_limitState1 = b2Joint.e_atUpperLimit;
      }
      if (length2 < this.m_maxLength2) {
         this.m_limitState2 = b2Joint.e_inactiveLimit;
         this.m_limitImpulse2 = 0.0;
      }
      else {
         this.m_limitState2 = b2Joint.e_atUpperLimit;
      }
      var cr1u1 = r1X * this.m_u1.y - r1Y * this.m_u1.x,
          cr2u2 = r2X * this.m_u2.y - r2Y * this.m_u2.x;
      this.m_limitMass1 = bA.m_invMass + bA.m_invI * cr1u1 * cr1u1;
      this.m_limitMass2 = bB.m_invMass + bB.m_invI * cr2u2 * cr2u2;
      this.m_pulleyMass = this.m_limitMass1 + this.m_ratio * this.m_ratio * this.m_limitMass2;
      this.m_limitMass1 = 1.0 / this.m_limitMass1;
      this.m_limitMass2 = 1.0 / this.m_limitMass2;
      this.m_pulleyMass = 1.0 / this.m_pulleyMass;
      if (step.warmStarting) {
         this.m_impulse *= step.dtRatio;
         this.m_limitImpulse1 *= step.dtRatio;
         this.m_limitImpulse2 *= step.dtRatio;
         var P1X = ((-this.m_impulse) - this.m_limitImpulse1) * this.m_u1.x,
          P1Y = ((-this.m_impulse) - this.m_limitImpulse1) * this.m_u1.y,
          P2X = ((-this.m_ratio * this.m_impulse) - this.m_limitImpulse2) * this.m_u2.x,
          P2Y = ((-this.m_ratio * this.m_impulse) - this.m_limitImpulse2) * this.m_u2.y;
         bA.m_linearVelocity.x += bA.m_invMass * P1X;
         bA.m_linearVelocity.y += bA.m_invMass * P1Y;
         bA.m_angularVelocity += bA.m_invI * (r1X * P1Y - r1Y * P1X);
         bB.m_linearVelocity.x += bB.m_invMass * P2X;
         bB.m_linearVelocity.y += bB.m_invMass * P2Y;
         bB.m_angularVelocity += bB.m_invI * (r2X * P2Y - r2Y * P2X);
      }
      else {
         this.m_impulse = 0.0;
         this.m_limitImpulse1 = 0.0;
         this.m_limitImpulse2 = 0.0;
      }
   };

   /**
    * SolveVelocityConstraints
    *
    * @param step
    *
    */
   b2PulleyJoint.prototype.SolveVelocityConstraints = function (step) {
      var bA = this.m_bodyA,
          bB = this.m_bodyB,
          tMat;
      tMat = bA.m_xf.R;
      var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x,
          r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y,
          tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
      r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
      r1X = tX;
      tMat = bB.m_xf.R;
      var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x,
          r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
      r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
      r2X = tX;
      var v1X = 0,
          v1Y = 0,
          v2X = 0,
          v2Y = 0,
          P1X = 0,
          P1Y = 0,
          P2X = 0,
          P2Y = 0,
          Cdot = 0,
          impulse = 0,
          oldImpulse = 0;
      if (this.m_state === b2Joint.e_atUpperLimit) {
         v1X = bA.m_linearVelocity.x + ((-bA.m_angularVelocity * r1Y));
         v1Y = bA.m_linearVelocity.y + (bA.m_angularVelocity * r1X);
         v2X = bB.m_linearVelocity.x + ((-bB.m_angularVelocity * r2Y));
         v2Y = bB.m_linearVelocity.y + (bB.m_angularVelocity * r2X);
         Cdot = (-(this.m_u1.x * v1X + this.m_u1.y * v1Y)) - this.m_ratio * (this.m_u2.x * v2X + this.m_u2.y * v2Y);
         impulse = this.m_pulleyMass * ((-Cdot));
         oldImpulse = this.m_impulse;
         this.m_impulse = b2Math.Max(0.0, this.m_impulse + impulse);
         impulse = this.m_impulse - oldImpulse;
         P1X = (-impulse * this.m_u1.x);
         P1Y = (-impulse * this.m_u1.y);
         P2X = (-this.m_ratio * impulse * this.m_u2.x);
         P2Y = (-this.m_ratio * impulse * this.m_u2.y);
         bA.m_linearVelocity.x += bA.m_invMass * P1X;
         bA.m_linearVelocity.y += bA.m_invMass * P1Y;
         bA.m_angularVelocity += bA.m_invI * (r1X * P1Y - r1Y * P1X);
         bB.m_linearVelocity.x += bB.m_invMass * P2X;
         bB.m_linearVelocity.y += bB.m_invMass * P2Y;
         bB.m_angularVelocity += bB.m_invI * (r2X * P2Y - r2Y * P2X);
      }
      if (this.m_limitState1 === b2Joint.e_atUpperLimit) {
         v1X = bA.m_linearVelocity.x + ((-bA.m_angularVelocity * r1Y));
         v1Y = bA.m_linearVelocity.y + (bA.m_angularVelocity * r1X);
         Cdot = (-(this.m_u1.x * v1X + this.m_u1.y * v1Y));
         impulse = (-this.m_limitMass1 * Cdot);
         oldImpulse = this.m_limitImpulse1;
         this.m_limitImpulse1 = b2Math.Max(0.0, this.m_limitImpulse1 + impulse);
         impulse = this.m_limitImpulse1 - oldImpulse;
         P1X = (-impulse * this.m_u1.x);
         P1Y = (-impulse * this.m_u1.y);
         bA.m_linearVelocity.x += bA.m_invMass * P1X;
         bA.m_linearVelocity.y += bA.m_invMass * P1Y;
         bA.m_angularVelocity += bA.m_invI * (r1X * P1Y - r1Y * P1X);
      }
      if (this.m_limitState2 === b2Joint.e_atUpperLimit) {
         v2X = bB.m_linearVelocity.x + ((-bB.m_angularVelocity * r2Y));
         v2Y = bB.m_linearVelocity.y + (bB.m_angularVelocity * r2X);
         Cdot = (-(this.m_u2.x * v2X + this.m_u2.y * v2Y));
         impulse = (-this.m_limitMass2 * Cdot);
         oldImpulse = this.m_limitImpulse2;
         this.m_limitImpulse2 = b2Math.Max(0.0, this.m_limitImpulse2 + impulse);
         impulse = this.m_limitImpulse2 - oldImpulse;
         P2X = (-impulse * this.m_u2.x);
         P2Y = (-impulse * this.m_u2.y);
         bB.m_linearVelocity.x += bB.m_invMass * P2X;
         bB.m_linearVelocity.y += bB.m_invMass * P2Y;
         bB.m_angularVelocity += bB.m_invI * (r2X * P2Y - r2Y * P2X);
      }
   };

   /**
    * SolvePositionConstraints
    *
    * @param baumgarte
    *
    */
   b2PulleyJoint.prototype.SolvePositionConstraints = function (baumgarte) {
      baumgarte = baumgarte || 0;
      var bA = this.m_bodyA,
          bB = this.m_bodyB,
          tMat,
          s1X = this.m_ground.m_xf.position.x + this.m_groundAnchor1.x,
          s1Y = this.m_ground.m_xf.position.y + this.m_groundAnchor1.y,
          s2X = this.m_ground.m_xf.position.x + this.m_groundAnchor2.x,
          s2Y = this.m_ground.m_xf.position.y + this.m_groundAnchor2.y,
          r1X = 0,
          r1Y = 0,
          r2X = 0,
          r2Y = 0,
          p1X = 0,
          p1Y = 0,
          p2X = 0,
          p2Y = 0,
          length1 = 0,
          length2 = 0,
          C = 0,
          impulse = 0,
          oldImpulse = 0,
          oldLimitPositionImpulse = 0,
          tX = 0,
          linearError = 0.0;
      if (this.m_state === b2Joint.e_atUpperLimit) {
         tMat = bA.m_xf.R;
         r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
         r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
         tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
         r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
         r1X = tX;
         tMat = bB.m_xf.R;
         r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
         r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
         tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
         r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
         r2X = tX;
         p1X = bA.m_sweep.c.x + r1X;
         p1Y = bA.m_sweep.c.y + r1Y;
         p2X = bB.m_sweep.c.x + r2X;
         p2Y = bB.m_sweep.c.y + r2Y;
         this.m_u1.Set(p1X - s1X, p1Y - s1Y);
         this.m_u2.Set(p2X - s2X, p2Y - s2Y);
         length1 = this.m_u1.Length();
         length2 = this.m_u2.Length();
         if (length1 > b2Settings.b2_linearSlop) {
            this.m_u1.Multiply(1.0 / length1);
         }
         else {
            this.m_u1.SetZero();
         }
         if (length2 > b2Settings.b2_linearSlop) {
            this.m_u2.Multiply(1.0 / length2);
         }
         else {
            this.m_u2.SetZero();
         }
         C = this.m_constant - length1 - this.m_ratio * length2;
         linearError = b2Math.Max(linearError, (-C));
         C = b2Math.Clamp(C + b2Settings.b2_linearSlop, (-b2Settings.b2_maxLinearCorrection), 0.0);
         impulse = (-this.m_pulleyMass * C);
         p1X = (-impulse * this.m_u1.x);
         p1Y = (-impulse * this.m_u1.y);
         p2X = (-this.m_ratio * impulse * this.m_u2.x);
         p2Y = (-this.m_ratio * impulse * this.m_u2.y);
         bA.m_sweep.c.x += bA.m_invMass * p1X;
         bA.m_sweep.c.y += bA.m_invMass * p1Y;
         bA.m_sweep.a += bA.m_invI * (r1X * p1Y - r1Y * p1X);
         bB.m_sweep.c.x += bB.m_invMass * p2X;
         bB.m_sweep.c.y += bB.m_invMass * p2Y;
         bB.m_sweep.a += bB.m_invI * (r2X * p2Y - r2Y * p2X);
         bA.SynchronizeTransform();
         bB.SynchronizeTransform();
      }
      if (this.m_limitState1 === b2Joint.e_atUpperLimit) {
         tMat = bA.m_xf.R;
         r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
         r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
         tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
         r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
         r1X = tX;
         p1X = bA.m_sweep.c.x + r1X;
         p1Y = bA.m_sweep.c.y + r1Y;
         this.m_u1.Set(p1X - s1X, p1Y - s1Y);
         length1 = this.m_u1.Length();
         if (length1 > b2Settings.b2_linearSlop) {
            this.m_u1.x *= 1.0 / length1;
            this.m_u1.y *= 1.0 / length1;
         }
         else {
            this.m_u1.SetZero();
         }
         C = this.m_maxLength1 - length1;
         linearError = b2Math.Max(linearError, (-C));
         C = b2Math.Clamp(C + b2Settings.b2_linearSlop, (-b2Settings.b2_maxLinearCorrection), 0.0);
         impulse = (-this.m_limitMass1 * C);
         p1X = (-impulse * this.m_u1.x);
         p1Y = (-impulse * this.m_u1.y);
         bA.m_sweep.c.x += bA.m_invMass * p1X;
         bA.m_sweep.c.y += bA.m_invMass * p1Y;
         bA.m_sweep.a += bA.m_invI * (r1X * p1Y - r1Y * p1X);
         bA.SynchronizeTransform();
      }
      if (this.m_limitState2 === b2Joint.e_atUpperLimit) {
         tMat = bB.m_xf.R;
         r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
         r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
         tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
         r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
         r2X = tX;
         p2X = bB.m_sweep.c.x + r2X;
         p2Y = bB.m_sweep.c.y + r2Y;
         this.m_u2.Set(p2X - s2X, p2Y - s2Y);
         length2 = this.m_u2.Length();
         if (length2 > b2Settings.b2_linearSlop) {
            this.m_u2.x *= 1.0 / length2;
            this.m_u2.y *= 1.0 / length2;
         }
         else {
            this.m_u2.SetZero();
         }
         C = this.m_maxLength2 - length2;
         linearError = b2Math.Max(linearError, (-C));
         C = b2Math.Clamp(C + b2Settings.b2_linearSlop, (-b2Settings.b2_maxLinearCorrection), 0.0);
         impulse = (-this.m_limitMass2 * C);
         p2X = (-impulse * this.m_u2.x);
         p2Y = (-impulse * this.m_u2.y);
         bB.m_sweep.c.x += bB.m_invMass * p2X;
         bB.m_sweep.c.y += bB.m_invMass * p2Y;
         bB.m_sweep.a += bB.m_invI * (r2X * p2Y - r2Y * p2X);
         bB.SynchronizeTransform();
      }
      return linearError < b2Settings.b2_linearSlop;
   };

   /**
    * GetType
    *
    * @param 
    *
    */
   b2PulleyJoint.prototype.GetType = function () {
      return this.m_type;
   };

   /**
    * GetBodyA
    *
    * @param 
    *
    */
   b2PulleyJoint.prototype.GetBodyA = function () {
      return this.m_bodyA;
   };

   /**
    * GetBodyB
    *
    * @param 
    *
    */
   b2PulleyJoint.prototype.GetBodyB = function () {
      return this.m_bodyB;
   };

   /**
    * GetNext
    *
    * @param 
    *
    */
   b2PulleyJoint.prototype.GetNext = function () {
      return this.m_next;
   };

   /**
    * GetUserData
    *
    * @param 
    *
    */
   b2PulleyJoint.prototype.GetUserData = function () {
      return this.m_userData;
   };

   /**
    * SetUserData
    *
    * @param data
    *
    */
   b2PulleyJoint.prototype.SetUserData = function (data) {
      this.m_userData = data;
   };

   /**
    * IsActive
    *
    * @param 
    *
    */
   b2PulleyJoint.prototype.IsActive = function () {
      return this.m_bodyA.IsActive() && this.m_bodyB.IsActive();
   };

   /**
    * b2Joint
    *
    * @param def
    *
    */
   b2PulleyJoint.prototype.b2Joint = function (def) {
      b2Assert(def.bodyA !== def.bodyB);
      this.m_type = def.type;
      this.m_prev = null;
      this.m_next = null;
      this.m_bodyA = def.bodyA;
      this.m_bodyB = def.bodyB;
      this.m_collideConnected = def.collideConnected;
      this.m_islandFlag = false;
      this.m_userData = def.userData;
   };

   /**
    * FinalizeVelocityConstraints
    *
    * @param 
    *
    */
   b2PulleyJoint.prototype.FinalizeVelocityConstraints = function () {};

   /**
    *  Class b2PulleyJointDef
    *
    * @param 
    *
    */
   b2PulleyJointDef = Box2D.Dynamics.Joints.b2PulleyJointDef = function b2PulleyJointDef() {

      this.groundAnchorA = new b2Vec2(0, 0);
      this.groundAnchorB = new b2Vec2(0, 0);
      this.localAnchorA = new b2Vec2(0, 0);
      this.localAnchorB = new b2Vec2(0, 0);
      this.groundAnchorA.Set((-1.0), 1.0);
      this.groundAnchorB.Set(1.0, 1.0);
      this.localAnchorA.Set((-1.0), 0.0);
      this.localAnchorB.Set(1.0, 0.0);
   };
   b2PulleyJointDef.constructor = b2PulleyJointDef;
   b2PulleyJointDef.prototype = Object.create(b2JointDef.prototype );
   b2PulleyJointDef.prototype.type                = b2Joint.e_pulleyJoint;
   b2PulleyJointDef.prototype.groundAnchorA       = null;
   b2PulleyJointDef.prototype.groundAnchorB       = null;
   b2PulleyJointDef.prototype.localAnchorA        = null;
   b2PulleyJointDef.prototype.localAnchorB        = null;
   b2PulleyJointDef.prototype.lengthA             = 0.0;
   b2PulleyJointDef.prototype.maxLengthA          = 0.0;
   b2PulleyJointDef.prototype.lengthB             = 0.0;
   b2PulleyJointDef.prototype.maxLengthB          = 0.0;
   b2PulleyJointDef.prototype.ratio               = 1.0;
   b2PulleyJointDef.prototype.collideConnected    = true;

   /**
    * Initialize
    *
    * @param bA
    * @param bB
    * @param gaA
    * @param gaB
    * @param anchorA
    * @param anchorB
    * @param r
    *
    */
   b2PulleyJointDef.prototype.Initialize = function (bA, bB, gaA, gaB, anchorA, anchorB, r) {
      r = r || 0;
      this.bodyA = bA;
      this.bodyB = bB;
      this.groundAnchorA.SetV(gaA);
      this.groundAnchorB.SetV(gaB);
      this.localAnchorA = this.bodyA.GetLocalPoint(anchorA);
      this.localAnchorB = this.bodyB.GetLocalPoint(anchorB);
      var d1X = anchorA.x - gaA.x,
          d1Y = anchorA.y - gaA.y;
      this.lengthA = Math.sqrt(d1X * d1X + d1Y * d1Y);
      var d2X = anchorB.x - gaB.x,
          d2Y = anchorB.y - gaB.y;
      this.lengthB = Math.sqrt(d2X * d2X + d2Y * d2Y);
      this.ratio = r;
      var C = this.lengthA + this.ratio * this.lengthB;
      this.maxLengthA = C - this.ratio * b2PulleyJoint.b2_minPulleyLength;
      this.maxLengthB = (C - b2PulleyJoint.b2_minPulleyLength) / this.ratio;
   };

   /**
    * b2JointDef
    *
    * @param 
    *
    */
   b2PulleyJointDef.prototype.b2JointDef = function () {
      this.type = b2Joint.e_unknownJoint;
      this.userData = null;
      this.bodyA = null;
      this.bodyB = null;
      this.collideConnected = false;
   };

   /**
    *  Class b2RevoluteJoint
    *
    * @param def
    *
    */
   b2RevoluteJoint = Box2D.Dynamics.Joints.b2RevoluteJoint = function b2RevoluteJoint(def) {

      this.K = new b2Mat22();
      this.K1 = new b2Mat22();
      this.K2 = new b2Mat22();
      this.K3 = new b2Mat22();
      this.impulse3 = new b2Vec3(0, 0, 0);
      this.impulse2 = new b2Vec2(0, 0);
      this.reduced = new b2Vec2(0, 0);
      this.m_localAnchor1 = new b2Vec2(0, 0);
      this.m_localAnchor2 = new b2Vec2(0, 0);
      this.m_impulse = new b2Vec3(0, 0, 0);
      this.m_mass = new b2Mat33();
      b2Joint.call(this, def);
      this.m_localAnchor1.SetV(def.localAnchorA);
      this.m_localAnchor2.SetV(def.localAnchorB);
      this.m_referenceAngle = def.referenceAngle;
      this.m_impulse.SetZero();
      this.m_lowerAngle = def.lowerAngle;
      this.m_upperAngle = def.upperAngle;
      this.m_maxMotorTorque = def.maxMotorTorque;
      this.m_motorSpeed = def.motorSpeed;
      this.m_enableLimit = def.enableLimit;
      this.m_enableMotor = def.enableMotor;
      this.m_limitState = b2Joint.e_inactiveLimit;
   };
   b2RevoluteJoint.constructor = b2RevoluteJoint;
   b2RevoluteJoint.prototype = Object.create(b2Joint.prototype );
   b2RevoluteJoint.prototype.K                       = null;
   b2RevoluteJoint.prototype.K1                      = null;
   b2RevoluteJoint.prototype.K2                      = null;
   b2RevoluteJoint.prototype.K3                      = null;
   b2RevoluteJoint.prototype.impulse2                = null;
   b2RevoluteJoint.prototype.impulse3                = null;
   b2RevoluteJoint.prototype.reduced                 = null;
   b2RevoluteJoint.prototype.m_impulse               = null;
   b2RevoluteJoint.prototype.m_mass                  = 0.0;
   b2RevoluteJoint.prototype.m_referenceAngle        = 0.0;
   b2RevoluteJoint.prototype.m_motorImpulse          = 0.0;
   b2RevoluteJoint.prototype.m_lowerAngle            = 0.0;
   b2RevoluteJoint.prototype.m_upperAngle            = 0.0;
   b2RevoluteJoint.prototype.m_maxMotorTorque        = 0.0;
   b2RevoluteJoint.prototype.m_motorSpeed            = 0.0;
   b2RevoluteJoint.prototype.m_enableLimit           = 0.0;
   b2RevoluteJoint.prototype.m_enableMotor           = false;
   b2RevoluteJoint.prototype.m_limitState            = b2Joint.e_inactiveLimit;


   b2RevoluteJoint.tImpulse = new b2Vec2(0, 0);

   /**
    * GetAnchorA
    *
    * @param 
    *
    */
   b2RevoluteJoint.prototype.GetAnchorA = function () {
      return this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
   };

   /**
    * GetAnchorB
    *
    * @param 
    *
    */
   b2RevoluteJoint.prototype.GetAnchorB = function () {
      return this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
   };

   /**
    * GetReactionForce
    *
    * @param inv_dt
    *
    */
   b2RevoluteJoint.prototype.GetReactionForce = function (inv_dt) {
      inv_dt = inv_dt || 0;
      return new b2Vec2(inv_dt * this.m_impulse.x, inv_dt * this.m_impulse.y);
   };

   /**
    * GetReactionTorque
    *
    * @param inv_dt
    *
    */
   b2RevoluteJoint.prototype.GetReactionTorque = function (inv_dt) {
      inv_dt = inv_dt || 0;
      return inv_dt * this.m_impulse.z;
   };

   /**
    * GetJointAngle
    *
    * @param 
    *
    */
   b2RevoluteJoint.prototype.GetJointAngle = function () {
      return this.m_bodyB.m_sweep.a - this.m_bodyA.m_sweep.a - this.m_referenceAngle;
   };

   /**
    * GetJointSpeed
    *
    * @param 
    *
    */
   b2RevoluteJoint.prototype.GetJointSpeed = function () {
      return this.m_bodyB.m_angularVelocity - this.m_bodyA.m_angularVelocity;
   };

   /**
    * IsLimitEnabled
    *
    * @param 
    *
    */
   b2RevoluteJoint.prototype.IsLimitEnabled = function () {
      return this.m_enableLimit;
   };

   /**
    * EnableLimit
    *
    * @param flag
    *
    */
   b2RevoluteJoint.prototype.EnableLimit = function (flag) {
      this.m_enableLimit = flag;
   };

   /**
    * GetLowerLimit
    *
    * @param 
    *
    */
   b2RevoluteJoint.prototype.GetLowerLimit = function () {
      return this.m_lowerAngle;
   };

   /**
    * GetUpperLimit
    *
    * @param 
    *
    */
   b2RevoluteJoint.prototype.GetUpperLimit = function () {
      return this.m_upperAngle;
   };

   /**
    * SetLimits
    *
    * @param lower
    * @param upper
    *
    */
   b2RevoluteJoint.prototype.SetLimits = function (lower, upper) {
      lower = lower || 0;
      upper = upper || 0;
      this.m_lowerAngle = lower;
      this.m_upperAngle = upper;
   };

   /**
    * IsMotorEnabled
    *
    * @param 
    *
    */
   b2RevoluteJoint.prototype.IsMotorEnabled = function () {
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      return this.m_enableMotor;
   };

   /**
    * EnableMotor
    *
    * @param flag
    *
    */
   b2RevoluteJoint.prototype.EnableMotor = function (flag) {
      this.m_enableMotor = flag;
   };

   /**
    * SetMotorSpeed
    *
    * @param speed
    *
    */
   b2RevoluteJoint.prototype.SetMotorSpeed = function (speed) {
      speed = speed || 0;
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      this.m_motorSpeed = speed;
   };

   /**
    * GetMotorSpeed
    *
    * @param 
    *
    */
   b2RevoluteJoint.prototype.GetMotorSpeed = function () {
      return this.m_motorSpeed;
   };

   /**
    * SetMaxMotorTorque
    *
    * @param torque
    *
    */
   b2RevoluteJoint.prototype.SetMaxMotorTorque = function (torque) {
      torque = torque || 0;
      this.m_maxMotorTorque = torque;
   };

   /**
    * GetMotorTorque
    *
    * @param 
    *
    */
   b2RevoluteJoint.prototype.GetMotorTorque = function () {
      return this.m_maxMotorTorque;
   };

   /**
    * InitVelocityConstraints
    *
    * @param step
    *
    */
   b2RevoluteJoint.prototype.InitVelocityConstraints = function (step) {
      var bA = this.m_bodyA,
          bB = this.m_bodyB,
          tMat,
          tX = 0;

      if (this.m_enableMotor || this.m_enableLimit) {
          // You cannot create a rotation limit between bodies that
          // both have fixed rotation.
             b2Assert(bA.m_invI > 0.0 || bB.m_invI > 0.0);
      }
      tMat = bA.m_xf.R;
      var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x,
          r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
      tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
      r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
      r1X = tX;
      tMat = bB.m_xf.R;
      var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x,
          r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
      r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
      r2X = tX;
      var m1 = bA.m_invMass,
          m2 = bB.m_invMass,
          i1 = bA.m_invI,
          i2 = bB.m_invI;
      this.m_mass.col1.x = m1 + m2 + r1Y * r1Y * i1 + r2Y * r2Y * i2;
      this.m_mass.col2.x = (-r1Y * r1X * i1) - r2Y * r2X * i2;
      this.m_mass.col3.x = (-r1Y * i1) - r2Y * i2;
      this.m_mass.col1.y = this.m_mass.col2.x;
      this.m_mass.col2.y = m1 + m2 + r1X * r1X * i1 + r2X * r2X * i2;
      this.m_mass.col3.y = r1X * i1 + r2X * i2;
      this.m_mass.col1.z = this.m_mass.col3.x;
      this.m_mass.col2.z = this.m_mass.col3.y;
      this.m_mass.col3.z = i1 + i2;
      this.m_motorMass = 1.0 / (i1 + i2);
      if (this.m_enableMotor === false) {
         this.m_motorImpulse = 0.0;
      }
      if (this.m_enableLimit) {
         var jointAngle = bB.m_sweep.a - bA.m_sweep.a - this.m_referenceAngle;
         if (b2Math.Abs(this.m_upperAngle - this.m_lowerAngle) < 2.0 * b2Settings.b2_angularSlop) {
            this.m_limitState = b2Joint.e_equalLimits;
         }
         else if (jointAngle <= this.m_lowerAngle) {
            if (this.m_limitState !== b2Joint.e_atLowerLimit) {
               this.m_impulse.z = 0.0;
            }
            this.m_limitState = b2Joint.e_atLowerLimit;
         }
         else if (jointAngle >= this.m_upperAngle) {
            if (this.m_limitState !== b2Joint.e_atUpperLimit) {
               this.m_impulse.z = 0.0;
            }
            this.m_limitState = b2Joint.e_atUpperLimit;
         }
         else {
            this.m_limitState = b2Joint.e_inactiveLimit;
            this.m_impulse.z = 0.0;
         }
      }
      else {
         this.m_limitState = b2Joint.e_inactiveLimit;
      }
      if (step.warmStarting) {
         this.m_impulse.x *= step.dtRatio;
         this.m_impulse.y *= step.dtRatio;
         this.m_motorImpulse *= step.dtRatio;
         var PX = this.m_impulse.x,
          PY = this.m_impulse.y;
         bA.m_linearVelocity.x -= m1 * PX;
         bA.m_linearVelocity.y -= m1 * PY;
         bA.m_angularVelocity -= i1 * ((r1X * PY - r1Y * PX) + this.m_motorImpulse + this.m_impulse.z);
         bB.m_linearVelocity.x += m2 * PX;
         bB.m_linearVelocity.y += m2 * PY;
         bB.m_angularVelocity += i2 * ((r2X * PY - r2Y * PX) + this.m_motorImpulse + this.m_impulse.z);
      }
      else {
         this.m_impulse.SetZero();
         this.m_motorImpulse = 0.0;
      }
   };

   /**
    * SolveVelocityConstraints
    *
    * @param step
    *
    */
   b2RevoluteJoint.prototype.SolveVelocityConstraints = function (step) {
      var bA = this.m_bodyA,
          bB = this.m_bodyB,
          tMat,
          tX = 0,
          newImpulse = 0,
          r1X = 0,
          r1Y = 0,
          r2X = 0,
          r2Y = 0,
          v1 = bA.m_linearVelocity,
          w1 = bA.m_angularVelocity,
          v2 = bB.m_linearVelocity,
          w2 = bB.m_angularVelocity,
          m1 = bA.m_invMass,
          m2 = bB.m_invMass,
          i1 = bA.m_invI,
          i2 = bB.m_invI;
      if (this.m_enableMotor && this.m_limitState !== b2Joint.e_equalLimits) {
         var Cdot = w2 - w1 - this.m_motorSpeed,
          impulse = this.m_motorMass * ((-Cdot)),
          oldImpulse = this.m_motorImpulse,
          maxImpulse = step.dt * this.m_maxMotorTorque;
         this.m_motorImpulse = b2Math.Clamp(this.m_motorImpulse + impulse, (-maxImpulse), maxImpulse);
         impulse = this.m_motorImpulse - oldImpulse;
         w1 -= i1 * impulse;
         w2 += i2 * impulse;
      }
      if (this.m_enableLimit && this.m_limitState !== b2Joint.e_inactiveLimit) {
         tMat = bA.m_xf.R;
         r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
         r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
         tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
         r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
         r1X = tX;
         tMat = bB.m_xf.R;
         r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
         r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
         tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
         r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
         r2X = tX;
         var Cdot1X = v2.x + ((-w2 * r2Y)) - v1.x - ((-w1 * r1Y)),
          Cdot1Y = v2.y + (w2 * r2X) - v1.y - (w1 * r1X),
          Cdot2 = w2 - w1;
         this.m_mass.Solve33(this.impulse3, (-Cdot1X), (-Cdot1Y), (-Cdot2));
         if (this.m_limitState === b2Joint.e_equalLimits) {
            this.m_impulse.Add(this.impulse3);
         }
         else if (this.m_limitState === b2Joint.e_atLowerLimit) {
            newImpulse = this.m_impulse.z + this.impulse3.z;
            if (newImpulse < 0.0) {
               this.m_mass.Solve22(this.reduced, (-Cdot1X), (-Cdot1Y));
               this.impulse3.x = this.reduced.x;
               this.impulse3.y = this.reduced.y;
               this.impulse3.z = (-this.m_impulse.z);
               this.m_impulse.x += this.reduced.x;
               this.m_impulse.y += this.reduced.y;
               this.m_impulse.z = 0.0;
            }
         }
         else if (this.m_limitState === b2Joint.e_atUpperLimit) {
            newImpulse = this.m_impulse.z + this.impulse3.z;
            if (newImpulse > 0.0) {
               this.m_mass.Solve22(this.reduced, (-Cdot1X), (-Cdot1Y));
               this.impulse3.x = this.reduced.x;
               this.impulse3.y = this.reduced.y;
               this.impulse3.z = (-this.m_impulse.z);
               this.m_impulse.x += this.reduced.x;
               this.m_impulse.y += this.reduced.y;
               this.m_impulse.z = 0.0;
            }
         }
         v1.x -= m1 * this.impulse3.x;
         v1.y -= m1 * this.impulse3.y;
         w1 -= i1 * (r1X * this.impulse3.y - r1Y * this.impulse3.x + this.impulse3.z);
         v2.x += m2 * this.impulse3.x;
         v2.y += m2 * this.impulse3.y;
         w2 += i2 * (r2X * this.impulse3.y - r2Y * this.impulse3.x + this.impulse3.z);
      }
      else {
         tMat = bA.m_xf.R;
         r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
         r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
         tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
         r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
         r1X = tX;
         tMat = bB.m_xf.R;
         r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
         r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
         tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
         r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
         r2X = tX;
         var CdotX = v2.x + ((-w2 * r2Y)) - v1.x - ((-w1 * r1Y)),
          CdotY = v2.y + (w2 * r2X) - v1.y - (w1 * r1X);
         this.m_mass.Solve22(this.impulse2, (-CdotX), (-CdotY));
         this.m_impulse.x += this.impulse2.x;
         this.m_impulse.y += this.impulse2.y;
         v1.x -= m1 * this.impulse2.x;
         v1.y -= m1 * this.impulse2.y;
         w1 -= i1 * (r1X * this.impulse2.y - r1Y * this.impulse2.x);
         v2.x += m2 * this.impulse2.x;
         v2.y += m2 * this.impulse2.y;
         w2 += i2 * (r2X * this.impulse2.y - r2Y * this.impulse2.x);
      }
      bA.m_linearVelocity.SetV(v1);
      bA.m_angularVelocity = w1;
      bB.m_linearVelocity.SetV(v2);
      bB.m_angularVelocity = w2;
   };

   /**
    * SolvePositionConstraints
    *
    * @param baumgarte
    *
    */
   b2RevoluteJoint.prototype.SolvePositionConstraints = function (baumgarte) {
      var oldLimitImpulse = 0,
          C = 0,
          tMat,
          bA = this.m_bodyA,
          bB = this.m_bodyB,
          angularError = 0.0,
          positionError = 0.0,
          tX = 0,
          impulseX = 0,
          impulseY = 0;
      if (this.m_enableLimit && this.m_limitState !== b2Joint.e_inactiveLimit) {
         var angle = bB.m_sweep.a - bA.m_sweep.a - this.m_referenceAngle,
          limitImpulse = 0.0;
         if (this.m_limitState === b2Joint.e_equalLimits) {
            C = b2Math.Clamp(angle - this.m_lowerAngle, (-b2Settings.b2_maxAngularCorrection), b2Settings.b2_maxAngularCorrection);
            limitImpulse = (-this.m_motorMass * C);
            angularError = b2Math.Abs(C);
         }
         else if (this.m_limitState === b2Joint.e_atLowerLimit) {
            C = angle - this.m_lowerAngle;
            angularError = (-C);
            C = b2Math.Clamp(C + b2Settings.b2_angularSlop, (-b2Settings.b2_maxAngularCorrection), 0.0);
            limitImpulse = (-this.m_motorMass * C);
         }
         else if (this.m_limitState === b2Joint.e_atUpperLimit) {
            C = angle - this.m_upperAngle;
            angularError = C;
            C = b2Math.Clamp(C - b2Settings.b2_angularSlop, 0.0, b2Settings.b2_maxAngularCorrection);
            limitImpulse = (-this.m_motorMass * C);
         }
         bA.m_sweep.a -= bA.m_invI * limitImpulse;
         bB.m_sweep.a += bB.m_invI * limitImpulse;
         bA.SynchronizeTransform();
         bB.SynchronizeTransform();
      } {
         tMat = bA.m_xf.R;
         var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x,
          r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
         tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
         r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
         r1X = tX;
         tMat = bB.m_xf.R;
         var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x,
          r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
         tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
         r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
         r2X = tX;
         var CX = bB.m_sweep.c.x + r2X - bA.m_sweep.c.x - r1X,
          CY = bB.m_sweep.c.y + r2Y - bA.m_sweep.c.y - r1Y,
          CLengthSquared = CX * CX + CY * CY,
          CLength = Math.sqrt(CLengthSquared);
         positionError = CLength;
         var invMass1 = bA.m_invMass,
          invMass2 = bB.m_invMass,
          invI1 = bA.m_invI,
          invI2 = bB.m_invI,
          k_allowedStretch = 10.0 * b2Settings.b2_linearSlop;
         if (CLengthSquared > k_allowedStretch * k_allowedStretch) {
            var uX = CX / CLength,
          uY = CY / CLength,
          k = invMass1 + invMass2,
          m = 1.0 / k;
            impulseX = m * ((-CX));
            impulseY = m * ((-CY));
            var k_beta = 0.5;
            bA.m_sweep.c.x -= k_beta * invMass1 * impulseX;
            bA.m_sweep.c.y -= k_beta * invMass1 * impulseY;
            bB.m_sweep.c.x += k_beta * invMass2 * impulseX;
            bB.m_sweep.c.y += k_beta * invMass2 * impulseY;
            CX = bB.m_sweep.c.x + r2X - bA.m_sweep.c.x - r1X;
            CY = bB.m_sweep.c.y + r2Y - bA.m_sweep.c.y - r1Y;
         }
         this.K1.col1.x = invMass1 + invMass2;
         this.K1.col2.x = 0.0;
         this.K1.col1.y = 0.0;
         this.K1.col2.y = invMass1 + invMass2;
         this.K2.col1.x = invI1 * r1Y * r1Y;
         this.K2.col2.x = (-invI1 * r1X * r1Y);
         this.K2.col1.y = (-invI1 * r1X * r1Y);
         this.K2.col2.y = invI1 * r1X * r1X;
         this.K3.col1.x = invI2 * r2Y * r2Y;
         this.K3.col2.x = (-invI2 * r2X * r2Y);
         this.K3.col1.y = (-invI2 * r2X * r2Y);
         this.K3.col2.y = invI2 * r2X * r2X;
         this.K.SetM(this.K1);
         this.K.AddM(this.K2);
         this.K.AddM(this.K3);
         this.K.Solve(b2RevoluteJoint.tImpulse, (-CX), (-CY));
         impulseX = b2RevoluteJoint.tImpulse.x;
         impulseY = b2RevoluteJoint.tImpulse.y;
         bA.m_sweep.c.x -= bA.m_invMass * impulseX;
         bA.m_sweep.c.y -= bA.m_invMass * impulseY;
         bA.m_sweep.a -= bA.m_invI * (r1X * impulseY - r1Y * impulseX);
         bB.m_sweep.c.x += bB.m_invMass * impulseX;
         bB.m_sweep.c.y += bB.m_invMass * impulseY;
         bB.m_sweep.a += bB.m_invI * (r2X * impulseY - r2Y * impulseX);
         bA.SynchronizeTransform();
         bB.SynchronizeTransform();
      }
      return positionError <= b2Settings.b2_linearSlop && angularError <= b2Settings.b2_angularSlop;
   };

   /**
    * GetType
    *
    * @param 
    *
    */
   b2RevoluteJoint.prototype.GetType = function () {
      return this.m_type;
   };

   /**
    * GetBodyA
    *
    * @param 
    *
    */
   b2RevoluteJoint.prototype.GetBodyA = function () {
      return this.m_bodyA;
   };

   /**
    * GetBodyB
    *
    * @param 
    *
    */
   b2RevoluteJoint.prototype.GetBodyB = function () {
      return this.m_bodyB;
   };

   /**
    * GetNext
    *
    * @param 
    *
    */
   b2RevoluteJoint.prototype.GetNext = function () {
      return this.m_next;
   };

   /**
    * GetUserData
    *
    * @param 
    *
    */
   b2RevoluteJoint.prototype.GetUserData = function () {
      return this.m_userData;
   };

   /**
    * SetUserData
    *
    * @param data
    *
    */
   b2RevoluteJoint.prototype.SetUserData = function (data) {
      this.m_userData = data;
   };

   /**
    * IsActive
    *
    * @param 
    *
    */
   b2RevoluteJoint.prototype.IsActive = function () {
      return this.m_bodyA.IsActive() && this.m_bodyB.IsActive();
   };

   /**
    * b2Joint
    *
    * @param def
    *
    */
   b2RevoluteJoint.prototype.b2Joint = function (def) {
      b2Assert(def.bodyA !== def.bodyB);
      this.m_type = def.type;
      this.m_prev = null;
      this.m_next = null;
      this.m_bodyA = def.bodyA;
      this.m_bodyB = def.bodyB;
      this.m_collideConnected = def.collideConnected;
      this.m_islandFlag = false;
      this.m_userData = def.userData;
   };

   /**
    * FinalizeVelocityConstraints
    *
    * @param 
    *
    */
   b2RevoluteJoint.prototype.FinalizeVelocityConstraints = function () {};

   /**
    *  Class b2RevoluteJointDef
    *
    * @param 
    *
    */
   b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef = function b2RevoluteJointDef() {

      this.localAnchorA = new b2Vec2(0, 0);
      this.localAnchorB = new b2Vec2(0, 0);
      b2JointDef.call(this);
      this.type = b2Joint.e_revoluteJoint;
      this.localAnchorA.Set(0.0, 0.0);
      this.localAnchorB.Set(0.0, 0.0);
   };
   b2RevoluteJointDef.constructor = b2RevoluteJointDef;
   b2RevoluteJointDef.prototype = Object.create(b2JointDef.prototype );
   b2RevoluteJointDef.prototype.type                = b2Joint.e_revoluteJoint;
   b2RevoluteJointDef.prototype.localAnchorA        = null;
   b2RevoluteJointDef.prototype.localAnchorB        = null;
   b2RevoluteJointDef.prototype.referenceAngle      = 0.0;
   b2RevoluteJointDef.prototype.lowerAngle          = 0.0;
   b2RevoluteJointDef.prototype.upperAngle          = 0.0;
   b2RevoluteJointDef.prototype.maxMotorTorque      = 0.0;
   b2RevoluteJointDef.prototype.motorSpeed          = 0.0;
   b2RevoluteJointDef.prototype.enableLimit         = false;
   b2RevoluteJointDef.prototype.enableMotor         = false;

   /**
    * Initialize
    *
    * @param bA
    * @param bB
    * @param anchor
    *
    */
   b2RevoluteJointDef.prototype.Initialize = function (bA, bB, anchor) {
      this.bodyA = bA;
      this.bodyB = bB;
      this.localAnchorA = this.bodyA.GetLocalPoint(anchor);
      this.localAnchorB = this.bodyB.GetLocalPoint(anchor);
      this.referenceAngle = this.bodyB.GetAngle() - this.bodyA.GetAngle();
   };

   /**
    * b2JointDef
    *
    * @param 
    *
    */
   b2RevoluteJointDef.prototype.b2JointDef = function () {
      this.type = b2Joint.e_unknownJoint;
      this.userData = null;
      this.bodyA = null;
      this.bodyB = null;
      this.collideConnected = false;
   };

   /**
    *  Class b2WeldJoint
    *
    * @param def
    *
    */
   b2WeldJoint = Box2D.Dynamics.Joints.b2WeldJoint = function b2WeldJoint(def) {

      this.m_localAnchorA = new b2Vec2(0, 0);
      this.m_localAnchorB = new b2Vec2(0, 0);
      this.m_impulse = new b2Vec3(0, 0, 0);
      this.m_mass = new b2Mat33();
      b2Joint.call(this, def);
      this.m_localAnchorA.SetV(def.localAnchorA);
      this.m_localAnchorB.SetV(def.localAnchorB);
      this.m_referenceAngle = def.referenceAngle;
      this.m_impulse.SetZero();
      this.m_mass = new b2Mat33();
   };
   b2WeldJoint.constructor = b2WeldJoint;
   b2WeldJoint.prototype = Object.create(b2Joint.prototype );
   b2WeldJoint.prototype.m_impulse             = null;
   b2WeldJoint.prototype.m_mass                = null;
   b2WeldJoint.prototype.m_referenceAngle      = 0.0;


   /**
    * GetAnchorA
    *
    * @param 
    *
    */
   b2WeldJoint.prototype.GetAnchorA = function () {
      return this.m_bodyA.GetWorldPoint(this.m_localAnchorA);
   };

   /**
    * GetAnchorB
    *
    * @param 
    *
    */
   b2WeldJoint.prototype.GetAnchorB = function () {
      return this.m_bodyB.GetWorldPoint(this.m_localAnchorB);
   };

   /**
    * GetReactionForce
    *
    * @param inv_dt
    *
    */
   b2WeldJoint.prototype.GetReactionForce = function (inv_dt) {
      inv_dt = inv_dt || 0;
      return new b2Vec2(inv_dt * this.m_impulse.x, inv_dt * this.m_impulse.y);
   };

   /**
    * GetReactionTorque
    *
    * @param inv_dt
    *
    */
   b2WeldJoint.prototype.GetReactionTorque = function (inv_dt) {
      inv_dt = inv_dt || 0;
      return inv_dt * this.m_impulse.z;
   };

   /**
    * InitVelocityConstraints
    *
    * @param step
    *
    */
   b2WeldJoint.prototype.InitVelocityConstraints = function (step) {
      var tMat,
          tX = 0,
          bA = this.m_bodyA,
          bB = this.m_bodyB;
      tMat = bA.m_xf.R;
      var rAX = this.m_localAnchorA.x - bA.m_sweep.localCenter.x,
          rAY = this.m_localAnchorA.y - bA.m_sweep.localCenter.y;
      tX = (tMat.col1.x * rAX + tMat.col2.x * rAY);
      rAY = (tMat.col1.y * rAX + tMat.col2.y * rAY);
      rAX = tX;
      tMat = bB.m_xf.R;
      var rBX = this.m_localAnchorB.x - bB.m_sweep.localCenter.x,
          rBY = this.m_localAnchorB.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * rBX + tMat.col2.x * rBY);
      rBY = (tMat.col1.y * rBX + tMat.col2.y * rBY);
      rBX = tX;
      var mA = bA.m_invMass,
          mB = bB.m_invMass,
          iA = bA.m_invI,
          iB = bB.m_invI;
      this.m_mass.col1.x = mA + mB + rAY * rAY * iA + rBY * rBY * iB;
      this.m_mass.col2.x = (-rAY * rAX * iA) - rBY * rBX * iB;
      this.m_mass.col3.x = (-rAY * iA) - rBY * iB;
      this.m_mass.col1.y = this.m_mass.col2.x;
      this.m_mass.col2.y = mA + mB + rAX * rAX * iA + rBX * rBX * iB;
      this.m_mass.col3.y = rAX * iA + rBX * iB;
      this.m_mass.col1.z = this.m_mass.col3.x;
      this.m_mass.col2.z = this.m_mass.col3.y;
      this.m_mass.col3.z = iA + iB;
      if (step.warmStarting) {
         this.m_impulse.x *= step.dtRatio;
         this.m_impulse.y *= step.dtRatio;
         this.m_impulse.z *= step.dtRatio;
         bA.m_linearVelocity.x -= mA * this.m_impulse.x;
         bA.m_linearVelocity.y -= mA * this.m_impulse.y;
         bA.m_angularVelocity -= iA * (rAX * this.m_impulse.y - rAY * this.m_impulse.x + this.m_impulse.z);
         bB.m_linearVelocity.x += mB * this.m_impulse.x;
         bB.m_linearVelocity.y += mB * this.m_impulse.y;
         bB.m_angularVelocity += iB * (rBX * this.m_impulse.y - rBY * this.m_impulse.x + this.m_impulse.z);
      }
      else {
         this.m_impulse.SetZero();
      }
   };

   /**
    * SolveVelocityConstraints
    *
    * @param step
    *
    */
   b2WeldJoint.prototype.SolveVelocityConstraints = function (step) {
      var tMat,
          tX = 0,
          bA = this.m_bodyA,
          bB = this.m_bodyB,
          vA = bA.m_linearVelocity,
          wA = bA.m_angularVelocity,
          vB = bB.m_linearVelocity,
          wB = bB.m_angularVelocity,
          mA = bA.m_invMass,
          mB = bB.m_invMass,
          iA = bA.m_invI,
          iB = bB.m_invI;
      tMat = bA.m_xf.R;
      var rAX = this.m_localAnchorA.x - bA.m_sweep.localCenter.x,
          rAY = this.m_localAnchorA.y - bA.m_sweep.localCenter.y;
      tX = (tMat.col1.x * rAX + tMat.col2.x * rAY);
      rAY = (tMat.col1.y * rAX + tMat.col2.y * rAY);
      rAX = tX;
      tMat = bB.m_xf.R;
      var rBX = this.m_localAnchorB.x - bB.m_sweep.localCenter.x,
          rBY = this.m_localAnchorB.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * rBX + tMat.col2.x * rBY);
      rBY = (tMat.col1.y * rBX + tMat.col2.y * rBY);
      rBX = tX;
      var Cdot1X = vB.x - wB * rBY - vA.x + wA * rAY,
          Cdot1Y = vB.y + wB * rBX - vA.y - wA * rAX,
          Cdot2 = wB - wA,
          impulse = new b2Vec3(0, 0, 0);
      this.m_mass.Solve33(impulse, (-Cdot1X), (-Cdot1Y), (-Cdot2));
      this.m_impulse.Add(impulse);
      vA.x -= mA * impulse.x;
      vA.y -= mA * impulse.y;
      wA -= iA * (rAX * impulse.y - rAY * impulse.x + impulse.z);
      vB.x += mB * impulse.x;
      vB.y += mB * impulse.y;
      wB += iB * (rBX * impulse.y - rBY * impulse.x + impulse.z);
      bA.m_angularVelocity = wA;
      bB.m_angularVelocity = wB;
   };

   /**
    * SolvePositionConstraints
    *
    * @param baumgarte
    *
    */
   b2WeldJoint.prototype.SolvePositionConstraints = function (baumgarte) {
      baumgarte = baumgarte || 0;
      var tMat,
          tX = 0,
          bA = this.m_bodyA,
          bB = this.m_bodyB;
      tMat = bA.m_xf.R;
      var rAX = this.m_localAnchorA.x - bA.m_sweep.localCenter.x,
          rAY = this.m_localAnchorA.y - bA.m_sweep.localCenter.y;
      tX = (tMat.col1.x * rAX + tMat.col2.x * rAY);
      rAY = (tMat.col1.y * rAX + tMat.col2.y * rAY);
      rAX = tX;
      tMat = bB.m_xf.R;
      var rBX = this.m_localAnchorB.x - bB.m_sweep.localCenter.x,
          rBY = this.m_localAnchorB.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * rBX + tMat.col2.x * rBY);
      rBY = (tMat.col1.y * rBX + tMat.col2.y * rBY);
      rBX = tX;
      var mA = bA.m_invMass,
          mB = bB.m_invMass,
          iA = bA.m_invI,
          iB = bB.m_invI,
          C1X = bB.m_sweep.c.x + rBX - bA.m_sweep.c.x - rAX,
          C1Y = bB.m_sweep.c.y + rBY - bA.m_sweep.c.y - rAY,
          C2 = bB.m_sweep.a - bA.m_sweep.a - this.m_referenceAngle,
          k_allowedStretch = 10.0 * b2Settings.b2_linearSlop,
          positionError = Math.sqrt(C1X * C1X + C1Y * C1Y),
          angularError = b2Math.Abs(C2);
      if (positionError > k_allowedStretch) {
         iA *= 1.0;
         iB *= 1.0;
      }
      this.m_mass.col1.x = mA + mB + rAY * rAY * iA + rBY * rBY * iB;
      this.m_mass.col2.x = (-rAY * rAX * iA) - rBY * rBX * iB;
      this.m_mass.col3.x = (-rAY * iA) - rBY * iB;
      this.m_mass.col1.y = this.m_mass.col2.x;
      this.m_mass.col2.y = mA + mB + rAX * rAX * iA + rBX * rBX * iB;
      this.m_mass.col3.y = rAX * iA + rBX * iB;
      this.m_mass.col1.z = this.m_mass.col3.x;
      this.m_mass.col2.z = this.m_mass.col3.y;
      this.m_mass.col3.z = iA + iB;
      var impulse = new b2Vec3(0, 0, 0);
      this.m_mass.Solve33(impulse, (-C1X), (-C1Y), (-C2));
      bA.m_sweep.c.x -= mA * impulse.x;
      bA.m_sweep.c.y -= mA * impulse.y;
      bA.m_sweep.a -= iA * (rAX * impulse.y - rAY * impulse.x + impulse.z);
      bB.m_sweep.c.x += mB * impulse.x;
      bB.m_sweep.c.y += mB * impulse.y;
      bB.m_sweep.a += iB * (rBX * impulse.y - rBY * impulse.x + impulse.z);
      bA.SynchronizeTransform();
      bB.SynchronizeTransform();
      return positionError <= b2Settings.b2_linearSlop && angularError <= b2Settings.b2_angularSlop;
   };

   /**
    * GetType
    *
    * @param 
    *
    */
   b2WeldJoint.prototype.GetType = function () {
      return this.m_type;
   };

   /**
    * GetBodyA
    *
    * @param 
    *
    */
   b2WeldJoint.prototype.GetBodyA = function () {
      return this.m_bodyA;
   };

   /**
    * GetBodyB
    *
    * @param 
    *
    */
   b2WeldJoint.prototype.GetBodyB = function () {
      return this.m_bodyB;
   };

   /**
    * GetNext
    *
    * @param 
    *
    */
   b2WeldJoint.prototype.GetNext = function () {
      return this.m_next;
   };

   /**
    * GetUserData
    *
    * @param 
    *
    */
   b2WeldJoint.prototype.GetUserData = function () {
      return this.m_userData;
   };

   /**
    * SetUserData
    *
    * @param data
    *
    */
   b2WeldJoint.prototype.SetUserData = function (data) {
      this.m_userData = data;
   };

   /**
    * IsActive
    *
    * @param 
    *
    */
   b2WeldJoint.prototype.IsActive = function () {
      return this.m_bodyA.IsActive() && this.m_bodyB.IsActive();
   };

   /**
    * b2Joint
    *
    * @param def
    *
    */
   b2WeldJoint.prototype.b2Joint = function (def) {
      b2Assert(def.bodyA !== def.bodyB);
      this.m_type = def.type;
      this.m_prev = null;
      this.m_next = null;
      this.m_bodyA = def.bodyA;
      this.m_bodyB = def.bodyB;
      this.m_collideConnected = def.collideConnected;
      this.m_islandFlag = false;
      this.m_userData = def.userData;
   };

   /**
    * FinalizeVelocityConstraints
    *
    * @param 
    *
    */
   b2WeldJoint.prototype.FinalizeVelocityConstraints = function () {};

   /**
    *  Class b2WeldJointDef
    *
    * @param 
    *
    */
   b2WeldJointDef = Box2D.Dynamics.Joints.b2WeldJointDef = function b2WeldJointDef() {
      this.localAnchorA = new b2Vec2(0, 0);
      this.localAnchorB = new b2Vec2(0, 0);
   };
   b2WeldJointDef.constructor = b2WeldJointDef;
   b2WeldJointDef.prototype = Object.create(b2JointDef.prototype );
   b2WeldJointDef.prototype.type                = b2Joint.e_weldJoint;
   b2WeldJointDef.prototype.referenceAngle      = 0.0;
   b2WeldJointDef.prototype.localAnchorA        = null;
   b2WeldJointDef.prototype.localAnchorB        = null;

   /**
    * Initialize
    *
    * @param bA
    * @param bB
    * @param anchor
    *
    */
   b2WeldJointDef.prototype.Initialize = function (bA, bB, anchor) {
      this.bodyA = bA;
      this.bodyB = bB;
      this.localAnchorA.SetV(this.bodyA.GetLocalPoint(anchor));
      this.localAnchorB.SetV(this.bodyB.GetLocalPoint(anchor));
      this.referenceAngle = this.bodyB.GetAngle() - this.bodyA.GetAngle();
   };

   /**
    * b2JointDef
    *
    * @param 
    *
    */
   b2WeldJointDef.prototype.b2JointDef = function () {
      this.type = b2Joint.e_unknownJoint;
      this.userData = null;
      this.bodyA = null;
      this.bodyB = null;
      this.collideConnected = false;
   };
/**
*  Class b2ContactListener
*
* @param
*
*/
b2ContactListener = Box2D.Dynamics.b2ContactListener = function b2ContactListener() {};
b2ContactListener.constructor = b2ContactListener;
b2ContactListener.prototype = {

    /**
     * BeginContact
     *
     * @param contact
     *
     */
    BeginContact: function (contact) {
    },

    /**
     * EndContact
     *
     * @param contact
     *
     */
    EndContact: function (contact) {
    },

    /**
     * PreSolve
     *
     * @param contact
     * @param oldManifold
     *
     */
    PreSolve: function (contact, oldManifold) {
    },

    /**
     * PostSolve
     *
     * @param contact
     * @param impulse
     *
     */
    PostSolve: function (contact, impulse) {
    }
};
b2ContactListener.b2_defaultListener = new b2ContactListener();

/**
*  Class b2ContactFilter
*
* @param
*
*/
b2ContactFilter = Box2D.Dynamics.b2ContactFilter = function b2ContactFilter() {};
b2ContactFilter.constructor = b2ContactFilter;
b2ContactFilter.prototype = {

    /**
     * ShouldCollide
     *
     * @param fixtureA
     * @param fixtureB
     *
     */
    ShouldCollide: function (fixtureA, fixtureB) {
        var filter1 = fixtureA.GetFilterData(),
            filter2 = fixtureB.GetFilterData();
        if (filter1.groupIndex === filter2.groupIndex && filter1.groupIndex !== 0) {
            return filter1.groupIndex > 0;
        }
        return (filter1.maskBits & filter2.categoryBits) !== 0 && (filter1.categoryBits & filter2.maskBits) !== 0;
    },

    /**
     * RayCollide
     *
     * @param userData
     * @param fixture
     *
     */
    RayCollide: function (userData, fixture) {
        if (!userData) return true;
        return this.ShouldCollide((userData instanceof b2Fixture ? userData : null), fixture);
    }
};

b2ContactFilter.b2_defaultFilter = new b2ContactFilter();

/**
*  Class b2Fixture
*
* @param 
*
*/
b2Fixture = Box2D.Dynamics.b2Fixture = function b2Fixture() {
    this.m_filter = new b2FilterData();
    this.m_aabb = new b2AABB();
};

b2Fixture.constructor = b2Fixture;
b2Fixture.prototype = {
    m_filter: null,
    m_shape: null,
    m_isSensor: false,
    m_body: null,
    m_next: null,
    m_userData: null,
    m_density: 0.0,
    m_friction: 0.0,
    m_restitution: 0.0,
    m_aabb: null,
    m_proxy: null,
    /**
     * GetType
     *
     * @param
     *
     */
    GetType: function () {
        return this.m_shape.GetType();
    },

    /**
     * GetShape
     *
     * @param
     *
     */
    GetShape: function () {
        return this.m_shape;
    },

    /**
     * SetSensor
     *
     * @param sensor
     *
     */
    SetSensor: function (sensor) {
        if (this.m_isSensor === sensor) return;
        this.m_isSensor = sensor;
        if (this.m_body == null) return;
        var edge = this.m_body.GetContactList();
        while (edge) {
            var contact = edge.contact,
                fixtureA = contact.GetFixtureA(),
                fixtureB = contact.GetFixtureB();
            if (fixtureA === this || fixtureB === this) contact.SetSensor(fixtureA.IsSensor() || fixtureB.IsSensor());
            edge = edge.next;
        }
    },

    /**
     * IsSensor
     *
     * @param
     *
     */
    IsSensor: function () {
        return this.m_isSensor;
    },

    /**
     * SetFilterData
     *
     * @param filter
     *
     */
    SetFilterData: function (filter) {
        this.m_filter = filter.Copy();
        if (this.m_body) return;
        var edge = this.m_body.GetContactList();
        while (edge) {
            var contact = edge.contact,
                fixtureA = contact.GetFixtureA(),
                fixtureB = contact.GetFixtureB();
            if (fixtureA === this || fixtureB === this) contact.FlagForFiltering();
            edge = edge.next;
        }
    },

    /**
     * GetFilterData
     *
     * @param
     *
     */
    GetFilterData: function () {
        return this.m_filter.Copy();
    },

    /**
     * GetBody
     *
     * @param
     *
     */
    GetBody: function () {
        return this.m_body;
    },

    /**
     * GetNext
     *
     * @param
     *
     */
    GetNext: function () {
        return this.m_next;
    },

    /**
     * GetUserData
     *
     * @param
     *
     */
    GetUserData: function () {
        return this.m_userData;
    },

    /**
     * SetUserData
     *
     * @param data
     *
     */
    SetUserData: function (data) {
        this.m_userData = data;
    },

    /**
     * TestPoint
     *
     * @param p
     *
     */
    TestPoint: function (p) {
        return this.m_shape.TestPoint(this.m_body.GetTransform(), p);
    },

    /**
     * RayCast
     *
     * @param output
     * @param input
     *
     */
    RayCast: function (output, input) {
        return this.m_shape.RayCast(output, input, this.m_body.GetTransform());
    },

    /**
     * GetMassData
     *
     * @param massData
     *
     */
    GetMassData: function (massData) {
        massData = massData || null;
        if (massData == null) {
            massData = new b2MassData();
        }
        this.m_shape.ComputeMass(massData, this.m_density);
        return massData;
    },

    /**
     * SetDensity
     *
     * @param density
     *
     */
    SetDensity: function (density) {
        density = density || 0;
        this.m_density = density;
    },

    /**
     * GetDensity
     *
     * @param
     *
     */
    GetDensity: function () {
        return this.m_density;
    },

    /**
     * GetFriction
     *
     * @param
     *
     */
    GetFriction: function () {
        return this.m_friction;
    },

    /**
     * SetFriction
     *
     * @param friction
     *
     */
    SetFriction: function (friction) {
        friction = friction || 0;
        this.m_friction = friction;
    },

    /**
     * GetRestitution
     *
     * @param
     *
     */
    GetRestitution: function () {
        return this.m_restitution;
    },

    /**
     * SetRestitution
     *
     * @param restitution
     *
     */
    SetRestitution: function (restitution) {
        restitution = restitution || 0;
        this.m_restitution = restitution;
    },

    /**
     * GetAABB
     *
     * @param
     *
     */
    GetAABB: function () {
        return this.m_aabb;
    },

    /**
     * Create
     *
     * @param body
     * @param xf
     * @param def
     *
     */
    Create: function (body, xf, def) {
        this.m_userData = def.userData;
        this.m_friction = def.friction;
        this.m_restitution = def.restitution;
        this.m_body = body;
        this.m_next = null;
        this.m_filter = def.filter.Copy();
        this.m_isSensor = def.isSensor;
        this.m_shape = def.shape.Copy();
        this.m_density = def.density;
    },

    /**
     * Destroy
     *
     * @param
     *
     */
    Destroy: function () {
        this.m_shape = null;
    },

    /**
     * CreateProxy
     *
     * @param broadPhase
     * @param xf
     *
     */
    CreateProxy: function (broadPhase, xf) {
        this.m_shape.ComputeAABB(this.m_aabb, xf);
        this.m_proxy = broadPhase.CreateProxy(this.m_aabb, this);
    },

    /**
     * DestroyProxy
     *
     * @param broadPhase
     *
     */
    DestroyProxy: function (broadPhase) {
        if (this.m_proxy == null) {
            return;
        }
        broadPhase.DestroyProxy(this.m_proxy);
        this.m_proxy = null;
    },

    /**
     * Synchronize
     *
     * @param broadPhase
     * @param transform1
     * @param transform2
     *
     */
    Synchronize: function (broadPhase, transform1, transform2) {
        if (!this.m_proxy) return;
        var aabb1 = new b2AABB(),
            aabb2 = new b2AABB();
        this.m_shape.ComputeAABB(aabb1, transform1);
        this.m_shape.ComputeAABB(aabb2, transform2);
        this.m_aabb.Combine(aabb1, aabb2);
        var displacement = b2Math.SubtractVV(transform2.position, transform1.position);
        broadPhase.MoveProxy(this.m_proxy, this.m_aabb, displacement);
    }
}
/**
*  Class b2ContactManager
*
* @param
*
*/
b2ContactManager = Box2D.Dynamics.b2ContactManager = function b2ContactManager() {
    this.m_world = null;
    this.m_contactCount = 0;
    this.m_contactFilter = b2ContactFilter.b2_defaultFilter;
    this.m_contactListener = b2ContactListener.b2_defaultListener;
    this.m_contactFactory = new b2ContactFactory(this.m_allocator);
    this.m_broadPhase = new b2DynamicTreeBroadPhase();
};
b2ContactManager.s_evalCP = new b2ContactPoint();
b2ContactManager.constructor = b2ContactManager;
b2ContactManager.prototype = {
    m_world             : null,
    m_contactCount      : null,
    m_contactFilter     : null,
    m_contactListener   : null,
    m_contactFactory    : null,
    m_broadPhase        : null,
    /**
     * AddPair
     *
     * @param proxyUserDataA
     * @param proxyUserDataB
     *
     */
    AddPair: function (proxyUserDataA, proxyUserDataB) {
        var fixtureA = (proxyUserDataA instanceof b2Fixture ? proxyUserDataA : null),
            fixtureB = (proxyUserDataB instanceof b2Fixture ? proxyUserDataB : null),
            bodyA = fixtureA.GetBody(),
            bodyB = fixtureB.GetBody();
        if (bodyA === bodyB) return;
        var edge = bodyB.GetContactList();
        while (edge) {
            if (edge.other === bodyA) {
                var fA = edge.contact.GetFixtureA(),
                    fB = edge.contact.GetFixtureB();
                if (fA === fixtureA && fB === fixtureB) return;
                if (fA === fixtureB && fB === fixtureA) return;
            }
            edge = edge.next;
        }
        if (bodyB.ShouldCollide(bodyA) === false) {
            return;
        }
        if (this.m_contactFilter.ShouldCollide(fixtureA, fixtureB) === false) {
            return;
        }
        var c = this.m_contactFactory.Create(fixtureA, fixtureB);
        fixtureA = c.GetFixtureA();
        fixtureB = c.GetFixtureB();
        bodyA = fixtureA.m_body;
        bodyB = fixtureB.m_body;
        c.m_prev = null;
        c.m_next = this.m_world.m_contactList;
        if (this.m_world.m_contactList != null) {
            this.m_world.m_contactList.m_prev = c;
        }
        this.m_world.m_contactList = c;
        c.m_nodeA.contact = c;
        c.m_nodeA.other = bodyB;
        c.m_nodeA.prev = null;
        c.m_nodeA.next = bodyA.m_contactList;
        if (bodyA.m_contactList != null) {
            bodyA.m_contactList.prev = c.m_nodeA;
        }
        bodyA.m_contactList = c.m_nodeA;
        c.m_nodeB.contact = c;
        c.m_nodeB.other = bodyA;
        c.m_nodeB.prev = null;
        c.m_nodeB.next = bodyB.m_contactList;
        if (bodyB.m_contactList != null) {
            bodyB.m_contactList.prev = c.m_nodeB;
        }
        bodyB.m_contactList = c.m_nodeB;
        ++this.m_world.m_contactCount;
    },

    /**
     * FindNewContacts
     *
     * @param
     *
     */
    FindNewContacts: function () {
        var generateCallback = function (context, cb) {
            return function () {
                cb.apply(context, arguments);
            };
        };
        this.m_broadPhase.UpdatePairs(generateCallback(this, this.AddPair));
    },

    /**
     * Destroy
     *
     * @param c
     *
     */
    Destroy: function (c) {
        var fixtureA = c.GetFixtureA(),
            fixtureB = c.GetFixtureB(),
            bodyA = fixtureA.GetBody(),
            bodyB = fixtureB.GetBody();
        if (c.IsTouching()) {
            this.m_contactListener.EndContact(c);
        }
        if (c.m_prev) {
            c.m_prev.m_next = c.m_next;
        }
        if (c.m_next) {
            c.m_next.m_prev = c.m_prev;
        }
        if (c === this.m_world.m_contactList) {
            this.m_world.m_contactList = c.m_next;
        }
        if (c.m_nodeA.prev) {
            c.m_nodeA.prev.next = c.m_nodeA.next;
        }
        if (c.m_nodeA.next) {
            c.m_nodeA.next.prev = c.m_nodeA.prev;
        }
        if (c.m_nodeA === bodyA.m_contactList) {
            bodyA.m_contactList = c.m_nodeA.next;
        }
        if (c.m_nodeB.prev) {
            c.m_nodeB.prev.next = c.m_nodeB.next;
        }
        if (c.m_nodeB.next) {
            c.m_nodeB.next.prev = c.m_nodeB.prev;
        }
        if (c.m_nodeB === bodyB.m_contactList) {
            bodyB.m_contactList = c.m_nodeB.next;
        }
        this.m_contactFactory.Destroy(c);
        --this.m_contactCount;
    },

    /**
     * Collide
     *
     * @param
     *
     */
    Collide: function () {
        var c = this.m_world.m_contactList;
        while (c) {
            var fixtureA = c.GetFixtureA(),
                fixtureB = c.GetFixtureB(),
                bodyA = fixtureA.GetBody(),
                bodyB = fixtureB.GetBody();
            if (bodyA.IsAwake() === false && bodyB.IsAwake() === false) {
                c = c.GetNext();
                continue;
            }
            if (c.m_flags & b2Contact.e_filterFlag) {
                if (bodyB.ShouldCollide(bodyA) === false) {
                    var cNuke = c;
                    c = cNuke.GetNext();
                    this.Destroy(cNuke);
                    continue;
                }
                if (this.m_contactFilter.ShouldCollide(fixtureA, fixtureB) === false) {
                    cNuke = c;
                    c = cNuke.GetNext();
                    this.Destroy(cNuke);
                    continue;
                }
                c.m_flags &= ~b2Contact.e_filterFlag;
            }
            var proxyA = fixtureA.m_proxy,
                proxyB = fixtureB.m_proxy,
                overlap = this.m_broadPhase.TestOverlap(proxyA, proxyB);
            if (overlap === false) {
                cNuke = c;
                c = cNuke.GetNext();
                this.Destroy(cNuke);
                continue;
            }
            c.Update(this.m_contactListener);
            c = c.GetNext();
        }
    }
};
/**
 *  Class b2Body
 *
 * @param bd
 * @param world
 *
 */
b2Body = Box2D.Dynamics.b2Body = function b2Body(bd, world) {

    this.m_xf = new b2Transform();
    this.m_sweep = new b2Sweep();
    this.m_linearVelocity = new b2Vec2(0, 0);
    this.m_force = new b2Vec2(0, 0);
    if (bd.bullet) {
      this.m_flags |= b2Body.e_bulletFlag;
    }
    if (bd.fixedRotation) {
      this.m_flags |= b2Body.e_fixedRotationFlag;
    }
    if (bd.allowSleep) {
      this.m_flags |= b2Body.e_allowSleepFlag;
    }
    if (bd.awake) {
      this.m_flags |= b2Body.e_awakeFlag;
    }
    if (bd.active) {
      this.m_flags |= b2Body.e_activeFlag;
    }
    this.m_world = world;
    this.m_xf.position.SetV(bd.position);
    this.m_xf.R.Set(bd.angle);
    this.m_sweep.localCenter.SetZero();
    this.m_sweep.t0 = 1.0;
    this.m_sweep.a0 = this.m_sweep.a = bd.angle;
    var tMat = this.m_xf.R,
         tVec = this.m_sweep.localCenter;
    this.m_sweep.c.x = (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
    this.m_sweep.c.y = (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
    this.m_sweep.c.x += this.m_xf.position.x;
    this.m_sweep.c.y += this.m_xf.position.y;
    this.m_sweep.c0.SetV(this.m_sweep.c);
    this.m_linearVelocity.SetV(bd.linearVelocity);
    this.m_angularVelocity = bd.angularVelocity;
    this.m_linearDamping = bd.linearDamping;
    this.m_angularDamping = bd.angularDamping;
    this.m_force.Set(0.0, 0.0);
    this.m_type = bd.type;
    if (this.m_type === b2Body.b2_dynamicBody) {
      this.m_mass = 1.0;
      this.m_invMass = 1.0;
    }
    this.m_inertiaScale = bd.inertiaScale;
    this.m_userData = bd.userData;
};

b2Body.s_xf1 = new b2Transform();
b2Body.e_islandFlag = 0x0001;
b2Body.e_awakeFlag = 0x0002;
b2Body.e_allowSleepFlag = 0x0004;
b2Body.e_bulletFlag = 0x0008;
b2Body.e_fixedRotationFlag = 0x0010;
b2Body.e_activeFlag = 0x0020;
b2Body.b2_staticBody = 0;
b2Body.b2_kinematicBody = 1;
b2Body.b2_dynamicBody = 2;
b2Body.constructor = b2Body;
b2Body.prototype = {
     m_xf: null,
     m_sweep: null,
     m_flags: 0,
     m_world: null,
     m_jointList: null,
     m_controllerList: null,
     m_contactList: null,
     m_controllerCount: 0,
     m_prev: null,
     m_next: null,
     m_linearVelocity: null,
     m_angularVelocity: null,
     m_linearDamping: null,
     m_angularDamping: null,
     m_force: null,
     m_torque: 0.0,
     m_sleepTime: 0.0,
     m_type: 0,
     m_mass: 0.0,
     m_invMass: 0.0,
     m_I: 0.0,
     m_invI: 0.0,
     m_inertiaScale: 0,
     m_userData: null,
     m_fixtureList: null,
     m_fixtureCount: 0,

     /**
      * connectEdges
      *
      * @param s1
      * @param s2
      * @param angle1
      *
      */
     connectEdges: function (s1, s2, angle1) {
          angle1 = angle1 || 0;
          var angle2 = Math.atan2(s2.GetDirectionVector().y, s2.GetDirectionVector().x),
                coreOffset = Math.tan((angle2 - angle1) * 0.5),
                core = b2Math.MulFV(coreOffset, s2.GetDirectionVector());
          core = b2Math.SubtractVV(core, s2.GetNormalVector());
          core = b2Math.MulFV(b2Settings.b2_toiSlop, core);
          core = b2Math.AddVV(core, s2.GetVertex1());
          var cornerDir = b2Math.AddVV(s1.GetDirectionVector(), s2.GetDirectionVector());
          cornerDir.Normalize();
          var convex = b2Math.Dot(s1.GetDirectionVector(), s2.GetNormalVector()) > 0.0;
          s1.SetNextEdge(s2, core, cornerDir, convex);
          s2.SetPrevEdge(s1, core, cornerDir, convex);
          return angle2;
     },

     /**
      * CreateFixture
      *
      * @param def
      * @return object
      *
      */
     CreateFixture: function (def) {
          if (this.m_world.IsLocked() === true) {
                return null;
          }
          var fixture = new b2Fixture();
          fixture.Create(this, this.m_xf, def);
          if (this.m_flags & b2Body.e_activeFlag) {
                var broadPhase = this.m_world.m_contactManager.m_broadPhase;
                fixture.CreateProxy(broadPhase, this.m_xf);
          }
          fixture.m_next = this.m_fixtureList;
          this.m_fixtureList = fixture;
          ++this.m_fixtureCount;
          fixture.m_body = this;
          if (fixture.m_density > 0.0) {
                this.ResetMassData();
          }
          this.m_world.m_flags |= b2World.e_newFixture;
          return fixture;
     },

     /**
      * CreateFixture2
      *
      * @param shape
      * @param density
      *
      */
     CreateFixture2: function (shape, density) {
          density = density || 0.0;
          var def = new b2FixtureDef();
          def.shape = shape;
          def.density = density;
          return this.CreateFixture(def);
     },

     /**
      * DestroyFixture
      *
      * @param fixture
      *
      */
     DestroyFixture: function (fixture) {
          if (this.m_world.IsLocked() === true) {
                return;
          }
          var node = this.m_fixtureList,
                ppF = null,
                found = false;
          while (node != null) {
                if (node === fixture) {
                     if (ppF) ppF.m_next = fixture.m_next;
                     else this.m_fixtureList = fixture.m_next;
                     found = true;
                     break;
                }
                ppF = node;
                node = node.m_next;
          }
          var edge = this.m_contactList;
          while (edge) {
                var c = edge.contact;
                edge = edge.next;
                var fixtureA = c.GetFixtureA(),
                     fixtureB = c.GetFixtureB();
                if (fixture === fixtureA || fixture === fixtureB) {
                     this.m_world.m_contactManager.Destroy(c);
                }
          }
          if (this.m_flags & b2Body.e_activeFlag) {
                var broadPhase = this.m_world.m_contactManager.m_broadPhase;
                fixture.DestroyProxy(broadPhase);
          }
          else {
          }
          fixture.Destroy();
          fixture.m_body = null;
          fixture.m_next = null;
          --this.m_fixtureCount;
          this.ResetMassData();
     },

     /**
      * SetPositionAndAngle
      *
      * @param position
      * @param angle
      *
      */
     SetPositionAndAngle: function (position, angle) {
          angle = angle || 0;
          var f;
          if (this.m_world.IsLocked() === true) {
                return;
          }
          this.m_xf.R.Set(angle);
          this.m_xf.position.SetV(position);
          var tMat = this.m_xf.R,
                tVec = this.m_sweep.localCenter;
          this.m_sweep.c.x = (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
          this.m_sweep.c.y = (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
          this.m_sweep.c.x += this.m_xf.position.x;
          this.m_sweep.c.y += this.m_xf.position.y;
          this.m_sweep.c0.SetV(this.m_sweep.c);
          this.m_sweep.a0 = this.m_sweep.a = angle;
          var broadPhase = this.m_world.m_contactManager.m_broadPhase;
          for (f = this.m_fixtureList; f; f = f.m_next) {
                f.Synchronize(broadPhase, this.m_xf, this.m_xf);
          }
          this.m_world.m_contactManager.FindNewContacts();
     },

     /**
      * SetTransform
      *
      * @param xf
      *
      */
     SetTransform: function (xf) {
          this.SetPositionAndAngle(xf.position, xf.GetAngle());
     },

     /**
      * GetTransform
      *
      * @param
      *
      */
     GetTransform: function () {
          return this.m_xf;
     },

     /**
      * GetPosition
      *
      * @param
      *
      */
     GetPosition: function () {
          return this.m_xf.position;
     },

     /**
      * SetPosition
      *
      * @param position
      *
      */
     SetPosition: function (position) {
          this.SetPositionAndAngle(position, this.GetAngle());
     },

     /**
      * GetAngle
      *
      * @param
      *
      */
     GetAngle: function () {
          return this.m_sweep.a;
     },

     /**
      * SetAngle
      *
      * @param angle
      *
      */
     SetAngle: function (angle) {
          angle = angle || 0;
          this.SetPositionAndAngle(this.GetPosition(), angle);
     },

     /**
      * GetWorldCenter
      *
      * @param
      *
      */
     GetWorldCenter: function () {
          return this.m_sweep.c;
     },

     /**
      * GetLocalCenter
      *
      * @param
      *
      */
     GetLocalCenter: function () {
          return this.m_sweep.localCenter;
     },

     /**
      * SetLinearVelocity
      *
      * @param v
      *
      */
     SetLinearVelocity: function (v) {
          if (this.m_type === b2Body.b2_staticBody) {
                return;
          }
          this.m_linearVelocity.SetV(v);
     },

     /**
      * GetLinearVelocity
      *
      * @param
      *
      */
     GetLinearVelocity: function () {
          return this.m_linearVelocity;
     },

     /**
      * SetAngularVelocity
      *
      * @param omega
      *
      */
     SetAngularVelocity: function (omega) {
          if (this.m_type === b2Body.b2_staticBody) {
                return;
          }
          this.m_angularVelocity = omega;
     },

     /**
      * GetAngularVelocity
      *
      * @param
      *
      */
     GetAngularVelocity: function () {
          return this.m_angularVelocity;
     },

     /**
      * GetDefinition
      *
      * @param
      *
      */
     GetDefinition: function () {
          var bd = new b2BodyDef();
          bd.type = this.GetType();
          bd.allowSleep = (this.m_flags & b2Body.e_allowSleepFlag) === b2Body.e_allowSleepFlag;
          bd.angle = this.GetAngle();
          bd.angularDamping = this.m_angularDamping;
          bd.angularVelocity = this.m_angularVelocity;
          bd.fixedRotation = (this.m_flags & b2Body.e_fixedRotationFlag) === b2Body.e_fixedRotationFlag;
          bd.bullet = (this.m_flags & b2Body.e_bulletFlag) === b2Body.e_bulletFlag;
          bd.awake = (this.m_flags & b2Body.e_awakeFlag) === b2Body.e_awakeFlag;
          bd.linearDamping = this.m_linearDamping;
          bd.linearVelocity.SetV(this.GetLinearVelocity());
          bd.position = this.GetPosition();
          bd.userData = this.GetUserData();
          return bd;
     },

     /**
      * ApplyForce
      *
      * @param force
      * @param point
      *
      */
     ApplyForce: function (force, point) {
          if (this.m_type !== b2Body.b2_dynamicBody) {
                return;
          }
          if (this.IsAwake() === false) {
                this.SetAwake(true);
          }
          this.m_force.x += force.x;
          this.m_force.y += force.y;
          this.m_torque += ((point.x - this.m_sweep.c.x) * force.y - (point.y - this.m_sweep.c.y) * force.x);
     },

     /**
      * ApplyTorque
      *
      * @param torque
      *
      */
     ApplyTorque: function (torque) {
          if (this.m_type !== b2Body.b2_dynamicBody) {
                return;
          }
          if (this.IsAwake() === false) {
                this.SetAwake(true);
          }
          this.m_torque += torque;
     },

     /**
      * ApplyImpulse
      *
      * @param impulse
      * @param point
      *
      */
     ApplyImpulse: function (impulse, point) {
          if (this.m_type !== b2Body.b2_dynamicBody) {
                return;
          }
          if (this.IsAwake() === false) {
                this.SetAwake(true);
          }
          this.m_linearVelocity.x += this.m_invMass * impulse.x;
          this.m_linearVelocity.y += this.m_invMass * impulse.y;
          this.m_angularVelocity += this.m_invI * ((point.x - this.m_sweep.c.x) * impulse.y - (point.y - this.m_sweep.c.y) * impulse.x);
     },

     /**
      * Split
      *
      * @param callback
      *
      */
     Split: function (callback) {
          var linearVelocity = this.GetLinearVelocity().Copy(),
                angularVelocity = this.GetAngularVelocity(),
                center = this.GetWorldCenter(),
                body1 = this,
                body2 = this.m_world.CreateBody(this.GetDefinition()),
                prev;
          for (var f = body1.m_fixtureList; f;) {
                if (callback(f)) {
                     var next = f.m_next;
                     if (prev) {
                          prev.m_next = next;
                     }
                     else {
                          body1.m_fixtureList = next;
                     }
                     body1.m_fixtureCount--;
                     f.m_next = body2.m_fixtureList;
                     body2.m_fixtureList = f;
                     body2.m_fixtureCount++;
                     f.m_body = body2;
                     f = next;
                }
                else {
                     prev = f;
                     f = f.m_next;
                }
          }
          body1.ResetMassData();
          body2.ResetMassData();
          var center1 = body1.GetWorldCenter(),
                center2 = body2.GetWorldCenter(),
                velocity1 = b2Math.AddVV(linearVelocity, b2Math.CrossFV(angularVelocity, b2Math.SubtractVV(center1, center))),
                velocity2 = b2Math.AddVV(linearVelocity, b2Math.CrossFV(angularVelocity, b2Math.SubtractVV(center2, center)));
          body1.SetLinearVelocity(velocity1);
          body2.SetLinearVelocity(velocity2);
          body1.SetAngularVelocity(angularVelocity);
          body2.SetAngularVelocity(angularVelocity);
          body1.SynchronizeFixtures();
          body2.SynchronizeFixtures();
          return body2;
     },

     /**
      * Merge
      *
      * @param other
      *
      */
     Merge: function (other) {
          var f;
          for (f = other.m_fixtureList; f;) {
                var next = f.m_next;
                other.m_fixtureCount--;
                f.m_next = this.m_fixtureList;
                this.m_fixtureList = f;
                this.m_fixtureCount++;
                f.m_body = body2;
                f = next;
          }
          body1.m_fixtureCount = 0;
          var body1 = this,
                body2 = other,
                center1 = body1.GetWorldCenter(),
                center2 = body2.GetWorldCenter(),
                velocity1 = body1.GetLinearVelocity().Copy(),
                velocity2 = body2.GetLinearVelocity().Copy(),
                angular1 = body1.GetAngularVelocity(),
                angular = body2.GetAngularVelocity();
          body1.ResetMassData();
          this.SynchronizeFixtures();
     },

     /**
      * GetMass
      *
      * @param
      * @return mass
      *
      */
     GetMass: function () {
          return this.m_mass;
     },

     /**
      * GetInertia
      *
      * @param
      * @return inertia
      *
      */
     GetInertia: function () {
          return this.m_I;
     },

     /**
      * GetMassData
      *
      * @param data
      *
      */
     GetMassData: function (data) {
          data.mass = this.m_mass;
          data.I = this.m_I;
          data.center.SetV(this.m_sweep.localCenter);
     },

     /**
      * SetMassData
      *
      * @param massData
      *
      */
     SetMassData: function (massData) {
          b2Assert(this.m_world.IsLocked() === false);
          if (this.m_world.IsLocked() === true) {
                return;
          }
          if (this.m_type !== b2Body.b2_dynamicBody) {
                return;
          }
          this.m_invMass = 0.0;
          this.m_I = 0.0;
          this.m_invI = 0.0;
          this.m_mass = massData.mass;
          if (this.m_mass <= 0.0) {
                this.m_mass = 1.0;
          }
          this.m_invMass = 1.0 / this.m_mass;
          if (massData.I > 0.0 && (this.m_flags & b2Body.e_fixedRotationFlag) === 0) {
                this.m_I = massData.I - this.m_mass * (massData.center.x * massData.center.x + massData.center.y * massData.center.y);
                this.m_invI = 1.0 / this.m_I;
          }
          var oldCenter = this.m_sweep.c.Copy();
          this.m_sweep.localCenter.SetV(massData.center);
          this.m_sweep.c0.SetV(b2Math.MulX(this.m_xf, this.m_sweep.localCenter));
          this.m_sweep.c.SetV(this.m_sweep.c0);
          this.m_linearVelocity.x += this.m_angularVelocity * (-(this.m_sweep.c.y - oldCenter.y));
          this.m_linearVelocity.y += this.m_angularVelocity * (+(this.m_sweep.c.x - oldCenter.x));
     },

     /**
      * ResetMassData
      *
      * @param
      *
      */
     ResetMassData: function () {
          this.m_mass = 0.0;
          this.m_invMass = 0.0;
          this.m_I = 0.0;
          this.m_invI = 0.0;
          this.m_sweep.localCenter.SetZero();
          if (this.m_type === b2Body.b2_staticBody || this.m_type === b2Body.b2_kinematicBody) {
                return;
          }
          var center = b2Vec2.Make(0, 0);
          for (var f = this.m_fixtureList; f; f = f.m_next) {
                if (f.m_density === 0.0) {
                     continue;
                }
                var massData = f.GetMassData();
                this.m_mass += massData.mass;
                center.x += massData.center.x * massData.mass;
                center.y += massData.center.y * massData.mass;
                this.m_I += massData.I;
          }
          if (this.m_mass > 0.0) {
                this.m_invMass = 1.0 / this.m_mass;
                center.x *= this.m_invMass;
                center.y *= this.m_invMass;
          }
          else {
                this.m_mass = 1.0;
                this.m_invMass = 1.0;
          }
          if (this.m_I > 0.0 && (this.m_flags & b2Body.e_fixedRotationFlag) === 0) {
                this.m_I -= this.m_mass * (center.x * center.x + center.y * center.y);
                this.m_I *= this.m_inertiaScale;
                b2Assert(this.m_I > 0);
                this.m_invI = 1.0 / this.m_I;
          }
          else {
                this.m_I = 0.0;
                this.m_invI = 0.0;
          }
          var oldCenter = this.m_sweep.c.Copy();
          this.m_sweep.localCenter.SetV(center);
          this.m_sweep.c0.SetV(b2Math.MulX(this.m_xf, this.m_sweep.localCenter));
          this.m_sweep.c.SetV(this.m_sweep.c0);
          this.m_linearVelocity.x += this.m_angularVelocity * (-(this.m_sweep.c.y - oldCenter.y));
          this.m_linearVelocity.y += this.m_angularVelocity * (+(this.m_sweep.c.x - oldCenter.x));
     },

     /**
      * GetWorldPoint
      *
      * @param localPoint
      *
      */
     GetWorldPoint: function (localPoint) {
          var A = this.m_xf.R,
                u = new b2Vec2(A.col1.x * localPoint.x + A.col2.x * localPoint.y, A.col1.y * localPoint.x + A.col2.y * localPoint.y);
          u.x += this.m_xf.position.x;
          u.y += this.m_xf.position.y;
          return u;
     },

     /**
      * GetWorldVector
      *
      * @param localVector
      *
      */
     GetWorldVector: function (localVector) {
          return b2Math.MulMV(this.m_xf.R, localVector);
     },

     /**
      * GetLocalPoint
      *
      * @param worldPoint
      *
      */
     GetLocalPoint: function (worldPoint) {
          return b2Math.MulXT(this.m_xf, worldPoint);
     },

     /**
      * GetLocalVector
      *
      * @param worldVector
      *
      */
     GetLocalVector: function (worldVector) {
          return b2Math.MulTMV(this.m_xf.R, worldVector);
     },

     /**
      * GetLinearVelocityFromWorldPoint
      *
      * @param worldPoint
      *
      */
     GetLinearVelocityFromWorldPoint: function (worldPoint) {
          return new b2Vec2(this.m_linearVelocity.x - this.m_angularVelocity * (worldPoint.y - this.m_sweep.c.y), this.m_linearVelocity.y + this.m_angularVelocity * (worldPoint.x - this.m_sweep.c.x));
     },

     /**
      * GetLinearVelocityFromLocalPoint
      *
      * @param localPoint
      *
      */
     GetLinearVelocityFromLocalPoint: function (localPoint) {
          var A = this.m_xf.R,
                worldPoint = new b2Vec2(A.col1.x * localPoint.x + A.col2.x * localPoint.y, A.col1.y * localPoint.x + A.col2.y * localPoint.y);
          worldPoint.x += this.m_xf.position.x;
          worldPoint.y += this.m_xf.position.y;
          return new b2Vec2(this.m_linearVelocity.x - this.m_angularVelocity * (worldPoint.y - this.m_sweep.c.y), this.m_linearVelocity.y + this.m_angularVelocity * (worldPoint.x - this.m_sweep.c.x));
     },

     /**
      * GetLinearDamping
      *
      * @param
      *
      */
     GetLinearDamping: function () {
          return this.m_linearDamping;
     },

     /**
      * SetLinearDamping
      *
      * @param linearDamping
      *
      */
     SetLinearDamping: function (linearDamping) {
          linearDamping = linearDamping || 0;
          this.m_linearDamping = linearDamping;
     },

     /**
      * GetAngularDamping
      *
      * @param
      *
      */
     GetAngularDamping: function () {
          return this.m_angularDamping;
     },

     /**
      * SetAngularDamping
      *
      * @param angularDamping
      *
      */
     SetAngularDamping: function (angularDamping) {
          angularDamping = angularDamping || 0;
          this.m_angularDamping = angularDamping;
     },

     /**
      * SetType
      *
      * @param type
      *
      */
     SetType: function (type) {
          type = type || 0;
          if (this.m_type === type) {
                return;
          }
          this.m_type = type;
          this.ResetMassData();
          if (this.m_type === b2Body.b2_staticBody) {
                this.m_linearVelocity.SetZero();
                this.m_angularVelocity = 0.0;
          }
          this.SetAwake(true);
          this.m_force.SetZero();
          this.m_torque = 0.0;
          for (var ce = this.m_contactList; ce; ce = ce.next) {
                ce.contact.FlagForFiltering();
          }
     },

     /**
      * GetType
      *
      * @param
      *
      */
     GetType: function () {
          return this.m_type;
     },

     /**
      * SetBullet
      *
      * @param flag
      *
      */
     SetBullet: function (flag) {
          if (flag) {
                this.m_flags |= b2Body.e_bulletFlag;
          }
          else {
                this.m_flags &= ~b2Body.e_bulletFlag;
          }
     },

     /**
      * IsBullet
      *
      * @param
      *
      */
     IsBullet: function () {
          return (this.m_flags & b2Body.e_bulletFlag) === b2Body.e_bulletFlag;
     },

     /**
      * SetSleepingAllowed
      *
      * @param flag
      *
      */
     SetSleepingAllowed: function (flag) {
          if (flag) {
                this.m_flags |= b2Body.e_allowSleepFlag;
          }
          else {
                this.m_flags &= ~b2Body.e_allowSleepFlag;
                this.SetAwake(true);
          }
     },

     /**
      * SetAwake
      *
      * @param flag
      *
      */
     SetAwake: function (flag) {
          if (flag) {
                this.m_flags |= b2Body.e_awakeFlag;
                this.m_sleepTime = 0.0;
          }
          else {
                this.m_flags &= ~b2Body.e_awakeFlag;
                this.m_sleepTime = 0.0;
                this.m_linearVelocity.SetZero();
                this.m_angularVelocity = 0.0;
                this.m_force.SetZero();
                this.m_torque = 0.0;
          }
     },

     /**
      * IsAwake
      *
      * @param
      *
      */
     IsAwake: function () {
          return (this.m_flags & b2Body.e_awakeFlag) === b2Body.e_awakeFlag;
     },

     /**
      * SetFixedRotation
      *
      * @param fixed
      *
      */
     SetFixedRotation: function (fixed) {
          if (fixed) {
                this.m_flags |= b2Body.e_fixedRotationFlag;
          }
          else {
                this.m_flags &= ~b2Body.e_fixedRotationFlag;
          }
          this.ResetMassData();
     },

     /**
      * IsFixedRotation
      *
      * @param
      *
      */
     IsFixedRotation: function () {
          return (this.m_flags & b2Body.e_fixedRotationFlag) === b2Body.e_fixedRotationFlag;
     },

     /**
      * SetActive
      *
      * @param flag
      *
      */
     SetActive: function (flag) {
          if (flag === this.IsActive()) {
                return;
          }
          var broadPhase,
                f;
          if (flag) {
                this.m_flags |= b2Body.e_activeFlag;
                broadPhase = this.m_world.m_contactManager.m_broadPhase;
                for (f = this.m_fixtureList; f; f = f.m_next) {
                     f.CreateProxy(broadPhase, this.m_xf);
                }
          }
          else {
                this.m_flags &= ~b2Body.e_activeFlag;
                broadPhase = this.m_world.m_contactManager.m_broadPhase;
                for (f = this.m_fixtureList; f; f = f.m_next) {
                     f.DestroyProxy(broadPhase);
                }
                var ce = this.m_contactList;
                while (ce) {
                     var ce0 = ce;
                     ce = ce.next;
                     this.m_world.m_contactManager.Destroy(ce0.contact);
                }
                this.m_contactList = null;
          }
     },

     /**
      * IsActive
      *
      * @param
      *
      */
     IsActive: function () {
          return (this.m_flags & b2Body.e_activeFlag) === b2Body.e_activeFlag;
     },

     /**
      * IsSleepingAllowed
      *
      * @param
      *
      */
     IsSleepingAllowed: function () {
          return (this.m_flags & b2Body.e_allowSleepFlag) === b2Body.e_allowSleepFlag;
     },

     /**
      * GetFixtureList
      *
      * @param
      *
      */
     GetFixtureList: function () {
          return this.m_fixtureList;
     },

     /**
      * GetJointList
      *
      * @param
      *
      */
     GetJointList: function () {
          return this.m_jointList;
     },

     /**
      * GetControllerList
      *
      * @param
      *
      */
     GetControllerList: function () {
          return this.m_controllerList;
     },

     /**
      * GetContactList
      *
      * @param
      *
      */
     GetContactList: function () {
          return this.m_contactList;
     },

     /**
      * GetNext
      *
      * @param
      *
      */
     GetNext: function () {
          return this.m_next;
     },

     /**
      * GetUserData
      *
      * @param
      *
      */
     GetUserData: function () {
          return this.m_userData;
     },

     /**
      * SetUserData
      *
      * @param data
      *
      */
     SetUserData: function (data) {
          this.m_userData = data;
     },

     /**
      * GetWorld
      *
      * @param
      *
      */
     GetWorld: function () {
          return this.m_world;
     },

     /**
      * SynchronizeFixtures
      *
      * @param
      *
      */
     SynchronizeFixtures: function () {
          var xf1 = b2Body.s_xf1;
          xf1.R.Set(this.m_sweep.a0);
          var tMat = xf1.R,
                tVec = this.m_sweep.localCenter;
          xf1.position.x = this.m_sweep.c0.x - (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
          xf1.position.y = this.m_sweep.c0.y - (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
          var f,
                broadPhase = this.m_world.m_contactManager.m_broadPhase;
          for (f = this.m_fixtureList; f; f = f.m_next) {
                f.Synchronize(broadPhase, xf1, this.m_xf);
          }
     },

     /**
      * SynchronizeTransform
      *
      * @param
      *
      */
     SynchronizeTransform: function () {
          this.m_xf.R.Set(this.m_sweep.a);
          var tMat = this.m_xf.R,
                tVec = this.m_sweep.localCenter;
          this.m_xf.position.x = this.m_sweep.c.x - (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
          this.m_xf.position.y = this.m_sweep.c.y - (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
     },

     /**
      * ShouldCollide
      *
      * @param other
      *
      */
     ShouldCollide: function (other) {
          if (this.m_type !== b2Body.b2_dynamicBody && other.m_type !== b2Body.b2_dynamicBody) {
                return false;
          }
          for (var jn = this.m_jointList; jn; jn = jn.next) {
                if (jn.other === other) if (jn.joint.m_collideConnected === false) {
                     return false;
                }
          }
          return true;
     },

     /**
      * Advance
      *
      * @param t
      *
      */
     Advance: function (t) {
          t = t || 0;
          this.m_sweep.Advance(t);
          this.m_sweep.c.SetV(this.m_sweep.c0);
          this.m_sweep.a = this.m_sweep.a0;
          this.SynchronizeTransform();
     }
};
/**
*  Class b2DebugDraw
*
* @param 
*
*/
b2DebugDraw = Box2D.Dynamics.b2DebugDraw = function b2DebugDraw() {
    this.m_drawScale = 1.0;
    this.m_lineThickness = 1.0;
    this.m_alpha = 1.0;
    this.m_fillAlpha = 1.0;
    this.m_xformScale = 1.0;
    var __this = this;
    //#WORKAROUND
    this.m_sprite = {
     graphics: {
        clear: function () {
           __this.m_ctx.clearRect(0, 0, __this.m_ctx.canvas.width, __this.m_ctx.canvas.height)
        }
     }
    };
    this.m_drawFlags = 0;
};
b2DebugDraw.e_shapeBit           = 0x0001;
b2DebugDraw.e_jointBit           = 0x0002;
b2DebugDraw.e_aabbBit            = 0x0004;
b2DebugDraw.e_pairBit            = 0x0008;
b2DebugDraw.e_centerOfMassBit    = 0x0010;
b2DebugDraw.e_controllerBit      = 0x0020;
b2DebugDraw.constructor = b2DebugDraw;
b2DebugDraw.prototype = {
    m_drawScale         : 1.0,
    m_lineThickness     : 1.0,
    m_alpha             : 1.0,
    m_fillAlpha         : 1.0,
    m_xformScale        : 1.0,
    m_drawFlags         : 0x000000,
    m_ctx               : null,


    /**
     * SetFlags
     *
     * @param flags
     *
     */
    SetFlags: function (flags) {
        flags = flags || 0;
        this.m_drawFlags = flags;
    },

    /**
     * GetFlags
     *
     * @param
     *
     */
    GetFlags: function () {
        return this.m_drawFlags;
    },

    /**
     * AppendFlags
     *
     * @param flags
     *
     */
    AppendFlags: function (flags) {
        flags = flags || 0;
        this.m_drawFlags |= flags;
    },

    /**
     * ClearFlags
     *
     * @param flags
     *
     */
    ClearFlags: function (flags) {
        flags = flags || 0;
        this.m_drawFlags &= ~flags;
    },

    /**
     * SetSprite
     *
     * @param sprite
     *
     */
    SetSprite: function (sprite) {
        this.m_ctx = sprite;
    },

    /**
     * GetSprite
     *
     * @param
     *
     */
    GetSprite: function () {
        return this.m_ctx;
    },

    /**
     * SetDrawScale
     *
     * @param drawScale
     *
     */
    SetDrawScale: function (drawScale) {
        drawScale = drawScale || 0;
        this.m_drawScale = drawScale;
    },

    /**
     * GetDrawScale
     *
     * @param
     *
     */
    GetDrawScale: function () {
        return this.m_drawScale;
    },

    /**
     * SetLineThickness
     *
     * @param lineThickness
     *
     */
    SetLineThickness: function (lineThickness) {
        lineThickness = lineThickness || 0;
        this.m_lineThickness = lineThickness;
        this.m_ctx.strokeWidth = lineThickness;
    },

    /**
     * GetLineThickness
     *
     * @param
     *
     */
    GetLineThickness: function () {
        return this.m_lineThickness;
    },

    /**
     * SetAlpha
     *
     * @param alpha
     *
     */
    SetAlpha: function (alpha) {
        alpha = alpha || 0;
        this.m_alpha = alpha;
    },

    /**
     * GetAlpha
     *
     * @param
     *
     */
    GetAlpha: function () {
        return this.m_alpha;
    },

    /**
     * SetFillAlpha
     *
     * @param alpha
     *
     */
    SetFillAlpha: function (alpha) {
        alpha = alpha || 0;
        this.m_fillAlpha = alpha;
    },

    /**
     * GetFillAlpha
     *
     * @param
     *
     */
    GetFillAlpha: function () {
        return this.m_fillAlpha;
    },

    /**
     * SetXFormScale
     *
     * @param xformScale
     *
     */
    SetXFormScale: function (xformScale) {
        xformScale = xformScale || 0;
        this.m_xformScale = xformScale;
    },

    /**
     * GetXFormScale
     *
     * @param
     *
     */
    GetXFormScale: function () {
        return this.m_xformScale;
    },

    /**
     * DrawPolygon
     *
     * @param vertices
     * @param vertexCount
     * @param color
     *
     */
    DrawPolygon: function (vertices, vertexCount, color) {
        if (!vertexCount) return;
        var s = this.m_ctx,
            drawScale = this.m_drawScale;
        s.beginPath();
        s.strokeStyle = this._color(color.color, this.m_alpha);
        s.moveTo(vertices[0].x * drawScale, vertices[0].y * drawScale);
        for (var i = 1; i < vertexCount; i++) {
            s.lineTo(vertices[i].x * drawScale, vertices[i].y * drawScale);
        }
        s.lineTo(vertices[0].x * drawScale, vertices[0].y * drawScale);
        s.closePath();
        s.stroke();
    },

    /**
     * DrawSolidPolygon
     *
     * @param vertices
     * @param vertexCount
     * @param color
     *
     */
    DrawSolidPolygon: function (vertices, vertexCount, color) {
        if (!vertexCount) return;
        var s = this.m_ctx,
            drawScale = this.m_drawScale;
        s.beginPath();
        s.strokeStyle = this._color(color.color, this.m_alpha);
        s.fillStyle = this._color(color.color, this.m_fillAlpha);
        s.moveTo(vertices[0].x * drawScale, vertices[0].y * drawScale);
        for (var i = 1; i < vertexCount; i++) {
            s.lineTo(vertices[i].x * drawScale, vertices[i].y * drawScale);
        }
        s.lineTo(vertices[0].x * drawScale, vertices[0].y * drawScale);
        s.closePath();
        s.fill();
        s.stroke();
    },

    /**
     * DrawCircle
     *
     * @param center
     * @param radius
     * @param color
     *
     */
    DrawCircle: function (center, radius, color) {
        if (!radius) return;
        var s = this.m_ctx,
            drawScale = this.m_drawScale;
        s.beginPath();
        s.strokeStyle = this._color(color.color, this.m_alpha);
        s.arc(center.x * drawScale, center.y * drawScale, radius * drawScale, 0, Math.PI * 2, true);
        s.closePath();
        s.stroke();
    },

    /**
     * DrawSolidCircle
     *
     * @param center
     * @param radius
     * @param axis
     * @param color
     *
     */
    DrawSolidCircle: function (center, radius, axis, color) {
        if (!radius) return;
        var s = this.m_ctx,
            drawScale = this.m_drawScale,
            cx = center.x * drawScale,
            cy = center.y * drawScale;
        s.moveTo(0, 0);
        s.beginPath();
        s.strokeStyle = this._color(color.color, this.m_alpha);
        s.fillStyle = this._color(color.color, this.m_fillAlpha);
        s.arc(cx, cy, radius * drawScale, 0, Math.PI * 2, true);
        s.moveTo(cx, cy);
        s.lineTo((center.x + axis.x * radius) * drawScale, (center.y + axis.y * radius) * drawScale);
        s.closePath();
        s.fill();
        s.stroke();
    },

    /**
     * DrawSegment
     *
     * @param p1
     * @param p2
     * @param color
     *
     */
    DrawSegment: function (p1, p2, color) {
        var s = this.m_ctx,
            drawScale = this.m_drawScale;
        s.strokeStyle = this._color(color.color, this.m_alpha);
        s.beginPath();
        s.moveTo(p1.x * drawScale, p1.y * drawScale);
        s.lineTo(p2.x * drawScale, p2.y * drawScale);
        s.closePath();
        s.stroke();
    },

    /**
     * DrawTransform
     *
     * @param xf
     *
     */
    DrawTransform: function (xf) {
        var s = this.m_ctx,
            drawScale = this.m_drawScale;
        s.beginPath();
        s.strokeStyle = this._color(0xff0000, this.m_alpha);
        s.moveTo(xf.position.x * drawScale, xf.position.y * drawScale);
        s.lineTo((xf.position.x + this.m_xformScale * xf.R.col1.x) * drawScale, (xf.position.y + this.m_xformScale * xf.R.col1.y) * drawScale);

        s.strokeStyle = this._color(0xff00, this.m_alpha);
        s.moveTo(xf.position.x * drawScale, xf.position.y * drawScale);
        s.lineTo((xf.position.x + this.m_xformScale * xf.R.col2.x) * drawScale, (xf.position.y + this.m_xformScale * xf.R.col2.y) * drawScale);
        s.closePath();
        s.stroke();
    },

    /**
    * _color
    *
    * @param color
    * @param alpha
    *
    */
    _color: function (color, alpha) {
       return "rgba(" + ((color & 0xFF0000) >> 16) + "," + ((color & 0xFF00) >> 8) + "," + (color & 0xFF) + "," + alpha + ")";
    }
};


/**
*  Class b2BodyDef
*
* @param
*
*/
b2BodyDef = Box2D.Dynamics.b2BodyDef = function b2BodyDef() {

    this.position = new b2Vec2(0, 0);
    this.linearVelocity = new b2Vec2(0, 0);
    this.position.Set(0.0, 0.0);
    this.linearVelocity.Set(0, 0);
};
/**
* prototype properties
*
*/
b2BodyDef.prototype = {
    position            : null,
    userData            : null,
    angle               : 0.0,
    linearVelocity      : null,
    angularVelocity     : 0.0,
    linearDamping       : 0.0,
    angularDamping      : 0.0,
    allowSleep          : true,
    awake               : true,
    fixedRotation       : false,
    bullet              : false,
    type                : b2Body.b2_staticBody,
    active              : true,
    inertiaScale        : 1.0
};

/**
*  Class b2ContactImpulse
*
* @param
*
*/
b2ContactImpulse = Box2D.Dynamics.b2ContactImpulse = function b2ContactImpulse() {
    this.normalImpulses = [];
    this.tangentImpulses = [];
    for (var i=0; i<b2Settings.b2_maxManifoldPoints; i++) {
        this.normalImpulses.push(0);
        this.tangentImpulses.push(0);
    }

};
b2ContactImpulse.constructor = b2ContactImpulse;
b2ContactImpulse.prototype = {
   normalImpulses: null,
   tangentImpulses: null
};



   /**
    *  Class b2FixtureDef
    *
    * @param
    *
    */
   b2FixtureDef = Box2D.Dynamics.b2FixtureDef = function b2FixtureDef() {
     this.filter = new b2FilterData();
   };
   b2FixtureDef.prototype = {
       shape         : null,
       userData      : null,
       friction      : 0.2,
       restitution   : 0.0,
       density       : 0.0,
       isSensor      : false,
       filter        : null
   };

/**
*  Class b2Island
*
* @param 
*
*/
b2Island = Box2D.Dynamics.b2Island = function b2Island() {
    this.m_bodies = [];
    this.m_contacts = [];
    this.m_joints = [];
};
b2Island.s_impulse = new b2ContactImpulse();
b2Island.constructor = b2Island;
b2Island.prototype = {
    m_bodies: null,
    m_contacts: null,
    m_joints: null,
    m_bodyCapacity: 0,
    m_contactCapacity: 0,
    m_jointCapacity: 0,
    m_bodyCount: 0,
    m_contactCount: 0,
    m_jointCount: 0,
    m_allocator: null,
    m_listener: null,
    m_contactSolver: null,
    /**
     * Initialize
     *
     * @param bodyCapacity
     * @param contactCapacity
     * @param jointCapacity
     * @param allocator
     * @param listener
     * @param contactSolver
     *
     */
    Initialize: function (bodyCapacity, contactCapacity, jointCapacity, allocator, listener, contactSolver) {
        var i;
        this.m_bodyCapacity = bodyCapacity;
        this.m_contactCapacity = contactCapacity;
        this.m_jointCapacity = jointCapacity;
        this.m_allocator = allocator;
        this.m_listener = listener;
        this.m_contactSolver = contactSolver;
        for (i = this.m_bodies.length; i < bodyCapacity; i++)
            this.m_bodies[i] = null;
        for (i = this.m_contacts.length; i < contactCapacity; i++)
            this.m_contacts[i] = null;
        for (i = this.m_joints.length; i < jointCapacity; i++)
            this.m_joints[i] = null;
    },

    /**
     * Clear
     *
     * @param
     *
     */
    Clear: function () {
        this.m_bodyCount = 0;
        this.m_contactCount = 0;
        this.m_jointCount = 0;
    },

    /**
     * Solve
     *
     * @param step
     * @param gravity
     * @param allowSleep
     *
     */
    Solve: function (step, gravity, allowSleep) {
        var i = 0,
            j = 0,
            b,
            joint;
        for (i = 0;
             i < this.m_bodyCount; ++i) {
            b = this.m_bodies[i];
            if (b.GetType() !== b2Body.b2_dynamicBody) continue;
            b.m_linearVelocity.x += step.dt * (gravity.x + b.m_invMass * b.m_force.x);
            b.m_linearVelocity.y += step.dt * (gravity.y + b.m_invMass * b.m_force.y);
            b.m_angularVelocity += step.dt * b.m_invI * b.m_torque;
            b.m_linearVelocity.Multiply(b2Math.Clamp(1.0 - step.dt * b.m_linearDamping, 0.0, 1.0));
            b.m_angularVelocity *= b2Math.Clamp(1.0 - step.dt * b.m_angularDamping, 0.0, 1.0);
        }
        this.m_contactSolver.Initialize(step, this.m_contacts, this.m_contactCount, this.m_allocator);
        var contactSolver = this.m_contactSolver;
        contactSolver.InitVelocityConstraints(step);
        for (i = 0;
             i < this.m_jointCount; ++i) {
            joint = this.m_joints[i];
            joint.InitVelocityConstraints(step);
        }
        for (i = 0;
             i < step.velocityIterations; ++i) {
            for (j = 0;
                 j < this.m_jointCount; ++j) {
                joint = this.m_joints[j];
                joint.SolveVelocityConstraints(step);
            }
            contactSolver.SolveVelocityConstraints();
        }
        for (i = 0;
             i < this.m_jointCount; ++i) {
            joint = this.m_joints[i];
            joint.FinalizeVelocityConstraints();
        }
        contactSolver.FinalizeVelocityConstraints();
        for (i = 0;
             i < this.m_bodyCount; ++i) {
            b = this.m_bodies[i];
            if (b.GetType() === b2Body.b2_staticBody) continue;
            var translationX = step.dt * b.m_linearVelocity.x,
                translationY = step.dt * b.m_linearVelocity.y;
            if ((translationX * translationX + translationY * translationY) > b2Settings.b2_maxTranslationSquared) {
                b.m_linearVelocity.Normalize();
                b.m_linearVelocity.x *= b2Settings.b2_maxTranslation * step.inv_dt;
                b.m_linearVelocity.y *= b2Settings.b2_maxTranslation * step.inv_dt;
            }
            var rotation = step.dt * b.m_angularVelocity;
            if (rotation * rotation > b2Settings.b2_maxRotationSquared) {
                if (b.m_angularVelocity < 0.0) {
                    b.m_angularVelocity = (-b2Settings.b2_maxRotation * step.inv_dt);
                }
                else {
                    b.m_angularVelocity = b2Settings.b2_maxRotation * step.inv_dt;
                }
            }
            b.m_sweep.c0.SetV(b.m_sweep.c);
            b.m_sweep.a0 = b.m_sweep.a;
            b.m_sweep.c.x += step.dt * b.m_linearVelocity.x;
            b.m_sweep.c.y += step.dt * b.m_linearVelocity.y;
            b.m_sweep.a += step.dt * b.m_angularVelocity;
            b.SynchronizeTransform();
        }
        for (i = 0;
             i < step.positionIterations; ++i) {
            var contactsOkay = contactSolver.SolvePositionConstraints(b2Settings.b2_contactBaumgarte),
                jointsOkay = true;
            for (j = 0;
                 j < this.m_jointCount; ++j) {
                joint = this.m_joints[j];
                var jointOkay = joint.SolvePositionConstraints(b2Settings.b2_contactBaumgarte);
                jointsOkay = jointsOkay && jointOkay;
            }
            if (contactsOkay && jointsOkay) {
                break;
            }
        }
        this.Report(contactSolver.m_constraints);
        if (allowSleep) {
            var minSleepTime = b2Settings.b2_maxFloat,
                linTolSqr = b2Settings.b2_linearSleepTolerance * b2Settings.b2_linearSleepTolerance,
                angTolSqr = b2Settings.b2_angularSleepTolerance * b2Settings.b2_angularSleepTolerance;
            for (i = 0;
                 i < this.m_bodyCount; ++i) {
                b = this.m_bodies[i];
                if (b.GetType() === b2Body.b2_staticBody) {
                    continue;
                }
                if ((b.m_flags & b2Body.e_allowSleepFlag) === 0) {
                    b.m_sleepTime = 0.0;
                    minSleepTime = 0.0;
                }
                if ((b.m_flags & b2Body.e_allowSleepFlag) === 0 || b.m_angularVelocity * b.m_angularVelocity > angTolSqr || b2Math.Dot(b.m_linearVelocity, b.m_linearVelocity) > linTolSqr) {
                    b.m_sleepTime = 0.0;
                    minSleepTime = 0.0;
                }
                else {
                    b.m_sleepTime += step.dt;
                    minSleepTime = b2Math.Min(minSleepTime, b.m_sleepTime);
                }
            }
            if (minSleepTime >= b2Settings.b2_timeToSleep) {
                for (i = 0;
                     i < this.m_bodyCount; ++i) {
                    b = this.m_bodies[i];
                    b.SetAwake(false);
                }
            }
        }
    },

    /**
     * SolveTOI
     *
     * @param subStep
     *
     */
    SolveTOI: function (subStep) {
        var i = 0,
            j = 0;
        this.m_contactSolver.Initialize(subStep, this.m_contacts, this.m_contactCount, this.m_allocator);
        var contactSolver = this.m_contactSolver;
        for (i = 0;
             i < this.m_jointCount; ++i) {
            this.m_joints[i].InitVelocityConstraints(subStep);
        }
        for (i = 0;
             i < subStep.velocityIterations; ++i) {
            contactSolver.SolveVelocityConstraints();
            for (j = 0;
                 j < this.m_jointCount; ++j) {
                this.m_joints[j].SolveVelocityConstraints(subStep);
            }
        }
        for (i = 0;
             i < this.m_bodyCount; ++i) {
            var b = this.m_bodies[i];
            if (b.GetType() === b2Body.b2_staticBody) continue;
            var translationX = subStep.dt * b.m_linearVelocity.x,
                translationY = subStep.dt * b.m_linearVelocity.y;
            if ((translationX * translationX + translationY * translationY) > b2Settings.b2_maxTranslationSquared) {
                b.m_linearVelocity.Normalize();
                b.m_linearVelocity.x *= b2Settings.b2_maxTranslation * subStep.inv_dt;
                b.m_linearVelocity.y *= b2Settings.b2_maxTranslation * subStep.inv_dt;
            }
            var rotation = subStep.dt * b.m_angularVelocity;
            if (rotation * rotation > b2Settings.b2_maxRotationSquared) {
                if (b.m_angularVelocity < 0.0) {
                    b.m_angularVelocity = (-b2Settings.b2_maxRotation * subStep.inv_dt);
                }
                else {
                    b.m_angularVelocity = b2Settings.b2_maxRotation * subStep.inv_dt;
                }
            }
            b.m_sweep.c0.SetV(b.m_sweep.c);
            b.m_sweep.a0 = b.m_sweep.a;
            b.m_sweep.c.x += subStep.dt * b.m_linearVelocity.x;
            b.m_sweep.c.y += subStep.dt * b.m_linearVelocity.y;
            b.m_sweep.a += subStep.dt * b.m_angularVelocity;
            b.SynchronizeTransform();
        }
        var k_toiBaumgarte = 0.75;
        for (i = 0;
             i < subStep.positionIterations; ++i) {
            var contactsOkay = contactSolver.SolvePositionConstraints(k_toiBaumgarte),
                jointsOkay = true;
            for (j = 0;
                 j < this.m_jointCount; ++j) {
                var jointOkay = this.m_joints[j].SolvePositionConstraints(b2Settings.b2_contactBaumgarte);
                jointsOkay = jointsOkay && jointOkay;
            }
            if (contactsOkay && jointsOkay) {
                break;
            }
        }
        this.Report(contactSolver.m_constraints);
    },

    /**
     * Report
     *
     * @param constraints
     *
     */
    Report: function (constraints) {
        if (this.m_listener == null) {
            return;
        }
        for (var i = 0; i < this.m_contactCount; ++i) {
            var c = this.m_contacts[i],
                cc = constraints[i];
            for (var j = 0; j < cc.pointCount; ++j) {
                b2Island.s_impulse.normalImpulses[j] = cc.points[j].normalImpulse;
                b2Island.s_impulse.tangentImpulses[j] = cc.points[j].tangentImpulse;
            }
            this.m_listener.PostSolve(c, b2Island.s_impulse);
        }
    },

    /**
     * AddBody
     *
     * @param body
     *
     */
    AddBody: function (body) {
        body.m_islandIndex = this.m_bodyCount;
        this.m_bodies[this.m_bodyCount++] = body;
    },

    /**
     * AddContact
     *
     * @param contact
     *
     */
    AddContact: function (contact) {
        this.m_contacts[this.m_contactCount++] = contact;
    },

    /**
     * AddJoint
     *
     * @param joint
     *
     */
    AddJoint: function (joint) {
        this.m_joints[this.m_jointCount++] = joint;
    }
};
/**
*  Class b2World
*
* @param gravity
* @param doSleep
*
*/
b2World = Box2D.Dynamics.b2World = function b2World(gravity, doSleep) {
    this.m_stack = [];
    this.m_contactManager = new b2ContactManager();
    this.m_contactSolver = new b2ContactSolver();
    this.m_island = new b2Island();
    this.m_allowSleep = doSleep;
    this.m_gravity = gravity;
    this.m_contactManager.m_world = this;
    var bd = new b2BodyDef();
    this.m_groundBody = this.CreateBody(bd);
};

b2World.s_timestep2 = new b2TimeStep();
b2World.s_xf = new b2Transform();
b2World.s_backupA = new b2Sweep();
b2World.s_backupB = new b2Sweep();
b2World.s_timestep = new b2TimeStep();
b2World.s_queue = [];
b2World.s_jointColor = new b2Color(0.5, 0.8, 0.8);
b2World.e_newFixture = 0x0001;
b2World.e_locked = 0x0002;
b2World.constructor = b2World;
b2World.prototype = {
    m_stack: null,
    m_contactManager: null,
    m_contactSolver: null,
    m_island: null,
    m_destructionListener: null,
    m_debugDraw: null,
    m_bodyList: null,
    m_contactList: null,
    m_jointList: null,
    m_controllerList: null,
    m_bodyCount: 0,
    m_contactCount: 0,
    m_jointCount: 0,
    m_controllerCount: 0,
    m_allowSleep: null,
    m_gravity: null,
    m_inv_dt0: 0.0,
    m_groundBody: null,
    m_warmStarting: true,
    m_continuousPhysics: true,
    /**
     * SetDestructionListener
     *
     * @param listener
     *
     */
    SetDestructionListener: function (listener) {
        this.m_destructionListener = listener;
    },

    /**
     * SetContactFilter
     *
     * @param filter
     *
     */
    SetContactFilter: function (filter) {
        this.m_contactManager.m_contactFilter = filter;
    },

    /**
     * SetContactListener
     *
     * @param listener
     *
     */
    SetContactListener: function (listener) {
        this.m_contactManager.m_contactListener = listener;
    },

    /**
     * SetDebugDraw
     *
     * @param debugDraw
     *
     */
    SetDebugDraw: function (debugDraw) {
        this.m_debugDraw = debugDraw;
    },

    /**
     * SetBroadPhase
     *
     * @param broadPhase
     *
     */
    SetBroadPhase: function (broadPhase) {
        var oldBroadPhase = this.m_contactManager.m_broadPhase;
        this.m_contactManager.m_broadPhase = broadPhase;
        for (var b = this.m_bodyList; b; b = b.m_next) {
            for (var f = b.m_fixtureList; f; f = f.m_next) {
                f.m_proxy = broadPhase.CreateProxy(oldBroadPhase.GetFatAABB(f.m_proxy), f);
            }
        }
    },

    /**
     * Validate
     *
     * @param
     *
     */
    Validate: function () {
        this.m_contactManager.m_broadPhase.Validate();
    },

    /**
     * GetProxyCount
     *
     * @param
     *
     */
    GetProxyCount: function () {
        return this.m_contactManager.m_broadPhase.GetProxyCount();
    },

    /**
     * CreateBody
     *
     * @param def
     *
     */
    CreateBody: function (def) {
        if (this.IsLocked() === true) {
            return null;
        }
        var b = new b2Body(def, this);
        b.m_prev = null;
        b.m_next = this.m_bodyList;
        if (this.m_bodyList) {
            this.m_bodyList.m_prev = b;
        }
        this.m_bodyList = b;
        ++this.m_bodyCount;
        return b;
    },

    /**
     * DestroyBody
     *
     * @param b
     *
     */
    DestroyBody: function (b) {
        if (this.IsLocked() === true) {
            return;
        }
        var jn = b.m_jointList;
        while (jn) {
            var jn0 = jn;
            jn = jn.next;
            if (this.m_destructionListener) {
                this.m_destructionListener.SayGoodbyeJoint(jn0.joint);
            }
            this.DestroyJoint(jn0.joint);
        }
        var coe = b.m_controllerList;
        while (coe) {
            var coe0 = coe;
            coe = coe.nextController;
            coe0.controller.RemoveBody(b);
        }
        var ce = b.m_contactList;
        while (ce) {
            var ce0 = ce;
            ce = ce.next;
            this.m_contactManager.Destroy(ce0.contact);
        }
        b.m_contactList = null;
        var f = b.m_fixtureList;
        while (f) {
            var f0 = f;
            f = f.m_next;
            if (this.m_destructionListener) {
                this.m_destructionListener.SayGoodbyeFixture(f0);
            }
            f0.DestroyProxy(this.m_contactManager.m_broadPhase);
            f0.Destroy();
        }
        b.m_fixtureList = null;
        b.m_fixtureCount = 0;
        if (b.m_prev) {
            b.m_prev.m_next = b.m_next;
        }
        if (b.m_next) {
            b.m_next.m_prev = b.m_prev;
        }
        if (b === this.m_bodyList) {
            this.m_bodyList = b.m_next;
        }
        --this.m_bodyCount;
    },

    /**
     * CreateJoint
     *
     * @param def
     *
     */
    CreateJoint: function (def) {
        var j = b2Joint.Create(def, null);
        j.m_prev = null;
        j.m_next = this.m_jointList;
        if (this.m_jointList) {
            this.m_jointList.m_prev = j;
        }
        this.m_jointList = j;
        ++this.m_jointCount;
        j.m_edgeA.joint = j;
        j.m_edgeA.other = j.m_bodyB;
        j.m_edgeA.prev = null;
        j.m_edgeA.next = j.m_bodyA.m_jointList;
        if (j.m_bodyA.m_jointList) j.m_bodyA.m_jointList.prev = j.m_edgeA;
        j.m_bodyA.m_jointList = j.m_edgeA;
        j.m_edgeB.joint = j;
        j.m_edgeB.other = j.m_bodyA;
        j.m_edgeB.prev = null;
        j.m_edgeB.next = j.m_bodyB.m_jointList;
        if (j.m_bodyB.m_jointList) j.m_bodyB.m_jointList.prev = j.m_edgeB;
        j.m_bodyB.m_jointList = j.m_edgeB;
        var bodyA = def.bodyA,
            bodyB = def.bodyB;
        if (def.collideConnected === false) {
            var edge = bodyB.GetContactList();
            while (edge) {
                if (edge.other === bodyA) {
                    edge.contact.FlagForFiltering();
                }
                edge = edge.next;
            }
        }
        return j;
    },

    /**
     * DestroyJoint
     *
     * @param j
     *
     */
    DestroyJoint: function (j) {
        var collideConnected = j.m_collideConnected;
        if (j.m_prev) {
            j.m_prev.m_next = j.m_next;
        }
        if (j.m_next) {
            j.m_next.m_prev = j.m_prev;
        }
        if (j === this.m_jointList) {
            this.m_jointList = j.m_next;
        }
        var bodyA = j.m_bodyA,
            bodyB = j.m_bodyB;
        bodyA.SetAwake(true);
        bodyB.SetAwake(true);
        if (j.m_edgeA.prev) {
            j.m_edgeA.prev.next = j.m_edgeA.next;
        }
        if (j.m_edgeA.next) {
            j.m_edgeA.next.prev = j.m_edgeA.prev;
        }
        if (j.m_edgeA === bodyA.m_jointList) {
            bodyA.m_jointList = j.m_edgeA.next;
        }
        j.m_edgeA.prev = null;
        j.m_edgeA.next = null;
        if (j.m_edgeB.prev) {
            j.m_edgeB.prev.next = j.m_edgeB.next;
        }
        if (j.m_edgeB.next) {
            j.m_edgeB.next.prev = j.m_edgeB.prev;
        }
        if (j.m_edgeB === bodyB.m_jointList) {
            bodyB.m_jointList = j.m_edgeB.next;
        }
        j.m_edgeB.prev = null;
        j.m_edgeB.next = null;
        b2Joint.Destroy(j, null);
        --this.m_jointCount;
        if (collideConnected === false) {
            var edge = bodyB.GetContactList();
            while (edge) {
                if (edge.other === bodyA) {
                    edge.contact.FlagForFiltering();
                }
                edge = edge.next;
            }
        }
    },

    /**
     * AddController
     *
     * @param c
     *
     */
    AddController: function (c) {
        c.m_next = this.m_controllerList;
        c.m_prev = null;
        this.m_controllerList = c;
        c.m_world = this;
        this.m_controllerCount++;
        return c;
    },

    /**
     * RemoveController
     *
     * @param c
     *
     */
    RemoveController: function (c) {
        if (c.m_prev) c.m_prev.m_next = c.m_next;
        if (c.m_next) c.m_next.m_prev = c.m_prev;
        if (this.m_controllerList === c) this.m_controllerList = c.m_next;
        this.m_controllerCount--;
    },

    /**
     * CreateController
     *
     * @param controller
     *
     */
    CreateController: function (controller) {
        if (controller.m_world !== this) throw new Error("Controller can only be a member of one world");
        controller.m_next = this.m_controllerList;
        controller.m_prev = null;
        if (this.m_controllerList) this.m_controllerList.m_prev = controller;
        this.m_controllerList = controller;
        ++this.m_controllerCount;
        controller.m_world = this;
        return controller;
    },

    /**
     * DestroyController
     *
     * @param controller
     *
     */
    DestroyController: function (controller) {
        controller.Clear();
        if (controller.m_next) controller.m_next.m_prev = controller.m_prev;
        if (controller.m_prev) controller.m_prev.m_next = controller.m_next;
        if (controller === this.m_controllerList) this.m_controllerList = controller.m_next;
        --this.m_controllerCount;
    },

    /**
     * SetWarmStarting
     *
     * @param flag
     *
     */
    SetWarmStarting: function (flag) {
        this.m_warmStarting = flag;
    },

    /**
     * SetContinuousPhysics
     *
     * @param flag
     *
     */
    SetContinuousPhysics: function (flag) {
        this.m_continuousPhysics = flag;
    },

    /**
     * GetBodyCount
     *
     * @param
     *
     */
    GetBodyCount: function () {
        return this.m_bodyCount;
    },

    /**
     * GetJointCount
     *
     * @param
     *
     */
    GetJointCount: function () {
        return this.m_jointCount;
    },

    /**
     * GetContactCount
     *
     * @param
     *
     */
    GetContactCount: function () {
        return this.m_contactCount;
    },

    /**
     * SetGravity
     *
     * @param gravity
     *
     */
    SetGravity: function (gravity) {
        this.m_gravity = gravity;
    },

    /**
     * GetGravity
     *
     * @param
     *
     */
    GetGravity: function () {
        return this.m_gravity;
    },

    /**
     * GetGroundBody
     *
     * @param
     *
     */
    GetGroundBody: function () {
        return this.m_groundBody;
    },

    /**
     * Step
     *
     * @param dt
     * @param velocityIterations
     * @param positionIterations
     *
     */
    Step: function (dt, velocityIterations, positionIterations) {
        dt = dt || 0;
        velocityIterations = velocityIterations || 0;
        positionIterations = positionIterations || 0;
        if (this.m_flags & b2World.e_newFixture) {
            this.m_contactManager.FindNewContacts();
            this.m_flags &= ~b2World.e_newFixture;
        }
        this.m_flags |= b2World.e_locked;
        var step = b2World.s_timestep2;
        step.dt = dt;
        step.velocityIterations = velocityIterations;
        step.positionIterations = positionIterations;
        if (dt > 0.0) {
            step.inv_dt = 1.0 / dt;
        }
        else {
            step.inv_dt = 0.0;
        }
        step.dtRatio = this.m_inv_dt0 * dt;
        step.warmStarting = this.m_warmStarting;
        this.m_contactManager.Collide();
        if (step.dt > 0.0) {
            this.Solve(step);
        }
        if (this.m_continuousPhysics && step.dt > 0.0) {
            this.SolveTOI(step);
        }
        if (step.dt > 0.0) {
            this.m_inv_dt0 = step.inv_dt;
        }
        this.m_flags &= ~b2World.e_locked;
    },

    /**
     * ClearForces
     *
     * @param
     *
     */
    ClearForces: function () {
        for (var body = this.m_bodyList; body; body = body.m_next) {
            body.m_force.SetZero();
            body.m_torque = 0.0;
        }
    },

    /**
     * DrawDebugData
     *
     * @param
     *
     */
    DrawDebugData: function () {
        if (this.m_debugDraw == null) {
            return;
        }
        this.m_debugDraw.m_sprite.graphics.clear();
        var flags = this.m_debugDraw.GetFlags(),
            i = 0,
            b,
            f,
            s,
            j,
            bp,
            invQ = new b2Vec2,
            x1 = new b2Vec2,
            x2 = new b2Vec2,
            xf,
            b1 = new b2AABB(),
            b2 = new b2AABB(),
            vs = [new b2Vec2(0, 0), new b2Vec2(0, 0), new b2Vec2(0, 0), new b2Vec2(0, 0)],
            color = new b2Color(0, 0, 0);
        if (flags & b2DebugDraw.e_shapeBit) {
            for (b = this.m_bodyList;
                 b; b = b.m_next) {
                xf = b.m_xf;
                for (f = b.GetFixtureList();
                     f; f = f.m_next) {
                    s = f.GetShape();
                    if (b.IsActive() === false) {
                        color.Set(0.5, 0.5, 0.3);
                        this.DrawShape(s, xf, color);
                    }
                    else if (b.GetType() === b2Body.b2_staticBody) {
                        color.Set(0.5, 0.9, 0.5);
                        this.DrawShape(s, xf, color);
                    }
                    else if (b.GetType() === b2Body.b2_kinematicBody) {
                        color.Set(0.5, 0.5, 0.9);
                        this.DrawShape(s, xf, color);
                    }
                    else if (b.IsAwake() === false) {
                        color.Set(0.6, 0.6, 0.6);
                        this.DrawShape(s, xf, color);
                    }
                    else {
                        color.Set(0.9, 0.7, 0.7);
                        this.DrawShape(s, xf, color);
                    }
                }
            }
        }
        if (flags & b2DebugDraw.e_jointBit) {
            for (j = this.m_jointList;
                 j; j = j.m_next) {
                this.DrawJoint(j);
            }
        }
        if (flags & b2DebugDraw.e_controllerBit) {
            for (var c = this.m_controllerList; c; c = c.m_next) {
                c.Draw(this.m_debugDraw);
            }
        }
        if (flags & b2DebugDraw.e_pairBit) {
            color.Set(0.3, 0.9, 0.9);
            for (var contact = this.m_contactManager.m_contactList; contact; contact = contact.GetNext()) {
                var fixtureA = contact.GetFixtureA(),
                    fixtureB = contact.GetFixtureB(),
                    cA = fixtureA.GetAABB().GetCenter(),
                    cB = fixtureB.GetAABB().GetCenter();
                this.m_debugDraw.DrawSegment(cA, cB, color);
            }
        }
        if (flags & b2DebugDraw.e_aabbBit) {
            bp = this.m_contactManager.m_broadPhase;
            vs = [new b2Vec2(0, 0), new b2Vec2(0, 0), new b2Vec2(0, 0), new b2Vec2(0, 0)];
            for (b = this.m_bodyList;
                 b; b = b.GetNext()) {
                if (b.IsActive() === false) {
                    continue;
                }
                for (f = b.GetFixtureList();
                     f; f = f.GetNext()) {
                    var aabb = bp.GetFatAABB(f.m_proxy);
                    vs[0].Set(aabb.lowerBound.x, aabb.lowerBound.y);
                    vs[1].Set(aabb.upperBound.x, aabb.lowerBound.y);
                    vs[2].Set(aabb.upperBound.x, aabb.upperBound.y);
                    vs[3].Set(aabb.lowerBound.x, aabb.upperBound.y);
                    this.m_debugDraw.DrawPolygon(vs, 4, color);
                }
            }
        }
        if (flags & b2DebugDraw.e_centerOfMassBit) {
            for (b = this.m_bodyList;
                 b; b = b.m_next) {
                xf = b2World.s_xf;
                xf.R = b.m_xf.R;
                xf.position = b.GetWorldCenter();
                this.m_debugDraw.DrawTransform(xf);
            }
        }
    },

    /**
     * QueryAABB
     *
     * @param callback
     * @param aabb
     *
     */
    QueryAABB: function (callback, aabb) {
        var __this = this,
            broadPhase = __this.m_contactManager.m_broadPhase;

        function WorldQueryWrapper(proxy) {
            return callback(broadPhase.GetUserData(proxy));
        }

        broadPhase.Query(WorldQueryWrapper, aabb);
    },

    /**
     * QueryShape
     *
     * @param callback
     * @param shape
     * @param transform
     *
     */
    QueryShape: function (callback, shape, transform) {
        var __this = this;
        transform = transform || null;
        if (transform == null) {
            transform = new b2Transform();
            transform.SetIdentity();
        }
        var broadPhase = __this.m_contactManager.m_broadPhase;

        function WorldQueryWrapper(proxy) {
            var fixture = (broadPhase.GetUserData(proxy) instanceof b2Fixture ? broadPhase.GetUserData(proxy) : null);
            if (b2Shape.TestOverlap(shape, transform, fixture.GetShape(), fixture.GetBody().GetTransform())) return callback(fixture);
            return true;
        }

        var aabb = new b2AABB();
        shape.ComputeAABB(aabb, transform);
        broadPhase.Query(WorldQueryWrapper, aabb);
    },

    /**
     * QueryPoint
     *
     * @param callback
     * @param p
     *
     */
    QueryPoint: function (callback, p) {
        var __this = this,
            broadPhase = __this.m_contactManager.m_broadPhase;

        function WorldQueryWrapper(proxy) {
            var fixture = (broadPhase.GetUserData(proxy) instanceof b2Fixture ? broadPhase.GetUserData(proxy) : null);
            if (fixture.TestPoint(p)) return callback(fixture);
            return true;
        }

        var aabb = new b2AABB();
        aabb.lowerBound.Set(p.x - b2Settings.b2_linearSlop, p.y - b2Settings.b2_linearSlop);
        aabb.upperBound.Set(p.x + b2Settings.b2_linearSlop, p.y + b2Settings.b2_linearSlop);
        broadPhase.Query(WorldQueryWrapper, aabb);
    },

    /**
     * RayCast
     *
     * @param callback
     * @param point1
     * @param point2
     *
     */
    RayCast: function (callback, point1, point2) {
        var __this = this,
            broadPhase = __this.m_contactManager.m_broadPhase,
            output = new b2RayCastOutput;

        function RayCastWrapper(input, proxy) {
            var userData = broadPhase.GetUserData(proxy),
                fixture = (userData instanceof b2Fixture ? userData : null),
                hit = fixture.RayCast(output, input);
            if (hit) {
                var fraction = output.fraction,
                    point = new b2Vec2((1.0 - fraction) * point1.x + fraction * point2.x, (1.0 - fraction) * point1.y + fraction * point2.y);
                return callback(fixture, point, output.normal, fraction);
            }
            return input.maxFraction;
        }

        var input = new b2RayCastInput(point1, point2);
        broadPhase.RayCast(RayCastWrapper, input);
    },

    /**
     * RayCastOne
     *
     * @param point1
     * @param point2
     *
     */
    RayCastOne: function (point1, point2) {
        var __this = this,
            result;

        function RayCastOneWrapper(fixture, point, normal, fraction) {
            fraction = fraction || 0;
            result = fixture;
            return fraction;
        }

        __this.RayCast(RayCastOneWrapper, point1, point2);
        return result;
    },

    /**
     * RayCastAll
     *
     * @param point1
     * @param point2
     *
     */
    RayCastAll: function (point1, point2) {
        var __this = this,
            result = [];

        function RayCastAllWrapper(fixture, point, normal, fraction) {
            fraction = fraction || 0;
            result[result.length] = fixture;
            return 1;
        }

        __this.RayCast(RayCastAllWrapper, point1, point2);
        return result;
    },

    /**
     * GetBodyList
     *
     * @param
     *
     */
    GetBodyList: function () {
        return this.m_bodyList;
    },

    /**
     * GetJointList
     *
     * @param
     *
     */
    GetJointList: function () {
        return this.m_jointList;
    },

    /**
     * GetContactList
     *
     * @param
     *
     */
    GetContactList: function () {
        return this.m_contactList;
    },

    /**
     * IsLocked
     *
     * @param
     *
     */
    IsLocked: function () {
        return (this.m_flags & b2World.e_locked) > 0;
    },

    /**
     * Solve
     *
     * @param step
     *
     */
    Solve: function (step) {
        var b;
        for (var controller = this.m_controllerList; controller; controller = controller.m_next) {
            controller.Step(step);
        }
        var island = this.m_island;
        island.Initialize(this.m_bodyCount, this.m_contactCount, this.m_jointCount, null, this.m_contactManager.m_contactListener, this.m_contactSolver);
        for (b = this.m_bodyList;
             b; b = b.m_next) {
            b.m_flags &= ~b2Body.e_islandFlag;
        }
        for (var c = this.m_contactList; c; c = c.m_next) {
            c.m_flags &= ~b2Contact.e_islandFlag;
        }
        for (var j = this.m_jointList; j; j = j.m_next) {
            j.m_islandFlag = false;
        }
        var stackSize = this.m_bodyCount,
            stack = this.m_stack;
        for (var seed = this.m_bodyList; seed; seed = seed.m_next) {
            if (seed.m_flags & b2Body.e_islandFlag) {
                continue;
            }
            if (seed.IsAwake() === false || seed.IsActive() === false) {
                continue;
            }
            if (seed.GetType() === b2Body.b2_staticBody) {
                continue;
            }
            island.Clear();
            var stackCount = 0;
            stack[stackCount++] = seed;
            seed.m_flags |= b2Body.e_islandFlag;
            while (stackCount > 0) {
                b = stack[--stackCount];
                island.AddBody(b);
                if (b.IsAwake() === false) {
                    b.SetAwake(true);
                }
                if (b.GetType() === b2Body.b2_staticBody) {
                    continue;
                }
                var other;
                for (var ce = b.m_contactList; ce; ce = ce.next) {
                    if (ce.contact.m_flags & b2Contact.e_islandFlag) {
                        continue;
                    }
                    if (ce.contact.IsSensor() === true || ce.contact.IsEnabled() === false || ce.contact.IsTouching() === false) {
                        continue;
                    }
                    island.AddContact(ce.contact);
                    ce.contact.m_flags |= b2Contact.e_islandFlag;
                    other = ce.other;
                    if (other.m_flags & b2Body.e_islandFlag) {
                        continue;
                    }
                    stack[stackCount++] = other;
                    other.m_flags |= b2Body.e_islandFlag;
                }
                for (var jn = b.m_jointList; jn; jn = jn.next) {
                    if (jn.joint.m_islandFlag === true) {
                        continue;
                    }
                    other = jn.other;
                    if (other.IsActive() === false) {
                        continue;
                    }
                    island.AddJoint(jn.joint);
                    jn.joint.m_islandFlag = true;
                    if (other.m_flags & b2Body.e_islandFlag) {
                        continue;
                    }
                    stack[stackCount++] = other;
                    other.m_flags |= b2Body.e_islandFlag;
                }
            }
            island.Solve(step, this.m_gravity, this.m_allowSleep);
            for (var i = 0; i < island.m_bodyCount; ++i) {
                b = island.m_bodies[i];
                if (b.GetType() === b2Body.b2_staticBody) {
                    b.m_flags &= ~b2Body.e_islandFlag;
                }
            }
        }
        for (i = 0; i < stack.length; ++i) {
            if (!stack[i]) break;
            stack[i] = null;
        }
        for (b = this.m_bodyList; b; b = b.m_next) {
            if (b.IsAwake() === false || b.IsActive() === false) {
                continue;
            }
            if (b.GetType() === b2Body.b2_staticBody) {
                continue;
            }
            b.SynchronizeFixtures();
        }
        this.m_contactManager.FindNewContacts();
    },

    /**
     * SolveTOI
     *
     * @param step
     *
     */
    SolveTOI: function (step) {
        var b,
            fA,
            fB,
            bA,
            bB,
            cEdge,
            j,
            island = this.m_island;
        island.Initialize(this.m_bodyCount, b2Settings.b2_maxTOIContactsPerIsland, b2Settings.b2_maxTOIJointsPerIsland, null, this.m_contactManager.m_contactListener, this.m_contactSolver);
        var queue = b2World.s_queue;
        for (b = this.m_bodyList; b; b = b.m_next) {
            b.m_flags &= ~b2Body.e_islandFlag;
            b.m_sweep.t0 = 0.0;
        }
        var c;
        for (c = this.m_contactList; c; c = c.m_next) {
            c.m_flags &= ~(b2Contact.e_toiFlag | b2Contact.e_islandFlag);
        }
        for (j = this.m_jointList; j; j = j.m_next) {
            j.m_islandFlag = false;
        }
        for (; ;) {
            var minContact = null,
                minTOI = 1.0;
            for (c = this.m_contactList; c; c = c.m_next) {
                if (c.IsSensor() === true || c.IsEnabled() === false || c.IsContinuous() === false) {
                    continue;
                }
                var toi = 1.0;
                if (c.m_flags & b2Contact.e_toiFlag) {
                    toi = c.m_toi;
                }
                else {
                    fA = c.m_fixtureA;
                    fB = c.m_fixtureB;
                    bA = fA.m_body;
                    bB = fB.m_body;
                    if ((bA.GetType() !== b2Body.b2_dynamicBody || bA.IsAwake() === false) && (bB.GetType() !== b2Body.b2_dynamicBody || bB.IsAwake() === false)) {
                        continue;
                    }
                    var t0 = bA.m_sweep.t0;
                    if (bA.m_sweep.t0 < bB.m_sweep.t0) {
                        t0 = bB.m_sweep.t0;
                        bA.m_sweep.Advance(t0);
                    }
                    else if (bB.m_sweep.t0 < bA.m_sweep.t0) {
                        t0 = bA.m_sweep.t0;
                        bB.m_sweep.Advance(t0);
                    }
                    toi = c.ComputeTOI(bA.m_sweep, bB.m_sweep);
                    b2Assert(0.0 <= toi && toi <= 1.0);
                    if (toi > 0.0 && toi < 1.0) {
                        toi = (1.0 - toi) * t0 + toi;
                        if (toi > 1) toi = 1;
                    }
                    c.m_toi = toi;
                    c.m_flags |= b2Contact.e_toiFlag;
                }
                if (b2Settings.b2_epsilon < toi && toi < minTOI) {
                    minContact = c;
                    minTOI = toi;
                }
            }
            if (minContact == null || 1.0 - 100.0 * b2Settings.b2_epsilon < minTOI) {
                break;
            }
            fA = minContact.m_fixtureA;
            fB = minContact.m_fixtureB;
            bA = fA.m_body;
            bB = fB.m_body;
            b2World.s_backupA.Set(bA.m_sweep);
            b2World.s_backupB.Set(bB.m_sweep);
            bA.Advance(minTOI);
            bB.Advance(minTOI);
            minContact.Update(this.m_contactManager.m_contactListener);
            minContact.m_flags &= ~b2Contact.e_toiFlag;
            if (minContact.IsSensor() === true || minContact.IsEnabled() === false) {
                bA.m_sweep.Set(b2World.s_backupA);
                bB.m_sweep.Set(b2World.s_backupB);
                bA.SynchronizeTransform();
                bB.SynchronizeTransform();
                continue;
            }
            if (minContact.IsTouching() === false) {
                continue;
            }
            var seed = bA;
            if (seed.GetType() !== b2Body.b2_dynamicBody) {
                seed = bB;
            }
            island.Clear();
            var queueStart = 0,
                queueSize = 0;
            queue[queueStart + queueSize++] = seed;
            seed.m_flags |= b2Body.e_islandFlag;
            while (queueSize > 0) {
                b = queue[queueStart++];
                --queueSize;
                island.AddBody(b);
                if (b.IsAwake() === false) {
                    b.SetAwake(true);
                }
                if (b.GetType() !== b2Body.b2_dynamicBody) {
                    continue;
                }
                for (cEdge = b.m_contactList;
                     cEdge; cEdge = cEdge.next) {
                    if (island.m_contactCount === island.m_contactCapacity) {
                        break;
                    }
                    if (cEdge.contact.m_flags & b2Contact.e_islandFlag) {
                        continue;
                    }
                    if (cEdge.contact.IsSensor() === true || cEdge.contact.IsEnabled() === false || cEdge.contact.IsTouching() === false) {
                        continue;
                    }
                    island.AddContact(cEdge.contact);
                    cEdge.contact.m_flags |= b2Contact.e_islandFlag;
                    var other = cEdge.other;
                    if (other.m_flags & b2Body.e_islandFlag) {
                        continue;
                    }
                    if (other.GetType() !== b2Body.b2_staticBody) {
                        other.Advance(minTOI);
                        other.SetAwake(true);
                    }
                    queue[queueStart + queueSize] = other;
                    ++queueSize;
                    other.m_flags |= b2Body.e_islandFlag;
                }
                for (var jEdge = b.m_jointList; jEdge; jEdge = jEdge.next) {
                    if (island.m_jointCount === island.m_jointCapacity) continue;
                    if (jEdge.joint.m_islandFlag === true) continue;
                    other = jEdge.other;
                    if (other.IsActive() === false) {
                        continue;
                    }
                    island.AddJoint(jEdge.joint);
                    jEdge.joint.m_islandFlag = true;
                    if (other.m_flags & b2Body.e_islandFlag) continue;
                    if (other.GetType() !== b2Body.b2_staticBody) {
                        other.Advance(minTOI);
                        other.SetAwake(true);
                    }
                    queue[queueStart + queueSize] = other;
                    ++queueSize;
                    other.m_flags |= b2Body.e_islandFlag;
                }
            }
            var subStep = b2World.s_timestep;
            subStep.warmStarting = false;
            subStep.dt = (1.0 - minTOI) * step.dt;
            subStep.inv_dt = 1.0 / subStep.dt;
            subStep.dtRatio = 0.0;
            subStep.velocityIterations = step.velocityIterations;
            subStep.positionIterations = step.positionIterations;
            island.SolveTOI(subStep);
            var i = 0;
            for (i = 0; i < island.m_bodyCount; ++i) {
                b = island.m_bodies[i];
                b.m_flags &= ~b2Body.e_islandFlag;
                if (b.IsAwake() === false) {
                    continue;
                }
                if (b.GetType() !== b2Body.b2_dynamicBody) {
                    continue;
                }
                b.SynchronizeFixtures();
                for (cEdge = b.m_contactList;
                     cEdge; cEdge = cEdge.next) {
                    cEdge.contact.m_flags &= ~b2Contact.e_toiFlag;
                }
            }
            for (i = 0; i < island.m_contactCount; ++i) {
                c = island.m_contacts[i];
                c.m_flags &= ~(b2Contact.e_toiFlag | b2Contact.e_islandFlag);
            }
            for (i = 0; i < island.m_jointCount; ++i) {
                j = island.m_joints[i];
                j.m_islandFlag = false;
            }
            this.m_contactManager.FindNewContacts();
        }
    },

    /**
     * DrawJoint
     *
     * @param joint
     *
     */
    DrawJoint: function (joint) {
        var b1 = joint.GetBodyA(),
            b2 = joint.GetBodyB(),
            xf1 = b1.m_xf,
            xf2 = b2.m_xf,
            x1 = xf1.position,
            x2 = xf2.position,
            p1 = joint.GetAnchorA(),
            p2 = joint.GetAnchorB(),
            color = b2World.s_jointColor;
        switch (joint.m_type) {
            case b2Joint.e_distanceJoint:
                this.m_debugDraw.DrawSegment(p1, p2, color);
                break;
            case b2Joint.e_pulleyJoint:
            {
                var pulley = ((joint instanceof b2PulleyJoint ? joint : null)),
                    s1 = pulley.GetGroundAnchorA(),
                    s2 = pulley.GetGroundAnchorB();
                this.m_debugDraw.DrawSegment(s1, p1, color);
                this.m_debugDraw.DrawSegment(s2, p2, color);
                this.m_debugDraw.DrawSegment(s1, s2, color);
            }
                break;
            case b2Joint.e_mouseJoint:
                this.m_debugDraw.DrawSegment(p1, p2, color);
                break;
            default:
                if (b1 !== this.m_groundBody) this.m_debugDraw.DrawSegment(x1, p1, color);
                this.m_debugDraw.DrawSegment(p1, p2, color);
                if (b2 !== this.m_groundBody) this.m_debugDraw.DrawSegment(x2, p2, color);
        }
    },

    /**
     * DrawShape
     *
     * @param shape
     * @param xf
     * @param color
     *
     */
    DrawShape: function (shape, xf, color) {
        switch (shape.m_type) {
            case b2Shape.e_circleShape:
            {
                var circle = ((shape instanceof b2CircleShape ? shape : null)),
                    center = b2Math.MulX(xf, circle.m_p),
                    radius = circle.m_radius,
                    axis = xf.R.col1;
                this.m_debugDraw.DrawSolidCircle(center, radius, axis, color);
            }
                break;
            case b2Shape.e_polygonShape:
            {
                var i = 0,
                    poly = ((shape instanceof b2PolygonShape ? shape : null)),
                    vertexCount = poly.GetVertexCount(),
                    localVertices = poly.GetVertices(),
                    vertices = [];
                for (i = 0; i < vertexCount; ++i) {
                    vertices.push(b2Math.MulX(xf, localVertices[i]));
                }
                this.m_debugDraw.DrawSolidPolygon(vertices, vertexCount, color);
            }
                break;
            case b2Shape.e_edgeShape:
            {
                var edge = (shape instanceof b2EdgeShape ? shape : null);
                this.m_debugDraw.DrawSegment(b2Math.MulX(xf, edge.GetVertex1()), b2Math.MulX(xf, edge.GetVertex2()), color);
            }
                break;
        }
    }
}
/**
*  Class b2DestructionListener
*
* @param
*
*/
b2DestructionListener = Box2D.Dynamics.b2DestructionListener = function b2DestructionListener() {};

b2DestructionListener.constructor = b2DestructionListener;
b2DestructionListener.prototype = {
    /**
     * SayGoodbyeJoint
     *
     * @param joint
     *
     */
    SayGoodbyeJoint: function (joint) {
    },

    /**
     * SayGoodbyeFixture
     *
     * @param fixture
     *
     */
    SayGoodbyeFixture: function (fixture) {
    }
};
    return Box2D;
}).call(this);
if ('undefined' !== typeof module) {
    module.exports = Box2D;
}