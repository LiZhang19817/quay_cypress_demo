/// <reference types='cypress' />

//export CYPRESS_QUAY_ENDPOINT=quayregistry-quay-quay-enterprise.apps.quay-perf-467.perfscale.devcluster.openshift.com
//export CYPRESS_QUAY_USER=quay
//export CYPRESS_QUAY_PASSWORD=password
//export CYPRESS_QUAY_IMAGE_REPOSITORY=quaydemo
//export CYPRESS_QUAY_ORG_NAME=quaydemo

describe('Quay Automation Sanity Testing Case', function(){
    beforeEach('Docker login Quay',function(){
     
        cy.exec('docker login '+Cypress.env('QUAY_ENDPOINT')+' -u'+Cypress.env('QUAY_USER')+ ' -p' + Cypress.env('QUAY_PASSWORD'));
       
    })

    it('Login Quay Console', function(){
        
        cy.visit('https://'+Cypress.env('QUAY_ENDPOINT'));
        cy.contains('Sign in', {timeout:6000} ).click({force: true});
        cy.get('#signin-username', {timeout:6000} ).type(Cypress.env('QUAY_USER'));
        cy.get('#signin-password', {timeout:6000} ).type(Cypress.env('QUAY_PASSWORD'));
        cy.get('.signin-form-element > .form-signin > .btn', {timeout:6000} ).click({force: true}); 
        
        //verify user quay existed
        cy.get('.namespaces-list > :nth-child(1) > a').should('contain.text','quay');
        
    })

    it('create new organization', function(){
        cy.get('.new-org > a').click();
        cy.get('.field-container > .namespace-input > .namespace-input-element > .form-control').type(Cypress.env('QUAY_ORG_NAME'));
        cy.get('.button-bar > .btn').click();

        //Verify New Orginaztion was created successfully
        cy.get('.organization-name').should('contain.text',Cypress.env('QUAY_ORG_NAME'))
    })

    it('create new image repository', function(){
        cy.get('.co-nav-title-action > a').click();
        cy.get('#repoName').type(Cypress.env('QUAY_IMAGE_REPOSITORY'));
        cy.get('.col-md-12 > .btn').click();

        //Verify New Image Repository was created successfully
        cy.get('.co-nav-title-content > :nth-child(2)').should('contain.text',Cypress.env('QUAY_IMAGE_REPOSITORY'));
    })

    it('Starred quay image repository', function(){
        cy.get('.star-icon').click();

        //Verify New Image Repository was starred successfully
        cy.get('.star-icon').should('have.class','starred');
    })
    
    it('push image to quay', function(){
        
        cy.exec('docker pull amazonlinux',{timeout:1800000}).its('code').should('eq', 0);
        cy.exec('docker tag amazonlinux '+Cypress.env('QUAY_ENDPOINT')+'/'+Cypress.env('QUAY_ORG_NAME')+'/'+Cypress.env('QUAY_IMAGE_REPOSITORY'));
        cy.exec('docker push '+Cypress.env('QUAY_ENDPOINT')+'/'+Cypress.env('QUAY_ORG_NAME')+'/'+Cypress.env('QUAY_IMAGE_REPOSITORY'),{timeout:1800000}).its('code').should('eq', 0);
    })

    it('pull image from quay', function(){
        cy.exec('docker pull '+Cypress.env('QUAY_ENDPOINT')+'/'+Cypress.env('QUAY_ORG_NAME')+'/'+Cypress.env('QUAY_IMAGE_REPOSITORY'),{timeout:1800000}).its('code').should('eq', 0);
    })
})
