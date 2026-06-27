import SetupController from './SetupController'
import Auth from './Auth'
import AppearanceController from './AppearanceController'
import DashboardController from './DashboardController'
import ClientController from './ClientController'
import DatabaseController from './DatabaseController'
import NginxController from './NginxController'
import SslController from './SslController'
import CloudflareController from './CloudflareController'
import SystemController from './SystemController'
import FileManagerController from './FileManagerController'
import ActivityLogController from './ActivityLogController'
import SettingsController from './SettingsController'
const Controllers = {
    SetupController: Object.assign(SetupController, SetupController),
Auth: Object.assign(Auth, Auth),
AppearanceController: Object.assign(AppearanceController, AppearanceController),
DashboardController: Object.assign(DashboardController, DashboardController),
ClientController: Object.assign(ClientController, ClientController),
DatabaseController: Object.assign(DatabaseController, DatabaseController),
NginxController: Object.assign(NginxController, NginxController),
SslController: Object.assign(SslController, SslController),
CloudflareController: Object.assign(CloudflareController, CloudflareController),
SystemController: Object.assign(SystemController, SystemController),
FileManagerController: Object.assign(FileManagerController, FileManagerController),
ActivityLogController: Object.assign(ActivityLogController, ActivityLogController),
SettingsController: Object.assign(SettingsController, SettingsController),
}

export default Controllers