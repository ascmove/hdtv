import React from 'react'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import Tooltip from '@material-ui/core/Tooltip'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ViewModule from "@material-ui/icons/ViewModule"
import Grid from "@material-ui/core/Grid"
import ViewHeadline from "@material-ui/icons/ViewHeadline"
import blue from "@material-ui/core/colors/blue"
import SearchInput from "../components/SearchInput.jsx"
import CategoryItem from "../components/CategoryItem.jsx"
import ChannelList from "../components/ChannelList.jsx"
import config from "../../config/config"

const drawerWidth = 240

const fetchPromise = (url, id) => {
    return new Promise((resolve, reject) => {
        fetch(url).then((res) => {
            res.json().then((data) => {
                resolve({
                    id,
                    list: data[0].list
                })
            }, (err) => {
                reject(err)
            })
        }, (err) => {
            reject(err)
        })
    })
}

const styles = (theme) => ({
    root: {
        flexGrow: 1,
        height: "100vh",
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        backgroundColor: blue[500]
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing.unit * 7,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing.unit * 9,
        },
    },
    toolbar: Object.assign({}, {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px'
    }, theme.mixins.toolbar),
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: `32px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
        overflowY: "auto",
        marginTop: 56
    },
    container: {
        minHeight: "calc(100% - 340px)",
        [theme.breakpoints.only("xs")]: {
            minHeight: "0"
        }
    }
})

class MiniDrawer extends React.Component {
    render() {
        const { classes, theme } = this.props

        return (
            <div className={classes.root}>
                <AppBar
                    position="absolute"
                    className={classNames(classes.appBar,
                        this.state.open && classes.appBarShift)}
                >
                    <Toolbar disableGutters={!this.state.open}>
                        <Tooltip title="显示文字">
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={this.openDrawer}
                                className={classNames(classes.menuButton,
                                    this.state.open && classes.hide)}
                            >
                                <MenuIcon />
                            </IconButton>
                        </Tooltip>
                        <Typography variant="title" color="inherit" noWrap>
                            {this.props.category}
                        </Typography>
                        <div style={{ flex: "1 1 auto" }}></div>
                        <SearchInput className={classes.input}
                            channelList={this.state.currentChannelList}
                            setFilter={this.setFilter} />
                        <div style={{ margin: "0 20px 0 10px" }}>
                            <IconButton onClick={() => {
                                this.setIsHidePicture(!this.state.isHidePicture)
                            }}>
                                {this.state.isHidePicture ?
                                    <ViewHeadline /> : <ViewModule />}
                            </IconButton>
                        </div>
                    </Toolbar>
                </AppBar>
                <Drawer
                    variant="permanent"
                    classes={{
                        paper: classNames(classes.drawerPaper,
                            !this.state.open && classes.drawerPaperClose),
                    }}
                    open={this.state.open}
                >
                    <div className={classes.toolbar}>
                        <IconButton onClick={this.closeDrawer}>
                            {theme.direction === 'rtl' ?
                                <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </div>
                    <Divider />
                    <List>
                        {this.state.categoryList.map((category) => (
                            <CategoryItem key={category.categoryId}
                                name={category.name}
                                isActive={
                                    this.state.category === category.name
                                }
                            />
                        ))}
                    </List>
                    <Divider />
                    <List>
                        <CategoryItem key="101" name="我的收藏"
                            isActive={this.state.category === "我的收藏"} />
                    </List>
                </Drawer>
                <main className={classes.content}>
                    <div className={classes.toolbar}
                        style={{ height: 0, minHeight: 0 }}
                    />
                    <div className={classes.container}>
                        <ChannelList isHidePicture={this.state.isHidePicture}
                            channelList={this.state.currentChannelList}
                            cacheNum={this.state.timestamp}
                            filter={this.state.filter} />
                    </div>
                    <footer style={{
                        background: blue[500],
                        color: "#fff",
                        marginTop: "40px",
                        padding: "20px 70px 20px 70px"
                    }}>
                        <Grid container alignContent="space-around">
                            <Grid item xs={12} sm={6} >
                                <Typography variant="headline" paragraph color="inherit">
                                    友情链接
                                </Typography>
                                <a href="http://tv.byr.cn/">
                                    <Typography variant="subheading" color="inherit">
                                        北邮人IPTV直播
                                    </Typography>
                                </a>
                                <a href="http://video.dlut.edu.cn/">
                                    <Typography variant="subheading" color="inherit">
                                        大工媒体服务
                                    </Typography>
                                </a>
                                <a href="http://tv.jlu6.edu.cn/">
                                    <Typography variant="subheading" color="inherit">
                                        吉大电视直播
                                    </Typography>
                                </a>
                                <a href="http://dh.sau.edu.cn/">
                                    <Typography variant="subheading" color="inherit">
                                        沈航媒体服务
                                    </Typography>
                                </a>
                                <a href="http://tv6.ustc.edu.cn/">
                                    <Typography variant="subheading" color="inherit">
                                        中国科大电视直播
                                    </Typography>
                                </a>
                                <a href="http://hdtv.lzu6.edu.cn/">
                                    <Typography variant="subheading" color="inherit">
                                        兰州大学高清电视
                                    </Typography>
                                </a>
                                <a href="http://itv.ahau.edu.cn">
                                    <Typography variant="subheading" color="inherit">
                                        安徽农大网络电视
                                    </Typography>
                                </a>
                                <a href="http://iptv.neusoft.edu.cn">
                                    <Typography variant="subheading" color="inherit">
                                        大连东软信息技术学院IPv6网络电视
                                    </Typography>
                                </a>
                                <a href="http://iptv.tsinghua.edu.cn/">
                                    <Typography variant="subheading" paragraph color="inherit">
                                        清华大学IPTV
                                    </Typography>
                                </a>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="headline" paragraph color="inherit">
                                    联系我们
                                </Typography>
                                <Typography variant="subheading" color="inherit">
                                    东北大学网络中心
                                </Typography>
                                <a href="https://github.com/Zack-Bee/hdtv">
                                    <Typography variant="subheading" paragraph color="inherit">
                                        Github
                                    </Typography>
                                </a>
                                <a href="https://hdtv.neu6.edu.cn/thx">
                                    <Typography variant="headline" paragraph color="inherit">
                                        鸣谢
                                </Typography>
                                </a>
                                <a href="https://hdtv.neu6.edu.cn/faq">
                                    <Typography variant="headline" paragraph color="inherit">
                                        FAQ
                                </Typography>
                                </a>
                                <a href="https://hdtv.neu6.edu.cn/index.html">
                                    <Typography variant="subheading" color="inherit">
                                        旧版HDTV
                                </Typography>
                                </a>
                                <a href="https://hdtv.neu6.edu.cn/soft/neutv.apk">
                                    <Typography variant="subheading" color="inherit">
                                        安卓客户端
                                </Typography>
                                </a>
                            </Grid>
                        </Grid>
                    </footer>
                </main>
            </div>
        )
    }

    constructor(props) {
        super(props)
        this.state = {
            open: false,
            category: this.props.category,
            search: "",
            isHidePicture: false,
            currentChannelList: [],
            categoryList: [],
            timestamp: Date.now(),
            filter: ""
        }
        this.closeDrawer = this.closeDrawer.bind(this)
        this.openDrawer = this.openDrawer.bind(this)
        this.setCategory = this.setCategory.bind(this)
        this.setIsHidePicture = this.setIsHidePicture.bind(this)
        this.setFilter = this.setFilter.bind(this)
        this.freshTitle = this.freshTitle.bind(this)
        this.freshDetail = this.freshDetail.bind(this)
    }

    componentDidMount() {
        // console.log(this.props)
        let isHidePicture = localStorage.getItem("isHidePicture")

        if (isHidePicture) {
            isHidePicture = JSON.parse(isHidePicture)
        } else {
            isHidePicture = false
            localStorage.setItem("isHidePicture", JSON.stringify(false))
        }

        this.setState({
            isHidePicture
        })

        fetch(config.channels).then((res) => {
            res.json().then((channels) => {
                this.freshFavoriteListInfo(channels)
                this.setState({
                    categoryList: channels
                }, () => {
                    this.freshDetail()
                    this.getVideoMap(channels).then(this.freshTitle)
                })

                this.applySelectCategory()
            })
        })

        // 周期性更新信息
        this.timer = setInterval(() => {
            // console.log("change")
            this.setState({
                timestamp: Date.now()
            })
            this.freshDetail()
            this.getVideoMap(this.state.categoryList).then(this.freshTitle)
        }, 1000 * 120)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.category === this.props.category) {
            return
        }

        this.applySelectCategory()
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }

    // 打开侧面导航栏
    openDrawer() {
        this.setState({ open: true })
    }

    // 关闭侧面导航栏
    closeDrawer() {
        this.setState({ open: false })
    }

    // 设置分类
    setCategory(category) {
        this.setState({ category })
    }

    // 设置是否隐藏图片
    setIsHidePicture(isHidePicture) {
        localStorage.setItem("isHidePicture", JSON.stringify(isHidePicture))
        this.setState({ isHidePicture })
    }

    // 设置筛选节目的filter
    setFilter(filter) {
        this.setState({ filter })
    }

    // 获取节目观看人数等详细信息
    freshDetail() {
        let channels = this.state.categoryList
        fetch(config.details).then((res) => {
            res.json().then((details) => {
                let detailsMap = {}

                // 使用map存储, 将查找修改的复杂度从O(n^2)降低到O(n)
                for (let i of details) {
                    detailsMap[i.channelId] = i
                }
                for (let i = 0, len1 = channels.length;
                    i < len1; i++) {
                    for (let j = 0, list = channels[i].channelList,
                        len2 = list.length; j < len2; j++) {
                        list[j].viewerNum = detailsMap[list[j].channelId].viewerNum
                    }
                }

                this.setState({
                    categoryList: channels
                })
            })
        })

        this.setState({
            timestamp: Date.now()
        })
    }

    // 根据节目单刷新标题
    freshTitle(videoMap) {
        let currentMap = {},
            now = Math.floor(Date.now() / 1000)

        // 根据节目单map得到当前播放的节目的名称
        for (let i in videoMap) {
            for (let j = 0, len = videoMap[i].length; j < len; j++) {
                if ((now <= videoMap[i][j].endTime) &&
                    (now >= videoMap[i][j].startTime)) {
                    currentMap[i] = videoMap[i][j].title
                    break
                }
            }
        }
        for (let i = 0, categoryList = this.state.categoryList;
            i < categoryList.length; i++) {
            for (let j = 0; j < categoryList[i].channelList.length; j++) {
                let channel = categoryList[i].channelList[j]
                channel.title = currentMap[channel.channelId] || " "
            }
        }
        this.setState({
            categoryList: this.state.categoryList
        })
    }

    freshFavoriteListInfo(channels) {

        // 获取收藏的节目
        let favoriteList = localStorage.getItem("favoriteList")
        if (!favoriteList) {
            localStorage.setItem("favoriteList", JSON.stringify([]))
            this.favoriteCategory = []
        } else {

            // 从所有频道中得到收藏节目的信息
            favoriteList = JSON.parse(favoriteList)
            for (let i = 0, categoryList = channels,
                len = categoryList.length; i < len; i++) {
                if (categoryList[i].name === "所有频道") {
                    this.favoriteCategory = []
                    favoriteList.forEach((id) => {
                        for (let j = 0; j < categoryList[i].channelList.length;
                            j++) {
                            if (categoryList[i].channelList[j].channelId ===
                                id) {
                                this.favoriteCategory.push(
                                    categoryList[i].channelList[j]
                                )
                            }
                        }
                    })
                    break
                }
            }
        }
    }

    // 获取所有节目的节目单的map
    getVideoMap(channels) {
        return new Promise((resolve) => {
            let storeSaveTime = sessionStorage.getItem("saveTime"),
                saveTime = Number(storeSaveTime),
                saveDate = new Date(saveTime).getDate(),
                currentDate = new Date().getDate(),
                videoMap = sessionStorage.getItem("videoMap")

            // 如果节目单信息过期, 则发送请求更新节目单
            if (!storeSaveTime || !videoMap ||
                (saveTime - Date.now() > 40 * 60 * 1000) ||
                currentDate !== saveDate) {
                for (let i = 0, list = channels, len = list.length;
                    i < len; i++) {
                    if (list[i].name === "所有频道") {
                        let fetchAllPromise = []
                        for (let j = 0;
                            j < list[i].channelList.length;
                            j++) {
                            let channelId = list[i].channelList[j].channelId
                            fetchAllPromise.push(
                                fetchPromise(
                                    `${config.list}/${channelId}/1`,
                                    list[i].channelList[j].channelId
                                )
                            )
                        }
                        let allVideo = {}
                        Promise.all(fetchAllPromise).then((list) => {
                            list.forEach((info) => {
                                allVideo[info.id] = info.list
                            })
                            sessionStorage.setItem("saveTime", Date.now())
                            sessionStorage.setItem("videoMap",
                                JSON.stringify(allVideo))
                            resolve(allVideo)
                        })
                    }
                }
            } else {

                // 直接使用本地存储中的节目map
                resolve(JSON.parse(videoMap))
            }
        })
    }

    applySelectCategory() {

        // 切换到收藏的节目单
        if (this.props.category === "我的收藏") {
            this.setState({
                currentChannelList: this.favoriteCategory || []
            })
            return
        }

        // 切换不同的分类
        for (let i = 0, list = this.state.categoryList, len = list.length;
            i < len; i++) {
            if (list[i].name === this.props.category) {
                this.setState({
                    currentChannelList: list[i].channelList
                })
                return
            }
        }
    }
}

export default withStyles(styles, { withTheme: true })(MiniDrawer)
