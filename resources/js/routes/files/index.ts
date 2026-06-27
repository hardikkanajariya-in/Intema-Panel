import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
    applyUrlDefaults,
} from './../../wayfinder';
/**
 * @see \App\Http\Controllers\FileManagerController::index
 * @see app/Http/Controllers/FileManagerController.php:18
 * @route '/files'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

index.definition = {
    methods: ['get', 'head'],
    url: '/files',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\FileManagerController::index
 * @see app/Http/Controllers/FileManagerController.php:18
 * @route '/files'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\FileManagerController::index
 * @see app/Http/Controllers/FileManagerController.php:18
 * @route '/files'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\FileManagerController::index
 * @see app/Http/Controllers/FileManagerController.php:18
 * @route '/files'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\FileManagerController::index
 * @see app/Http/Controllers/FileManagerController.php:18
 * @route '/files'
 */
const indexForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\FileManagerController::index
 * @see app/Http/Controllers/FileManagerController.php:18
 * @route '/files'
 */
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});
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
        },
    }),
    method: 'get',
});

index.form = indexForm;
/**
 * @see \App\Http\Controllers\FileManagerController::show
 * @see app/Http/Controllers/FileManagerController.php:28
 * @route '/files/show/{path}'
 */
export const show = (
    args: { path: string | number } | [path: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});

show.definition = {
    methods: ['get', 'head'],
    url: '/files/show/{path}',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\FileManagerController::show
 * @see app/Http/Controllers/FileManagerController.php:28
 * @route '/files/show/{path}'
 */
show.url = (
    args: { path: string | number } | [path: string | number] | string | number,
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { path: args };
    }

    if (Array.isArray(args)) {
        args = {
            path: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        path: args.path,
    };

    return (
        show.definition.url
            .replace('{path}', parsedArgs.path.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\FileManagerController::show
 * @see app/Http/Controllers/FileManagerController.php:28
 * @route '/files/show/{path}'
 */
show.get = (
    args: { path: string | number } | [path: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\FileManagerController::show
 * @see app/Http/Controllers/FileManagerController.php:28
 * @route '/files/show/{path}'
 */
show.head = (
    args: { path: string | number } | [path: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\FileManagerController::show
 * @see app/Http/Controllers/FileManagerController.php:28
 * @route '/files/show/{path}'
 */
const showForm = (
    args: { path: string | number } | [path: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\FileManagerController::show
 * @see app/Http/Controllers/FileManagerController.php:28
 * @route '/files/show/{path}'
 */
showForm.get = (
    args: { path: string | number } | [path: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\FileManagerController::show
 * @see app/Http/Controllers/FileManagerController.php:28
 * @route '/files/show/{path}'
 */
showForm.head = (
    args: { path: string | number } | [path: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

show.form = showForm;
/**
 * @see \App\Http\Controllers\FileManagerController::update
 * @see app/Http/Controllers/FileManagerController.php:37
 * @route '/files/{path}'
 */
export const update = (
    args: { path: string | number } | [path: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

update.definition = {
    methods: ['put'],
    url: '/files/{path}',
} satisfies RouteDefinition<['put']>;

/**
 * @see \App\Http\Controllers\FileManagerController::update
 * @see app/Http/Controllers/FileManagerController.php:37
 * @route '/files/{path}'
 */
update.url = (
    args: { path: string | number } | [path: string | number] | string | number,
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { path: args };
    }

    if (Array.isArray(args)) {
        args = {
            path: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        path: args.path,
    };

    return (
        update.definition.url
            .replace('{path}', parsedArgs.path.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\FileManagerController::update
 * @see app/Http/Controllers/FileManagerController.php:37
 * @route '/files/{path}'
 */
update.put = (
    args: { path: string | number } | [path: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

/**
 * @see \App\Http\Controllers\FileManagerController::update
 * @see app/Http/Controllers/FileManagerController.php:37
 * @route '/files/{path}'
 */
const updateForm = (
    args: { path: string | number } | [path: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\FileManagerController::update
 * @see app/Http/Controllers/FileManagerController.php:37
 * @route '/files/{path}'
 */
updateForm.put = (
    args: { path: string | number } | [path: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'post',
});

update.form = updateForm;
/**
 * @see \App\Http\Controllers\FileManagerController::download
 * @see app/Http/Controllers/FileManagerController.php:48
 * @route '/files/download/{path}'
 */
export const download = (
    args: { path: string | number } | [path: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
});

download.definition = {
    methods: ['get', 'head'],
    url: '/files/download/{path}',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\FileManagerController::download
 * @see app/Http/Controllers/FileManagerController.php:48
 * @route '/files/download/{path}'
 */
download.url = (
    args: { path: string | number } | [path: string | number] | string | number,
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { path: args };
    }

    if (Array.isArray(args)) {
        args = {
            path: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        path: args.path,
    };

    return (
        download.definition.url
            .replace('{path}', parsedArgs.path.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\FileManagerController::download
 * @see app/Http/Controllers/FileManagerController.php:48
 * @route '/files/download/{path}'
 */
download.get = (
    args: { path: string | number } | [path: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\FileManagerController::download
 * @see app/Http/Controllers/FileManagerController.php:48
 * @route '/files/download/{path}'
 */
download.head = (
    args: { path: string | number } | [path: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\FileManagerController::download
 * @see app/Http/Controllers/FileManagerController.php:48
 * @route '/files/download/{path}'
 */
const downloadForm = (
    args: { path: string | number } | [path: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: download.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\FileManagerController::download
 * @see app/Http/Controllers/FileManagerController.php:48
 * @route '/files/download/{path}'
 */
downloadForm.get = (
    args: { path: string | number } | [path: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: download.url(args, options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\FileManagerController::download
 * @see app/Http/Controllers/FileManagerController.php:48
 * @route '/files/download/{path}'
 */
downloadForm.head = (
    args: { path: string | number } | [path: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: download.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

download.form = downloadForm;
const files = {
    index: Object.assign(index, index),
    show: Object.assign(show, show),
    update: Object.assign(update, update),
    download: Object.assign(download, download),
};

export default files;
