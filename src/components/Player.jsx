import React from 'react'
import blue from "@material-ui/core/colors/blue"
import { withStyles } from '@material-ui/core/styles'
import Hls from 'hls.js'
import swf from 'flowplayer/dist/flowplayer.swf'
import swfHls from 'flowplayer/dist/flowplayerhls.swf'
import "flowplayer/dist/skin/skin.css"
import flowplayer from 'flowplayer'
// import thumbnails from "../plugins/flowplayer.thumbnails"

window.Hls = Hls

// 增加进度条预览图片扩展
// thumbnails(flowplayer)

const styles = (theme) => ({
    player: {
        height: "calc(100vh - 64px)",
        width: "100%",
        overflow: "hidden",
        [theme.breakpoints.only("xs")]: {
            height: "calc(100vh - 56px)"
        }
    }
})

const isPc = (() => {
    var userAgentInfo = navigator.userAgent;
    var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
    }
    return flag;
})()

class Player extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        console.log(isPc)
        return (
            <React.Fragment>
                <style>
                    {`
                    #player .fp-color {
                        background-color: ${blue[500]};
                    }
                    #player .fp-bar, #player .fp-volumebar {
                        cursor: pointer;
                    }
                    `}
                </style>
                <div id="player" ref={(ref) => { this.playerNode = ref }}
                    className={`${this.props.classes.player} fp-slim no-volume`} />
            </React.Fragment>
        )
    }

    componentDidMount() {
        let clip = {
            sources: [{
                type: "application/x-mpegurl",
                src: "https://media2.neu6.edu.cn/hls/cctv1hd.m3u8"
            }]
        }
        this.player = flowplayer(this.playerNode, {
            share: false,
            autoplay: true,
            clip,
            live: true,
            keyboard: false,
            chromecast: false,
            swf,
            swfHls,
            hlsjs: {
                xhrSetup: (xhr) => {
                    xhr.withCredentials = false
                },
            }
        })
        console.log(this.player.engine)
        console.log(this.player.shutdown.toString())
        setTimeout(() => {
            this.player.disable()
            this.player.shutdown()
            console.log("has shutdown")
            this.player = flowplayer(this.playerNode, {
                share: false,
                autoplay: true,
                clip: {
                    sources: [{
                        type: "application/x-mpegurl",
                        src: "https://media2.neu6.edu.cn/review/program-1529424360-1529426160-hls27.m3u8"
                    }]
                },
                live: false,
                keyboard: false,
                chromecast: false,
                swf,
                swfHls,
                hlsjs: {
                    xhrSetup: (xhr) => {
                        xhr.withCredentials = false
                    },
                }
            })
        }, 5000)
    }

    componentWillUnmount() {
        // 卸载播放器

        if (this.player.engine) {
            this.player.unload()
        }

        this.player.shutdown()

        let video = this.playerNode.querySelector(".fp-player > video")
        video.src = ""
        video.load()
    }
}

export default withStyles(styles)(Player)