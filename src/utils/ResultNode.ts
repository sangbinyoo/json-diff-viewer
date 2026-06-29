import { ResultNode } from "../components";
import { DiffType } from "../components/MainLayout/ResultPanel/ResultPanel";

export type SummaryResult = {added:number,removed:number,changed:number,unchanged:number};

export function getDiffType(origin: any, target: any, key: string, parentNode: ResultNode): DiffType {
    
    if(parentNode?.type === 'added') return 'added';

    if(!target.hasOwnProperty(key)){
        return 'removed';
    }else if(!origin.hasOwnProperty(key)){
        return 'added';
    }else if(origin[key] === target[key]){
        return 'unchanged';
    }else{
        return 'changed';
    }
}


export function getResultNodes(origin: any, target: any,parentNode:ResultNode, sortValue:string): ResultNode[] {
    //origin, target의 프로퍼티를 모두 합친 property list 추출(단 중복은 제거한다)
    if(!origin || !target || !isObject(origin, target)) return [];

    //key 추출 및 sorting type에 따라 정렬
    let props:string[] = [];
    new Set([...Object.keys(origin), ...Object.keys(target)]).forEach(key=> props.push(key));
    switch(sortValue){
        case 'key':
            props.sort((a,b)=> a.localeCompare(b));
            break;
        case 'type':
            props.sort((a,b)=>{
                const typeA = getDiffType(origin, target, a, parentNode);
                const typeB = getDiffType(origin, target, b, parentNode);
                return typeA.localeCompare(typeB);
            });
            break;
        case 'original':
            break;
    }
    //key list를 순회하면서 node를 생성 및 type 결정
    //orgin[key]이나 target[key]가 객체인 경우, 재귀적으로 getResultNodes호출해서 children노드 생성
    let currentNodes:ResultNode[] = [];

    props.forEach(key => {
        let currentNode:ResultNode = {
            key: key,
            value: { origin: origin[key], target: target[key] },
            type: getDiffType(origin, target, key, parentNode),
            title: Array.isArray(parentNode) ? origin[key]:key,
            children: []
        }
        currentNode.children = getResultNodes(origin[key], target[key], currentNode, sortValue)
        currentNodes.push(currentNode);
    })
    return currentNodes;

}

function isObject(origin: any, target: any): boolean {
    return typeof origin === 'object' && origin !== undefined && origin !== null || typeof target === 'object' && target !== undefined && target !== null;
}


export function getSummary(allNodes:ResultNode[], result:SummaryResult){
    
    allNodes.forEach(current=>{
        result[current.type] += 1
        if(current.children){
            getSummary(current.children, result)
        }
    })


}