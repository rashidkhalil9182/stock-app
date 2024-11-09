import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-toggle-switch',
  standalone: true,
  imports: [],
  templateUrl: './toggle-switch.component.html',
  styleUrl: './toggle-switch.component.scss'
})
export class ToggleSwitchComponent {
  @Input() selected: boolean = true;
  @Output() onSwitched = new EventEmitter<boolean>();

  switch(event: Event): void {
    this.onSwitched.emit((event.currentTarget as HTMLInputElement).checked);
  }

}
