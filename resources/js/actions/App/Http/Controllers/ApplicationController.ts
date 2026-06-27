import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
    applyUrlDefaults,
} from './../../../../wayfinder';
/**
 * @see \App\Http\Controllers\ApplicationController::index
 * @see app/Http/Controllers/ApplicationController.php:28
 * @route '/applications'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

index.definition = {
    methods: ['get', 'head'],
    url: '/applications',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\ApplicationController::index
 * @see app/Http/Controllers/ApplicationController.php:28
 * @route '/applications'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\ApplicationController::index
 * @see app/Http/Controllers/ApplicationController.php:28
 * @route '/applications'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\ApplicationController::index
 * @see app/Http/Controllers/ApplicationController.php:28
 * @route '/applications'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\ApplicationController::index
 * @see app/Http/Controllers/ApplicationController.php:28
 * @route '/applications'
 */
const indexForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ApplicationController::index
 * @see app/Http/Controllers/ApplicationController.php:28
 * @route '/applications'
 */
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\ApplicationController::index
 * @see app/Http/Controllers/ApplicationController.php:28
 * @route '/applications'
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
 * @see \App\Http\Controllers\ApplicationController::show
 * @see app/Http/Controllers/ApplicationController.php:51
 * @route '/applications/{application}'
 */
export const show = (
    args:
        | { application: string | { uuid: string } }
        | [application: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});

