/**=========================================================
  python 2.7.6 学习
  
  Author      paper
  Date        2014-08
  Site        https://github.com/paper
  
  Reference   http://www.liaoxuefeng.com/wiki/001374738125095c955c1e6d8bb493182103fac9270762a000
              http://woodpecker.org.cn/diveintopython/
              http://www.google.com
  
============================================================*/
(function(global, undefined){
  
  global.Py = {};
  
  Py.string = {};
  Py.list = {};
  
  /*-----------------------------------------------
    Python 允许用r''表示''内部的字符串默认不转义
    
    说明：
    \b 退格      \f 走纸换页   \n 换行
    \r 回车      \t 横向跳格   \' 单引号
    \" 双引号    \\ 反斜杠
  -------------------------------------------------*/
  Py.string.r = function(str){
    var obj = {
      '\b' : '\\b',
      '\f' : '\\f',
      '\n' : '\\n',
      '\r' : '\\r',
      '\t' : '\\t',
      '\'' : '\\\'',
      '\"' : '\\\"',
      '\\' : '\\\\'
    }
    
    var result = str.replace(/[\b\f\n\r\t\'\"\\]/g, function(a, b){
      return obj[a];
    });
  
    return result;
    
  }
  
  /*-----------------------------------------------
    Python list
    
    1. len      用len()函数可以获得list元素的个数
    2. append   往list中追加元素到末尾。js push之后返回新的长度， py append之后返回 None
  -------------------------------------------------*/
  Py.list.len = function(arr){
    return arr.length;
  }
  
  Py.list.append = function(arr, elem){
    arr.push(elem);
  }
  
  
  
  
  
  
  
 
  
})(this);
