###
###
class MersenneTwister

  # Period parameters
  N = 624
  M = 397
  MATRIX_A = 0x9908b0df     # constant vector a
  UPPER_MASK = 0x80000000   # most significant w-r bits
  LOWER_MASK = 0x7fffffff   # least significant r bits

  mt:   null                # the array for the state vector
  mti:  N+1                 # mti==N+1 means mt[N] is not initialized


  constructor: (seed) ->
    @mt = [0...N]
    switch (typeof seed)
      when 'number' then @init_genrand(seed)
      when 'object' then @init_genrand(seed, seed.length)
      else @init_genrand(Date.now() % LOWER_MASK)


  ###
   * Generates a random boolean value.
  ###
  nextBool: ->
    return (@genrand_int32() & 1) is 1

  ###
   * Generates a random real value from 0.0, inclusive, to 1.0, exclusive.
  ###
  nextDouble: ->
    return @genrand_res53()

  ###
   * Generates a random int value from 0, inclusive, to max, exclusive.
  ###
  nextInt: (max) ->
    #return Math.floor(@genrand_res53() * max)
    return ~~(@genrand_res53() * max)


  ###
   * initializes mt[N] with a seed
  ###
  init_genrand: (s) ->
    @mt[0] = s & 0xffffffff
    @mti = 1
    while (@mti < N)
      @mt[@mti] =
        (1812433253 * (@mt[@mti-1] ^ (@mt[@mti-1] >> 30)) + @mti)
      ###
      # See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. #
      # In the previous versions, MSBs of the seed affect   #
      # only MSBs of the array mt[].                        #
      # 2002/01/09 modified by Makoto Matsumoto             #
      ###
      @mt[@mti] &= 0xffffffff
      ###
      # for >32 bit machines #
      ###
      @mti++

    return

  # initialize by an array with array-length
  # init_key is the array for initializing keys
  # key_length is its length
  # slight change for C++, 2004/2/26
  init_by_array: (init_key, key_length) ->
    @init_genrand(19650218)
    i=1
    j=0
    k = if N>key_length then N else key_length
    while (k>0)
      @mt[i] = (@mt[i] ^ ((@mt[i-1] ^ (@mt[i-1] >> 30)) * 1664525)) + init_key[j] + j # non linear
      @mt[i] &= 0xffffffff # for WORDSIZE > 32 machines
      i++
      j++
      if (i>=N)
        @mt[0] = @mt[N-1]
        i=1
      if (j>=key_length) then j=0
      k--

    k=N-1
    while (k>0)
      @mt[i] = (@mt[i] ^ ((@mt[i-1] ^ (@mt[i-1] >> 30)) * 1566083941)) - i # non linear
      @mt[i] &= 0xffffffff
      i++
      if (i>=N)
        @mt[0] = @mt[N-1]
        i=1
      k--
    @mt[0] = 0x80000000 # MSB is 1; assuring non-zero initial array
    return

  ###
   * generates a random number on [0,0xffffffff]-interval
  ###
  genrand_int32: ->
    mag01 = [0x0, MATRIX_A]

    if (@mti >= N) # generate N words at one time */

      if (@mti is N + 1) # if init_genrand() has not been called,
        @init_genrand(5489) # a default initial seed is used

      kk = 0
      while (kk < N - M)
        y = (@mt[kk] & UPPER_MASK) | (@mt[kk + 1] & LOWER_MASK)
        @mt[kk] = @mt[kk + M] ^ (y >> 1) ^ mag01[y & 0x1]
        kk++

      while (kk < N - 1)
        y = (@mt[kk] & UPPER_MASK) | (@mt[kk + 1] & LOWER_MASK)
        @mt[kk] = @mt[kk + (M - N)] ^ (y >> 1) ^ mag01[y & 0x1]
        kk++

      y = (@mt[N - 1] & UPPER_MASK) | (@mt[0] & LOWER_MASK)
      @mt[N - 1] = @mt[M - 1] ^ (y >> 1) ^ mag01[y & 0x1]

      @mti = 0

    y = @mt[@mti++] # enforce 32 bit range
    # Tempering
    y ^= (y >> 11)
    y ^= ((y << 7) & 0x9d2c5680)
    y ^= ((y << 15) & 0xefc60000)
    y ^= (y >> 18)

    return y >> 0

  ###
  * generates a random number on [0,0x7fffffff]-interval
  ###
  genrand_int31: ->
    return (@genrand_int32() >> 1)

  ###
   * generates a random number on [0,1]-real-interval
  ###
  genrand_real1: ->
    return @genrand_int32() * (1.0 / 4294967296.0)
    # divided by 2^32-1

  ###
   * generates a random number on [0,1)-real-interval
  ###
  genrand_real2: ->
    return @genrand_int32() * (1.0 / 4294967296.0)
    # divided by 2^32

  ###
   * generates a random number on (0,1)-real-interval
  ###
  genrand_real3: ->
    return (@genrand_int32() + 0.5) * (1.0 / 4294967296.0)
    # divided by 2^32

  ###
   * generates a random number on [0,1) with 53-bit resolution
  ###
  genrand_res53: ->
    a = @genrand_int32() >> 5
    b = @genrand_int32() >> 6
    return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0)


###
# These real versions are due to Isaku Wada, 2002/01/09 added
###