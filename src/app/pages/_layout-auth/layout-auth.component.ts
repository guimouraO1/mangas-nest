import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
    selector: 'app-layout-auth',
    imports: [RouterOutlet, NavbarComponent],
    templateUrl: './layout-auth.component.html'
})
export class LayoutAuthComponent {}
