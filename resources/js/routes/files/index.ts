import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\FileManagerController::index
 * @see app/Http/Controllers/FileManagerController.php:18
 * @route '/files'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/files',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FileManagerController::index
 * @see app/Http/Controllers/FileManagerController.php:18
 * @route '/files'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FileManagerController::index
 * @see app/Http/Controllers/FileManagerController.php:18
 * @route '/files'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\FileManagerController::index
 * @see app/Http/Controllers/FileManagerController.php:18
 * @route '/files'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\FileManagerController::index
 * @see app/Http/Controllers/FileManagerController.php:18
 * @route '/files'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\FileManagerController::index
 * @see app/Http/Controllers/FileManagerController.php:18
 * @route '/files'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\FileManagerController::index
 * @see app/Http/Controllers/FileManagerController.php:18
 * @route '/files'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\FileManagerController::show
 * @see app/Http/Controllers/FileManagerController.php:42
 * @route '/files/show'
 */
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/files/show',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FileManagerController::show
 * @see app/Http/Controllers/FileManagerController.php:42
 * @route '/files/show'
 */
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FileManagerController::show
 * @see app/Http/Controllers/FileManagerController.php:42
 * @route '/files/show'
 */
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\FileManagerController::show
 * @see app/Http/Controllers/FileManagerController.php:42
 * @route '/files/show'
 */
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\FileManagerController::show
 * @see app/Http/Controllers/FileManagerController.php:42
 * @route '/files/show'
 */
    const showForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\FileManagerController::show
 * @see app/Http/Controllers/FileManagerController.php:42
 * @route '/files/show'
 */
        showForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\FileManagerController::show
 * @see app/Http/Controllers/FileManagerController.php:42
 * @route '/files/show'
 */
        showForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\FileManagerController::update
 * @see app/Http/Controllers/FileManagerController.php:64
 * @route '/files'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/files',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\FileManagerController::update
 * @see app/Http/Controllers/FileManagerController.php:64
 * @route '/files'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FileManagerController::update
 * @see app/Http/Controllers/FileManagerController.php:64
 * @route '/files'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\FileManagerController::update
 * @see app/Http/Controllers/FileManagerController.php:64
 * @route '/files'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\FileManagerController::update
 * @see app/Http/Controllers/FileManagerController.php:64
 * @route '/files'
 */
        updateForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\FileManagerController::download
 * @see app/Http/Controllers/FileManagerController.php:80
 * @route '/files/download'
 */
export const download = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/files/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FileManagerController::download
 * @see app/Http/Controllers/FileManagerController.php:80
 * @route '/files/download'
 */
download.url = (options?: RouteQueryOptions) => {
    return download.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FileManagerController::download
 * @see app/Http/Controllers/FileManagerController.php:80
 * @route '/files/download'
 */
download.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\FileManagerController::download
 * @see app/Http/Controllers/FileManagerController.php:80
 * @route '/files/download'
 */
download.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\FileManagerController::download
 * @see app/Http/Controllers/FileManagerController.php:80
 * @route '/files/download'
 */
    const downloadForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: download.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\FileManagerController::download
 * @see app/Http/Controllers/FileManagerController.php:80
 * @route '/files/download'
 */
        downloadForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\FileManagerController::download
 * @see app/Http/Controllers/FileManagerController.php:80
 * @route '/files/download'
 */
        downloadForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    download.form = downloadForm
/**
* @see \App\Http\Controllers\FileManagerController::createDirectory
 * @see app/Http/Controllers/FileManagerController.php:91
 * @route '/files/create-directory'
 */
export const createDirectory = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createDirectory.url(options),
    method: 'post',
})

