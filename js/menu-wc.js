'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">fyle-qbo-app documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AppModule-bca0fcccb1a35d1756500ea648af6bf9dfe394ae76e5879507b86baa5538631a642c82322b5824a39379ebf5d5a67618126c521d7a3afd7bf0fcbc22b86ca543"' : 'data-bs-target="#xs-components-links-module-AppModule-bca0fcccb1a35d1756500ea648af6bf9dfe394ae76e5879507b86baa5538631a642c82322b5824a39379ebf5d5a67618126c521d7a3afd7bf0fcbc22b86ca543"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-bca0fcccb1a35d1756500ea648af6bf9dfe394ae76e5879507b86baa5538631a642c82322b5824a39379ebf5d5a67618126c521d7a3afd7bf0fcbc22b86ca543"' :
                                            'id="xs-components-links-module-AppModule-bca0fcccb1a35d1756500ea648af6bf9dfe394ae76e5879507b86baa5538631a642c82322b5824a39379ebf5d5a67618126c521d7a3afd7bf0fcbc22b86ca543"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AuthModule-894a50ff1c0191630eda4ab84452cbc562c7ad2677dd99d9e098603a25e6a51616aa91828791b465f9eead4d8c1a84387ef8221bbefbcfd25dbcd7a9b570fe0f"' : 'data-bs-target="#xs-components-links-module-AuthModule-894a50ff1c0191630eda4ab84452cbc562c7ad2677dd99d9e098603a25e6a51616aa91828791b465f9eead4d8c1a84387ef8221bbefbcfd25dbcd7a9b570fe0f"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AuthModule-894a50ff1c0191630eda4ab84452cbc562c7ad2677dd99d9e098603a25e6a51616aa91828791b465f9eead4d8c1a84387ef8221bbefbcfd25dbcd7a9b570fe0f"' :
                                            'id="xs-components-links-module-AuthModule-894a50ff1c0191630eda4ab84452cbc562c7ad2677dd99d9e098603a25e6a51616aa91828791b465f9eead4d8c1a84387ef8221bbefbcfd25dbcd7a9b570fe0f"' }>
                                            <li class="link">
                                                <a href="components/AuthComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FyleCallbackComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FyleCallbackComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoginComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoginComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LogoutComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LogoutComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SharedLoginComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SharedLoginComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthRoutingModule.html" data-type="entity-link" >AuthRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ConfigurationModule.html" data-type="entity-link" >ConfigurationModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-ConfigurationModule-2bf3ecaf8087bea2fe48fd9f3fbe5fdbadb8d3aca03c56b13ca4974077f0207715b81b3ff7f0b6ff33743bb5b69af6810ae9f2da9453672366d0589cda159f5a"' : 'data-bs-target="#xs-components-links-module-ConfigurationModule-2bf3ecaf8087bea2fe48fd9f3fbe5fdbadb8d3aca03c56b13ca4974077f0207715b81b3ff7f0b6ff33743bb5b69af6810ae9f2da9453672366d0589cda159f5a"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ConfigurationModule-2bf3ecaf8087bea2fe48fd9f3fbe5fdbadb8d3aca03c56b13ca4974077f0207715b81b3ff7f0b6ff33743bb5b69af6810ae9f2da9453672366d0589cda159f5a"' :
                                            'id="xs-components-links-module-ConfigurationModule-2bf3ecaf8087bea2fe48fd9f3fbe5fdbadb8d3aca03c56b13ca4974077f0207715b81b3ff7f0b6ff33743bb5b69af6810ae9f2da9453672366d0589cda159f5a"' }>
                                            <li class="link">
                                                <a href="components/ConfigurationAdvancedSettingsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConfigurationAdvancedSettingsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConfigurationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConfigurationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConfigurationEmployeeSettingsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConfigurationEmployeeSettingsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConfigurationExportSettingsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConfigurationExportSettingsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConfigurationImportSettingsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConfigurationImportSettingsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ConfigurationRoutingModule.html" data-type="entity-link" >ConfigurationRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/CoreModule.html" data-type="entity-link" >CoreModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-CoreModule-c9db41b4ea7f4dda6018572c53473966414731cf442c350573379f9cee810469378592b7a7cdb08a9cc77779148fbe2243a0653b7936c64e3361588411de2ab2"' : 'data-bs-target="#xs-components-links-module-CoreModule-c9db41b4ea7f4dda6018572c53473966414731cf442c350573379f9cee810469378592b7a7cdb08a9cc77779148fbe2243a0653b7936c64e3361588411de2ab2"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-CoreModule-c9db41b4ea7f4dda6018572c53473966414731cf442c350573379f9cee810469378592b7a7cdb08a9cc77779148fbe2243a0653b7936c64e3361588411de2ab2"' :
                                            'id="xs-components-links-module-CoreModule-c9db41b4ea7f4dda6018572c53473966414731cf442c350573379f9cee810469378592b7a7cdb08a9cc77779148fbe2243a0653b7936c64e3361588411de2ab2"' }>
                                            <li class="link">
                                                <a href="components/EmailMultiSelectComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EmailMultiSelectComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/DashboardModule.html" data-type="entity-link" >DashboardModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-DashboardModule-00a57919b356612c2444b4b51781dcda27720f98260078a288c94b52a9f7e7454e92d2f8162118f3f1605c7e6cbc2af609331f32f0b301a6bb5ac8b0e4af0854"' : 'data-bs-target="#xs-components-links-module-DashboardModule-00a57919b356612c2444b4b51781dcda27720f98260078a288c94b52a9f7e7454e92d2f8162118f3f1605c7e6cbc2af609331f32f0b301a6bb5ac8b0e4af0854"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-DashboardModule-00a57919b356612c2444b4b51781dcda27720f98260078a288c94b52a9f7e7454e92d2f8162118f3f1605c7e6cbc2af609331f32f0b301a6bb5ac8b0e4af0854"' :
                                            'id="xs-components-links-module-DashboardModule-00a57919b356612c2444b4b51781dcda27720f98260078a288c94b52a9f7e7454e92d2f8162118f3f1605c7e6cbc2af609331f32f0b301a6bb5ac8b0e4af0854"' }>
                                            <li class="link">
                                                <a href="components/DashboardComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DashboardComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/DashboardRoutingModule.html" data-type="entity-link" >DashboardRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ExportLogModule.html" data-type="entity-link" >ExportLogModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-ExportLogModule-781fd1d858867e7ac3196ec8d43aae08fb955bc4625b3723aec752f62ff3f680f30a8063e650ecbdcaafff6e8b4e7398ba93870b7fcd2e6d10f8ba5fc943ed3e"' : 'data-bs-target="#xs-components-links-module-ExportLogModule-781fd1d858867e7ac3196ec8d43aae08fb955bc4625b3723aec752f62ff3f680f30a8063e650ecbdcaafff6e8b4e7398ba93870b7fcd2e6d10f8ba5fc943ed3e"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ExportLogModule-781fd1d858867e7ac3196ec8d43aae08fb955bc4625b3723aec752f62ff3f680f30a8063e650ecbdcaafff6e8b4e7398ba93870b7fcd2e6d10f8ba5fc943ed3e"' :
                                            'id="xs-components-links-module-ExportLogModule-781fd1d858867e7ac3196ec8d43aae08fb955bc4625b3723aec752f62ff3f680f30a8063e650ecbdcaafff6e8b4e7398ba93870b7fcd2e6d10f8ba5fc943ed3e"' }>
                                            <li class="link">
                                                <a href="components/ExportLogChildDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ExportLogChildDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ExportLogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ExportLogComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ExportLogRoutingModule.html" data-type="entity-link" >ExportLogRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/IntegrationModule.html" data-type="entity-link" >IntegrationModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-IntegrationModule-1e775dfb948306a683b3264e5c6dfceb37a549244b32f6dedb66a0bd95bf57c7bb9910934dc086748bf870eeb2b9f7aaffcb8e5cd37fd8129dfd78934d394063"' : 'data-bs-target="#xs-components-links-module-IntegrationModule-1e775dfb948306a683b3264e5c6dfceb37a549244b32f6dedb66a0bd95bf57c7bb9910934dc086748bf870eeb2b9f7aaffcb8e5cd37fd8129dfd78934d394063"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-IntegrationModule-1e775dfb948306a683b3264e5c6dfceb37a549244b32f6dedb66a0bd95bf57c7bb9910934dc086748bf870eeb2b9f7aaffcb8e5cd37fd8129dfd78934d394063"' :
                                            'id="xs-components-links-module-IntegrationModule-1e775dfb948306a683b3264e5c6dfceb37a549244b32f6dedb66a0bd95bf57c7bb9910934dc086748bf870eeb2b9f7aaffcb8e5cd37fd8129dfd78934d394063"' }>
                                            <li class="link">
                                                <a href="components/IntegrationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >IntegrationComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/IntegrationRoutingModule.html" data-type="entity-link" >IntegrationRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MainModule.html" data-type="entity-link" >MainModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-MainModule-58d78f1493407fca1435444f6c572024f31564e9e347235e0b9647fb3f6dbe2966a3770bccd29975df6a2a2150cb843cdfe40ad51d2f54b69c6e70f160b99038"' : 'data-bs-target="#xs-components-links-module-MainModule-58d78f1493407fca1435444f6c572024f31564e9e347235e0b9647fb3f6dbe2966a3770bccd29975df6a2a2150cb843cdfe40ad51d2f54b69c6e70f160b99038"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-MainModule-58d78f1493407fca1435444f6c572024f31564e9e347235e0b9647fb3f6dbe2966a3770bccd29975df6a2a2150cb843cdfe40ad51d2f54b69c6e70f160b99038"' :
                                            'id="xs-components-links-module-MainModule-58d78f1493407fca1435444f6c572024f31564e9e347235e0b9647fb3f6dbe2966a3770bccd29975df6a2a2150cb843cdfe40ad51d2f54b69c6e70f160b99038"' }>
                                            <li class="link">
                                                <a href="components/MainComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MainComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/MainRoutingModule.html" data-type="entity-link" >MainRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MappingModule.html" data-type="entity-link" >MappingModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-MappingModule-b3990b62dca0f36b154cf4dd9427ca4840b9ab4bddd4da746fbed36d740babb889fa8916acfa133d37fb4f889e095ebbb1a63e09d4f5e0f2aae8bb0368835fe6"' : 'data-bs-target="#xs-components-links-module-MappingModule-b3990b62dca0f36b154cf4dd9427ca4840b9ab4bddd4da746fbed36d740babb889fa8916acfa133d37fb4f889e095ebbb1a63e09d4f5e0f2aae8bb0368835fe6"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-MappingModule-b3990b62dca0f36b154cf4dd9427ca4840b9ab4bddd4da746fbed36d740babb889fa8916acfa133d37fb4f889e095ebbb1a63e09d4f5e0f2aae8bb0368835fe6"' :
                                            'id="xs-components-links-module-MappingModule-b3990b62dca0f36b154cf4dd9427ca4840b9ab4bddd4da746fbed36d740babb889fa8916acfa133d37fb4f889e095ebbb1a63e09d4f5e0f2aae8bb0368835fe6"' }>
                                            <li class="link">
                                                <a href="components/CustomMappingComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CustomMappingComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EmployeeMappingComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EmployeeMappingComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MappingComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MappingComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/MappingRoutingModule.html" data-type="entity-link" >MappingRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/OnboardingModule.html" data-type="entity-link" >OnboardingModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-OnboardingModule-9e49d21334c46b3a38cf46be5a21ad6babbd93bfa7dc58b40a17c5699b1bcc92b321e5360acd0ee1e402a7f70b55285c92a94c9f624922c7c7cc17fc8a8d5cdb"' : 'data-bs-target="#xs-components-links-module-OnboardingModule-9e49d21334c46b3a38cf46be5a21ad6babbd93bfa7dc58b40a17c5699b1bcc92b321e5360acd0ee1e402a7f70b55285c92a94c9f624922c7c7cc17fc8a8d5cdb"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-OnboardingModule-9e49d21334c46b3a38cf46be5a21ad6babbd93bfa7dc58b40a17c5699b1bcc92b321e5360acd0ee1e402a7f70b55285c92a94c9f624922c7c7cc17fc8a8d5cdb"' :
                                            'id="xs-components-links-module-OnboardingModule-9e49d21334c46b3a38cf46be5a21ad6babbd93bfa7dc58b40a17c5699b1bcc92b321e5360acd0ee1e402a7f70b55285c92a94c9f624922c7c7cc17fc8a8d5cdb"' }>
                                            <li class="link">
                                                <a href="components/CloneSettingsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CloneSettingsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/OnboardingAdvancedSettingsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OnboardingAdvancedSettingsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/OnboardingComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OnboardingComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/OnboardingDoneComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OnboardingDoneComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/OnboardingEmployeeSettingsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OnboardingEmployeeSettingsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/OnboardingExportSettingsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OnboardingExportSettingsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/OnboardingImportSettingsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OnboardingImportSettingsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/OnboardingLandingComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OnboardingLandingComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/OnboardingQboConnectorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OnboardingQboConnectorComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/OnboardingRoutingModule.html" data-type="entity-link" >OnboardingRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/QboCallbackModule.html" data-type="entity-link" >QboCallbackModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-QboCallbackModule-0b7db09849b707e649e8afa2c1e2f57ec18f402b6c7bab6cea8e6e3fb8c80e7203aef8ea198cded16c24c3aa359b3418f6f2c9ef5af38275941c9bea6f6532f5"' : 'data-bs-target="#xs-components-links-module-QboCallbackModule-0b7db09849b707e649e8afa2c1e2f57ec18f402b6c7bab6cea8e6e3fb8c80e7203aef8ea198cded16c24c3aa359b3418f6f2c9ef5af38275941c9bea6f6532f5"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-QboCallbackModule-0b7db09849b707e649e8afa2c1e2f57ec18f402b6c7bab6cea8e6e3fb8c80e7203aef8ea198cded16c24c3aa359b3418f6f2c9ef5af38275941c9bea6f6532f5"' :
                                            'id="xs-components-links-module-QboCallbackModule-0b7db09849b707e649e8afa2c1e2f57ec18f402b6c7bab6cea8e6e3fb8c80e7203aef8ea198cded16c24c3aa359b3418f6f2c9ef5af38275941c9bea6f6532f5"' }>
                                            <li class="link">
                                                <a href="components/QboCallbackComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >QboCallbackComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/QboCallbackRoutingModule.html" data-type="entity-link" >QboCallbackRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SharedModule.html" data-type="entity-link" >SharedModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-SharedModule-17f638aaeecc0a9903be2b9bbed08dea033ebd6e1daaac64f5b4c54b5114bd7c8bf2e74a13c313411b07a78acae1f7f1b58f291a821fc57f3ee2594845160412"' : 'data-bs-target="#xs-components-links-module-SharedModule-17f638aaeecc0a9903be2b9bbed08dea033ebd6e1daaac64f5b4c54b5114bd7c8bf2e74a13c313411b07a78acae1f7f1b58f291a821fc57f3ee2594845160412"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SharedModule-17f638aaeecc0a9903be2b9bbed08dea033ebd6e1daaac64f5b4c54b5114bd7c8bf2e74a13c313411b07a78acae1f7f1b58f291a821fc57f3ee2594845160412"' :
                                            'id="xs-components-links-module-SharedModule-17f638aaeecc0a9903be2b9bbed08dea033ebd6e1daaac64f5b4c54b5114bd7c8bf2e74a13c313411b07a78acae1f7f1b58f291a821fc57f3ee2594845160412"' }>
                                            <li class="link">
                                                <a href="components/AddEmailDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AddEmailDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AdvancedSettingsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AdvancedSettingsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConfigurationSelectFieldComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConfigurationSelectFieldComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConfigurationStepFooterSectionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConfigurationStepFooterSectionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConfigurationStepHeaderSectionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConfigurationStepHeaderSectionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConfigurationToggleFieldComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConfigurationToggleFieldComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConfirmationDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConfirmationDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DashboardExportLogDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DashboardExportLogDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DashboardHeaderSectionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DashboardHeaderSectionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DashboardQboErrorDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DashboardQboErrorDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DashboardResolveMappingErrorDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DashboardResolveMappingErrorDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EmailMultiSelectComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EmailMultiSelectComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EmailMultiSelectFieldComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EmailMultiSelectFieldComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EmployeeSettingsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EmployeeSettingsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ExpenseFieldCreationDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ExpenseFieldCreationDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ExportLogChildTableComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ExportLogChildTableComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ExportLogTableComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ExportLogTableComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ExportSettingsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ExportSettingsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GenericMappingComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GenericMappingComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HeaderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HeaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ImportSettingsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ImportSettingsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoaderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MandatoryErrorMessageComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MandatoryErrorMessageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MandatoryFieldComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MandatoryFieldComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MappingFilterComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MappingFilterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MappingHeaderSectionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MappingHeaderSectionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MappingTableComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MappingTableComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/OnboardingFooterComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OnboardingFooterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/OnboardingStepperComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OnboardingStepperComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PaginatorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PaginatorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PreviewDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PreviewDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/QboConnectorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >QboConnectorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SelectComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SelectComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SimpleTextSearchComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SimpleTextSearchComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SkipExportLogTableComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SkipExportLogTableComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ToggleComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ToggleComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ZeroStateWithIllustrationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ZeroStateWithIllustrationComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#pipes-links-module-SharedModule-17f638aaeecc0a9903be2b9bbed08dea033ebd6e1daaac64f5b4c54b5114bd7c8bf2e74a13c313411b07a78acae1f7f1b58f291a821fc57f3ee2594845160412"' : 'data-bs-target="#xs-pipes-links-module-SharedModule-17f638aaeecc0a9903be2b9bbed08dea033ebd6e1daaac64f5b4c54b5114bd7c8bf2e74a13c313411b07a78acae1f7f1b58f291a821fc57f3ee2594845160412"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-SharedModule-17f638aaeecc0a9903be2b9bbed08dea033ebd6e1daaac64f5b4c54b5114bd7c8bf2e74a13c313411b07a78acae1f7f1b58f291a821fc57f3ee2594845160412"' :
                                            'id="xs-pipes-links-module-SharedModule-17f638aaeecc0a9903be2b9bbed08dea033ebd6e1daaac64f5b4c54b5114bd7c8bf2e74a13c313411b07a78acae1f7f1b58f291a821fc57f3ee2594845160412"' }>
                                            <li class="link">
                                                <a href="pipes/SearchPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SearchPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/SnakeCaseToSpaceCase.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SnakeCaseToSpaceCase</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/TrimCharacterPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TrimCharacterPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AdvancedSettingModel.html" data-type="entity-link" >AdvancedSettingModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/CloneSettingModel.html" data-type="entity-link" >CloneSettingModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/EmployeeMappingModel.html" data-type="entity-link" >EmployeeMappingModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/EmployeeSettingModel.html" data-type="entity-link" >EmployeeSettingModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExportSettingModel.html" data-type="entity-link" >ExportSettingModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/ImportSettingModel.html" data-type="entity-link" >ImportSettingModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/MappingModel.html" data-type="entity-link" >MappingModel</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AdvancedSettingService.html" data-type="entity-link" >AdvancedSettingService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ApiService.html" data-type="entity-link" >ApiService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AppcuesService.html" data-type="entity-link" >AppcuesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CloneSettingService.html" data-type="entity-link" >CloneSettingService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DashboardService.html" data-type="entity-link" >DashboardService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EmployeeSettingService.html" data-type="entity-link" >EmployeeSettingService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExportLogService.html" data-type="entity-link" >ExportLogService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExportSettingService.html" data-type="entity-link" >ExportSettingService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GlobalErrorHandler.html" data-type="entity-link" >GlobalErrorHandler</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/HelperService.html" data-type="entity-link" >HelperService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ImportSettingService.html" data-type="entity-link" >ImportSettingService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MappingService.html" data-type="entity-link" >MappingService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PaginatorService.html" data-type="entity-link" >PaginatorService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/QboConnectorService.html" data-type="entity-link" >QboConnectorService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RefinerService.html" data-type="entity-link" >RefinerService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StorageService.html" data-type="entity-link" >StorageService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TrackingService.html" data-type="entity-link" >TrackingService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserService.html" data-type="entity-link" >UserService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/WindowService.html" data-type="entity-link" >WindowService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/WorkspaceService.html" data-type="entity-link" >WorkspaceService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interceptors-links"' :
                            'data-bs-target="#xs-interceptors-links"' }>
                            <span class="icon ion-ios-swap"></span>
                            <span>Interceptors</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="interceptors-links"' : 'id="xs-interceptors-links"' }>
                            <li class="link">
                                <a href="interceptors/JwtInterceptor.html" data-type="entity-link" >JwtInterceptor</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link" >AuthGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/WorkspacesGuard.html" data-type="entity-link" >WorkspacesGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AdvancedSettingFormOption.html" data-type="entity-link" >AdvancedSettingFormOption</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EmployeeSettingFormOption.html" data-type="entity-link" >EmployeeSettingFormOption</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ExpenseGroupList.html" data-type="entity-link" >ExpenseGroupList</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ExpenseGroupSetting.html" data-type="entity-link" >ExpenseGroupSetting</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ExpenseGroupSettingGet.html" data-type="entity-link" >ExpenseGroupSettingGet</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ExpenseList.html" data-type="entity-link" >ExpenseList</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ExportSettingFormOption.html" data-type="entity-link" >ExportSettingFormOption</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ExportSettingWorkspaceGeneralSetting.html" data-type="entity-link" >ExportSettingWorkspaceGeneralSetting</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ExtendedEmployeeAttribute.html" data-type="entity-link" >ExtendedEmployeeAttribute</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ExtendedExpenseAttribute.html" data-type="entity-link" >ExtendedExpenseAttribute</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ImportSettingFormOption.html" data-type="entity-link" >ImportSettingFormOption</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Mapping.html" data-type="entity-link" >Mapping</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NameInJournalEntryOptions.html" data-type="entity-link" >NameInJournalEntryOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/QboConnectorPost.html" data-type="entity-link" >QboConnectorPost</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SkipExportList.html" data-type="entity-link" >SkipExportList</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/User.html" data-type="entity-link" >User</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});