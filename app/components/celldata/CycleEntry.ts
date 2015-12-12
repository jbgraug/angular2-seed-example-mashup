import {Component, NgFor} from 'angular2/angular2';
import {FORM_DIRECTIVES, NgClass} from 'angular2/angular2';
import {CellDataServices} from '../../services/CellDataServices';
import {Router} from 'angular2/router';

@Component({
    selector: 'cycle-entry',
    viewBindings: [CellDataServices],
    templateUrl: './components/celldata/CycleEntry.html',
    directives: [FORM_DIRECTIVES, NgClass, NgFor]
})
export class CycleEntry {

    model = {
        errors: '',
        newCycle: {
            startDate: '',
            endDate: ''
        },
        cycles:[]
    };

    constructor(public router:Router, public cellDataServices: CellDataServices) {
        this.getCycles();
    }

    getCycles() {
        this.cellDataServices.getCyles()
            .subscribe((cycles:any[]) => {
                //console.log('cycles', cycles);
                this.model.cycles = cycles.map(c => {
                        return { cycleId: c.cycleId,
                                 startDate: new Date(c.startDate),
                                 endDate: new Date(c.endDate)
                               };
                    });
            });
    }

    submit() {
        this.model.errors = '';

        if (!this.model.newCycle.startDate ||
            !this.model.newCycle.endDate ||
            this.model.newCycle.startDate >= this.model.newCycle.endDate) {
            this.model.errors = 'Invalid dates';
            return;
        }

        console.log(this.model.newCycle);
        this.cellDataServices.saveCycle(this.model.newCycle)
            .subscribe(
                cycle => {
                    console.log(`Cycle ${cycle.cycleId} created from ${cycle.startDate} to ${cycle.endDate}.`);
                    this.router.navigateByUrl('/usageentry');
                },
                err => console.log('Save cycle error', err)
             );

    }
}