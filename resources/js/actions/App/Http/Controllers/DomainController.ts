import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
    applyUrlDefaults,
} from './../../../../wayfinder';
/**
 * @see \App\Http\Controllers\DomainController::index
 * @see app/Http/Controllers/DomainController.php:21
 * @route '/domains'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

index.definition = {
    methods: ['get', 'head'],
    url: '/domains',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\DomainController::index
 * @see app/Http/Controllers/DomainController.php:21
 * @route '/domains'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\DomainController::index
 * @see app/Http/Controllers/DomainController.php:21
 * @route '/domains'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\DomainController::index
 * @see app/Http/Controllers/DomainController.php:21
 * @route '/domains'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\DomainController::index
 * @see app/Http/Controllers/DomainController.php:21
 * @route '/domains'
 */
const indexForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\DomainController::index
 * @see app/Http/Controllers/DomainController.php:21
 * @route '/domains'
 */
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\DomainController::index
 * @see app/Http/Controllers/DomainController.php:21
 * @route '/domains'
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
 * @see \App\Http\Controllers\DomainController::show
 * @see app/Http/Controllers/DomainController.php:44
 * @route '/domains/{domain}'
 */
export const show = (
    args:
        | { domain: string | { uuid: string } }
        | [domain: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});

show.definition = {
    methods: ['get', 'head'],
    url: '/domains/{domain}',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\DomainController::show
 * @see app/Http/Controllers/DomainController.php:44
 * @route '/domains/{domain}'
 */
show.url = (
    args:
        | { domain: string | { uuid: string } }
        | [domain: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { domain: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { domain: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            domain: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        domain:
            typeof args.domain === 'object' ? args.domain.uuid : args.domain,
    };

    return (
        show.definition.url
            .replace('{domain}', parsedArgs.domain.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\DomainController::show
 * @see app/Http/Controllers/DomainController.php:44
 * @route '/domains/{domain}'
 */
show.get = (
    args:
        | { domain: string | { uuid: string } }
        | [domain: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\DomainController::show
 * @see app/Http/Controllers/DomainController.php:44
 * @route '/domains/{domain}'
 */
show.head = (
    args:
        | { domain: string | { uuid: string } }
        | [domain: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\DomainController::show
 * @see app/Http/Controllers/DomainController.php:44
 * @route '/domains/{domain}'
 */
const showForm = (
    args:
        | { domain: string | { uuid: string } }
        | [domain: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\DomainController::show
 * @see app/Http/Controllers/DomainController.php:44
 * @route '/domains/{domain}'
 */
showForm.get = (
    args:
        | { domain: string | { uuid: string } }
        | [domain: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\DomainController::show
 * @see app/Http/Controllers/DomainController.php:44
 * @route '/domains/{domain}'
 */
showForm.head = (
    args:
        | { domain: string | { uuid: string } }
        | [domain: string | { uuid: string }]
        | string
        | { uuid: string },
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
 * @see \App\Http\Controllers\DomainController::destroy
 * @see app/Http/Controllers/DomainController.php:97
 * @route '/domains/{domain}'
 */
export const destroy = (
    args:
        | { domain: string | { uuid: string } }
        | [domain: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

destroy.definition = {
    methods: ['delete'],
    url: '/domains/{domain}',
} satisfies RouteDefinition<['delete']>;

/**
 * @see \App\Http\Controllers\DomainController::destroy
 * @see app/Http/Controllers/DomainController.php:97
 * @route '/domains/{domain}'
 */
destroy.url = (
    args:
        | { domain: string | { uuid: string } }
        | [domain: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { domain: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { domain: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            domain: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        domain:
            typeof args.domain === 'object' ? args.domain.uuid : args.domain,
    };

    return (
        destroy.definition.url
            .replace('{domain}', parsedArgs.domain.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\DomainController::destroy
 * @see app/Http/Controllers/DomainController.php:97
 * @route '/domains/{domain}'
 */
destroy.delete = (
    args:
        | { domain: string | { uuid: string } }
        | [domain: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

/**
 * @see \App\Http\Controllers\DomainController::destroy
 * @see app/Http/Controllers/DomainController.php:97
 * @route '/domains/{domain}'
 */
const destroyForm = (
    args:
        | { domain: string | { uuid: string } }
        | [domain: string | { uuid: string }]
        | string
        | { uuid: string },
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
 * @see \App\Http\Controllers\DomainController::destroy
 * @see app/Http/Controllers/DomainController.php:97
 * @route '/domains/{domain}'
 */
destroyForm.delete = (
    args:
        | { domain: string | { uuid: string } }
        | [domain: string | { uuid: string }]
        | string
        | { uuid: string },
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
 * @see \App\Http\Controllers\DomainController::attachSsl
 * @see app/Http/Controllers/DomainController.php:65
 * @route '/domains/{domain}/attach-ssl'
 */
export const attachSsl = (
    args:
        | { domain: string | { uuid: string } }
        | [domain: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: attachSsl.url(args, options),
    method: 'post',
});

attachSsl.definition = {
    methods: ['post'],
    url: '/domains/{domain}/attach-ssl',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\DomainController::attachSsl
 * @see app/Http/Controllers/DomainController.php:65
 * @route '/domains/{domain}/attach-ssl'
 */
attachSsl.url = (
    args:
        | { domain: string | { uuid: string } }
        | [domain: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { domain: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { domain: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            domain: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        domain:
            typeof args.domain === 'object' ? args.domain.uuid : args.domain,
    };

    return (
        attachSsl.definition.url
            .replace('{domain}', parsedArgs.domain.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\DomainController::attachSsl
 * @see app/Http/Controllers/DomainController.php:65
 * @route '/domains/{domain}/attach-ssl'
 */
attachSsl.post = (
    args:
        | { domain: string | { uuid: string } }
        | [domain: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: attachSsl.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\DomainController::attachSsl
 * @see app/Http/Controllers/DomainController.php:65
 * @route '/domains/{domain}/attach-ssl'
 */
const attachSslForm = (
    args:
        | { domain: string | { uuid: string } }
        | [domain: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: attachSsl.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\DomainController::attachSsl
 * @see app/Http/Controllers/DomainController.php:65
 * @route '/domains/{domain}/attach-ssl'
 */
attachSslForm.post = (
    args:
        | { domain: string | { uuid: string } }
        | [domain: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: attachSsl.url(args, options),
    method: 'post',
});

attachSsl.form = attachSslForm;
/**
 * @see \App\Http\Controllers\DomainController::detachSsl
 * @see app/Http/Controllers/DomainController.php:83
 * @route '/domains/{domain}/detach-ssl'
 */
export const detachSsl = (
    args:
        | { domain: string | { uuid: string } }
        | [domain: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: detachSsl.url(args, options),
    method: 'delete',
});

detachSsl.definition = {
    methods: ['delete'],
    url: '/domains/{domain}/detach-ssl',
} satisfies RouteDefinition<['delete']>;

/**
 * @see \App\Http\Controllers\DomainController::detachSsl
 * @see app/Http/Controllers/DomainController.php:83
 * @route '/domains/{domain}/detach-ssl'
 */
detachSsl.url = (
    args:
        | { domain: string | { uuid: string } }
        | [domain: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { domain: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { domain: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            domain: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        domain:
            typeof args.domain === 'object' ? args.domain.uuid : args.domain,
    };

    return (
        detachSsl.definition.url
            .replace('{domain}', parsedArgs.domain.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\DomainController::detachSsl
 * @see app/Http/Controllers/DomainController.php:83
 * @route '/domains/{domain}/detach-ssl'
 */
detachSsl.delete = (
    args:
        | { domain: string | { uuid: string } }
        | [domain: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: detachSsl.url(args, options),
    method: 'delete',
});

/**
 * @see \App\Http\Controllers\DomainController::detachSsl
 * @see app/Http/Controllers/DomainController.php:83
 * @route '/domains/{domain}/detach-ssl'
 */
const detachSslForm = (
    args:
        | { domain: string | { uuid: string } }
        | [domain: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: detachSsl.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\DomainController::detachSsl
 * @see app/Http/Controllers/DomainController.php:83
 * @route '/domains/{domain}/detach-ssl'
 */
detachSslForm.delete = (
    args:
        | { domain: string | { uuid: string } }
        | [domain: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: detachSsl.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'post',
});

detachSsl.form = detachSslForm;
const DomainController = { index, show, destroy, attachSsl, detachSsl };

export default DomainController;
