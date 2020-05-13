import service from '@/utils/request'

export function InsertPaper(data) {
    return service({
        url: '/KS_Paper/InsertPaper',
        method: 'post',
        data
    })
}

export function SelectPaper(data) {
    return service({
        url: '/KS_Paper/SelectPaper',
        method: 'post',
        data
    })
}

export function DeletePaper(data) {
    return service({
        url: '/KS_Paper/DeletePaper',
        method: 'post',
        data
    })
}

export function UpdateUser(data) {
    return service({
        url: '/KS_Paper/UpdateUser',
        method: 'post',
        data
    })
}

export function SelectPaperDetailById(data) {
    return service({
        url: '/KS_Paper/SelectPaperDetailById',
        method: 'post',
        data
    })
}

export function InsertTask(data) {
    return service({
        url: '/KS_Task/InsertTask',
        method: 'post',
        data
    })
}

export function UpdateTask(data) {
    return service({
        url: '/KS_Task/UpdateTask',
        method: 'post',
        data
    })
}

export function SelectTask(data) {
    return service({
        url: '/KS_Task/SelectTask',
        method: 'post',
        data
    })
}



