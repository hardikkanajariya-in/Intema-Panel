import SetupController from './SetupController'
import Auth from './Auth'
import AppearanceController from './AppearanceController'
import DashboardController from './DashboardController'
import ProjectController from './ProjectController'
import ResourceWizardController from './ResourceWizardController'
import ApplicationController from './ApplicationController'
import ManagedDatabaseController from './ManagedDatabaseController'
import DomainController from './DomainController'
import SslCertificateController from './SslCertificateController'
import NginxController from './NginxController'
import SystemController from './SystemController'
import FileManagerController from './FileManagerController'
import ActivityLogController from './ActivityLogController'
import SettingsController from './SettingsController'
const Controllers = {
    SetupController: Object.assign(SetupController, SetupController),
Auth: Object.assign(Auth, Auth),
AppearanceController: Object.assign(AppearanceController, AppearanceController),
DashboardController: Object.assign(DashboardController, DashboardController),
ProjectController: Object.assign(ProjectController, ProjectController),
ResourceWizardController: Object.assign(ResourceWizardController, ResourceWizardController),
ApplicationController: Object.assign(ApplicationController, ApplicationController),
ManagedDatabaseController: Object.assign(ManagedDatabaseController, ManagedDatabaseController),
DomainController: Object.assign(DomainController, DomainController),
SslCertificateController: Object.assign(SslCertificateController, SslCertificateController),
NginxController: Object.assign(NginxController, NginxController),
SystemController: Object.assign(SystemController, SystemController),
FileManagerController: Object.assign(FileManagerController, FileManagerController),
ActivityLogController: Object.assign(ActivityLogController, ActivityLogController),
SettingsController: Object.assign(SettingsController, SettingsController),
}

export default Controllers