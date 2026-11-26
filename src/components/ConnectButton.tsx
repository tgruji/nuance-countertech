import { useState } from 'react';
import { Clock, Coffee, Plus, UserPlus } from 'lucide-react';
import { getPerson } from '../data/mockData';
import { useApp, type RelationshipDetails } from '../store/AppContext';
import { MET_REFLECTION_DAYS } from '../lib/relationships';
import { firstName, navigate } from '../lib/utils';
import { Button, Modal } from './ui';
import { RelationshipForm } from './RelationshipForm';

/** The invitation step: describe the relationship, then send. */
export function ConnectModal({
  personId,
  onSend,
  onClose,
}: {
  personId: string;
  onSend: (d: RelationshipDetails) => void;
  onClose: () => void;
}) {
  const app = useApp();
  const person = getPerson(personId);
  return (
    <Modal title={`Connect with ${firstName(person.name)}`} onClose={onClose} wide>
      <p className="mb-4 text-sm text-black/70">
        On Nuance, a connection is a statement that a real professional relationship exists. Describe it as
        it is — a brief meeting is just as valid as a long collaboration, but they aren’t the same thing.
      </p>
      <RelationshipForm
        person={person}
        showNote
        submitLabel="Send invitation"
        onCancel={onClose}
        onSubmit={(d) => {
          onSend(d);
          onClose();
        }}
        onFollowInstead={
          app.isFollowing(personId)
            ? undefined
            : () => {
                app.toggleFollow(personId);
                onClose();
              }
        }
      />
    </Modal>
  );
}

/**
 * The connect action for someone you aren't yet connected to.
 * Standard mode: one click sends an undifferentiated request.
 * Redesign, reflection buffer on: one click adds them to the Met list; nothing is sent yet.
 * Redesign, reflection buffer off: opens the invitation step straight away.
 */
export function ConnectButton({
  personId,
  size = 'md',
  className = '',
}: {
  personId: string;
  size?: 'sm' | 'md';
  className?: string;
}) {
  const app = useApp();
  const [open, setOpen] = useState(false);
  const person = getPerson(personId);
  const outgoing = app.outgoingInvitationTo(personId);

  if (app.connectionOf(personId)) return null;

  if (outgoing) {
    return (
      <Button
        size={size}
        variant="muted"
        className={className}
        title="Click to withdraw"
        onClick={() => confirm(`Withdraw your invitation to ${person.name}?`) && app.withdrawInvitation(outgoing.id)}
      >
        <Clock size={16} /> Pending
      </Button>
    );
  }

  if (app.incomingInvitationFrom(personId)) {
    return (
      <Button size={size} className={className} onClick={() => navigate('/network')}>
        Respond to invitation
      </Button>
    );
  }

  if (app.bufferActive && app.metEntryFor(personId)) {
    return (
      <Button size={size} variant="muted" className={className} title="Open your Met list" onClick={() => navigate('/network')}>
        <Coffee size={16} /> In Met list
      </Button>
    );
  }

  const onClick = () => {
    if (!app.redesign) app.sendInvitation(personId);
    else if (app.bufferActive) app.addToMetList(personId);
    else setOpen(true);
  };

  return (
    <>
      <Button
        size={size}
        variant={size === 'sm' ? 'muted' : 'primary'}
        className={className}
        title={app.bufferActive ? `Adds ${firstName(person.name)} to your Met list for ${MET_REFLECTION_DAYS} days of reflection — nothing is sent yet` : undefined}
        onClick={onClick}
      >
        {size === 'sm' ? <Plus size={16} /> : <UserPlus size={16} />}
        {app.redesign && !app.bufferActive ? 'Connect…' : 'Connect'}
      </Button>
      {open && <ConnectModal personId={personId} onSend={(d) => app.sendInvitation(personId, d)} onClose={() => setOpen(false)} />}
    </>
  );
}

export function FollowButton({ personId, size = 'md' }: { personId: string; size?: 'sm' | 'md' }) {
  const app = useApp();
  const following = app.isFollowing(personId);
  return (
    <Button size={size} variant={following ? 'muted' : 'secondary'} onClick={() => app.toggleFollow(personId)}>
      {following ? 'Following' : (
        <>
          <Plus size={16} /> Follow
        </>
      )}
    </Button>
  );
}
