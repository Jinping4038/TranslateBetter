import React from 'react';

export default function PracticePreferences({preferences, onChange}) {
  return <section className="settings-card practice-preferences" aria-labelledby="practice-preferences-title">
    <h2 id="practice-preferences-title">Practice Preferences</h2>
    <p className="muted">Choose how sentences are selected during practice.</p>
    {[
      ['prioritizeUnseen', "Prioritize sentences I haven't practiced", 'Show new sentences before repeating sentences you have already practiced.'],
      ['repeatLowerScores', 'Occasionally repeat sentences with lower scores', 'Bring back sentences that may benefit from more practice.'],
    ].map(([key, label, description]) => <div className="practice-preference" key={key}>
      <div><label htmlFor={key}>{label}</label><p id={key+'-description'} className="muted">{description}</p></div>
      <input type="checkbox" role="switch" id={key} checked={preferences[key]} aria-describedby={key+'-description'}
        onChange={event => onChange(key, event.target.checked)}/>
    </div>)}
  </section>;
}
