import service from '@/utils/request'

export function SelectDepts(data) {
    return service({
        url: '/User/SelectDepts',
        method: 'post',
        data
    })
}

export function SelectDeptorUser(data) {
    return service({
        url: 'EvaluationUser/SelectDeptorUser',
        method: 'post',
        data
    })
}



