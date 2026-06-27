import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
} from './../../wayfinder';
/**
 * @see \App\Http\Controllers\ResourceWizardController::create
 * @see app/Http/Controllers/ResourceWizardController.php:38
 * @route '/resources/create'
 */
export const create = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});

create.definition = {
    methods: ['get', 'head'],
    url: '/resources/create',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\ResourceWizardController::create
 * @see app/Http/Controllers/ResourceWizardController.php:38
 * @route '/resources/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\ResourceWizardController::create
 * @see app/Http/Controllers/ResourceWizardController.php:38
 * @route '/resources/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\ResourceWizardController::create
 * @see app/Http/Controllers/ResourceWizardController.php:38
 * @route '/resources/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\ResourceWizardController::create
 * @see app/Http/Controllers/ResourceWizardController.php:38
 * @route '/resources/create'
 */
const createForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ResourceWizardController::create
 * @see app/Http/Controllers/ResourceWizardController.php:38
 * @route '/resources/create'
 */
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\ResourceWizardController::create
 * @see app/Http/Controllers/ResourceWizardController.php:38
 * @route '/resources/create'
 */
createForm.head = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

create.form = createForm;
/**
 * @see \App\Http\Controllers\ResourceWizardController::store
 * @see app/Http/Controllers/ResourceWizardController.php:63
 * @route '/resources'
 */
export const store = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

store.definition = {
    methods: ['post'],
    url: '/resources',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\ResourceWizardController::store
 * @see app/Http/Controllers/ResourceWizardController.php:63
 * @route '/resources'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\ResourceWizardController::store
 * @see app/Http/Controllers/ResourceWizardController.php:63
 * @route '/resources'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ResourceWizardController::store
 * @see app/Http/Controllers/ResourceWizardController.php:63
 * @route '/resources'
 */
const storeForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ResourceWizardController::store
 * @see app/Http/Controllers/ResourceWizardController.php:63
 * @route '/resources'
 */
storeForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

store.form = storeForm;
const resources = {
    create: Object.assign(create, create),
    store: Object.assign(store, store),
};

export default resources;
