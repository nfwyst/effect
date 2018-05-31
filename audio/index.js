class DataLoader {
  constructor (url = 'fast.mp3') {
    // 创建上下文
    this.context = window.AudioContext ? new AudioContext() : new webkitAudioContext()
    this.audioBuffer = null
    this.sourceNode = null

    // 载入音乐数据
    this.setupAudioNodes()
    this.loadSound(url)
  }

  setupAudioNodes () {
    // 创建一个 buffer source 并连接到 destination
    this.sourceNode = this.context.createBufferSource()
    this.sourceNode.connect(this.context.destination)
  }

  loadSound (url) {
    let req = new XMLHttpRequest()
    req.open('GET', url, true)
    req.responseType = 'arraybuffer'
    // 数据载入之后对数据进行解码
    req.onload = () => {
      this.context.decodeAudioData(req.response, (buffer) => {
        this.playSound(buffer)
      }, (e) => {
        console.error(e.message)
      })
    }

    req.send()
  }

  playSound (buffer) {
    this.sourceNode.buffer = buffer
    this.sourceNode.start(0)
  }
}

class Connector {
  constructor (loader) {
    this.ctx = document.getElementById('canvas').getContext('2d')
    // 设置分析器
    this.context = loader.context

    this.analyser = this.context.createAnalyser()
    this.analyser.smoothingTimeConstant = 0.3
    this.analyser.fftSize = 1024

    this.analyser2 = this.context.createAnalyser()
    this.analyser2.smoothingTimeConstant = 0.0
    this.analyser2.fftSize = 1024

    // 左右声道
    this.splitter = this.context.createChannelSplitter()
    loader.sourceNode.connect(this.splitter)
    this.splitter.connect(this.analyser, 0, 0)
    this.splitter.connect(this.analyser2, 1, 0)

    // 设置 js 节点
    this.jsNode = this.context.createScriptProcessor(2048, 1, 1)
    this.jsNode.connect(this.context.destination)
    this.analyser.connect(this.jsNode)
    loader.sourceNode.connect(this.context.destination)
    this.jsNode.onaudioprocess = () => {
      // 获取平均频率
      let arr = new Uint8Array(this.analyser.frequencyBinCount)
      this.analyser.getByteFrequencyData(arr)
      let average = this.getAverageVolume(arr)

      let arr2 = new Uint8Array(this.analyser2.frequencyBinCount)
      this.analyser2.getByteFrequencyData(arr2)
      let average2 = this.getAverageVolume(arr2)

      // 刷新
      this.ctx.clearRect(0, 0, 60, 130)
      let color = this.ctx.createLinearGradient(0, 0, 60, 130)
      color.addColorStop(0, 'yellow')
      color.addColorStop(0.4, 'red')
      color.addColorStop(0.8, 'pink')
      color.addColorStop(1, 'orange')
      this.ctx.fillStyle = color
      this.ctx.fillRect(0, 130 - average, 25, 130)
      this.ctx.fillRect(30, 130 - average2, 25, 130)
    }
  }

  getAverageVolume (arr) {
    // 获取频率的振幅
    return arr.reduce((sum, cur, index) => {
      return sum += cur
    }, 0) / arr.length
  }
}

new Connector(new DataLoader())
