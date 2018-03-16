(function($) {
    $.imgplay = function(element, options) {
        var defaults = {
            name: 'imgplay',
            rate: 1,
            controls: true,
            pageSize: 5
        };

        var plugin = this;
  
        var el = element;
        var $el = $(element);
        var $canvas = null;
        var screen = null;
        var playing = false;
        // var direction = 'forward';
        // var page = 1;
        // var total = 0;
        // var index = 0;
        // var buffer = [];
        // var playTimer = null;
        // var bufferLoading = [];

        plugin.settings = {};


        plugin.controls = {
            play: null
        };

        

        plugin.init = function() {
            plugin.frames = [];
            plugin.settings = $.extend({}, defaults, options);

            // max rate is 100 fps and min rate is 0.001 fps
            plugin.settings.rate = (plugin.settings.rate < 0.001) ? 0.001 : plugin.settings.rate;
            plugin.settings.rate = (plugin.settings.rate > 100) ? 100 : plugin.settings.rate;

            $el.addClass('imgplay');
            $canvas = $('.imgplay-canvas');
            screen = $canvas.get(0).getContext('2d');
            // $el.append($canvas);
            // initControls();
            $('.file-item').find('img').each(function(j, img) {
                plugin.frames[j] = img;
                console.log('遍历上传的图片：：' + plugin.frames);

            });
            plugin.play(); 
            // prepare images list
           /* $el.find('img').each(function(j, img) {
                // if($(img).prop('src') != '') {
                    plugin.frames[j] = img;
                // } else {
                    // buffer[j] = img;
                // }

                // total++;
            }).detach();
            // $(window).resize(resize);
            // resize();*/
        };

        plugin.isPlaying = function() {
            return playing;
        };

        // plugin.getCurrentFrame = function() {
        //     return index;
        // };

        plugin.play = function() {
            playing = true;
            // direction = 'forward';
            drawFrame();

            // if (plugin.settings.controls) {
            //     plugin.controls.play.addClass('active');
            // }
        };
      
        var initControls = function() {
            if (!plugin.settings.controls) {
                return;
            }
            if ($el.find('.imgplay-controls').length == 0) {
                var controls = $('<div class="imgplay-controls"></div>');
                // var progress = $('<div class="imgplay-progress">');
                var buttons = $('<div class="imgplay-buttons">');
                var loadBar = $('<div class="imgplay-load-bar">');
                var playBar = $('<div class="imgplay-play-bar">');

                var play = $('<div class="imgplay-button imgplay-play"><i class="material-icons">play_arrow</i></div>');
                play.on('click', function() { plugin.play(); });

                loadBar.append(playBar);
                // progress.append(loadBar);
                // buttons.append([play, pause, previousFrame, stop, nextFrame, fullscreen]);
                 buttons.append([play]);
                // controls.append([progress, buttons]);
                controls.append([buttons]);
                $el.append(controls);

                plugin.controls.play = play;
            }
        };

        var drawFrame = function() {
            if (screen != null) {
                var length = plugin.frames.length;
                var timerslide = '';
                var timerBig = '';
                var timersmall = '';
                var timerHide = '';
                var timerDisp = '';

                var cw = $canvas.width();
                var ch = $canvas.height();

                screen.clearRect(0, 0, cw, ch);
                screen.fillStyle = "black",
                screen.fillRect(0, 0, cw, ch);

                var borderWidth = 20;

                var width = 320;//cw - borderWidth;
                var height = 180;//ch - borderWidth;
     
                var x = 0;
                var left = -340;
                var top = -200;
                // 画九宫格
                var draw9Image = function () {
                
                    var draw1stRow = function() {

                        screen.drawImage(plugin.frames[1], 0 + left, 0 + top, width, height);

                        for (var i = 1; i < length; i++) {
                            screen.drawImage(plugin.frames[i], width * i + borderWidth * i + left, 0 + top, width, height);

                        }

                    }
                    var draw2ndRow = function() {
                        screen.drawImage(plugin.frames[1], width * 0 + left, height + borderWidth, width, height);

                        for (var i = 0; i < length; i++ ) {
                            screen.drawImage(plugin.frames[i], width * (i + 1) + borderWidth * (i + 1) + left, height + borderWidth + top, width, height);

                        }
                    }
                    var draw3rdRow = function () {
                        screen.drawImage(plugin.frames[1], width * 0 + left, (height + borderWidth) * 2 + top, width, height);
                        for (var i = 1; i < length; i++) {
                            screen.drawImage(plugin.frames[i], width * i + borderWidth * i + left, (height + borderWidth) * 2 + top, width, height);
                        }
                    }
                    draw1stRow();
                    draw2ndRow();
                    draw3rdRow();
                }

                // 入口为 scaleSmall
                var draw = function() {
                    // 左移       
                    var p = 0;
                    var xpixel = 0;
                    var ypixel = 0;
                    var x = 0;
                    var slideImages = function () {
                        var px =  x - ( width + borderWidth )* 0.6 ;
                        if (xpixel > px) {
                            screen.clearRect(0, 0, cw, ch);
                            screen.save();
                            xpixel -= 10;
                            console.log('p:::' + p +'xpixel::' + xpixel + 'x:' + x);
                            screen.translate(xpixel, ypixel);
                            screen.scale(scale,scale);
                            draw9Image();
                            screen.restore();
                        }
                        else {

                            clearInterval(timerslide);
                            xpixel = px;
                            console.log("左移到头啦 xpixel:" + xpixel + '准备放大');
                            // setTimeout(function () {
                                timerBig = setInterval(scaleBig, 20);
                            // }, 4000);
                            
                        }
                    };
                    // 缩小begin 
                    var scale = 1;
                    var scaleSmall = function () {
                        
                        if (p === length - 2 ) {
                            clearInterval(timersmall);
                            clearInterval(timerslide);
                            console.log('淡出');
                            timerHide = setInterval(hideImage, 20);
                            return;
                        }

                        if(scale >=  0.6) {
                            screen.clearRect(0, 0, cw, ch);
                            screen.save();
                            xpixel += width * 0.01 * (0.5 + p * 0.9);
                            ypixel += height * 0.01 * 0.5;
                            screen.translate(xpixel, ypixel);
                            
                            scale -= 0.01;
                            screen.scale(scale,scale);
                            console.log('scaleSmall scale：' + scale + 'xpixel:::' +xpixel)
                            draw9Image();
                            screen.restore();

                        }
                        else {
                            clearInterval(timersmall);
                            x = xpixel;
                            console.log('缩小到头啦xpixel：：' + xpixel);
                            p++;
                            // setTimeout(function() {
                                timerslide = setInterval(slideImages, 20);
                            // }, 3000)
                            
                        }                         
                    };
                    var scaleBig = function () {
                        if(scale >= 1 ) {
                            clearInterval(timerBig);
                            xpixel = -(width * p);
                            console.log('放大到头啦 xpixel：：' + xpixel);
                            //x = xpixel;
                            setTimeout(function() {
                                timersmall = setInterval(scaleSmall,20);
                            },1000);
                        }
                        else{
                            screen.clearRect(0, 0, cw, ch);
                            screen.save();
                            xpixel -= width * 0.01 * (0.5 + p * 1.05) ;
                            ypixel -= height * 0.01 * 0.5;
                            screen.translate(xpixel, ypixel);
                            scale += 0.01;
                            screen.scale(scale,scale);
                            draw9Image();
                            screen.restore();
                        }
                    };
                    var ctxAlpha = 1;
                    var hideImage = function () {
                        if(ctxAlpha <= 0) {
                            clearInterval(timerHide);
                            timerDisp = setInterval(displayImage, 20);
                            return;

                        }
                        else {
                            screen.clearRect(0, 0, cw, ch);
                            screen.drawImage(plugin.frames[length - 2], 0, 0, width, height);
                            screen.globalAlpha = ctxAlpha;
                            ctxAlpha -= 0.1;
                        }               
                        
                    }
                    var opacity = 0;
                    var displayImage = function () {
                        if(opacity >= 1) {
                            clearInterval(timerDisp);
                            $('.play-button').show();
                            audio.pause();
                            return;
                        }
                        else {
                            screen.clearRect(0, 0, cw, ch);
                            screen.drawImage(plugin.frames[length - 1], 0, 0, width, height);
                            screen.globalAlpha = opacity;
                            opacity += 0.1;
                        }

                    }
                    // 1 先缩小
                    setTimeout(function() {
                        timersmall = setInterval(scaleSmall,20);
                    },1500);                           

                };

                draw9Image();
                // 添加特效                         
                draw();        
            }
        };

        plugin.init();
    };

    $.fn.imgplay = function(options) {
        return this.each(function() {
           // if($(this).data('imgplay') == undefined) {
                var plugin = new $.imgplay(this, options);
                $(this).data('imgplay', plugin);
           // }
        });
    };
})(jQuery);
