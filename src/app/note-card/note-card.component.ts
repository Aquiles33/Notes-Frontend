import { Component, OnInit, ViewChild, ElementRef, Renderer2, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss']
})
export class NoteCardComponent implements OnInit {

  @Input() title: string;
  @Input() body: string;
  @Input() link: string;
  @Output('delete') deleteEvent: EventEmitter<void> = new EventEmitter<void>()

  @ViewChild('truncator', {static: true}) truncator: ElementRef<HTMLElement>;
  @ViewChild('bodyDiv', {static: true}) bodyDiv: ElementRef<HTMLElement>;
  @ViewChild('bodyP', {static: true}) bodyP: ElementRef<HTMLElement>;

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
  }

ngAfterViewInit() {
  
  if(this.bodyP.nativeElement.scrollHeight > this.bodyDiv.nativeElement.clientHeight) {
    this.renderer.setStyle(this.truncator.nativeElement, 'display', 'block')
  } else {
    this.renderer.setStyle(this.truncator.nativeElement, 'display', 'none')
    }
  }

  onXButtonClick() {
    this.deleteEvent.emit()
  }
}
