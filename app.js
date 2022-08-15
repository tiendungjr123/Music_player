const $$ = document.querySelectorAll.bind(document);
const $ = document.querySelector.bind(document);
const PLAYER_KEY = "F8-player";
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const player = $(".player");
const btnPlay = $(".btn-toggle-play");
const cd = $(".cd");
const progress = $("#progress");
const btnPrev = $(".btn-prev");
const btnRepeat = $(".btn-repeat");
const btnNext = $(".btn-next");
const btnRandom = $(".btn-random");
const playlist = $(".playlist");

const app = {
  isRepeat: false,
  isRandom: false,
  isPlaying: false,
  currentIndex: 0,
  config: JSON.parse(localStorage.getItem(PLAYER_KEY)) || {},
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_KEY, JSON.stringify(this.config));
  },
  songs: [
    {
      name: "Thức giấc",
      singer: "DA LAB",
      path: "./Music/ThucGiac-DaLAB-7048212.mp3",
      image:
        "https://avatar-ex-swe.nixcdn.com/song/2021/07/14/8/c/f/9/1626231010810_500.jpg",
    },
    {
      name: "3107 3",
      singer: "W/n, Duongg, Nâu, V.A",
      path: "./Music/31073-WNDuonggNautitie-7059323.mp3",
      image:
        "https://avatar-ex-swe.nixcdn.com/song/2021/08/02/f/d/b/3/1627913895076_500.jpg",
    },
    {
      name: "Câu Hẹn Câu Thề",
      singer: "Đình Dũng, ACV",
      path: "./Music/CauHenCauThe-DinhDung-6994741.mp3",
      image:
        "https://avatar-ex-swe.nixcdn.com/song/2021/03/29/2/2/1/e/1617029681297_500.jpg",
    },
    {
      name: "Muộn rồi mà sao còn",
      singer: "Sơn Tùng M-TP",
      path: "./Music/MuonRoiMaSaoCon-SonTungMTP-7011803.mp3",
      image: "https://pbs.twimg.com/media/Ez5jRyVVgAQN6Kh.jpg",
    },

    {
      name: "Symphony",
      singer: "Clean Bandit",
      path: "./Music/Clean Bandit - Symphony.mp3",
      image: "https://i.ytimg.com/vi/PIf9GvWaxQQ/maxresdefault.jpg",
    },
    {
      name: "Waiting For Love",
      singer: "Avicii",
      path: "./Music/Avicii - Waiting For Love .mp3",
      image: "https://i.ytimg.com/vi/Hmbm3G-Q444/maxresdefault.jpg",
    },
    {
      name: "Alone",
      singer: "Marshmello",
      path: "./Music/Alan Walker - Alone.mp3",
      image: "https://i.ytimg.com/vi/UNB8F0ObA4g/maxresdefault.jpg",
    },
    {
      name: "Something Just Like This",
      singer: "The Chainsmokers & Coldplay",
      path: "./Music/Something Just Like This .mp3",
      image:
        "https://avatar-ex-swe.nixcdn.com/song/2017/11/07/a/1/4/5/1510038809679_640.jpg",
    },
    {
      name: "Sugar",
      singer: "Maroon 5",
      path: "./Music/Maroon 5 - Sugar .mp3",
      image: "https://i.ytimg.com/vi/7vw84EkHOlY/maxresdefault.jpg",
    },
  ],
  render: function () {
    const htmls = this.songs.map((item, index) => {
      return `
        <div data-index="${index}" class="song ${
        index === this.currentIndex ? "active" : ""
      }">
            <div
                class="thumb"
                style="
                background-image: url('${item.image}');
            "
            ></div>
            <div class="body">
                <h3 class="title">${item.name}</h3>
                <p class="author">${item.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>`;
    });
    playlist.innerHTML = htmls.join("");
  },
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    //xử lý CD quay / dừng
    const cdThumbAnimate = cdThumb.animate(
      [
        {
          transform: "rotate(360deg)",
        },
      ],
      {
        duration: 10000,
        iterations: Infinity,
      }
    );
    cdThumbAnimate.pause();
    //xử lý phóng to thu nhỏ
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCDwidth = cdWidth - scrollTop;
      cd.style.width = newCDwidth > 0 ? newCDwidth + "px" : 0;
      cd.style.opacity = newCDwidth / cdWidth;
    };
    //xử lý khi play
    btnPlay.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };
    //xử lý khi nhấn next songs
    btnNext.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      _this.scrollToActiveSong();
      audio.play();
    };
    //xử lý khi nhấn pre songs
    btnPrev.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.preSong();
      }
      _this.scrollToActiveSong();
      audio.play();
    };
    //xử lý khi random
    btnRandom.onclick = function () {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      btnRandom.classList.toggle("active", _this.isRandom);
    };
    //xử lý khi repeat
    btnRepeat.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      btnRepeat.classList.toggle("active", _this.isRepeat);
    };
    audio.onplay = function () {
      _this.isPlaying = true;
      cdThumbAnimate.play();
      player.classList.add("playing");
    };
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercen = (audio.currentTime / audio.duration) * 100;
        progress.value = progressPercen;
      }
    };
    progress.oninput = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        btnNext.click();
      }
    };
    //lắng nghe click hành vì click vào playlist
    playlist.onclick = function (e) {
      let songNode = e.target.closest(".song:not(.active)");
      if (songNode || e.target.closest(".option")) {
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          audio.play();
        }
        if (e.target.closest(".option")) {
        }
      }
    };
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (this.currentIndex === newIndex);
    console.log(newIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex > this.songs.length - 1) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  preSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      if (this.currentIndex <= 3) {
        $(".song.active").scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      } else {
        $(".song.active").scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 300);
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  defineProperty: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;

    if ($(".song.active")) {
      $(".song.active").classList.remove("active");
    }
    const list = $$(".song");
    list.forEach((song) => {
      if (Number(song.getAttribute("data-index")) === this.currentIndex) {
        song.classList.add("active");
      }
    });
  },
  start: function () {
    this.loadConfig();
    btnRandom.classList.toggle("active", this.isRandom);
    btnRepeat.classList.toggle("active", this.isRepeat);
    this.defineProperty();
    this.handleEvents();
    this.loadCurrentSong();
    this.render();
  },
};
app.start();
