import {TestBed, async, ComponentFixture} from '@angular/core/testing';
import { AppComponent } from './app.component';


describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  }));


  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'app'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('app');
  }));
  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to app!');
  }));
});


import { AppModule }    from './app.module';
import { AppRoutingModule } from './app-routing.module';
import { RouterLinkDirectiveStub } from '../testing';
import {Component, DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {By} from '@angular/platform-browser';

@Component({selector: 'app-banner', template: ''})
class BannerStubComponent {}

@Component({selector: 'router-outlet', template: ''})
class RouterOutletStubComponent { }

@Component({selector: 'app-welcome', template: ''})
class WelcomeStubComponent {}

let fixture: ComponentFixture<AppComponent>;
let comp: AppComponent;


fdescribe('AppComponent & TestModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        RouterLinkDirectiveStub,
        BannerStubComponent,
        RouterOutletStubComponent,
        WelcomeStubComponent
      ]
    })
      .compileComponents().then(() => {
      fixture = TestBed.createComponent(AppComponent);
      comp    = fixture.componentInstance;
    });
  }));
  tests();
});


//////// Testing w/ NO_ERRORS_SCHEMA //////
describe('AppComponent & NO_ERRORS_SCHEMA', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        BannerStubComponent,
        RouterLinkDirectiveStub
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
      .compileComponents().then(() => {
      fixture = TestBed.createComponent(AppComponent);
      comp    = fixture.componentInstance;
    });
  }));
  tests();
});



describe('AppComponent & AppModule', () => {

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [ AppModule ]
    })

    // Get rid of app's Router configuration otherwise many failures.
    // Doing so removes Router declarations; add the Router stubs
      .overrideModule(AppModule, {
        remove: {
          imports: [ AppRoutingModule ]
        },
        add: {
          declarations: [ RouterLinkDirectiveStub, RouterOutletStubComponent ]
        }
      })

      .compileComponents()

      .then(() => {
        fixture = TestBed.createComponent(AppComponent);
        comp    = fixture.componentInstance;
      });
  }));

  tests();
});

function tests() {
  let routerLinks: RouterLinkDirectiveStub[];
  let linkDes: DebugElement[];

  beforeEach(() => {
    fixture.detectChanges(); // trigger initial data binding

    // find DebugElements with an attached RouterLinkStubDirective
    linkDes = fixture.debugElement
      .queryAll(By.directive(RouterLinkDirectiveStub));

    // get attached link directive instances
    // using each DebugElement's injector
    routerLinks = linkDes.map(de => de.injector.get(RouterLinkDirectiveStub));
  });

  it('can instantiate the component', () => {
    expect(comp).not.toBeNull();
  });

  it('can get RouterLinks from template', () => {
    expect(routerLinks.length).toBe(3, 'should have 3 routerLinks');
    // expect(routerLinks[0].linkParams).toBe('/dashboard');
    // expect(routerLinks[1].linkParams).toBe('/heroes');
    expect(routerLinks[0].linkParams).toBe('/about');
  });

  it('can click Heroes link in template', () => {
    const heroesLinkDe = linkDes[1];   // heroes link DebugElement
    const heroesLink = routerLinks[1]; // heroes link directive

    expect(heroesLink.navigatedTo).toBeNull('should not have navigated yet');

    heroesLinkDe.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(heroesLink.navigatedTo).toBe('/heroes');
  });
}
