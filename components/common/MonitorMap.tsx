import {memo} from 'react'
import {BaseProps} from './type'
import classnames from "classnames";
import _ from "lodash";
interface IProps extends BaseProps{
    activePos?: any
}
function MonitorMap_(p:IProps){
    const {className,activePos} = p
    const basePos = [
        [[42,49]],
        [[41,50]],
        [[38,53]],
        [[37,53]],
        [[20,26],[35,52]],
        [[18,28],[34,51],[82,85],[96,100],[110,111]],
        [[17,24],[27,27],[29,32],[36,36],[38,51],[81,84],[92,101],[109,111]],
        [[3,6],[11,12],[16,27],[29,34],[40,51],[80,81],[86,86],[89,89],[91,106],[110,115]],
        [[2,8],[10,24],[26,27],[30,36],[40,50],[67,74],[83,83],[85,86],[88,123]],
        [[2,24],[26,26],[28,31],[34,37],[40,49],[66,75],[77,86],[88,124]],
        [[1,31],[34,38],[40,46],[51,54],[66,73],[76,124]],
        [[1,28],[31,31],[33,37],[41,44],[52,53],[64,123]],
        [[2,27],[33,37],[42,43],[63,115],[118,122]],
        [[4,8],[11,27],[33,38],[60,60],[64,114],[116,119]],
        [[3,7],[13,30],[33,39],[59,61],[64,109],[116,118]],
        [[2,3],[13,31],[33,40],[58,62],[64,110],[116,118]],
        [[0,1],[14,40],[58,111],[116,117]],
        [[16,36],[40,40],[60,111],[115,116]],
        [[16,38],[40,41],[61,78],[81,109],[111,111]],
        [[16,39],[60,71],[73,73],[75,77],[80,108]],
        [[16,37],[58,62],[66,66],[68,71],[76,78],[80,108],[110,111]],
        [[16,35],[58,61],[65,65],[67,67],[69,78],[81,102],[104,107],[110,110]],
        [[17,35],[59,60],[63,65],[67,67],[69,69],[71,78],[80,103],[105,106],[109,110]],
        [[18,34],[61,65],[74,103],[105,105],[108,110]],
        [[19,32],[59,66],[69,70],[74,103],[107,108]],
        [[20,32],[58,104],[106,107]],
        [[20,27],[31,32],[58,78],[80,104]],
        [[21,26],[31,31],[57,73],[75,78],[82,103]],
        [[21,21],[23,25],[56,73],[75,82],[85,103]],
        [[23,26],[28,29],[31,33],[56,74],[76,82],[86,101]],
        [[23,29],[34,36],[56,74],[76,81],[87,91],[94,98],[100,100],[104,104]],
        [[25,30],[56,75],[77,80],[87,90],[94,99],[103,104]],
        [[28,31],[56,75],[77,78],[87,89],[95,99],[103,104]],
        [[30,31],[34,37],[55,76],[88,89],[96,99],[104,104]],
        [[30,39],[56,79],[88,89],[96,96],[98,98],[102,102],[104,105]],
        [[31,40],[57,79],[88,89],[96,96],[101,102],[104,105]],
        [[33,42],[58,61],[64,79],[95,97],[101,102]],
        [[32,42],[65,78],[95,97],[100,102],[106,106]],
        [[32,43],[65,76],[96,97],[100,104],[106,108]],
        [[31,45],[65,76],[96,98],[100,102],[104,104],[107,111]],
        [[31,47],[65,75],[97,99],[107,112]],
        [[31,47],[66,75],[98,100],[110,113]],
        [[32,47],[66,75],[100,101],[104,105],[110,113]],
        [[33,47],[66,76],[78,79],[107,108],[113,113]],
        [[33,46],[65,76],[78,79],[105,108],[111,111]],
        [[34,46],[65,75],[77,79],[104,112]],
        [[35,46],[66,75],[77,79],[104,113]],
        [[35,45],[66,74],[77,78],[102,113]],
        [[35,44],[67,74],[77,78],[101,114]],
        [[35,43],[67,73],[77,77],[101,114]],
        [[35,43],[67,72],[101,114]],
        [[35,42],[68,72],[102,114]],
        [[35,41],[68,71],[102,114]],
        [[34,41],[68,69],[101,103],[108,108],[110,114],[123,123]],
        [[34,39],[110,113],[123,124]],
        [[34,38],[111,112],[122,124]],
        [[34,37],[112,113],[122,124]],
        [[34,36],[112,112],[121,122]],
        [[33,37],[120,121]],
        [[33,36]],
        [[33,35]],
        [[34,37]],
        [[35,36]],
    ]
    const pos2arr = (arr)=>{
        const start  = arr[0]
        const end  = arr[1]
        const fArr = []
        for(let i = start; i <= end; i++){
            fArr.push(i)
        }
        return fArr
    }
    const matchNode = (x,y)=>{
        const item = _.find(activePos,(item)=>{
            return item.x === x && item.y === y
        })
        return !!item?'red':'#666'
    }
    return(
        <svg width={954} height={450} className={classnames(className)}>
            { basePos.map((pos,posIndex) => {
                return pos.map(yItems=>{
                    return pos2arr(yItems).map((item,index)=>{
                        return(
                            <circle key={`circle${index}`} fill={matchNode(item,posIndex)} cx={(item+1)*7} cy={(posIndex+1)*7} r="2.6"/>
                        )
                    })
                })
            })}
        </svg>
    )
}
export const MonitorMap = memo(MonitorMap_)