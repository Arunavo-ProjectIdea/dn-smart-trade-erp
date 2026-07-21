import { TimelineEvent } from "@/lib/types/shipment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircle, faClock, faLocationDot, faUser, faFileLines } from "@fortawesome/free-solid-svg-icons";
import { Card, CardContent } from "@/components/ui/card";

interface TrackingTimelineProps {
  events: TimelineEvent[];
}

export function TrackingTimeline({ events }: TrackingTimelineProps) {
  if (!events || events.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <FontAwesomeIcon icon={faClock} className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No tracking data</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Tracking information has not been updated for this shipment yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Sort events by date and time (assuming string sort works for ISO or consistent format)
  // Reversing so newest is at top, or keep chronological? Chronological usually top-down or bottom-up.
  // Let's make newest at the top.
  const sortedEvents = [...events].reverse();

  return (
    <div className="relative border-l border-muted ml-3 space-y-8 py-4">
      {sortedEvents.map((event, index) => {
        const isLatest = index === 0;
        
        return (
          <div key={event.id} className="relative pl-8">
            <div className="absolute -left-3 top-1 bg-background">
              {isLatest ? (
                <FontAwesomeIcon icon={faCircleCheck} className="h-6 w-6 text-primary bg-background rounded-full" />
              ) : (
                <FontAwesomeIcon icon={faCircle} className="h-6 w-6 text-muted-foreground bg-background rounded-full" />
              )}
            </div>
            
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h4 className={`text-base font-semibold ${isLatest ? 'text-primary' : 'text-foreground'}`}>
                  {event.status}
                </h4>
                <span className="text-sm text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md">
                  {event.date} at {event.time}
                </span>
              </div>
              
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-start gap-2 text-sm">
                  <FontAwesomeIcon icon={faLocationDot} className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{event.location}</span>
                </div>
                
                <div className="flex items-start gap-2 text-sm">
                  <FontAwesomeIcon icon={faUser} className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{event.responsibleEmployee}</span>
                </div>
                
                {event.notes && (
                  <div className="flex items-start gap-2 text-sm sm:col-span-2 mt-1 bg-muted/30 p-2.5 rounded-md border border-border/50">
                    <FontAwesomeIcon icon={faFileLines} className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <span className="text-foreground/90">{event.notes}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
