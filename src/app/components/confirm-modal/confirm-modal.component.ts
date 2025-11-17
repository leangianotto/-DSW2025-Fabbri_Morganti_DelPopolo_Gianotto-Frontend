import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css'],   // <- Necesario
  encapsulation: ViewEncapsulation.None            // <- Hace que los estilos se apliquen SIEMPRE
})
export class ConfirmModalComponent {
  @Input() title = 'Confirmar';
  @Input() message = '';
  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  confirm() { this.onConfirm.emit(); }
  cancel() { this.onCancel.emit(); }
}
