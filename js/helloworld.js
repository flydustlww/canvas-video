
  var helloworld = Vue.extend({
     template: '<div class="popLayer">'+
'        <div class="poplayer-header">视频制作工具</div>'+
'        <div class="poplayer-body">'+
'            <div class="poplayer-body-left">'+
'                <div class="select-pic">'+
'                    <div class="select-pic-title">1.选择图片</div>'+
'                    <div class="select-pic-subtitle">'+
'                        请添加3-10张图片，图片大小小于200KB，支持jpg/png格式；</br>图片尺寸640*360、600*300、640*270、960*640（最建议640*360）'+
'                    </div>'+
'                    <div class="upload-image-wrapper">'+
'                        <div class="vue-uploader" >'+
'                            <div class="file-list">'+
'                                <section v-for="(file, index) of files" class="file-item draggable-item">'+
'                                    <img :src="file.src" alt="" ondragstart="return false;">'+
'                                    <p class="file-name">{{file.name}}</p>'+
'                                    <span class="file-remove" @click="remove(index)">+</span>'+
'                                </section>'+
'                                <section v-if="status == \'ready\'" class="file-item">'+
'                                    <div @click="add" class="add">'+
'                                        <span>+</span>'+
'                                    </div>'+
'                                </section>'+
'                            </div>'+
'                           '+
'                            <input type="file" accept="image/*"  @change="fileChanged" ref="file" multiple="multiple">'+
'                        </div>'+
'                    </div>'+
'                </div>'+
'                <div class="select-style">'+
'                    <div class="select-style-title">2.选择视频风格</div>'+
'                    <div class="select-style-subtitle">'+
'                        <input type="radio" name="grid" value="grid" checked class="style-item" />网格切换'+
'                    </div>'+
'                    '+
'                </div>'+
'                <div class="select-music">'+
'                    <div class="select-music-title">3.选择背景音乐</div>'+
'                    <div class="select-music-subtitle">'+
'                        <div class="select-music-item">'+
'                            <input type="radio" name="music" value="null" checked  class="none-music-item"/>无背景音乐'+
'                        </div>'+
'                        <div class="select-music-item" v-for="(music, index) of musics">'+
'                            <input type="radio" name="music" value="music"  class="music-item" @click="selectMusic" :musicSrc="music.src" />{{music.name}}'+
'                        </div>'+
'                    </div>'+
'                </div>        '+
'            </div>'+
'            <div class="poplayer-body-right">'+
'                <div id="imageplayer" class="imageplayer"  v-on:click="playCanvas">'+
'                    <div :class ="playCanvasButton"></div>'+
'                    <div v-if="files.length < 3" class="canvasTips">您可以在左侧添加图片来创建视频</div>'+
'                    <canvas v-if="files.length >= 3" class="imgplay-canvas"></canvas>'+
'                    <img v-if="files.length >= 3" :src="files[0].src" class="poster">'+
'                </div>'+
'            </div>'+

'        </div>'+
'            <div class="upload-func">'+
'                <div class="operation-box">'+
'                    <button v-if="status == \'ready\'" @click="submit" class="genVideo">生成视频</button>'+
'                    <button  @click="cancel" class="cancel">取消</button>'+
'                </div>'+
'            </div>     '+
'    </div>',
     data : function(){
      return {
        // isShow: false,
        status: 'ready',
        files: [],
        musics: [
        {
          name: '温馨',
          src: 'music/wenxin.mp3'

        },{
          name: '欢快',
          src: 'music/huankuai.mp3'

        },{
          name: '激昂',
          src: 'music/jiang.mp3'

        }],
        musicSrc: '',
        formSrc: '/user/videoCreate.json',
        uploading: false,
        percent: 0,
        playCanvasButton: 'pause-button'

      }
         
     },

     methods: {

         playCanvas() {
             // this.isShow = true;
             var fileLength = this.files.length;
             if(fileLength < 3) {

              $('#mask').append('<div class="error-tip">请至少选择3张图片</div>');
              setTimeout(function() {
                $('.error-tip').remove();

              }, 1500)
              return;

             }
             else {
               $('.poster').hide();
               $('.play-button').hide();
               $('#imageplayer').imgplay({rate: 2});
               // 播放音频
               //  
               var audio = new Audio(this.musicSrc);
               audio.loop = true;
               audio.play();
             }
         },
         // 
         selectMusic(event) {

          this.musicSrc = $(event.target).attr('musicsrc');

          console.log(this.musicSrc);

         },
         // 图片上传
         add() {
             this.$refs.file.click();
         },
         submit() {

           if (this.files.length === 0) {
               console.warn('no file!');
               return
           }

             var formData = new FormData()
             this.files.forEach((item, index) => {

              formData.append('upload' + index, item.file);
             });
             formData.append('videoTemplate', 'GRID');
             formData.append('audioType', 'WARMTH');
             formData.append('planId', '3834');
             formData.append('groupId', '15792');
             formData.append('unitId', '0');
             formData.append('unitType', 'VIDEO_WITH_IMAGE');
             formData.append('uploadType', 'VIDEO_CPM');
             this.uploading = true;
             $.ajax({
                  url: this.formSrc,
                  type: "POST",
                  data: formData,
                  // timeout: 1500,
                  processData: false,  // 告诉jQuery不要去处理发送的数据
                  contentType: false,   // 告诉jQuery不要去设置Content-Type请求头
                  success: function(response,status,xhr){
                     var model = response.model;
                     var videoSrc = model.previewUrl;
                     var fileInfo = $.parseJSON(model.fileInfo);
                     var fileSize = fileInfo.fileSize;
                     var fileName = fileInfo.originalFilename;
                     var duration = fileInfo.duration;
                     
                     Bus.$emit('fillFileInfo', {
                      fileSize,
                      fileName,
                      duration,
                      videoSrc   
                    })
                  },
                  error: function(response,status,xhr) {

                    Bus.$emit('errorUpload', {
                      response,
                      status,
                      xhr
                    });
                    console.log(response + status +xhr);

                  },
                  xhr: function () {
                      var xhr = new window.XMLHttpRequest();
                      xhr.addEventListener("progress", function (evt) {
                        if (evt.lengthComputable) {
                          var percentComplete = evt.loaded / evt.total;
                          var posterSrc = $('.file-item img').attr('src');
                          // console.log('posterSrc:::' + posterSrc);
                          Bus.$emit('finishedUpload', {
                            percentComplete,
                            posterSrc
                          });
                        }
                      }, false);
                      return xhr;
                  }
             });
         },
         cancel() {
             this.files = []
             this.status = 'ready',
             $('#mask').remove();
             $('body').css('position', 'unset');
         },
         remove(index) {
             this.files.splice(index, 1)
         },
         fileChanged() {
             // 不能上传相同的图片     
             var list = this.$refs.file.files
             for (var i = 0; i < list.length; i++) {
                 //if (!this.isContain(list[i])) {
                     var item = {
                         name: list[i].name,
                         size: list[i].size,
                         file: list[i]
                     }
                     this.html5Reader(list[i], item)
                     this.files.push(item);
                     if(this.files.length >= 3 ) {
                      this.playCanvasButton = 'play-button'

                     }
                // }
             }
             this.$refs.file.value = ''
             
         },
         // 将图片文件转成BASE64格式
         html5Reader(file, item){
             const reader = new FileReader()
             reader.onload = (e) => {
                 this.$set(item, 'src', e.target.result)
             }
             reader.readAsDataURL(file)
         }/*,
         isContain(file) {
           return this.files.find((item) => item.name === file.name && item.size === file.size)
         }*/
         

     }

  })







