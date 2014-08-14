/**=========================================================
  python 2.7.6 学习
  
  Author      paper
  Date        2014-08
  Site        https://github.com/paper
  
  Reference   http://www.liaoxuefeng.com/wiki/001374738125095c955c1e6d8bb493182103fac9270762a000
              http://woodpecker.org.cn/diveintopython/
              https://www.python.org/
              http://www.pythondoc.com/pythontutorial27/
============================================================*/
(function(global, undefined){
  
  global.Py = {};
  
  /*------------------------
    Python 字符串对象
    
    py_str = new Py.string(str);
  -------------------------*/
  Py.string = function(str){
    /*
      这种写法可以避免用户忘记了写new，但是不利于写继承
      
      // 写了new
      if (this instanceof Py.string){
        this.str = str;
      }
      // 忘记写new
      else{
        return new Py.string(str);
      }
    */
    
    this.str = str;
  }
  
  Py.string.prototype = {
    type : "string",
    
    value : function(){
      return this.str;
    },
    
    /*-----------------------------------------------
      Python 允许用r''表示''内部的字符串默认不转义
      
      说明：
      \b 退格      \f 走纸换页   \n 换行
      \r 回车      \t 横向跳格   \' 单引号
      \" 双引号    \\ 反斜杠
    -------------------------------------------------*/
    r : function(){
      var t = {
        '\b' : '\\b',
        '\f' : '\\f',
        '\n' : '\\n',
        '\r' : '\\r',
        '\t' : '\\t',
        '\'' : '\\\'',
        '\"' : '\\\"',
        '\\' : '\\\\'
      }
      
      this.str = this.str.replace(/[\b\f\n\r\t\'\"\\]/g, function(a, b){
        return t[a];
      });
    
      return this;
    }
  }
  
  /*------------------------
    Python list对象
    
    py_list = new Py.list(arr);
  ------------------------*/
  Py.list = function(arr){
    this.list = arr;
  }

  Py.list.prototype = {
    type : "list",
    
    value : function(){
      return this.list;
    },
    
    // py_list.len(); 获得list元素的个数
    len : function(){
      return this.list.length;
    },
    
    // 判断 下标index，是不是在 self的范围内
    _checkIndex : function(index, self){
      self = self || this;
      
      try{
        var len = self.len();
      }catch(e){
        throw new Error("TypeError: 'this' is not list or tuple");
      }
      
      if( index > len-1 || index < -1 * len ){
        throw new Error("IndexError: list index out of range");
      }
      
      return true;
    },
    
    // py_list.get(1);      list[1]
    // py_list.get(1, 0);   list[1][0]
    get : function(){
      var args = arguments;
      var argsLength = args.length;
      var i = 0;
      var self = this;
      var result = this;
      
      function getIn(){
        if( i >= argsLength ) return;
        
        var index = args[i];
        
        if( self._checkIndex(index, result) ){
          var value = result.value();
          var len = result.len();
          
          result = index >= 0 ? value[index] : value[len + index];
          i++;
          getIn();
        }
        
      }//end getIn
      
      getIn();
      
      return result;
      
    },
    
    // py_list.set(1, "a");     list[1] = "a"
    // py_list.set(1, 0, "a");  list[1][0] = "a"
    set : function(){
      var args = arguments;
      var argsLength = args.length;
      var elem = args[argsLength-1];
      var i = 0;
      var self = this;
      var result = this;
      
      function setIn(){
        var index = args[i];
        
        if( self._checkIndex(index, result) ){
          var value = result.value();
          var len = result.len();
          
          if( value[index].type === "tuple" ){
            throw new Error("TypeError: 'tuple' object does not support item assignment");
          }
          
          result = index >= 0 ? value[index] : value[len + index];
          i++;
          
          if( i == argsLength - 1 ){
            index >= 0 ? value[index] = elem : value[len + index] = elem;
            return;
          }
          
          setIn();
        }
        
      }//end setIn
      
      setIn();
    },
    
    // py_list.slice("[1:3]");
    slice : function(sliceStr){
      var num = sliceStr.split(":");
      var n1 = num[0];
      var n2 = num[1];
    },
     
    // append 往list中追加元素到末尾
    // js push之后返回新的长度，py append之后返回 None
    append : function(elem){
      this.list.push(elem);
      return this;
    },
    
    pop : function(index){
      index = index === undefined ? -1 : index;
      return this.list.splice(index, 1)[0];
    },
    
    extend : function(elem){
      this.list = this.list.concat(elem);
      return this;
    },
    
    // insert 将单个元素插入到 list 中。数值参数是插入点的索引
    insert : function(index, elem){
      this.list.splice(index, 0, elem);
      return this;
    }
    
  }//end Py.list.prototype
  
  /*------------------------
    Python *tuple对象 (待考虑)
  ------------------------*/
  Py.tuple = function(arr){
    Py.list.call(this, arr);
  }
  
  Py.tuple.prototype = new Py.list();
  
  Py.tuple.prototype.append = null;
  Py.tuple.prototype.pop = null;
  Py.tuple.prototype.extend = null;
  Py.tuple.prototype.insert = null;
  
  Py.tuple.prototype.type = "tuple";
  
  
  /*------------------------
    Python dict
    
    py_dict = new Py.dict(obj);
  ------------------------*/
  Py.dict = function(obj){
    this.dict = obj;
  }
  
  Py.dict.prototype = {
    type : "dict",
    
    value : function(){
      return this.dict;
    },
    
    // dict同样需要支持 dict['a'][0] 这种形式，但前面list已经写了
    // dict只要类似的写就可以了，这里不再重复
    
    // py_dict.set('a', 123) => dict['a'] = 123
    set : function(key, value){
      this.dict[key] = value;
    },
    
    // py_dict.get('a') => dict['a'] or dict.get(key, value);
    get : function(key, value){
      return this.dict[key] === undefined ? value : this.dict[key];
    },

    pop : function(key){
      if( this.dict[key] === undefined ){
        throw new Error('KeyError: "'+ key +'"');
      }
      
      delete this.dict[key];
    }
    
  }//end Py.dict.prototype
  
  
  /*------------------------
    Python set (New in version 2.3)
    http://www.pythondoc.com/pythontutorial27/datastructures.html#tut-sets
    
    参数是list或者字符串，只要是元素内容不可变就行
    str不可变的，list是可变的，所以set的参数如果是list包含了list，就会报错
    
    py_set = new Py.set([1,2,3]); // or (1,2,3), 'abc'
  ------------------------*/
  Py.set = function(arr){
    this.set = arr;
  }
  
  Py.set.prototype = {
    type : "set",
    
    value : function(){
      return this.set;
    },
    
    
    
  }//end Py.dict.prototype
  
  
 
  
})(this);
