import service from '@/utils/request'

export function InsertCourseWare(data) {
    return service({
        url: '/PX_CourseWare/InsertCourseWare',
        method: 'post',
        data
    })
}

export function SelectCourseWare(data) {
    return service({
        url: '/PX_CourseWare/SelectCourseWare',
        method: 'post',
        data
    })
}

export function SelectCourseWareDetailByID(data) {
    return service({
        url: '/PX_CourseWare/SelectCourseWareDetailByID',
        method: 'post',
        data
    })
}

export function DeleteCourseWare(data) {
    return service({
        url: '/PX_CourseWare/DeleteCourseWare',
        method: 'post',
        data
    })
}

export function UpdateCourseWare(data) {
    return service({
        url: '/PX_CourseWare/UpdateCourseWare',
        method: 'post',
        data
    })
}

export function ConvertWordToPdf(data) {
    return service({
        url: '/PX_CourseWare/ConvertWordToPdf',
        method: 'post',
        data
    })
}

export function UploadFile(data) {
    return service({
        url: '/PX_CourseWare/UploadFile',
        method: 'post',
        data
    })
}