import { Component, OnInit, Input } from '@angular/core';
import { Telecommand } from 'src/classes/telecommand';

import { Component as CubeSatComp } from 'src/classes/component';
import { ComponentService } from 'src/app/services/component/component.service';

@Component({
  selector: 'app-telecommand-details',
  templateUrl: './telecommand-details.component.html',
  styleUrls: ['./telecommand-details.component.scss']
})
export class TelecommandDetailsComponent implements OnInit {

  components: CubeSatComp[];

  @Input() telecommand: Telecommand;
  @Input() existingTelecommand: boolean;

  constructor(private componentService: ComponentService) { }

  ngOnInit() {
    this.getComponents();
  }

  getComponents(): void {
    this.componentService.getComponents()
      .subscribe(components => this.components = components);
  }

}
