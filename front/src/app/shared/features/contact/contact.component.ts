import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { ButtonModule } from "primeng/button";
import { MessageModule } from "primeng/message";

@Component({
  selector: "app-contact",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    MessageModule,
  ],
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.scss"],
})
export class ContactComponent {
  contactForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.maxLength(300)]]
  });

  showSuccess = false;

  constructor(private fb: FormBuilder) {}

  onSubmit() {
    if (this.contactForm.valid) {
      console.log('Formulaire envoyé', this.contactForm.value);
      this.showSuccess = true;
      setTimeout(() => {
        this.contactForm.reset();
        this.showSuccess = false;
      }, 3000);
    }
  }
}
