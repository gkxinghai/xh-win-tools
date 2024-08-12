export const showTitle = (item) => {

    let { title } = item.meta
    if (!title) return
    title = (item.meta && item.meta.title) || item.name
    return title
}
export const showChildren = (item) => {
    return item.children && (item.children.length > 1 || (item.meta && item.meta.showAlways))
}
export const getNameOrHref = (item, children0) => {
    return item.href ? `isTurnByHref_${item.href}` : (children0 ? item.children[0].name : item.name)
}
export const turnToPage= ($router,route)=> {
    let { name, params, query } = {}
    if (typeof route === 'string') name = route
    else {
        name = route.name
        params = route.params
        query = route.query
    }
    if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1])
        return
    }
    $router.push({
        name,
        params,
        query
    })
}