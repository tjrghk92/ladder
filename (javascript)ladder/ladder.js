document.addEventListener("DOMContentLoaded", () => {
    let heightNode = 10;
    let widthNode =  0;

    let LADDER = {};
    let row =0;
    let ladder = document.querySelector('#ladder');
    let ladder_canvas = document.querySelector('#ladder_canvas');
    let GLOBAL_FOOT_PRINT= {};
    let GLOBAL_CHECK_FOOT_PRINT= {};
    let working = false;
    
    const init = () => {
        canvasDraw();
    }

    const canvasDraw = () => {
        ladder.style.width = ( widthNode-1) * 100 + 6;
        ladder.style.height = (heightNode -1 ) * 25 + 6;
        ladder.style.backgroundColor = '#fff';
        ladder_canvas.width = ( widthNode-1) * 100 + 6;
        ladder_canvas.height = ( heightNode-1) * 25 + 6;

        setDefaultFootPrint();
        reSetCheckFootPrint();
        setDefaultRowLine();
        setRandomNodeData(); 
        drawNodeLine();
		drawDefaultLine();
        userSetting();
        resultSetting();
    }
	
	document.querySelector('#button').addEventListener('click', (e) => {
        const member = document.querySelector('input[name=member]').value;
        const landing = document.querySelector('#landing');
        if(member < 2){
            return alert('최소 2명 이상 선택하세요.')
        }

        if(member > 20){
            return alert('너무 많아요.. ㅠㅠ')   
        }      
        
        landing.style.opacity = 0;
        widthNode = member;
        setTimeout(() => {
            landing.remove();
            init();
        }, 310)
	});
    
    let userName = "";

    const userBtnSetting = () => {
        var ladderBtn = document.querySelectorAll('button.ladder-start');
        
        ladderBtn.forEach((o) => {
            o.addEventListener('click', (e) => {
                if(working){
                    return false;
                }
                working = true;
                reSetCheckFootPrint();
                var _this = e.target;
                _this.disabled = true
                _this.style.color = '#000'
                _this.style.border = '1px solid #F2F2F2'
                _this.style.opacity = '0.3';
              
                var node = _this.dataset.node;
                var color =  _this.dataset.color;
                startLineDrawing(node, color);
                userName =  document.querySelector('input[data-node="'+node+'"]').value;
            });
        });
    }
    
    const startLineDrawing = (node , color) => {

        var node = node;
        var color = color;
        
        var x = node.split('-')[0]*1;
        var y = node.split('-')[1]*1;
        var nodeInfo = GLOBAL_FOOT_PRINT[node];

        GLOBAL_CHECK_FOOT_PRINT[node] = true;
        
        var dir = 'r'
        if(y == heightNode ){
            reSetCheckFootPrint();
            var target = document.querySelector('input[data-node="'+node+'"]');

            target.style.backgroundColor = color;
            document.getElementById(node + "-user").innerText = userName;
            working = false;
            return false;
        }
        if(nodeInfo["change"] ){
            var leftNode = (x-1) + "-" +y;
            var rightNode = (x+1) + "-" +y;
            var downNode = x +"-"+ (y + 1);
            var leftNodeInfo = GLOBAL_FOOT_PRINT[leftNode];
            var rightNodeInfo = GLOBAL_FOOT_PRINT[rightNode];
                
            if(GLOBAL_FOOT_PRINT.hasOwnProperty(leftNode) && GLOBAL_FOOT_PRINT.hasOwnProperty(rightNode)){      
                var leftNodeInfo = GLOBAL_FOOT_PRINT[leftNode];
                var rightNodeInfo = GLOBAL_FOOT_PRINT[rightNode];
                if(  (leftNodeInfo["change"] &&  leftNodeInfo["draw"] && !!!GLOBAL_CHECK_FOOT_PRINT[leftNode] ) && (rightNodeInfo["change"])&&  leftNodeInfo["draw"]  && !!!GLOBAL_CHECK_FOOT_PRINT[rightNode] ){
                    //Left우선 
                    console.log("중복일때  LEFT 우선");
                    stokeLine(x, y, 'w' , 'l' , color ,3)
                     setTimeout(() => { 
                         return startLineDrawing(leftNode, color)
                     }, 100);
                }
                else if(  (leftNodeInfo["change"] &&  !!!leftNodeInfo["draw"] && !!!GLOBAL_CHECK_FOOT_PRINT[leftNode] ) && (rightNodeInfo["change"]) && !!!GLOBAL_CHECK_FOOT_PRINT[rightNode] ){
                    console.log('RIGHT 우선')
                    stokeLine(x, y, 'w' , 'r' , color ,3)
                    console.log("right")
                    setTimeout(() =>{ 
                        return startLineDrawing(rightNode, color)
                     }, 100);
                }
                else if(  (leftNodeInfo["change"] &&  leftNodeInfo["draw"] && !!!GLOBAL_CHECK_FOOT_PRINT[leftNode] ) && (!!!rightNodeInfo["change"]) ){
                    //Left우선 
                    console.log("LEFT 우선");
                    stokeLine(x, y, 'w' , 'l' , color ,3)
                     setTimeout(() =>{ 
                         return startLineDrawing(leftNode, color)
                     }, 100);
                }
                 else if(  !!!leftNodeInfo["change"]  &&  (rightNodeInfo["change"]) && !!!GLOBAL_CHECK_FOOT_PRINT[rightNode] ){
                    //Right우선 
                    console.log("RIGHT 우선");
                    stokeLine(x, y, 'w' , 'r' , color ,3)
                     setTimeout(() =>{ 
                         return startLineDrawing(rightNode, color)
                     }, 100);
                }
                else{
                    console.log('DOWN 우선')
                    stokeLine(x, y, 'h' , 'd' , color ,3)
                    setTimeout(() =>{ 
                       return startLineDrawing(downNode, color)
                    }, 100);
                }
            }else{
                console.log('else')
               if(!!!GLOBAL_FOOT_PRINT.hasOwnProperty(leftNode) && GLOBAL_FOOT_PRINT.hasOwnProperty(rightNode)){      
                    /// 좌측라인
                    console.log('좌측라인')
                    if(  (rightNodeInfo["change"] && !!!rightNodeInfo["draw"] ) && !!!GLOBAL_CHECK_FOOT_PRINT[rightNode] ){
                        //Right우선 
                        console.log("RIGHT 우선");
                        stokeLine(x, y, 'w' , 'r' , color ,3)
                        setTimeout(() =>{ 
                            return startLineDrawing(rightNode, color)
                        }, 100);
                    }else{
                        console.log('DOWN')
                        stokeLine(x, y, 'h' , 'd' , color ,3)
                        setTimeout(() =>{ 
                           return startLineDrawing(downNode, color)
                        }, 100);
                    }
                    
               }else if(GLOBAL_FOOT_PRINT.hasOwnProperty(leftNode) && !!!GLOBAL_FOOT_PRINT.hasOwnProperty(rightNode)){      
                    /// 우측라인
                    console.log('우측라인')
                    if(  (leftNodeInfo["change"] && leftNodeInfo["draw"] ) && !!!GLOBAL_CHECK_FOOT_PRINT[leftNode] ){
                        //Right우선 
                        console.log("LEFT 우선");
                        stokeLine(x, y, 'w' , 'l' , color ,3)
                        setTimeout(() =>{ 
                            return startLineDrawing(leftNode, color)
                        }, 100);
                    }else{
                        console.log('DOWN')
                        stokeLine(x, y, 'h' , 'd' , color ,3)
                        setTimeout(() =>{ 
                           return startLineDrawing(downNode, color)
                        }, 100);
                    }
               }
            }


        }else{
            console.log("down")
            var downNode = x +"-"+ (y + 1);
            stokeLine(x, y, 'h' , 'd' , color ,3)
            setTimeout(() =>{ 
                return startLineDrawing(downNode, color)
             }, 100);
        }
    }



    const userSetting = () => {
        var userList = LADDER[0];
        var html = '';
        for(var i=0; i <  userList.length; i++){
            var color = '#'+(function lol(m,s,c){return s[m.floor(m.random() * s.length)] + (c && lol(m,s,c-1));})(Math,'0123456789ABCDEF',4);

            var x = userList[i].split('-')[0]*1;
            var y = userList[i].split('-')[1]*1;
            var left = x * 100  -30;
            var div = document.createElement('div');
            
            div.classList.add("user-wrap");
            div.style.left = left;
            html += '<input type="text" data-node="'+userList[i]+'"><button class="ladder-start" style="background-color:'+color+'" data-color="'+color+'" data-node="'+userList[i]+'"></button>';
           
            div.innerHTML = html;
            ladder.append(div);
            html = '';
        }

        userBtnSetting();
    }
    const resultSetting = () => {
        var resultList = LADDER[heightNode-1];
        var html = '';
        for(var i=0; i <  resultList.length; i++){
            var x = resultList[i].split('-')[0]*1;
            var y = resultList[i].split('-')[1]*1 + 1;
            var node = x + "-" + y;
            var left = x * 100  -30
            var div = document.createElement('div');

            div.classList.add("answer-wrap");
            div.style.left = left;
            html += '<input type="text" data-node="'+node+'">'
            html +='<p id="'+node+'-user"></p>'
           
            div.innerHTML = html;
            ladder.append(div);
            html = '';
        }
    }

    const drawNodeLine = () => {
        for(var y =0; y < heightNode; y++){
            for(var x =0; x <widthNode ; x++){
                var node = x + '-' + y;
                var nodeInfo  = GLOBAL_FOOT_PRINT[node];
                if(nodeInfo.change && nodeInfo.draw ){
                     stokeLine(x, y ,'w' , 'r' , '#ddd' , '2')
                }
            }
        }
    }

    const stokeLine = (x, y, flag , dir , color , width) => {
        var canvas = document.getElementById('ladder_canvas');
        var ctx = canvas.getContext('2d');
        var moveToStart =0, moveToEnd =0, lineToStart =0 ,lineToEnd =0; 
        var eachWidth = 100; 
        var eachHeight = 25;
        if(flag == "w"){
            //가로줄
            if(dir == "r"){
                ctx.beginPath();
                moveToStart = x * eachWidth -1 ;
                moveToEnd = y * eachHeight -1 ;
                lineToStart = (x+1) * eachWidth -1;
                lineToEnd = y * eachHeight -1;
                
            }else{
                // dir "l"
                 ctx.beginPath();
                moveToStart = x * eachWidth -1;
                moveToEnd = y * eachHeight -1;
                lineToStart = (x- 1) * eachWidth -1;
                lineToEnd = y * eachHeight -1;
            }
        }else{
                ctx.beginPath();
                moveToStart = x * eachWidth -1;
                moveToEnd = y * eachHeight -1;
                lineToStart = x * eachWidth -1;
                lineToEnd = (y+1) * eachHeight -1;
        }

        ctx.moveTo(moveToStart + 3 ,moveToEnd  + 2);
        ctx.lineTo(lineToStart  + 3 ,lineToEnd  + 2 );
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.stroke();
        ctx.closePath();
    }

    const drawDefaultLine = () => {
		 var canvas = document.getElementById('ladder_canvas');
         var ctx = canvas.getContext('2d');
		 for(var x =0; x <widthNode ; x++){
			 ctx.beginPath();
			 ctx.moveTo(x * 100 +1, 0);
			 ctx.lineTo(x * 100 +1, 250);
			 ctx.strokeStyle = "#ddd";
			 //ctx.lineWidth = 2;
			 ctx.stroke();
			 ctx.closePath();
		 }
    }

    const setRandomNodeData = () => {
         for(var y =0; y < heightNode; y++){
            for(var x =0; x <widthNode ; x++){
                var loopNode = x + "-" + y;
                var rand = Math.floor(Math.random() * 2);
                if(rand == 0){
                    GLOBAL_FOOT_PRINT[loopNode] = {"change" : false , "draw" : false}
                }else{
                    if(x == (widthNode - 1)){
                        GLOBAL_FOOT_PRINT[loopNode] = {"change" : false , "draw" : false} ;    
                    }else{
                        GLOBAL_FOOT_PRINT[loopNode] =  {"change" : true , "draw" : true} ;  ;
                        x = x + 1;
                         loopNode = x + "-" + y;
                         GLOBAL_FOOT_PRINT[loopNode] =  {"change" : true , "draw" : false} ;  ;
                    }
                }
            }
         }
    }

    const setDefaultFootPrint = () => {
      
        for(var r = 0; r < heightNode; r++){
            for(var column =0; column < widthNode; column++){
                GLOBAL_FOOT_PRINT[column + "-" + r] = false;
            }
        }
		console.log(GLOBAL_FOOT_PRINT);
    }
    const reSetCheckFootPrint = () => {

        for(var r = 0; r < heightNode; r++){
            for(var column =0; column < widthNode; column++){
                GLOBAL_CHECK_FOOT_PRINT[column + "-" + r] = false;
            }
        }
		console.log(GLOBAL_CHECK_FOOT_PRINT);
    }

    const setDefaultRowLine = () => {

        for(var y =0; y < heightNode; y++){
            var rowArr = [];
            for(var x =0; x <widthNode ; x++){
                var node = x + "-"+ row;
                rowArr.push(node);
                // 노드그리기
                var left = x * 100;
                var top = row * 25;
                var div = document.createElement('div')
                div.class = 'node';
                div.id = node;
                div.dataset.left = left;
                div.dataset.top = top;
                div.style.position = 'absolute';
                div.style.left = left;
                div.style.top = top;
           
                ladder.append(div);
             }
             LADDER[row] =  rowArr;
             row++;
        }
    }



});