show.definition = {
    methods: ['get', 'head'],
    url: '/applications/{application}',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\ApplicationController::show
 * @see app/Http/Controllers/ApplicationController.php:51
 * @route '/applications/{application}'
 */
show.url = (
    args:
        | { application: string | { uuid: string } }
        | [application: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { application: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { application: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            application: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        application:
            typeof args.application === 'object'
                ? args.application.uuid
                : args.application,
    };

    return (
        show.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\ApplicationController::show
 * @see app/Http/Controllers/ApplicationController.php:51
 * @route '/applications/{application}'
 */
show.get = (
    args:
        | { application: string | { uuid: string } }
        | [application: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\ApplicationController::show
 * @see app/Http/Controllers/ApplicationController.php:51
 * @route '/applications/{application}'
 */
show.head = (
    args:
        | { application: string | { uuid: string } }
        | [application: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\ApplicationController::show
 * @see app/Http/Controllers/ApplicationController.php:51
 * @route '/applications/{application}'
 */
const showForm = (
    args:
        | { application: string | { uuid: string } }
        | [application: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ApplicationController::show
 * @see app/Http/Controllers/ApplicationController.php:51
 * @route '/applications/{application}'
 */
showForm.get = (
    args:
        | { application: string | { uuid: string } }
        | [application: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\ApplicationController::show
 * @see app/Http/Controllers/ApplicationController.php:51
 * @route '/applications/{application}'
 */
showForm.head = (
    args:
        | { application: string | { uuid: string } }
        | [application: string | { uuid: string }]
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
 * @see \App\Http\Controllers\ApplicationController::destroy
 * @see app/Http/Controllers/ApplicationController.php:80
 * @route '/applications/{application}'
 */
export const destroy = (
    args:
        | { application: string | { uuid: string } }
        | [application: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

destroy.definition = {
    methods: ['delete'],
    url: '/applications/{application}',
} satisfies RouteDefinition<['delete']>;

/**
 * @see \App\Http\Controllers\ApplicationController::destroy
 * @see app/Http/Controllers/ApplicationController.php:80
 * @route '/applications/{application}'
 */
destroy.url = (
    args:
        | { application: string | { uuid: string } }
        | [application: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { application: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { application: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            application: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        application:
            typeof args.application === 'object'
                ? args.application.uuid
                : args.application,
    };

    return (
        destroy.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\ApplicationController::destroy
 * @see app/Http/Controllers/ApplicationController.php:80
 * @route '/applications/{application}'
 */
destroy.delete = (
    args:
        | { application: string | { uuid: string } }
        | [application: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

/**
 * @see \App\Http\Controllers\ApplicationController::destroy
 * @see app/Http/Controllers/ApplicationController.php:80
 * @route '/applications/{application}'
 */
const destroyForm = (
    args:
        | { application: string | { uuid: string } }
        | [application: string | { uuid: string }]
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
 * @see \App\Http\Controllers\ApplicationController::destroy
 * @see app/Http/Controllers/ApplicationController.php:80
 * @route '/applications/{application}'
 */
destroyForm.delete = (
    args:
        | { application: string | { uuid: string } }
        | [application: string | { uuid: string }]
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
 * @see \App\Http\Controllers\ApplicationController::repair
 * @see app/Http/Controllers/ApplicationController.php:92
 * @route '/applications/{application}/repair'
 */
export const repair = (
    args:
        | { application: string | { uuid: string } }
        | [application: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: repair.url(args, options),
    method: 'post',
});

repair.definition = {
    methods: ['post'],
    url: '/applications/{application}/repair',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\ApplicationController::repair
 * @see app/Http/Controllers/ApplicationController.php:92
 * @route '/applications/{application}/repair'
 */
repair.url = (
    args:
        | { application: string | { uuid: string } }
        | [application: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { application: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { application: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            application: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        application:
            typeof args.application === 'object'
                ? args.application.uuid
                : args.application,
    };

    return (
        repair.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\ApplicationController::repair
 * @see app/Http/Controllers/ApplicationController.php:92
 * @route '/applications/{application}/repair'
 */
repair.post = (
    args:
        | { application: string | { uuid: string } }
        | [application: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: repair.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ApplicationController::repair
 * @see app/Http/Controllers/ApplicationController.php:92
 * @route '/applications/{application}/repair'
 */
const repairForm = (
    args:
        | { application: string | { uuid: string } }
        | [application: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: repair.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ApplicationController::repair
 * @see app/Http/Controllers/ApplicationController.php:92
 * @route '/applications/{application}/repair'
 */
repairForm.post = (
    args:
        | { application: string | { uuid: string } }
        | [application: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: repair.url(args, options),
    method: 'post',
});

repair.form = repairForm;
/**
 * @see \App\Http\Controllers\ApplicationController::health
 * @see app/Http/Controllers/ApplicationController.php:106
 * @route '/applications/{application}/health'
 */
export const health = (
    args:
        | { application: string | { uuid: string } }
        | [application: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: health.url(args, options),
    method: 'post',
});

health.definition = {
    methods: ['post'],
    url: '/applications/{application}/health',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\ApplicationController::health
 * @see app/Http/Controllers/ApplicationController.php:106
 * @route '/applications/{application}/health'
 */
health.url = (
    args:
        | { application: string | { uuid: string } }
        | [application: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { application: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { application: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            application: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        application:
            typeof args.application === 'object'
                ? args.application.uuid
                : args.application,
    };

    return (
        health.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\ApplicationController::health
 * @see app/Http/Controllers/ApplicationController.php:106
 * @route '/applications/{application}/health'
 */
health.post = (
    args:
        | { application: string | { uuid: string } }
        | [application: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: health.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ApplicationController::health
 * @see app/Http/Controllers/ApplicationController.php:106
 * @route '/applications/{application}/health'
 */
const healthForm = (
    args:
        | { application: string | { uuid: string } }
        | [application: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: health.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ApplicationController::health
 * @see app/Http/Controllers/ApplicationController.php:106
 * @route '/applications/{application}/health'
 */
healthForm.post = (
    args:
        | { application: string | { uuid: string } }
        | [application: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: health.url(args, options),
    method: 'post',
});

health.form = healthForm;
/**
 * @see \App\Http\Controllers\ApplicationController::deploy
 * @see app/Http/Controllers/ApplicationController.php:120
 * @route '/applications/{application}/deploy'
 */
export const deploy = (
    args:
        | { application: string | { uuid: string } }
        | [application: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: deploy.url(args, options),
    method: 'post',
});

deploy.definition = {
    methods: ['post'],
    url: '/applications/{application}/deploy',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\ApplicationController::deploy
 * @see app/Http/Controllers/ApplicationController.php:120
 * @route '/applications/{application}/deploy'
 */
deploy.url = (
    args:
        | { application: string | { uuid: string } }
        | [application: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { application: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { application: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            application: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        application:
            typeof args.application === 'object'
                ? args.application.uuid
                : args.application,
    };

    return (
        deploy.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\ApplicationController::deploy
 * @see app/Http/Controllers/ApplicationController.php:120
 * @route '/applications/{application}/deploy'
 */
deploy.post = (
    args:
        | { application: string | { uuid: string } }
        | [application: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: deploy.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ApplicationController::deploy
 * @see app/Http/Controllers/ApplicationController.php:120
 * @route '/applications/{application}/deploy'
 */
const deployForm = (
    args:
        | { application: string | { uuid: string } }
        | [application: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: deploy.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ApplicationController::deploy
 * @see app/Http/Controllers/ApplicationController.php:120
 * @route '/applications/{application}/deploy'
 */
deployForm.post = (
    args:
        | { application: string | { uuid: string } }
        | [application: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: deploy.url(args, options),
    method: 'post',
});

deploy.form = deployForm;
/**
 * @see \App\Http\Controllers\ApplicationController::runtime
 * @see app/Http/Controllers/ApplicationController.php:137
 * @route '/applications/{application}/runtime'
 */
export const runtime = (
    args:
        | { application: string | { uuid: string } }
        | [application: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: runtime.url(args, options),
    method: 'post',
});

runtime.definition = {
    methods: ['post'],
    url: '/applications/{application}/runtime',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\ApplicationController::runtime
 * @see app/Http/Controllers/ApplicationController.php:137
 * @route '/applications/{application}/runtime'
 */
runtime.url = (
    args:
        | { application: string | { uuid: string } }
        | [application: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { application: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { application: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            application: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        application:
            typeof args.application === 'object'
                ? args.application.uuid
                : args.application,
    };

    return (
        runtime.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\ApplicationController::runtime
 * @see app/Http/Controllers/ApplicationController.php:137
 * @route '/applications/{application}/runtime'
 */
runtime.post = (
    args:
        | { application: string | { uuid: string } }
        | [application: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: runtime.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ApplicationController::runtime
 * @see app/Http/Controllers/ApplicationController.php:137
 * @route '/applications/{application}/runtime'
 */
const runtimeForm = (
    args:
        | { application: string | { uuid: string } }
        | [application: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: runtime.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ApplicationController::runtime
 * @see app/Http/Controllers/ApplicationController.php:137
 * @route '/applications/{application}/runtime'
 */
runtimeForm.post = (
    args:
        | { application: string | { uuid: string } }
        | [application: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: runtime.url(args, options),
    method: 'post',
});

runtime.form = runtimeForm;
/**
 * @see \App\Http\Controllers\ApplicationController::attachDatabase
 * @see app/Http/Controllers/ApplicationController.php:163
 * @route '/applications/{application}/attach-database'
 */
export const attachDatabase = (
    args:
        | { application: string | { uuid: string } }
        | [application: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: attachDatabase.url(args, options),
    method: 'post',
});

attachDatabase.definition = {
    methods: ['post'],
    url: '/applications/{application}/attach-database',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\ApplicationController::attachDatabase
 * @see app/Http/Controllers/ApplicationController.php:163
 * @route '/applications/{application}/attach-database'
 */
attachDatabase.url = (
    args:
        | { application: string | { uuid: string } }
        | [application: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { application: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { application: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            application: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        application:
            typeof args.application === 'object'
                ? args.application.uuid
                : args.application,
    };

    return (
        attachDatabase.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\ApplicationController::attachDatabase
 * @see app/Http/Controllers/ApplicationController.php:163
 * @route '/applications/{application}/attach-database'
 */
attachDatabase.post = (
    args:
        | { application: string | { uuid: string } }
        | [application: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: attachDatabase.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ApplicationController::attachDatabase
 * @see app/Http/Controllers/ApplicationController.php:163
 * @route '/applications/{application}/attach-database'
 */
const attachDatabaseForm = (
    args:
        | { application: string | { uuid: string } }
        | [application: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: attachDatabase.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ApplicationController::attachDatabase
 * @see app/Http/Controllers/ApplicationController.php:163
 * @route '/applications/{application}/attach-database'
 */
attachDatabaseForm.post = (
    args:
        | { application: string | { uuid: string } }
        | [application: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: attachDatabase.url(args, options),
    method: 'post',
});

attachDatabase.form = attachDatabaseForm;
/**
 * @see \App\Http\Controllers\ApplicationController::detachDatabase
 * @see app/Http/Controllers/ApplicationController.php:177
 * @route '/applications/{application}/databases/{database}'
 */
export const detachDatabase = (
    args:
        | {
              application: string | { uuid: string };
              database: string | { uuid: string };
          }
        | [
              application: string | { uuid: string },
              database: string | { uuid: string },
          ],
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: detachDatabase.url(args, options),
    method: 'delete',
});

detachDatabase.definition = {
    methods: ['delete'],
    url: '/applications/{application}/databases/{database}',
} satisfies RouteDefinition<['delete']>;

/**
 * @see \App\Http\Controllers\ApplicationController::detachDatabase
 * @see app/Http/Controllers/ApplicationController.php:177
 * @route '/applications/{application}/databases/{database}'
 */
detachDatabase.url = (
    args:
        | {
              application: string | { uuid: string };
              database: string | { uuid: string };
          }
        | [
              application: string | { uuid: string },
              database: string | { uuid: string },
          ],
    options?: RouteQueryOptions,
) => {
    if (Array.isArray(args)) {
        args = {
            application: args[0],
            database: args[1],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        application:
            typeof args.application === 'object'
                ? args.application.uuid
                : args.application,
        database:
            typeof args.database === 'object'
                ? args.database.uuid
                : args.database,
    };

    return (
        detachDatabase.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace('{database}', parsedArgs.database.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\ApplicationController::detachDatabase
 * @see app/Http/Controllers/ApplicationController.php:177
 * @route '/applications/{application}/databases/{database}'
 */
detachDatabase.delete = (
    args:
        | {
              application: string | { uuid: string };
              database: string | { uuid: string };
          }
        | [
              application: string | { uuid: string },
              database: string | { uuid: string },
          ],
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: detachDatabase.url(args, options),
    method: 'delete',
});

/**
 * @see \App\Http\Controllers\ApplicationController::detachDatabase
 * @see app/Http/Controllers/ApplicationController.php:177
 * @route '/applications/{application}/databases/{database}'
 */
const detachDatabaseForm = (
    args:
        | {
              application: string | { uuid: string };
              database: string | { uuid: string };
          }
        | [
              application: string | { uuid: string },
              database: string | { uuid: string },
          ],
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: detachDatabase.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ApplicationController::detachDatabase
 * @see app/Http/Controllers/ApplicationController.php:177
 * @route '/applications/{application}/databases/{database}'
 */
detachDatabaseForm.delete = (
    args:
        | {
              application: string | { uuid: string };
              database: string | { uuid: string };
          }
        | [
              application: string | { uuid: string },
              database: string | { uuid: string },
          ],
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: detachDatabase.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'post',
});

detachDatabase.form = detachDatabaseForm;
/**
 * @see \App\Http\Controllers\ApplicationController::attachDomain
 * @see app/Http/Controllers/ApplicationController.php:190
 * @route '/applications/{application}/attach-domain'
 */
export const attachDomain = (
    args:
        | { application: string | { uuid: string } }
        | [application: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: attachDomain.url(args, options),
    method: 'post',
});

attachDomain.definition = {
    methods: ['post'],
    url: '/applications/{application}/attach-domain',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\ApplicationController::attachDomain
 * @see app/Http/Controllers/ApplicationController.php:190
 * @route '/applications/{application}/attach-domain'
 */
attachDomain.url = (
    args:
        | { application: string | { uuid: string } }
        | [application: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { application: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { application: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            application: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        application:
            typeof args.application === 'object'
                ? args.application.uuid
                : args.application,
    };

    return (
        attachDomain.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\ApplicationController::attachDomain
 * @see app/Http/Controllers/ApplicationController.php:190
 * @route '/applications/{application}/attach-domain'
 */
attachDomain.post = (
    args:
        | { application: string | { uuid: string } }
        | [application: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: attachDomain.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ApplicationController::attachDomain
 * @see app/Http/Controllers/ApplicationController.php:190
 * @route '/applications/{application}/attach-domain'
 */
const attachDomainForm = (
    args:
        | { application: string | { uuid: string } }
        | [application: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: attachDomain.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ApplicationController::attachDomain
 * @see app/Http/Controllers/ApplicationController.php:190
 * @route '/applications/{application}/attach-domain'
 */
attachDomainForm.post = (
    args:
        | { application: string | { uuid: string } }
        | [application: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: attachDomain.url(args, options),
    method: 'post',
});

attachDomain.form = attachDomainForm;
/**
 * @see \App\Http\Controllers\ApplicationController::detachDomain
 * @see app/Http/Controllers/ApplicationController.php:204
 * @route '/applications/{application}/domains/{domain}'
 */
export const detachDomain = (
    args:
        | {
              application: string | { uuid: string };
              domain: string | { uuid: string };
          }
        | [
              application: string | { uuid: string },
              domain: string | { uuid: string },
          ],
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: detachDomain.url(args, options),
    method: 'delete',
});

detachDomain.definition = {
    methods: ['delete'],
    url: '/applications/{application}/domains/{domain}',
} satisfies RouteDefinition<['delete']>;

/**
 * @see \App\Http\Controllers\ApplicationController::detachDomain
 * @see app/Http/Controllers/ApplicationController.php:204
 * @route '/applications/{application}/domains/{domain}'
 */
detachDomain.url = (
    args:
        | {
              application: string | { uuid: string };
              domain: string | { uuid: string };
          }
        | [
              application: string | { uuid: string },
              domain: string | { uuid: string },
          ],
    options?: RouteQueryOptions,
) => {
    if (Array.isArray(args)) {
        args = {
            application: args[0],
            domain: args[1],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        application:
            typeof args.application === 'object'
                ? args.application.uuid
                : args.application,
        domain:
            typeof args.domain === 'object' ? args.domain.uuid : args.domain,
    };

    return (
        detachDomain.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace('{domain}', parsedArgs.domain.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\ApplicationController::detachDomain
 * @see app/Http/Controllers/ApplicationController.php:204
 * @route '/applications/{application}/domains/{domain}'
 */
detachDomain.delete = (
    args:
        | {
              application: string | { uuid: string };
              domain: string | { uuid: string };
          }
        | [
              application: string | { uuid: string },
              domain: string | { uuid: string },
          ],
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: detachDomain.url(args, options),
    method: 'delete',
});

/**
 * @see \App\Http\Controllers\ApplicationController::detachDomain
 * @see app/Http/Controllers/ApplicationController.php:204
 * @route '/applications/{application}/domains/{domain}'
 */
const detachDomainForm = (
    args:
        | {
              application: string | { uuid: string };
              domain: string | { uuid: string };
          }
        | [
              application: string | { uuid: string },
              domain: string | { uuid: string },
          ],
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: detachDomain.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ApplicationController::detachDomain
 * @see app/Http/Controllers/ApplicationController.php:204
 * @route '/applications/{application}/domains/{domain}'
 */
detachDomainForm.delete = (
    args:
        | {
              application: string | { uuid: string };
              domain: string | { uuid: string };
          }
        | [
              application: string | { uuid: string },
              domain: string | { uuid: string },
          ],
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: detachDomain.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'post',
});

detachDomain.form = detachDomainForm;
const ApplicationController = {
    index,
    show,
    destroy,
    repair,
    health,
    deploy,
    runtime,
    attachDatabase,
    detachDatabase,
    attachDomain,
    detachDomain,
};

export default ApplicationController;
