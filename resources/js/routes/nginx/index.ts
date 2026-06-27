import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
    applyUrlDefaults,
} from './../../wayfinder';
/**
 * @see \App\Http\Controllers\NginxController::index
 * @see app/Http/Controllers/NginxController.php:17
 * @route '/nginx'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

index.definition = {
    methods: ['get', 'head'],
    url: '/nginx',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\NginxController::index
 * @see app/Http/Controllers/NginxController.php:17
 * @route '/nginx'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\NginxController::index
 * @see app/Http/Controllers/NginxController.php:17
 * @route '/nginx'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\NginxController::index
 * @see app/Http/Controllers/NginxController.php:17
 * @route '/nginx'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\NginxController::index
 * @see app/Http/Controllers/NginxController.php:17
 * @route '/nginx'
 */
const indexForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\NginxController::index
 * @see app/Http/Controllers/NginxController.php:17
 * @route '/nginx'
 */
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\NginxController::index
 * @see app/Http/Controllers/NginxController.php:17
 * @route '/nginx'
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
 * @see \App\Http\Controllers\NginxController::store
 * @see app/Http/Controllers/NginxController.php:25
 * @route '/nginx'
 */
export const store = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

store.definition = {
    methods: ['post'],
    url: '/nginx',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\NginxController::store
 * @see app/Http/Controllers/NginxController.php:25
 * @route '/nginx'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\NginxController::store
 * @see app/Http/Controllers/NginxController.php:25
 * @route '/nginx'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\NginxController::store
 * @see app/Http/Controllers/NginxController.php:25
 * @route '/nginx'
 */
const storeForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\NginxController::store
 * @see app/Http/Controllers/NginxController.php:25
 * @route '/nginx'
 */
storeForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

store.form = storeForm;
/**
 * @see \App\Http\Controllers\NginxController::enable
 * @see app/Http/Controllers/NginxController.php:44
 * @route '/nginx/{site}/enable'
 */
export const enable = (
    args: { site: string | number } | [site: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: enable.url(args, options),
    method: 'post',
});

enable.definition = {
    methods: ['post'],
    url: '/nginx/{site}/enable',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\NginxController::enable
 * @see app/Http/Controllers/NginxController.php:44
 * @route '/nginx/{site}/enable'
 */
enable.url = (
    args: { site: string | number } | [site: string | number] | string | number,
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { site: args };
    }

    if (Array.isArray(args)) {
        args = {
            site: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        site: args.site,
    };

    return (
        enable.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\NginxController::enable
 * @see app/Http/Controllers/NginxController.php:44
 * @route '/nginx/{site}/enable'
 */
enable.post = (
    args: { site: string | number } | [site: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: enable.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\NginxController::enable
 * @see app/Http/Controllers/NginxController.php:44
 * @route '/nginx/{site}/enable'
 */
const enableForm = (
    args: { site: string | number } | [site: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: enable.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\NginxController::enable
 * @see app/Http/Controllers/NginxController.php:44
 * @route '/nginx/{site}/enable'
 */
enableForm.post = (
    args: { site: string | number } | [site: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: enable.url(args, options),
    method: 'post',
});

enable.form = enableForm;
/**
 * @see \App\Http\Controllers\NginxController::disable
 * @see app/Http/Controllers/NginxController.php:52
 * @route '/nginx/{site}/disable'
 */
export const disable = (
    args: { site: string | number } | [site: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: disable.url(args, options),
    method: 'post',
});

disable.definition = {
    methods: ['post'],
    url: '/nginx/{site}/disable',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\NginxController::disable
 * @see app/Http/Controllers/NginxController.php:52
 * @route '/nginx/{site}/disable'
 */
disable.url = (
    args: { site: string | number } | [site: string | number] | string | number,
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { site: args };
    }

    if (Array.isArray(args)) {
        args = {
            site: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        site: args.site,
    };

    return (
        disable.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\NginxController::disable
 * @see app/Http/Controllers/NginxController.php:52
 * @route '/nginx/{site}/disable'
 */
disable.post = (
    args: { site: string | number } | [site: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: disable.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\NginxController::disable
 * @see app/Http/Controllers/NginxController.php:52
 * @route '/nginx/{site}/disable'
 */
const disableForm = (
    args: { site: string | number } | [site: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: disable.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\NginxController::disable
 * @see app/Http/Controllers/NginxController.php:52
 * @route '/nginx/{site}/disable'
 */
disableForm.post = (
    args: { site: string | number } | [site: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: disable.url(args, options),
    method: 'post',
});

disable.form = disableForm;
/**
 * @see \App\Http\Controllers\NginxController::destroy
 * @see app/Http/Controllers/NginxController.php:60
 * @route '/nginx/{site}'
 */
export const destroy = (
    args: { site: string | number } | [site: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

destroy.definition = {
    methods: ['delete'],
    url: '/nginx/{site}',
} satisfies RouteDefinition<['delete']>;

/**
 * @see \App\Http\Controllers\NginxController::destroy
 * @see app/Http/Controllers/NginxController.php:60
 * @route '/nginx/{site}'
 */
destroy.url = (
    args: { site: string | number } | [site: string | number] | string | number,
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { site: args };
    }

    if (Array.isArray(args)) {
        args = {
            site: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        site: args.site,
    };

    return (
        destroy.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\NginxController::destroy
 * @see app/Http/Controllers/NginxController.php:60
 * @route '/nginx/{site}'
 */
destroy.delete = (
    args: { site: string | number } | [site: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

/**
 * @see \App\Http\Controllers\NginxController::destroy
 * @see app/Http/Controllers/NginxController.php:60
 * @route '/nginx/{site}'
 */
const destroyForm = (
    args: { site: string | number } | [site: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\NginxController::destroy
 * @see app/Http/Controllers/NginxController.php:60
 * @route '/nginx/{site}'
 */
destroyForm.delete = (
    args: { site: string | number } | [site: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'post',
});

destroy.form = destroyForm;
/**
 * @see \App\Http\Controllers\NginxController::test
 * @see app/Http/Controllers/NginxController.php:68
 * @route '/nginx/actions/test'
 */
export const test = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: test.url(options),
    method: 'post',
});

test.definition = {
    methods: ['post'],
    url: '/nginx/actions/test',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\NginxController::test
 * @see app/Http/Controllers/NginxController.php:68
 * @route '/nginx/actions/test'
 */
test.url = (options?: RouteQueryOptions) => {
    return test.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\NginxController::test
 * @see app/Http/Controllers/NginxController.php:68
 * @route '/nginx/actions/test'
 */
test.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: test.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\NginxController::test
 * @see app/Http/Controllers/NginxController.php:68
 * @route '/nginx/actions/test'
 */
const testForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: test.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\NginxController::test
 * @see app/Http/Controllers/NginxController.php:68
 * @route '/nginx/actions/test'
 */
testForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: test.url(options),
    method: 'post',
});

test.form = testForm;
/**
 * @see \App\Http\Controllers\NginxController::reload
 * @see app/Http/Controllers/NginxController.php:75
 * @route '/nginx/actions/reload'
 */
export const reload = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: reload.url(options),
    method: 'post',
});

reload.definition = {
    methods: ['post'],
    url: '/nginx/actions/reload',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\NginxController::reload
 * @see app/Http/Controllers/NginxController.php:75
 * @route '/nginx/actions/reload'
 */
reload.url = (options?: RouteQueryOptions) => {
    return reload.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\NginxController::reload
 * @see app/Http/Controllers/NginxController.php:75
 * @route '/nginx/actions/reload'
 */
reload.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reload.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\NginxController::reload
 * @see app/Http/Controllers/NginxController.php:75
 * @route '/nginx/actions/reload'
 */
const reloadForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: reload.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\NginxController::reload
 * @see app/Http/Controllers/NginxController.php:75
 * @route '/nginx/actions/reload'
 */
reloadForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: reload.url(options),
    method: 'post',
});

reload.form = reloadForm;
/**
 * @see \App\Http\Controllers\NginxController::restart
 * @see app/Http/Controllers/NginxController.php:82
 * @route '/nginx/actions/restart'
 */
export const restart = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: restart.url(options),
    method: 'post',
});

restart.definition = {
    methods: ['post'],
    url: '/nginx/actions/restart',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\NginxController::restart
 * @see app/Http/Controllers/NginxController.php:82
 * @route '/nginx/actions/restart'
 */
restart.url = (options?: RouteQueryOptions) => {
    return restart.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\NginxController::restart
 * @see app/Http/Controllers/NginxController.php:82
 * @route '/nginx/actions/restart'
 */
restart.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restart.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\NginxController::restart
 * @see app/Http/Controllers/NginxController.php:82
 * @route '/nginx/actions/restart'
 */
const restartForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: restart.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\NginxController::restart
 * @see app/Http/Controllers/NginxController.php:82
 * @route '/nginx/actions/restart'
 */
restartForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: restart.url(options),
    method: 'post',
});

restart.form = restartForm;
const nginx = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    enable: Object.assign(enable, enable),
    disable: Object.assign(disable, disable),
    destroy: Object.assign(destroy, destroy),
    test: Object.assign(test, test),
    reload: Object.assign(reload, reload),
    restart: Object.assign(restart, restart),
};

export default nginx;
