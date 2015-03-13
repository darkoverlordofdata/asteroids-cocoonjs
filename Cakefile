fs = require('fs')
path = require('path')
{exec} = require('child_process')
options = {}
###> ========================================================================
    Build the coffeescript classes
======================================================================== <###
#task 'buildcoffee', 'build box2d', ->
#
#  src = [String(fs.readFileSync('./coffee/Box2D.coffee'))]
#  filelist = String(fs.readFileSync('./coffee/filelist'))
#
#  for f in filelist.split('\n')
#    src.push(path.basename(f) + " = " + String(fs.readFileSync(f+'.coffee')))
#
#  fs.writeFileSync("./tmp/Box2D.coffee", src.join('\n'))
#  exec "coffee --output ./web -c ./tmp/Box2D.coffee"

###> ========================================================================
    Build the javascript classes
======================================================================== <###
task 'buildjs', 'build box2d', ->   _buildjs()


###> ========================================================================
    parse the javascript library
======================================================================== <###

namespace = ['Box2D']
classes = []
option '-o', '--override', 'use overrides'
task 'redux', 'Redux the box2sweb library', (o) ->
  options = o

  namespace = ['Box2D']   # namespace root
  classes = []            # list of classes
  tab = '   '             # 3 spaces per tab
  ###
   *
   * Load modified Box2dWeb-2.1.a.3.js:
   *
   *  Crashes in node.js:
   *
   *     22   if(!(Object.prototype.defineProperty instanceof Function)
   *
   *    should be
   *
   *     22   if(!(Object.defineProperty instanceof Function)
   *
   *  Comment out so we can process the postDefs:
   *
   *  10866   //delete Box2D.postDefs;
   *
   *
  ###
#  eval(String(fs.readFileSync('./src/box2d_web.js')))
#  loadClasses Box2D

  ###
   * Hold your bits - mikolalysenko has already done this!
  ###
  Box2D = require('box2dweb')

  postDefs = []
  statics = {}
  for postDef in Box2D.postDefs
    def = postDef.toString().split('\n')
    def.pop()
    def.shift()
    for line, ix in def
      def[ix] = line.replace('      Box2D.', 'Box2D.')


    for line in def
      val = line.split(/\s*=\s*/)
      ns = val[0].split('.')
      key = ns[ns.length-2]
      statics[key] ?= []
      statics[key].push val



  ###
   * re-write each class
  ###
  for klass in classes

    continue if klass.namespace is 'Box2D.postDefs'

    pathname = './'+(klass.namespace.replace(/\./g,'/').replace('Box2D','lib'))+'/'
    src = klass.src[klass.name]
    code = [] # output
    foundSuper = false


    if 'function' is typeof src
      ###
       *  constructor:
       *
       *  Combine constructor and initializers
       *
       *  function b2ClassName.b2ClassName() {
      ###
      ctor = klass.src[klass.name]
      ctor = ctor.toString().split(/\n/)
      ctor.pop()    # remove start block
      ctor.shift()  # remove end block
      uber = klass.src.prototype.__super?.constructor
      ###
      # remove this super
      ###
      if uber?
        m1 = klass.namespace+'.'+uber.name+'.'+uber.name+'.apply(this, arguments);'
        for line, ix in ctor
          if line.indexOf(m1) >= 0
            ctor[ix] = ''


      ###
       * initialization
       *
       * transform this super call
      ###
      args = ''
      init = []
      if klass.src.prototype[klass.name]
        func = klass.src.prototype[klass.name].toString()
        args = func.substring(func.indexOf('(')+1, func.indexOf(')'))
        func = func.replace(args, '')
        func = func.replace('function () {','').replace(/}$/, '')

        init = func.split('\n')
        init.pop()    # remove start block
        init.shift()  # remove end block
        ###
        # replace super
        ###
        if uber?
          m2 = 'this.__super.' + uber.name + '.call(this'
          for line, ix in init
            if line.indexOf(m2) >= 0
              init[ix] = line.replace(m2, uber.name+'.call(this')
              foundSuper = true

      if uber? and not foundSuper
        init.unshift tab+tab+uber.name+'.apply(this, arguments);'


      ###
       * The constructor
       *
      ###
      if options.override and fs.existsSync(pathname+klass.name+'_ctor.js')
        code.push String(fs.readFileSync(pathname+klass.name+'_ctor.js'))
      else
        code.push ''
        code.push '   /**'
        code.push '    *  Class '+klass.name
        code.push '    *'
        for param in args.split(/\s*,\s*/)
          code.push '    * @param ' + param
        code.push '    *'
        code.push '    */'
        code.push tab + klass.name + ' = ' + klass.namespace + '.' + klass.name + ' = function '+klass.name+'('+args+'){'
        code.push _optimize(ctor.join('\n'))
        code.push _optimize(init.join('\n'))
        code.push tab + '};'
        code.push tab + klass.name + '.constructor = '+klass.name+';'
        if uber?
          code.push tab + klass.name + '.prototype = Object.create('+uber.name+'.prototype );'


      ###
       *
       *  Static Fields
       *
      ###
      if statics[klass.name]?
        code.push ''
        for val in statics[klass.name]
          ns = val[0].split('.')
          if val[1].indexOf(klass.name) >= 0
            postDefs.push val
          else
            code.push tab+klass.name+'.'+ns[ns.length-1]+' = '+val[1]


      ###
       *
       *  Instance Fields
       *
      ###
      if fs.existsSync(pathname+klass.name+'.properties.js')
        props = String(fs.readFileSync(pathname+klass.name+'.properties.js'))
        code.push ''
        for prop in props.split('\n')
          code.push tab+klass.name+'.prototype.'+prop


      ###
       * Static Members
      ###
      for methodName, method of klass.src
        if methodName isnt klass.name
          if 'function' is typeof method
            func = method.toString()
            args = func.substring(func.indexOf('(')+1, func.indexOf(')'))
            func = func.split('\n')

            code.push ''
            code.push '   /**'
            code.push '    * Static '+methodName
            code.push '    *'
            for param in args.split(/\s*,\s*/)
              code.push '    * @param ' + param
            code.push '    *'
            code.push '    */'
            code.push tab + klass.name + '.' + methodName + ' = ' + _optimize(func.join('\n')) + ';'


      ###
       * The remaining methods
       * Transform super calls
      ###
      for methodName, method of klass.src.prototype
        if methodName isnt '__super' and methodName isnt 'constructor' and methodName isnt klass.name
          func = method.toString()
          args = func.substring(func.indexOf('(')+1, func.indexOf(')'))

          func = method.toString().split('\n')
          if uber?
            m3 = 'this.__super.' + methodName + '.call(this'

            for line, ix in func
              if line.indexOf(m3) >= 0
                func[ix] = line.replace(m3, uber.name+'.prototype.'+methodName+'.call(this')

          code.push ''
          code.push '   /**'
          code.push '    * '+methodName
          code.push '    *'
          for param in args.split(/\s*,\s*/)
            code.push '    * @param ' + param
          code.push '    *'
          code.push '    */'
          code.push tab + klass.name + '.prototype.' + methodName + ' = ' + _optimize(func.join('\n')) + ';'


      prog = []
      prog.push _optimize(code.join('\n'))
      while (val = postDefs.pop())
        ns = val[0].split('.')
        prog.push tab+klass.name+'.'+ns[ns.length-1]+' = '+val[1]

      fs.writeFileSync(pathname+klass.name+'.js', prog.join('\n'))

  _buildjs()


###
 * Build the final output
###
_buildjs = ->


  src = []
  filelist = String(fs.readFileSync('./lib/filelist'))

  for f in filelist.split('\n')
    src.push(String(fs.readFileSync(f+'.js')))

  template = String(fs.readFileSync('./lib/template.js'))
  .replace("'{% Box2D %}'", src.join('\n'))

  fs.writeFileSync("./web/packages/box2d/Box2D.js", template)


###
 * Traverse pojs object tree
###
loadClasses = (obj) ->

  return unless obj?
  for name, member of obj
    if 'function' is typeof member # this is a class
      classes.push({namespace: namespace.join('.'), name: name, src: member})
    else
      namespace.push(name)
      for key, val of member
        if 'object' is typeof val
          #
          # recursively process nodes
          #
          namespace.push(key)
          loadClasses(val)
        else
          classes.push({namespace: namespace.join('.'), name: key, src: val})
      namespace.pop()
  namespace.pop()
  return


###> ========================================================================
 * Optimizations
======================================================================== <###
_optimize = (s) ->
  if options.override?
    _rule2 _rule1 s
  else
    s

###> ========================================================================
 * Rule 1
 *
 *  > if (x === undefined) x = 0;
 *
 *  < x = x || 0;
 *
======================================================================== <###
_rule1 = (s) ->
  op = /if\s*\(\s*([A-Za-z0-9._]*)\s*===\s*undefined\s*\)\s*([A-Za-z0-9._]*)\s*=\s*([A-Za-z0-9._]*)\s*;/

  re = ($0, $1, $2, $3) ->
    if $1 is $2
      "#{$1} = #{$1} || #{$3};"
    else
      $0

  if 'string' is typeof s
    if s.indexOf('\n')
      s1 = s.split('\n')
      for s2, index in s1
        if op.test(s2)
          s1[index] = s2.replace(op, re)
      s = s1.join('\n')

    else
      if op.test(s)
        s = s.replace(op, re)
  else
    for s1, index in s
      if op.test(s)
        s[index] = s1.replace(op, re)

  return s
###> ========================================================================
 * Rule 2
 *
 *  > var x1...;
 *  > var x2...;
 *
 *  < var x1...,
 *  <     x2...;
 *
======================================================================== <###
_rule2 = (s) ->
  if 'string' is typeof s
    if s.indexOf('\n')
      s = __rule2(s.split('\n')).join('\n')
  else
    s = __rule2(s)
  return s

__rule2 = (lines) ->
  op = /^\s*var\s*.*;$/
  re1 = /^\s*(var)\s*/
  re2 = /;$/

  flag = new Array(lines.length)
  for line, index in lines
      flag[index] = op.test(line)

  for line, index in lines
    if flag[index]
      if index < lines.length-1
        if flag[index+1]
          lines[index] = line.replace(re2, ',')

  for line, index in lines
    if flag[index]
      if index > 0
        if flag[index-1]
          lines[index] = line.replace(re1, '          ')

  return lines


