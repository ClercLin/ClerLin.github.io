function game2048(){
    let len=4;
    let size=20;
    let margin=4;
    let score=0;
    let winNum=2048;
    let isGameOver=false;

    
    //实例化视图对象
    let view = new View(len,size,margin)
    let board = new Board(len)

    view.init()
    board.init()

    board.onGenerate=function(e){
        
        view.addNum(e.x,e.y,e.num)
    }
    board.generate()
    board.generate()

    board.onMove=function(e){
        view.move(e.from,e.to)

        if(e.to.num > e.from.num){
            score+=e.to.num
            view.updateScore(score)
        }
        if(e.to.num>=winNum){//赢了呀
            // alert('恭喜，您获胜了！')
            setTimeout(function(){
                isGameOver=true
            view.win()
            },400)
            
        }
    }
    board.onMoveComplete=function(arr){
        setTimeout(function(e){
            view.updateView(arr)
        },300)
        if(board.canMove()){
        setTimeout(function(){
            board.generate()
        },400)
    }
        if(!board.canMove()){
            //alert('游戏结束，你的分数是：'+score)
            isGameOver=true
            view.over(score)
        }
    }

    // $('button').eq(0).click(function(){
    //     board.moveLeft()
    // })
    // $('button').eq(1).click(function(){
    //     board.moveRight()
    // })
    // $('button').eq(2).click(function(){
    //     board.moveUp()
    // })
    // $('button').eq(3).click(function(){
    //     board.moveDown()
    // })

    $(document).keydown(function(e){
        if(isGameOver){
            return false
        }
        switch(e.which){
            case 37:board.moveLeft(); break;
            case 38:board.moveUp(); break;
            case 39:board.moveRight(); break;
            case 40:board.moveDown(); break;
        }
    })
    document.addEventListener('touchstart',function(e){
        startx=e.touches[0].pageX
        starty=e.touches[0].pageY
        
    })
    document.addEventListener('touchend',function(e){ 
        endx=e.changedTouches[0].pageX
        endy=e.changedTouches[0].pageY
        if(isGameOver){
            return false
        }
        if(Math.abs(endx-startx)>Math.abs(endy-starty)){

            // x轴移动
            if((endx-startx)>0){
                // 向右运动
                board.moveRight();
            }
            else{
                // 向左运动
                board.moveLeft();
            }
        }
        else{
            if((endy-starty)>0){
                // 向下移动
                board.moveDown();
            }
            else{
                // 向上运动
                board.moveUp();
            }
        }
    })


    $('#game_restart').on('click',function(){
        restart()
    })
    function restart(){
        score=0
        view.updateScore(score)
        $('#game_over').addClass('game-hide')
        $('.game-num').remove()
        board.init()
        view.init()
        board.generate()
        board.generate()
        isGameOver=false
    }
}
//控制游戏视图的类
class View{
    constructor(len,size,margin){
        this.len=len;
        this.size=size;
        this.margin=margin;

        this.cellcon=$('#cell-con')
        this.numcon=$('#num-con')
    }
    //计算位置的方法
    getPos(n){
        return this.margin+n*(this.size+this.margin)
    }
     init(){
        for(let x=0;x<this.len;x++){
            for(let y=0;y<this.len;y++){
                let cell = $('<div>').addClass('game-cell').css({
                    top:this.getPos(x)+'%',
                    left:this.getPos(y)+'%'
                })
                this.cellcon.append(cell)
            }
        }
     }
     addNum(x,y,n){
        let num=$('<div>').addClass(`game-num game-num-${n}`).attr('id',`cell-${x}-${y}`).css({
          left:this.getPos(y)+'%',
          top:this.getPos(x)+'%'
      }).text(n)
        
      this.numcon.append(num)
    }
     move(from,to){
        $(`#cell-${from.x}-${from.y}`).animate({
            top:this.getPos(to.x)+'%',
            left:this.getPos(to.y)+'%'
        },150)
     }
     updateView(arr){
        
        $('.game-num').remove()
        for(let x=0;x<this.len;x++){
          for(let y=0;y<this.len;y++){
            if(arr[x][y]!=0){
              this.addNum(x,y,arr[x][y])
            }
          }
        }
    }
    updateScore(score){
        $('#game_score').text(score)
    }
    win(){
        $('#game_over').removeClass('game-hide')
        $('#game_over_info p').text('恭喜，您获胜了！')
      }
      over(score){
        $('#game_over').removeClass('game-hide')
        $('#game_over_info p').text('游戏结束，您的得分是：'+score)
      }
}

//控制游戏数值的类
class Board{
   constructor(len){
    this.len=len
    this.arr=[]
   }
   init(){
    for(let x=0;x<this.len;x++){
        this.arr[x]=[]
        for(let y=0;y<this.len;y++){
            this.arr[x][y]=0
   }
}

   }
// 自定义事件
onGenerate(){}
onMove(){}
onMoveComplete(){}

