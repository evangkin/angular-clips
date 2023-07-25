import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import IClip from 'src/app/models/clip.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClipService } from 'src/app/services/clip.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  @Input()
  activeClip: IClip | null = null;

  @Output()
  update = new EventEmitter();

  inSubmission = false;
  showAlert = false;
  alertColor = 'blue';
  alertText = 'Please wait. Updating clip...';

  clipID = new FormControl('', {
    nonNullable: true,
  });
  title = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
    nonNullable: true,
  });

  editForm = new FormGroup({
    title: this.title,
    id: this.clipID,
  });

  constructor(private modal: ModalService, private clipsService: ClipService) {}

  ngOnInit(): void {
    this.modal.register('editClip');
  }

  ngOnChanges() {
    if (!this.activeClip) {
      return;
    }

    this.inSubmission = false;
    this.showAlert = false;

    this.clipID.setValue(this.activeClip.docID!!);
    this.title.setValue(this.activeClip.title);
  }

  ngOnDestroy(): void {
    this.modal.unregister('editClip');
  }

  submit() {
    if (!this.activeClip) {
      return;
    }
    this.inSubmission = true;
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertText = 'Please wait. Updating clip...';

    try {
      this.clipsService.updateClip(this.clipID.value, this.title.value);
    } catch (err) {
      console.error(err);
      this.showAlert = true;
      this.alertColor = 'red';
      this.alertText = 'Something went wrong. Please try again later...';
      return;
    }

    this.activeClip.title = this.title.value;
    this.update.emit(this.activeClip);

    this.inSubmission = false;
    this.showAlert = true;
    this.alertColor = 'green';
    this.alertText = 'Success';
  }

}
