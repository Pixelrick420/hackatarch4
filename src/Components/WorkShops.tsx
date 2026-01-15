import Workshop from './WorkShop';
const background = '#F6EDC4';

export default function Workshops() {
    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    backgroundColor: background,
                }}
            >
                <Workshop
                    workshopName="WORKSHOP1"
                    workshopNumber={1}
                    registerLink="https://example.com/register"
                />

                <Workshop
                    workshopName="WORKSHOP2"
                    workshopNumber={2}
                    registerLink="https://example.com/register"
                />
            </div>
        </div>
    );
}
