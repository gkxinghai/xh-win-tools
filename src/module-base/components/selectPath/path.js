import {ref} from 'vue'

export function usePath(){
    const targetPath = ref('')

    function selectDownloadPath() {
        myApi.handleSelectPath(targetPath.value).then(res => {
            if (res) {
                console.log(res)
                targetPath.value = res
            }
        })
    }

    return {
        targetPath,
        selectDownloadPath,
    }
}
