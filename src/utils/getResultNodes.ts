import { ResultNode } from "../components/mockup";
import { DiffType } from "../components/mockup/ResultPanel";


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


export function getResultNodes(origin: any, target: any,parentNode:ResultNode): ResultNode[] {
    //origin, target의 프로퍼티를 모두 합친 property list 추출(단 중복은 제거한다)
    if(!origin || !target || !isObject(origin, target)) return [];

    
    //key list를 순회하면서 node를 생성 및 type 결정
    //orgin[key]이나 target[key]가 객체인 경우, 재귀적으로 getResultNodes호출해서 children노드 생성
    let currentNodes:ResultNode[] = [];
    const props = new Set([...Object.keys(origin), ...Object.keys(target)]);
    props.forEach(key => {
        let currentNode:ResultNode = {
            key: key,
            value: { origin: origin[key], target: target[key] },
            type: getDiffType(origin, target, key, parentNode),
            title: Array.isArray(parentNode) ? origin[key]:key,
            children: []
        }
        currentNode.children = getResultNodes(origin[key], target[key], currentNode)
        currentNodes.push(currentNode);
    })
    return currentNodes;

}

function isObject(origin: any, target: any): boolean {
    return typeof origin === 'object' && origin !== undefined && origin !== null || typeof target === 'object' && target !== undefined && target !== null;
}