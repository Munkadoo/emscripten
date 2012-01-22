//"use strict";

// XXX FIXME Hardcoded '4' in many places, here and in library_SDL, for RGBA

var LibraryGL = {
  $GL: {
    textures: {},
    textureCounter: 0,
    buffers: {},
    bufferCounter: 0,
  },

  glGetString: function(name_) {
    switch(name_) {
      case Module.ctx.VENDOR:
      case Module.ctx.RENDERER:
      case Module.ctx.VERSION:
        return allocate(intArrayFromString(Module.ctx.getParameter(name_)), 'i8', ALLOC_NORMAL);
      case 0x1F03: // Extensions
        return allocate(intArrayFromString(Module.ctx.getSupportedExtensions().join(' ')), 'i8', ALLOC_NORMAL);
      default:
        throw 'Failure: Invalid glGetString value: ' + name_;
    }
  },

  glGetIntegerv: function(name_, p) {
    switch(name_) {
      case Module.ctx.MAX_TEXTURE_SIZE:
        IHEAP[p] = Module.ctx.getParameter(name_);
        break;
      default:
        throw 'Failure: Invalid glGetIntegerv value: ' + name_;
    }
  },

  glGenTextures__deps: ['$GL'],
  glGenTextures: function(n, textures) {
    for (var i = 0; i < n; i++) {
      var id = GL.textureCounter++;
      GL.textures[id] = Module.ctx.createTexture();
      IHEAP[textures+QUANTUM_SIZE*i] = id;
    }
  },

  glDeleteTextures: function(n, textures) {
    for (var i = 0; i < n; i++) {
      var id = IHEAP[textures+QUANTUM_SIZE*i];
      Module.ctx.deleteTexture(GL.textures[id]);
      delete GL.textures[id];
    }
  },

  glTexImage2D: function(target, level, internalformat, width, height, border, format, type, pixels) {
    if (pixels) {
      pixels = new Uint8Array(IHEAP.slice(pixels, pixels + width*height*4)); // TODO: optimize
    }
    Module.ctx.texImage2D(target, level, internalformat, width, height, border, format, type, pixels);
  },

  glTexSubImage2D: function(target, level, xoffset, yoffset, width, height, format, type, pixels) {
    if (pixels) {
      pixels = new Uint8Array(IHEAP.slice(pixels, pixels + width*height*4)); // TODO: optimize
    }
    Module.ctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels);
  },

  glBindTexture: function(target, texture) {
    Module.ctx.bindTexture(target, GL.textures[texture]);
  },

  glGenBuffers__deps: ['$GL'],
  glGenBuffers: function(n, buffers) {
    for (var i = 0; i < n; i++) {
      var id = GL.bufferCounter++;
      GL.buffers[id] = Module.ctx.createBuffer();
      IHEAP[buffers+QUANTUM_SIZE*i] = id;
    }
  },

  glDeleteBuffers: function(n, buffers) {
    for (var i = 0; i < n; i++) {
      var id = IHEAP[buffers+QUANTUM_SIZE*i];
      Module.ctx.deleteBuffer(GL.buffers[id]);
      delete GL.buffers[id];
    }
  },

  glBufferData: function(target, size, data, usage) {
    var buf = new ArrayBuffer(size);
    var dataInBuf = new Uint8Array(buf);
    for (var i = 0; i < size; ++i) {
      dataInBuf[i] = IHEAP[data+QUANTUM_SIZE*i];
    }
    Module.ctx.bufferData(target, buf, usage);
  },

  glGetUniformLocation: function(program, name) {
    name = Pointer_stringify(name);
    return Module.ctx.getUnifromLocation(program, name);
  },

  glUniform1f: function(Location, v0) {
    Module.ctx.uniform1f(Location, v0);
  },

  glUniform2f: function(Location, v0, v1) {
    Module.ctx.uniform2f(Location, v0, v1);
  },

  glUniform3f: function(Location, v0, v1, v2) {
    Module.ctx.uniform3f(Location, v0, v1, v2);
  },

  glUniform4f: function(Location, v0, v1, v2, v3) {
    Module.ctx.uniform4f(Location, v0, v1, v2, v3);
  },

  glUniform1i: function(Location, v0) {
    Module.ctx.uniform1i(Location, v0);
  },

  glUniform2i: function(Location, v0, v1) {
    Module.ctx.uniform2i(Location, v0, v1);
  },

  glUniform3i: function(Location, v0, v1, v2) {
    Module.ctx.uniform3i(Location, v0, v1, v2);
  },

  glUniform4i: function(Location, v0, v1, v2, v3) {
    Module.ctx.uniform4i(Location, v0, v1, v2, v3);
  },

  glUniform1fv: function(Location, count, value) {
    value = new Float32Array(IHEAP.slice(value, value + count*4)); // TODO: optimize
    Module.ctx.uniform1fv(Location, value);
  },

  glUniform2fv: function(Location, count, value) {
    value = new Float32Array(IHEAP.slice(value, value + count*4)); // TODO: optimize
    Module.ctx.uniform2fv(Location, value);
  },

  glUniform3fv: function(Location, count, value) {
    value = new Float32Array(IHEAP.slice(value, value + count*4)); // TODO: optimize
    Module.ctx.uniform3fv(Location, value);
  },

  glUniform4fv: function(Location, count, value) {
    value = new Float32Array(IHEAP.slice(value, value + count*4)); // TODO: optimize
    Module.ctx.uniform4fv(Location, value);
  },

  glUniform1fi: function(Location, count, value) {
    value = new Uint32Array(IHEAP.slice(value, value + count*4)); // TODO: optimize
    Module.ctx.uniform1fi(Location, value);
  },

  glUniform2fi: function(Location, count, value) {
    value = new Uint32Array(IHEAP.slice(value, value + count*4)); // TODO: optimize
    Module.ctx.uniform2fi(Location, value);
  },

  glUniform3fi: function(Location, count, value) {
    value = new Uint32Array(IHEAP.slice(value, value + count*4)); // TODO: optimize
    Module.ctx.uniform3fi(Location, value);
  },

  glUniform4fi: function(Location, count, value) {
    value = new Uint32Array(IHEAP.slice(value, value + count*4)); // TODO: optimize
    Module.ctx.uniform4fi(Location, value);
  },

  glUniformMatrix2fv: function(Location, count, transpose, value) {
    value = new Float32Array(IHEAP.slice(value, value + count*4)); // TODO: optimize
    Module.ctx.uniformMatrix2fv(Location, transpose, value);
  },

  glUniformMatrix3fv: function(Location, count, transpose, value) {
    value = new Float32Array(IHEAP.slice(value, value + count*4)); // TODO: optimize
    Module.ctx.uniformMatrix3fv(Location, transpose, value);
  },

  glUniformMatrix4fv: function(Location, count, transpose, value) {
    value = new Float32Array(IHEAP.slice(value, value + count*4)); // TODO: optimize
    Module.ctx.uniformMatrix4fv(Location, transpose, value);
  },

  glBindBuffer: function(target, buffer) {
    Module.ctx.bindBuffer(target, GL.buffers[buffer]);
  },

  glVertexAttrib1f: function(index, v0) {
    Module.ctx.vertexAttrib1f(index, v0);
  },

  glVertexAttrib2f: function(index, v0, v1) {
    Module.ctx.vertexAttrib2f(index, v0, v1);
  },

  glVertexAttrib3f: function(index, v0, v1, v2) {
    Module.ctx.vertexAttrib3f(index, v0, v1, v2);
  },

  glVertexAttrib4f: function(index, v0, v1, v2, v3) {
    Module.ctx.vertexAttrib4f(index, v0, v1, v2, v3);
  },

  glVertexAttrib1fv: function(index, v) {
    v = new Float32Array(IHEAP.slice(v, value + 1*4)); // TODO: optimize
    Module.ctx.vertexAttrib1fv(index, v);
  },

  glVertexAttrib2fv: function(index, v) {
    v = new Float32Array(IHEAP.slice(v, value + 2*4)); // TODO: optimize
    Module.ctx.vertexAttrib2fv(index, v);
  },

  glVertexAttrib3fv: function(index, v) {
    v = new Float32Array(IHEAP.slice(v, value + 3*4)); // TODO: optimize
    Module.ctx.vertexAttrib3fv(index, v);
  },

  glVertexAttrib4fv: function(index, v) {
    v = new Float32Array(IHEAP.slice(v, value + 4*4)); // TODO: optimize
    Module.ctx.vertexAttrib4fv(index, v);
  },

  glVertexAttribPointer: function(index, size, type, normalized, stride, pointer) {
    Module.ctx.vertexAttribPointer(index, size, type, normalized, stride, pointer);
  },

  glEnableVertexAttribArray: function(index) {
    Module.ctx.enableVertexAttribArray(index);
  },

  glDisableVertexAttribArray: function(index) {
    Module.ctx.disableVertexAttribArray(index);
  },

  glClearColor: function(red, green, blue, alpha) {
    Module.ctx.clearColor(red, green, blue, alpha);
  },

  glClear: function(mask) {
    Module.ctx.clear(mask);
  },

  glEnable: function(cap) {
    Module.ctx.enable(cap);
  },

  glScissor: function(x, y, width, height) {
    Module.ctx.scissor(x, y, width, height);
  },

};

