


<div class='popupFriend   overflow-hidden cursor-default flex justify-center content-center fixed top-0 left-0 w-full'>

	<div class='w-3/5 flex items-center content-center p-4'>
		<p>

			Text de poup

		</p>
	</div>
	<div class='uppercase w-1/5 text-center cursor-pointer popupButton popupButton1 m-4'>
		accept
	</div>
	<div class='delay-500 uppercase w-1/5 text-center cursor-pointer popupButton popupButton2 m-4'>
		deny
	</div>


</div>

<style>

	.popupFriend{
      font-family: barlow-eb;
      background: rgba(246,213,64,0.9);

	}



  .popupButton {
      box-shadow: 0 6px 6px rgb(0 0 0 / 29%);
      height: 36px;
      line-height: 36px;
      padding: 0 25px;
      overflow: hidden;
      text-decoration: none;
			position: relative;
      background: #F6D540;
  }

  .popupButton1:before{
  }
  .popupButton2:before{
      animation-delay: 0.5s !important;
  }

  .popupButton:before {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      width: 100%;
      /*     top: 50%;
					 transform: translateY(-50%);*/
      height: 100%;
      border-radius: 5px;
      background: #fff;
      opacity: .4;
      transform-origin: 100% 100%;
      transition: all .6s cubic-bezier(.53,.21,0,1);
      will-change: transform;
      animation: 2s cubic-bezier(.53,.21,0,1)  infinite running slidein;

  }


  @keyframes slidein {
      from {
          margin-left: -100%;
      }

      to {
          margin-left: 100%;
      }
  }


</style>