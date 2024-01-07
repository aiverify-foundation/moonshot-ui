import { Window } from '@/app/components/window';

function WindowChat() {
  return (
    <Window
      name="Claude2"
      styles={{
        width: 500,
        height: 350,
        top: 70,
        left: 1210,
      }}>
      <div
        style={{
          color: '#FFF',
          padding: 15,
          fontSize: 12,
          background: '#3498db',
          margin: 10,
          borderRadius: 20,
        }}></div>
    </Window>
  );
}