createDirectory.definition = {
    methods: ["post"],
    url: '/files/create-directory',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FileManagerController::createDirectory
 * @see app/Http/Controllers/FileManagerController.php:91
 * @route '/files/create-directory'
 */
createDirectory.url = (options?: RouteQueryOptions) => {
    return createDirectory.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FileManagerController::createDirectory
 * @see app/Http/Controllers/FileManagerController.php:91
 * @route '/files/create-directory'
 */
createDirectory.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createDirectory.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\FileManagerController::createDirectory
 * @see app/Http/Controllers/FileManagerController.php:91
 * @route '/files/create-directory'
 */
    const createDirectoryForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: createDirectory.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\FileManagerController::createDirectory
 * @see app/Http/Controllers/FileManagerController.php:91
 * @route '/files/create-directory'
 */
        createDirectoryForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: createDirectory.url(options),
            method: 'post',
        })
    
    createDirectory.form = createDirectoryForm
/**
* @see \App\Http\Controllers\FileManagerController::createFile
 * @see app/Http/Controllers/FileManagerController.php:107
 * @route '/files/create-file'
 */
export const createFile = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createFile.url(options),
    method: 'post',
})

createFile.definition = {
    methods: ["post"],
    url: '/files/create-file',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FileManagerController::createFile
 * @see app/Http/Controllers/FileManagerController.php:107
 * @route '/files/create-file'
 */
createFile.url = (options?: RouteQueryOptions) => {
    return createFile.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FileManagerController::createFile
 * @see app/Http/Controllers/FileManagerController.php:107
 * @route '/files/create-file'
 */
createFile.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createFile.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\FileManagerController::createFile
 * @see app/Http/Controllers/FileManagerController.php:107
 * @route '/files/create-file'
 */
    const createFileForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: createFile.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\FileManagerController::createFile
 * @see app/Http/Controllers/FileManagerController.php:107
 * @route '/files/create-file'
 */
        createFileForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: createFile.url(options),
            method: 'post',
        })
    
    createFile.form = createFileForm
/**
* @see \App\Http\Controllers\FileManagerController::deleteMethod
 * @see app/Http/Controllers/FileManagerController.php:123
 * @route '/files'
 */
export const deleteMethod = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(options),
    method: 'delete',
})

deleteMethod.definition = {
    methods: ["delete"],
    url: '/files',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\FileManagerController::deleteMethod
 * @see app/Http/Controllers/FileManagerController.php:123
 * @route '/files'
 */
deleteMethod.url = (options?: RouteQueryOptions) => {
    return deleteMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FileManagerController::deleteMethod
 * @see app/Http/Controllers/FileManagerController.php:123
 * @route '/files'
 */
deleteMethod.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\FileManagerController::deleteMethod
 * @see app/Http/Controllers/FileManagerController.php:123
 * @route '/files'
 */
    const deleteMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: deleteMethod.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\FileManagerController::deleteMethod
 * @see app/Http/Controllers/FileManagerController.php:123
 * @route '/files'
 */
        deleteMethodForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deleteMethod.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    deleteMethod.form = deleteMethodForm
/**
* @see \App\Http\Controllers\FileManagerController::rename
 * @see app/Http/Controllers/FileManagerController.php:138
 * @route '/files/rename'
 */
export const rename = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rename.url(options),
    method: 'post',
})

rename.definition = {
    methods: ["post"],
    url: '/files/rename',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FileManagerController::rename
 * @see app/Http/Controllers/FileManagerController.php:138
 * @route '/files/rename'
 */
rename.url = (options?: RouteQueryOptions) => {
    return rename.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FileManagerController::rename
 * @see app/Http/Controllers/FileManagerController.php:138
 * @route '/files/rename'
 */
rename.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rename.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\FileManagerController::rename
 * @see app/Http/Controllers/FileManagerController.php:138
 * @route '/files/rename'
 */
    const renameForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: rename.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\FileManagerController::rename
 * @see app/Http/Controllers/FileManagerController.php:138
 * @route '/files/rename'
 */
        renameForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: rename.url(options),
            method: 'post',
        })
    
    rename.form = renameForm
const files = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
update: Object.assign(update, update),
download: Object.assign(download, download),
createDirectory: Object.assign(createDirectory, createDirectory),
createFile: Object.assign(createFile, createFile),
delete: Object.assign(deleteMethod, deleteMethod),
rename: Object.assign(rename, rename),
}

export default files