declare name 		"unstet";
declare version 	"1.0";
declare author 		"basilstotz";
declare license 	"BSD";
declare copyright 	"amXa";

declare options 	"[osc:on]";

import("stdfaust.lib");


//adapt for your needs

//import soundfiles (any number!)
import("m11_waveform.dsp");
import("m12_waveform.dsp");
import("m13_waveform.dsp");
import("m21_waveform.dsp");
import("m22_waveform.dsp");
import("m23_waveform.dsp");
import("m31_waveform.dsp");
import("m32_waveform.dsp");
import("m33_waveform.dsp");
import("m41_waveform.dsp");
import("m42_waveform.dsp");
import("m43_waveform.dsp");

//imports for "m11_waveform.dsp"
//m11_0 = waveform{};
//m11 = (m11_0):((!,_));
//m11_rtable_0(r) = (m11_0,r):rdtable;

//lists for imported sounds and their labels
WAVES = ( m11_0,m12_0,m13_0,m21_0,m22_0,m23_0,m31_0,m32_0,m33_0,m41_0,m42_0,m43_0);
LABELS = ( 11,12,13,21,22,23,31,32,33,41,42,43 );

//number of outputs
N_OUT = 4;

//do not edit below this
play_wave(label,wave) = ba.countup(m_count,m_gate(label)):m_table
		   with {
		   	m_count=(wave):((_,!));
			m_table(r)=(wave,r):rdtable;
			m_gate(l)=button("%l"):ba.impulsify;
			};
m_play(n) = play_wave(ba.take(n+1,LABELS),ba.take(n+1,WAVES));

beamer(n)=hgroup( "beamer%n", par(i,ba.count(LABELS),m_play(i)):>_ );

process = par(i, N_OUT, beamer(i+1));
