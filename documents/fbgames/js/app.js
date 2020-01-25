$("#tap").click(function() {
    
    var loveImages = [
                        "1.png","2.png","3.png","4.png","5.png","6.png","7.png","8.png"
                    ];

    var loveImage = loveImages[Math.floor(Math.random() * loveImages.length)];


    $("#loveimage1").attr('src', 'img/'+loveImage );

    $("#tap").attr('style', 'visibility : hidden;');


    $("#btn1").attr('style', 'visibility : visible; ');
    $("#btn1").attr('value', 'Try Another');
    $("#btn1").addClass('btn1_2')

    $("#btn2").attr('style', 'visibility : visible; ');

    $("#profilePic1").html("<img id='profilepic1_2' src='" + FBInstant.player.getPhoto() + "'>");

});




$("#btn1").click(function(event) {

  var loveImages = [
                      "1.png","2.png","3.png","4.png","5.png","6.png","7.png","8.png"
                  ];

  var loveImage = loveImages[Math.floor(Math.random() * loveImages.length)];

  $("#loveimage1").attr('src', 'img/'+loveImage );

});




function getBase64Image(img, img2) {

  var canvas = document.createElement("canvas");
  canvas.width = 614;
  canvas.height = 1079;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);





  var dataURL = canvas.toDataURL("image/png");
  return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}




$("#btn2").click(function(event) {

    FBInstant.shareAsync({
          intent: 'SHARE',
          image: getBase64Image($("#loveimage1")[0], $("#profilePic1")[0]),
          text: 'What type of lover are you? Find Out. Share. Win.',
          data: {
            myReplayData: '...'
          }
        }).then( function()
    {
        console.log("sharing is done");
    });
    // .catch( function(err)
    // {
    //    console.log('failed to share: ' + err.code + " :: " + err.message);
    // });

});