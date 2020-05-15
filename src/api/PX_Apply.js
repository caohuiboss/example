import service from '@/utils/request'

export function InsertApply(data) {
    return service({
        url: '/PX_Apply/InsertApply',
        method: 'post',
        data
    })
}

export function SelectApply(data) {
    return service({
        url: '/PX_Apply/SelectApply',
        method: 'post',
        data
    })
}

export function CancelApplyState(data) {
    return service({
        url: '/PX_Apply/CancelApplyState',
        method: 'post',
        data
    })
}

export function OpenApplyState(data) {
    return service({
        url: '/PX_Apply/OpenApplyState',
        method: 'post',
        data
    })
}

export function UpdateLookState(data) {
    return service({
        url: '/PX_Apply/UpdateLookState',
        method: 'post',
        data
    })
}