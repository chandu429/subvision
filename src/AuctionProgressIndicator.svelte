<script>
  import { getTimeDiffInWord } from './utils';

  export let closingStart, closingEnd, curBlockNum, auctionStart;

  let title, timeRemain, isClosing, progress;
  
  $: {
    isClosing = curBlockNum >= closingStart;
    const timeDelta = (isClosing ? closingEnd - (curBlockNum || 0) : (closingStart - curBlockNum)) * 6000;
    const timeDiff = getTimeDiffInWord(timeDelta)
    title = isClosing ? 'Auction ending started' : 'Auction started';
    timeRemain = (isClosing ? 'Closing in ' : 'Ending starts in ') + timeDiff;
    const total = isClosing ? closingEnd - closingStart : closingStart - auctionStart;
    const cur =  (isClosing ? curBlockNum - closingStart : curBlockNum - auctionStart);
    progress = (curBlockNum < closingEnd ? Math.floor((cur / total) * 100) : 100);
  }
</script>

<div class="flex flex-row justify-center px-2 items-center fixed-width ">
  <div class="rounded-full ">
    <svg width="70px" height="70px" viewBox="0 0 90 90" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(-963.000000, -135.000000)">
          <g transform="translate(963.000000, 135.000000)">
            <circle id="Color" fill="#EAEEFF" cx="45" cy="45" r="45"></circle>
            <g transform="translate(28.000000, 26.000000)" fill="#2549E6" fill-rule="nonzero">
              <path d="M18.5487981,17.681523 L26.2723558,17.681523 C27.1264423,17.681523 27.8170673,18.3628219 27.8170673,19.2053751 C27.8170673,20.0479283 27.1264423,20.7292273 26.2723558,20.7292273 L17.0040865,20.7292273 C16.15,20.7292273 15.459375,20.0479283 15.459375,19.2053751 L15.459375,13.1099664 C15.459375,12.2674132 16.15,11.5861142 17.0040865,11.5861142 C17.8581731,11.5861142 18.5487981,12.2674132 18.5487981,13.1099664 L18.5487981,17.681523 Z M17.0040865,35.9677492 C7.61730769,35.9677492 0.0122596154,28.4613662 0.0122596154,19.2053751 C0.0122596154,9.94535274 7.62139423,2.44300112 17.0040865,2.44300112 C26.3867788,2.44300112 33.9959135,9.9493841 33.9959135,19.2053751 C34,28.4613662 26.3908654,35.9677492 17.0040865,35.9677492 Z M17.0040865,32.9200448 C24.6826923,32.9200448 30.9064904,26.7802912 30.9064904,19.2053751 C30.9064904,11.6304591 24.6826923,5.48667413 17.0040865,5.48667413 C9.32548077,5.48667413 3.10168269,11.6264278 3.10168269,19.2013438 C3.10168269,26.7762598 9.32548077,32.9200448 17.0040865,32.9200448 Z M25.8228365,0.471668533 C26.4276442,-0.124972004 27.4043269,-0.124972004 28.0091346,0.471668533 L32.3776442,4.78118701 C32.9824519,5.37782755 32.9824519,6.34132139 32.3776442,6.93796193 C31.7728365,7.53460246 30.7961538,7.53460246 30.1913462,6.93796193 L25.8228365,2.62844345 C25.2180288,2.02777156 25.2180288,1.06427772 25.8228365,0.471668533 Z M7.65817308,0.471668533 C8.26298077,1.06830907 8.26298077,2.03180291 7.65817308,2.62844345 L3.28966346,6.93393057 C2.68485577,7.53057111 1.70817308,7.53057111 1.10336538,6.93393057 C0.498557692,6.33729003 0.498557692,5.37379619 1.10336538,4.77715566 L5.471875,0.467637178 C6.07668269,-0.124972004 7.05336538,-0.124972004 7.65817308,0.471668533 Z" id="Shape"></path>
            </g>
          </g>
        </g>
      </g>
    </svg>
  </div>
  <div class="px-2 ml-2 relative">
    <div class="text-base">{title}</div>
    <div class="text-xs fixed-width-words">{timeRemain}</div>
    <div class="h-4 mt-1 relative">
      <div class="meter animate">
        <span style="width: {Math.max(progress, 1)}%;"></span>
      </div>
      <div class="progress-text text-xs" style="left: {progress}px">{progress}%</div>
    </div>
  </div>
</div>

<style>
  @media (min-width: 600px) {
    .fixed-width {
      width: 35%;
    }
    .fixed-width-words {
      position: inherit;
      width: 280px;
    }
  }

  
  
  .progress-text {
    position: absolute;
    color: white;
    top: 0;
  }
  .meter {
    box-sizing: content-box;
    height: 14px;
    position: relative;
    background: #bbb;
    border-radius: 25px;
    padding: 1px;
    width: 220px;
  }

  .meter > span {
    display: block;
    height: 100%;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    background-color: rgb(28, 63, 170);
    background-image: linear-gradient(
      center bottom,
      rgb(28, 63, 170) 37%,
      rgb(255, 255, 255) 69%
    );
    position: relative;
    overflow: hidden;
  }
  .meter > span:after,
  .animate > span {
    content: "";
    position: absolute;
    top: 1px;
    left: 0;
    bottom: 0;
    right: 0;
    background-image: linear-gradient(
      -45deg,
      rgba(255, 255, 255, 0.2) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0.2) 75%,
      transparent 75%,
      transparent
    );
    z-index: 1;
    background-size: 50px 50px;
    animation: move 2s linear infinite;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    overflow: hidden;
  }

  .animate > span:after {
    display: none;
  }

  .orange > span {
    background-image: linear-gradient(#f1a165, #f36d0a);
  }


  @keyframes move {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 50px 50px;
    }
  }
</style>