  generate(){
    let empty=[]
    for(let x=0;x<this.len;x++){
        for(let y=0;y<this.len;y++){
            if(this.arr[x][y]==0){
                empty.push({x:x,y:y})
            }
   }
}
    let rnd=Math.floor(Math.random()*empty.length);
    let one = empty[rnd]
    this.arr[one.x][one.y]=Math.random()<0.5?2:4;
    
    this.onGenerate({x:one.x,y:one.y,num:this.arr[one.x][one.y]})
    }
    moveLeft(){//左移
        for(let x=0;x<this.len;x++){
            for(let y=0;y<this.len;y++){
                for(let next=y+1;next<this.len;next++){
                    if(this.arr[x][next]==0){
                        continue
                    }else{
                        if(this.arr[x][y]==0){
                            this.arr[x][y]=this.arr[x][next]
                            this.onMove({
                                from:{x:x,y:next,num:this.arr[x][next]},
                                to:{x:x,y:y,num:this.arr[x][y]}
                            })
                            this.arr[x][next]=0
                            y--
                        }
                        else if(this.arr[x][y]==this.arr[x][next]){
                            this.arr[x][y]+=this.arr[x][next]
                            this.onMove({
                                from:{x:x,y:next,num:this.arr[x][next]},
                                to:{x:x,y:y,num:this.arr[x][y]}
                            })
                            this.arr[x][next]=0
                        }
                    }
                    break
                }
            }
        }
        
        this.onMoveComplete(this.arr)
    }
    moveRight(){//右移
        for(let x=0;x<this.len;x++){
            for(let y=this.len-1;y>=0;y--){
                for(let next=y-1;next>=0;next--){
                    if(this.arr[x][next]==0){
                        continue
                    }else{
                        if(this.arr[x][y]==0){
                            this.arr[x][y]=this.arr[x][next]
                            this.onMove({
                                from:{x:x,y:next,num:this.arr[x][next]},
                                to:{x:x,y:y,num:this.arr[x][y]}
                            })
                            this.arr[x][next]=0
                            y++
                        }
                        else if(this.arr[x][y]==this.arr[x][next]){
                            this.arr[x][y]+=this.arr[x][next]
                            this.onMove({
                                from:{x:x,y:next,num:this.arr[x][next]},
                                to:{x:x,y:y,num:this.arr[x][y]}
                            })
                            this.arr[x][next]=0
                        }
                    }
                    break
                }
            }
        }
        
        this.onMoveComplete(this.arr)
    }
    moveUp(){//上移
        for(let y=0;y<this.len;y++){
            for(let x=0;x<this.len;x++){
                for(let next=x+1;next<this.len;next++){
                    if(this.arr[next][y]==0){
                        continue
                    }else{
                        if(this.arr[x][y]==0){
                            this.arr[x][y]=this.arr[next][y]
                            this.onMove({
                                from:{x:next,y:y,num:this.arr[next][y]},
                                to:{x:x,y:y,num:this.arr[x][y]}
                            })
                            this.arr[next][y]=0
                            x--
                        }
                        else if(this.arr[x][y]==this.arr[next][y]){
                            this.arr[x][y]+=this.arr[next][y]
                            this.onMove({
                                from:{x:next,y:y,num:this.arr[next][y]},
                                to:{x:x,y:y,num:this.arr[x][y]}
                            })
                            this.arr[next][y]=0
                        }
                    }
                    break
                }
            }
        }
        
        this.onMoveComplete(this.arr)
    }
    moveDown(){//下移
        for(let y=0;y<this.len;y++){
            for(let x=this.len-1;x>=0;x--){
                for(let next=x-1;next>=0;next--){
                    if(this.arr[next][y]==0){
                        continue
                    }else{
                        if(this.arr[x][y]==0){
                            this.arr[x][y]=this.arr[next][y]
                            this.onMove({
                                from:{x:next,y:y,num:this.arr[next][y]},
                                to:{x:x,y:y,num:this.arr[x][y]}
                            })
                            this.arr[next][y]=0
                            x++
                        }
                        else if(this.arr[x][y]==this.arr[next][y]){
                            this.arr[x][y]+=this.arr[next][y]
                            this.onMove({
                                from:{x:next,y:y,num:this.arr[next][y]},
                                to:{x:x,y:y,num:this.arr[x][y]}
                            })
                            this.arr[next][y]=0
                        }
                    }
                    break
                }
            }
        }
        
        this.onMoveComplete(this.arr)
    }
    canMove(){
        //遍历数组，如果没有=0的/相邻没有==、则不能继续移动
        for(let x=0;x<this.len;x++){
            for(let y=0;y<this.len;y++){
                if(this.arr[x][y]==0){
                    return true
                }
                let cur=this.arr[x][y]
                let right=this.arr[x][y+1]
                let down=this.arr[x + 1] ? this.arr[x + 1][y] : null
                if(cur==right||cur==down){
                    return true
                }
            }
        }
        return false
      }
}