// Ignored stubs for fixed-function pipeline. We will need to emulate this
'begin end matrixMode loadIdentity ortho color3f texCoord2f vertex2f blendFunc pushMatrix popMatrix translatef scalef color4ub enableClientState disableClientState vertexPointer colorPointer normalPointer texCoordPointer drawArrays clientActiveTexture_'.split(' ').forEach(function(name_) {
  var cName = 'gl' + name_[0].toUpperCase() + name_.substr(1);
  LibraryGL[cName] = function(){};
});

// Simple pass-through functions
[[0, 'shadeModel fogi fogfv'],
 [1, 'clearDepth depthFunc enable disable frontFace cullFace'],
 [2, 'pixelStorei'],
 [3, 'texParameteri texParameterf'],
 [4, 'viewport clearColor']].forEach(function(data) {
  var num = data[0];
  var names = data[1];
  var args = range(num).map(function(i) { return 'x' + i }).join(', ');
  var stub = '(function(' + args + ') { ' + (num > 0 ? 'Module.ctx.NAME(' + args + ')' : '') + ' })';
  names.split(' ').forEach(function(name_) {
    var cName = 'gl' + name_[0].toUpperCase() + name_.substr(1);
    LibraryGL[cName] = eval(stub.replace('NAME', name_));
    //print(cName + ': ' + LibraryGL[cName]);
  });
});

mergeInto(LibraryManager.library, LibraryGL);

