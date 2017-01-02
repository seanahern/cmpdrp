!function(n,o,i,e){"use strict";function t(){var o=n(".file-grid"),i=[];d.length&&(d.forEach(function(o){var e=n("<div class='grid-item'></div>"),t=n("<img src='"+o+"' />");e.append(t),i.push(e)}),i.forEach(function(n){o.append(n)}),n(".drop-zone").fadeOut(500,function(){n(".file-grid").fadeIn(500)}))}var l=1,c=2,f=l,r=!0,u=0,s=0,a=null,d=[],h=null,p=null,v=null,w=null,m=null,g=null,b=null,y=null,k=null,C=null,x=function(n){n.stopPropagation(),n.preventDefault(),n.dataTransfer.dropEffect="copy"},P=function(n){n.stopPropagation(),n.preventDefault();var o=n.target.result;d=d.concat(o),console.log("all files",d)},D=function(n){g.find(".hd .count").text("("+n+")")},E=function(){n(i.body).on("click",function(n){T()})},F=function(){n(i.body).off("click")},L=function(){return p.find(".view").each(function(o,i){n(i).is(":visible")&&(u=o)}),u},T=function(){var n=L()+1;n>p.children().length-1&&(n=0),z(n)},q=function(){var n=L()-1;0>n&&(n=p.children().length-1),z(n)},z=function(i){p.children().hide(),p.children().eq(i).show(),k.find("ul").children().removeClass("selected"),k.find("ul").children().eq(i).addClass("selected"),C.children().removeClass("selected"),C.children().eq(i).addClass("selected"),n(o).scrollTop(0)},O=function(){g.hasClass("is-open")?I():A()},R=function(){b.hasClass("is-open")?I():j()},A=function(){G(g)},j=function(){G(b)},G=function(o){I(),M(),a=o,a.addClass("is-open"),f===c&&(n(i.body).css("overflow","hidden"),F(),Z())},I=function(){null!==a&&(N(),a.removeClass("is-open"),a=null,f===c&&(n(i.body).css("overflow","auto"),E(),Y()))},K=function(){r=!0,u=0,s=0,d=[],X(l)},Q=function(){k.show(),C.hide()},S=function(){k.hide(),C.show()},U=function(){w.show()},B=function(){w.hide()},H=function(){p.show()},J=function(){p.hide()},M=function(){y.show()},N=function(){y.hide()},V=function(){n(".btn-index").show(),n(".btn-next").show(),n(".btn-prev").show()},W=function(){n(".btn-index").hide(),n(".btn-next").hide(),n(".btn-prev").hide()},X=function(n){if(n!==f)switch(f=n){case l:N(),J(),I(),U(),W(),tn(),F(),Z(),D(0),k.find(".filenames").empty(),C.empty(),p.empty();break;case c:B(),I(),H(),V(),tn(),E(),Y()}},Y=function(){n(i.body).on("mousemove",_),n(i.body).on("mousedown",_),n(i.body).on("mouseleave",$),nn()},Z=function(){n(i.body).off("mousemove",_),n(i.body).off("mousedown",_),n(i.body).off("mouseleave",$),on()},$=function(){en()},_=function(){v.is(":visible")||(v.stop(),tn()),nn()},nn=function(){on(),h=setTimeout(en,3e3)},on=function(){null!==h&&(clearTimeout(h),h=null)},en=function(){on(),v.fadeOut(500)},tn=function(){v.show()};n(i).ready(function(){return w=n(".drop-zone"),m=n("#filepicker"),v=n(".nav"),p=n(".views"),g=n(".index"),b=n(".help"),y=n(".blocker"),k=g.find(".list"),C=g.find(".thumbs"),W(),v.find(".btn-help").on("click",function(n){n.preventDefault(),n.stopPropagation(),j()}),y.on("mousedown",function(n){I()}),o.File&&o.FileReader&&o.FileList?(i.body.addEventListener("dragover",x,!1),i.body.addEventListener("drop",P,!1),g.on("click","a, canvas",function(o){o.preventDefault(),o.stopPropagation(),z(n(this).data("index")),I()}),v.find(".btn-next").on("click",function(n){n.preventDefault(),n.stopPropagation(),T()}),v.find(".btn-prev").on("click",function(n){n.preventDefault(),n.stopPropagation(),q()}),v.find(".btn-index").on("click",function(n){n.preventDefault(),n.stopPropagation(),A()}),g.find(".btn-list").on("click",function(n){n.preventDefault(),n.stopPropagation(),Q()}),g.find(".btn-thumbs").on("click",function(n){n.preventDefault(),n.stopPropagation(),S()}),w.click(function(o){o.preventDefault(),o.stopPropagation(),n("#filepicker").trigger("click")}),m.on("change",function(){for(var n,o=[],i=-1;n=this.files[++i];){var e=new Promise(function(o,i){if(n.type.toLowerCase().indexOf("image/")<0)return i(),!0;var e=new FileReader;e.onload=function(n){return function(n){P(n),o()}}(n),e.readAsDataURL(n)});o.push(e)}Promise.all(o).then(function(){console.log("After all proms prom, write files"),t()})}),n(i).on("click",".grid-item:not(.full) img",function(){n(this).parent().addClass("full")}),n(i).on("click",".grid-item.full img",function(){n(this).parent().removeClass("full")}),void n(i).on("keydown",function(n){var o=p.children().length;if(n.shiftKey&&191===n.which)return void R();if(13===n.which)return void(g.hasClass("is-open")&&I());if(27===n.which)return void(a&&(n.preventDefault(),n.stopPropagation(),I()));if(!(1>o)){if(73===n.which)return void O();if(82===n.which)return void K();if(84===n.which)return void(g.hasClass("is-open")&&(C.is(":visible")?Q():S()));if(!(2>o))return 74===n.which||37===n.which?void q():75===n.which||39===n.which?void T():void 0}})):(v.addClass("fallback"),w.find(".msg").text("Sorry, your browser does not support local file access"),void w.find(".sub").html('Try <a href="http://www.google.com/chrome">Google Chrome</a> or <a href="http://www.mozilla.org/firefox">Firefox</a>'))})}(jQuery,window,document);